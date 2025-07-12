import React from 'react';
import { StyleSheet, View } from 'react-native';

// 1. Import our new, reusable MapView component from the components directory.
import MapView from './components/MapView';

// 2. Import the map's style JSON. The path './style.json' is correct from this file's location.
import * as mapStyle from './style.json';

/**
 * This is the main screen component for your app.
 * Its only job is to set up the page and render the main components.
 */
function App(): JSX.Element {
  return (
    // 3. The page container ensures our layout fills the entire screen.
    <View style={styles.page}>
      {/* 4. We render our MapView component here.
          Instead of passing many props, we just pass the single 'mapStyleObject' prop.
          Our MapView component knows how to handle the rest.
      */}
      <MapView mapStyleObject={mapStyle} />
    </View>
  );
}

// The styles for the root view of the screen.
const styles = StyleSheet.create({
  page: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
});

export default App;
