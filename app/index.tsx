import React from 'react';
import { StyleSheet, View } from 'react-native';
import MapView from './components/MapView';

// It's generally better to import JSON with a default import.
// This ensures you get the raw object.
// Make sure "resolveJsonModule": true is in your tsconfig.json (it's default in Expo).
import mapStyle from './style.json';

function App(): JSX.Element {
  return (
    // The page container now correctly fills the screen and allows its child to do the same.
    <View style={styles.page}>
      <MapView mapStyleObject={mapStyle} />
    </View>
  );
}

// The styles for the root view of the screen have been updated.
const styles = StyleSheet.create({
  page: {
    // By only having flex: 1, this View will take up the whole screen
    // and give that space to its children.
    flex: 1,
    backgroundColor: '#F5FCFF', // You can keep a background color for the initial load
  },
});

export default App;
