import { type CameraRef } from '@maplibre/maplibre-react-native';
import * as Location from 'expo-location';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

// Define the props that this component will accept.
interface MapControlsProps {
  // 1. The component now accepts the camera instance directly, which may be null initially.
  camera: CameraRef | null;
  location: Location.LocationObject | null;
}

const MapControls: React.FC<MapControlsProps> = ({ camera, location }) => {
  /**
   * This function is called when the user presses the button.
   * It commands the camera to fly to the user's current location.
   */
  const centerOnUser = () => {
    // 2. The check is now simpler and more direct.
    if (camera && location) {
      camera.flyTo(
        [location.coords.longitude, location.coords.latitude],
        1200 // Animation duration in milliseconds
      );
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.button} onPress={centerOnUser}>
        <Text style={styles.buttonText}>🎯</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 40,
    right: 20,
  },
  button: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  buttonText: {
    fontSize: 24,
  },
});

export default MapControls;
