import * as MapLibreGL from '@maplibre/maplibre-react-native';
import React from 'react';
import { Alert, StyleSheet, View } from 'react-native';

// Define a more specific type for the press event payload for clarity.
type MapPressEvent = GeoJSON.Feature<
  GeoJSON.Point,
  { screenPointX: number; screenPointY: number }
>;

// A minimal style object to test if the PMTiles source loads at all.
// This removes all complexity and potential points of failure from the external JSON file.
const minimalStyle = {
  version: 8,
  name: 'Minimal PMTiles Test',
  sources: {
    'basemap-osm': {
      type: 'vector',
      url: 'pmtiles://https://pub-1636e051e3464ab48e64a0f8d95a6444.r2.dev/basemap/us-northeast-osm.pmtiles',
      attribution: '© OpenStreetMap contributors',
    },
  },
  layers: [
    {
      id: 'background',
      type: 'background',
      paint: { 'background-color': '#f8f4f0' }, // A light beige background
    },
    {
      id: 'test-water',
      type: 'fill',
      source: 'basemap-osm',
      'source-layer': 'water', // Make sure this source-layer name is correct in your tiles
      paint: {
        'fill-color': '#0000FF', // Bright blue to make it obvious
      },
    },
  ],
};

const MapScreen = () => {
  const mapRef = React.useRef<MapLibreGL.MapView>(null);

  const onDidFailLoadingMap = (
    event: { nativeEvent: { payload: { error: string } } }
  ) => {
    console.error('Failed to load map:', event.nativeEvent.payload.error);
    Alert.alert(
      'Map Load Error',
      `Failed to load the map style. Error: ${event.nativeEvent.payload.error}`,
    );
  };

  const onPress = async (event: MapPressEvent) => {
    const coords = event.geometry.coordinates;
    console.log('You tapped on the map at:', coords);

    const screenPoint: [number, number] = [
      event.properties.screenPointX,
      event.properties.screenPointY,
    ];

    const features = await mapRef.current?.queryRenderedFeaturesAtPoint(
      screenPoint,
      null,
      ['test-water'] // Only query our single test layer
    );

    if (features && features.features.length > 0) {
      const topFeature = features.features[0];
      console.log('Tapped Feature Properties:', topFeature.properties);
      Alert.alert(
        `Layer: ${topFeature.layer.id}`,
        `Properties: ${JSON.stringify(topFeature.properties, null, 2)}`,
      );
    }
  };

  return (
    <View style={styles.page}>
      <View style={styles.container}>
        <MapLibreGL.MapView
          ref={mapRef}
          style={styles.map}
          // Pass the minimal style object directly, ensuring it's stringified.
          styleJSON={JSON.stringify(minimalStyle)}
          onDidFailLoadingMap={onDidFailLoadingMap}
          onPress={onPress}
          logoEnabled={false}
        >
          <MapLibreGL.Camera
            defaultSettings={{
              centerCoordinate: [-74.0060, 40.7128], // Centered on New York City
              zoomLevel: 10,
            }}
          />
        </MapLibreGL.MapView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  page: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    height: '100%',
    width: '100%',
  },
  map: {
    flex: 1,
  },
});

export default MapScreen;
