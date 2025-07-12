import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface MapControlsProps {
  // 1. The component now accepts a simple function to re-enable tracking.
  recenter: () => void;
}

const MapControls: React.FC<MapControlsProps> = ({ recenter }) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.button} onPress={recenter}>
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