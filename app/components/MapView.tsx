import { Camera, MapView as MapLibreMapView, UserLocation } from '@maplibre/maplibre-react-native';
import React from 'react';
import { StyleSheet } from 'react-native';
import { useUserLocation } from '../hooks/useUserLocation';

interface MapViewProps {
  mapStyleObject: object;
}

const MapView: React.FC<MapViewProps> = ({ mapStyleObject }) => {
  // Our hook now provides both location and heading from the device hardware.
  const { location, heading } = useUserLocation();

  return (
    <MapLibreMapView
      style={styles.map}
      mapStyle={mapStyleObject}
      compassEnabled={true}
    >
      {/* The UserLocation component shows the blue "puck" on the map.
          'showsUserHeadingIndicator' makes the puck's arrow point in the direction of the device's heading.
      */}
      <UserLocation
        visible={true}
        showsUserHeadingIndicator={true}
      />
      
      {/*
        The Camera's view is controlled by the user's location and heading.
        This creates a "first-person" navigation experience.
      */}
      <Camera
        // Center the map on the user's current coordinates.
        centerCoordinate={
          location
            ? [location.coords.longitude, location.coords.latitude]
            : [-74.0060, 40.7128] // Default to New York City if location is not yet available.
        }
        // Rotate the map to match the direction the user's device is pointing.
        // We use 'trueHeading' for the most accurate direction.
        heading={heading?.trueHeading ?? 0}
        zoomLevel={16}
        animationMode={'easeTo'}
        animationDuration={500} // Smoothly animate camera changes.
      />
    </MapLibreMapView>
  );
};

const styles = StyleSheet.create({
  map: {
    flex: 1,
    alignSelf: 'stretch',
  },
});

export default MapView;
