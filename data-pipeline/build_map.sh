#!/usr/bin/env bash
set -e # Exit immediately if a command exits with a non-zero status.

# THIS SCRIPT IS INTENDED TO BE RUN INSIDE THE DOCKER CONTAINER
echo "Starting map data build process..."

# --- Environment Variable Check ---
# This script requires Cloudflare R2 credentials configured for Rclone.
# The following environment variables MUST be set when running the Docker container.
if [ -z "$R2_BUCKET_NAME" ] || [ -z "$RCLONE_CONFIG_R2_ACCOUNT_ID" ] || [ -z "$RCLONE_CONFIG_R2_ACCESS_KEY_ID" ] || [ -z "$RCLONE_CONFIG_R2_SECRET_ACCESS_KEY" ]; then
    echo "Error: One or more required environment variables are not set."
    echo "Please set: R2_BUCKET_NAME, RCLONE_CONFIG_R2_ACCOUNT_ID, RCLONE_CONFIG_R2_ACCESS_KEY_ID, RCLONE_CONFIG_R2_SECRET_ACCESS_KEY"
    exit 1
fi

# --- Configuration for Data Sources ---
# OSM data for Colorado from Geofabrik.
OSM_PBF_URL="https://download.geofabrik.de/north-america/us/colorado-latest.osm.pbf"
# VRT (Virtual Raster) file pointing to the global terrain dataset on AWS S3.
# The /vsis3/ prefix is GDAL's syntax for reading a file directly from an S3 bucket.
DEM_VRT_URL="/vsis3/elevation-tiles-prod/vrt/512/all.vrt"

# --- Directory Setup ---
# Create a temporary directory to work in, ensuring it gets cleaned up on exit.
TEMP_DIR=$(mktemp -d)
trap 'rm -rf -- "$TEMP_DIR"' EXIT
echo "Created temporary directory: $TEMP_DIR"
cd $TEMP_DIR

# --- 1. Process Vector Tiles ---
echo "--- [1/4] Processing Vector Tiles from OpenStreetMap ---"

echo "Fetching raw OSM data for Colorado..."
curl -fL -o data.osm.pbf $OSM_PBF_URL

echo "Fetching Tilemaker configuration files..."
curl -fL -o config.json https://raw.githubusercontent.com/systemed/tilemaker/master/resources/config-openmaptiles.json
curl -fL -o process.lua https://raw.githubusercontent.com/systemed/tilemaker/master/resources/process-openmaptiles.lua

echo "Running tilemaker to convert PBF to MBTiles format..."
tilemaker --input data.osm.pbf --output vector.mbtiles --config config.json --process process.lua

echo "Converting Vector MBTiles to PMTiles..."
pmtiles convert vector.mbtiles vector.pmtiles

# --- 2. Process Elevation (Terrain-RGB) Tiles ---
echo "--- [2/4] Processing Elevation Tiles from DEM ---"
# This process uses GDAL to create Terrain-RGB tiles from the AWS DEM source.

echo "Step 2a: Reprojecting DEM to Web Mercator (EPSG:3857)..."
# This reads directly from the cloud VRT file and creates a local, reprojected GeoTIFF.
gdalwarp -t_srs EPSG:3857 "$DEM_VRT_URL" dem_warped.tif

echo "Step 2b: Encoding DEM to Terrain-RGB format..."
# This formula encodes height data into the RGB channels of a new GeoTIFF.
gdal_calc.py -A dem_warped.tif --outfile=dem_rgb.tif --calc="((A+10000)/0.1).astype(int)" --type=Int32

echo "Step 2c: Tiling the RGB GeoTIFF into an XYZ directory..."
# This creates a directory structure of individual map tiles.
gdal2tiles.py -z 8-14 -r "near" dem_rgb.tif terrain_xyz

echo "Step 2d: Converting Terrain XYZ directory to PMTiles..."
pmtiles convert terrain_xyz terrain.pmtiles

# --- 3. Upload to Cloudflare R2 ---
echo "--- [3/4] Deploying final tilesets to Cloudflare R2 ---"
# Rclone will automatically use the RCLONE_CONFIG_* environment variables for configuration.
rclone copy vector.pmtiles "R2:$R2_BUCKET_NAME/"
rclone copy terrain.pmtiles "R2:$R2_BUCKET_NAME/"

# --- 4. Completion ---
echo "--- [4/4] MAP BUILD COMPLETE ---"
# The trap command will automatically clean up the temporary directory upon exit.
