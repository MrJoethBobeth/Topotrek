#!/bin/bash
set -e # Exit immediately if a command exits with a non-zero status.

# --- Configuration ---
# Your Cloudflare Account ID (find this on the right sidebar of the main Cloudflare dashboard)
CF_ACCOUNT_ID="e9a7e6c09827b7ff806ffbdaab1e2d60"
# The name of the R2 bucket you created
R2_BUCKET_NAME="topotrek-tiles"

# The URL for the OSM data extract from Geofabrik.
# For a truly global map, you would change this to north-america-latest.osm.pbf or planet-latest.osm.pbf
OSM_PBF_URL="https://download.geofabrik.de/north-america/us/colorado-latest.osm.pbf"

# This VRT (Virtual Raster) file acts as a pointer to the entire global terrain dataset on AWS.
# The /vsis3/ prefix is GDAL's syntax for reading a file directly from an S3 bucket.
DEM_TIF_URL="/vsis3/elevation-tiles-prod/vrt/512/all.vrt"

# --- Directory Setup ---
echo "--- Setting up directories ---"
mkdir -p raw_data processed_data final_tilesets

# --- 1. Fetch Raw Data ---
echo "--- Fetching raw OSM data ---"
wget -q -O raw_data/data.osm.pbf $OSM_PBF_URL
# Note: The DEM file is no longer downloaded. It will be streamed directly from AWS by GDAL.

# --- 2. Process Vector Tiles ---
echo "--- Processing Vector Tiles from OpenStreetMap ---"
# Download the configuration files directly from the tilemaker GitHub repository.
wget -q -O config.json https://raw.githubusercontent.com/systemed/tilemaker/master/resources/config-openmaptiles.json
wget -q -O process.lua https://raw.githubusercontent.com/systemed/tilemaker/master/resources/process-openmaptiles.lua

# Run tilemaker to convert PBF to vector tiles in MBTiles format
tilemaker --input raw_data/data.osm.pbf --output processed_data/vector.mbtiles --config config.json --process process.lua

# Convert MBTiles to PMTiles
echo "--- Converting Vector MBTiles to PMTiles ---"
pmtiles convert processed_data/vector.mbtiles final_tilesets/vector.pmtiles

# --- 3. Process Elevation (Terrain-RGB) Tiles ---
echo "--- Processing Elevation Tiles from DEM ---"
# Step 3a: Reproject DEM to Web Mercator (EPSG:3857) using the cloud-based VRT file.
gdalwarp -t_srs EPSG:3857 $DEM_TIF_URL processed_data/dem_warped.tif

# Step 3b: Use gdal_calc to encode height into RGB channels
# The formula is: red = (height + 10000) / 0.1 / 256^2, green = ... etc.
# This requires a Python-enabled GDAL.
echo "--- Encoding DEM to Terrain-RGB ---"
gdal_calc.py -A processed_data/dem_warped.tif --outfile=processed_data/dem_rgb.tif --calc="((A+10000)/0.1).astype(int)" --type=Int32

# Step 3c: Tile the RGB GeoTIFF into an XYZ directory
echo "--- Tiling RGB data ---"
gdal2tiles.py -z 8-14 -r "near" processed_data/dem_rgb.tif processed_data/terrain_xyz

# Step 3d: Convert the XYZ tile directory to a single PMTiles file
echo "--- Converting Terrain XYZ to PMTiles ---"
pmtiles convert processed_data/terrain_xyz final_tilesets/terrain.pmtiles

# --- 4. Deploy to Cloudflare R2 ---
echo "--- Deploying final tilesets to Cloudflare R2 ---"
wrangler r2 object put "${R2_BUCKET_NAME}/vector.pmtiles" --file=final_tilesets/vector.pmtiles --content-type="application/octet-stream"
wrangler r2 object put "${R2_BUCKET_NAME}/terrain.pmtiles" --file=final_tilesets/terrain.pmtiles --content-type="application/octet-stream"

echo "--- MAP BUILD COMPLETE ---"
echo "Vector tiles deployed to: https://pub-1636e051e3464ab48e64a0f8d95a6444.r2.dev/${R2_BUCKET_NAME}/vector.pmtiles"
echo "Terrain tiles deployed to: https://pub-1636e051e3464ab48e64a0f8d95a6444.r2.dev/${R2_BUCKET_NAME}/terrain.pmtiles"
