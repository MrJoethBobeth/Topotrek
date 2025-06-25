// Correctly import the entire library into the MapLibreGL namespace.
import * as MapLibreGL from '@maplibre/maplibre-react-native';
import React from 'react';
import { StyleSheet, View } from 'react-native';

// Import the local style.json file.
import style from './style.json';

export default function Index() {
  const onDidFailLoadingMap = (event: any) => {
    // This will now provide much clearer errors if the network requests fail.
    console.error(`DEBUG: Map render failed. Error: ${event.nativeEvent.payload.error}`);
  };

  const onDidFinishLoadingMap = () => {
    console.log('DEBUG: Map finished rendering successfully.');
  };

  return (
    <View style={styles.page}>
      <View style={styles.container}>
        {/* Use the MapView component from the imported namespace. */}
        <MapLibreGL.MapView
          style={styles.map}
          styleJSON={JSON.stringify(style)}
          logoEnabled={false}
          onDidFinishLoadingMap={onDidFinishLoadingMap}
          onDidFailLoadingMap={onDidFailLoadingMap}
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
  },
  container: {
    height: '100%',
    width: '100%',
  },
  map: {
    flex: 1
  }
});
