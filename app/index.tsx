import * as MapLibreGL from '@maplibre/maplibre-react-native';
import React, { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';

// Import the style JSON
import fullMapStyle from './style.json';

// If you are not using a MapTiler key, it's good practice to set the access token to null.
MapLibreGL.setAccessToken(null);

// A minimal, valid style that just shows a background color.
// This prevents the map from falling back to a default demo style if your main style fails to load.
const blankStyle = {
  version: 8,
  name: 'Blank',
  sources: {},
  layers: [
    {
      id: 'background',
      type: 'background',
      paint: {
        'background-color': '#f8f4f0', // A light background color
      },
    },
  ],
};

export default function MapScreen() {
  // Use state to manage the map style. Start with the blank style.
  const [style, setStyle] = useState(JSON.stringify(blankStyle));

  // After the component mounts, switch to the full style.
  useEffect(() => {
    // We stringify the full style object to pass to the MapView
    const fullStyleString = JSON.stringify(fullMapStyle);
    setStyle(fullStyleString);
  }, []); // The empty dependency array ensures this effect runs only once on mount.

  return (
    <View style={styles.container}>
      <MapLibreGL.MapView
        style={styles.map}
        styleJSON={style} // The style is now controlled by our component's state
        logoEnabled={false}
      >
        <MapLibreGL.Camera
          zoomLevel={9}
          centerCoordinate={[-71.0589, 42.3601]} // Centered on Boston, MA
          animationMode={'flyTo'}
          animationDuration={0}
        />
      </MapLibreGL.MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
});
