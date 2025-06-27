import * as MapLibreGL from '@maplibre/maplibre-react-native';
import React from 'react';
import { StyleSheet, View } from 'react-native';

// Import the style JSON
import style from './style.json';

// Set the access token for MapLibre GL
MapLibreGL.setAccessToken(null);

const App = () => {
  return (
    <View style={styles.container}>
      <MapLibreGL.MapView
        style={styles.map}
        styleJSON={JSON.stringify(style)}>
        <MapLibreGL.Camera
          zoomLevel={10}
          centerCoordinate={[-74.0060, 40.7128]} // New York City
        />
      </MapLibreGL.MapView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
});

export default App;
