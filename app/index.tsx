import { StyleSheet, View } from "react-native";
// Correctly import the MapView component as a named export.
import { MapView } from '@maplibre/maplibre-react-native';
// Import the map style from the local JSON file.
import style from './style.json';

/**
 * This is the main screen of the application.
 * It displays a full-screen map using MapLibre.
 */
const Index = () => {
  return (
    // A container view that takes up the full screen.
    <View style={styles.container}>
      {/* The MapView component renders the map.
        - The `style` prop makes the map fill its container.
        - The `styleURL` prop loads the map's appearance. It can accept
          a URL or, as in this case, a stringified JSON style object.
      */}
      <MapView 
        style={styles.map} 
        styleURL={JSON.stringify(style)} 
      />
    </View>
  );
};

// Use StyleSheet.create for performance and organization.
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
});

export default Index;
