import MapLibreGL from '@maplibre/maplibre-react-native';
import React, { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';

export default function Index() {
  // We call `setAccessToken` within a useEffect hook to ensure the native module
  // has been properly initialized before we try to use it.
  useEffect(() => {
    // For MapLibre, an access token isn't strictly necessary for open tile sources.
    // We are setting it to null as we will use our own tile sources later.
    MapLibreGL.setAccessToken(null);
  }, []);

  // A public style URL from MapLibre's demo server.
  // This provides a basic map layer to verify that the component is working.
  // In the next steps, you will replace this with the URL to your own style.json
  // which will be hosted on Cloudflare R2.
  const styleURL = 'https://demotiles.maplibre.org/style.json';

  return (
    <View style={styles.page}>
      <View style={styles.container}>
        <MapLibreGL.MapView
          style={styles.map}
          styleURL={styleURL}
          logoEnabled={false} // Hides the MapLibre logo
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF'
  },
  container: {
    height: '100%',
    width: '100%',
  },
  map: {
    flex: 1
  }
});