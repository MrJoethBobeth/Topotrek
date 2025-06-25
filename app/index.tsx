import * as MapLibreGL from '@maplibre/maplibre-react-native';
import React from 'react';
import { StyleSheet, View } from 'react-native';

// --- GET YOUR FREE API KEY ---
// 1. Go to https://www.maptiler.com/
// 2. Sign up for a free account.
// 3. Find your API key in your account dashboard.
// 4. Replace "YOUR_API_KEY_HERE" with your actual key.
const MAPTILER_API_KEY = "hOL9m32oLnOOhz9KAqQQ";

// Set the access token for MapTiler. 
// This is a one-time setup that MapLibre uses for any requests to MapTiler's services.
MapLibreGL.setAccessToken(null); // We are not using Mapbox, so this can be null.

const App = () => {
  // This style URL points to a complete map style provided by MapTiler.
  // It includes both the data sources (vector tiles) and the visual styling rules.
  // This replaces the need for a local style.json for now.
  const styleURL = `https://api.maptiler.com/maps/streets-v2/style.json?key=${MAPTILER_API_KEY}`;

  return (
    <View style={styles.container}>
      <MapLibreGL.MapView
        style={styles.map}
        styleURL={styleURL}
        logoEnabled={false} // You can disable the logo if you provide proper attribution elsewhere
      >
        <MapLibreGL.Camera
          zoomLevel={2}
          centerCoordinate={[-98.5795, 39.8283]} // Center on the USA
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
