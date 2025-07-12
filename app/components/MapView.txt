import { Camera, MapView as MapLibreMapView, UserLocation } from '@maplibre/maplibre-react-native';
import React from 'react';
import { StyleSheet } from 'react-native';
import { useUserLocation } from '../hooks/useUserLocation';

interface MapViewProps {
  mapStyleObject: object;
}

const MapView: React.FC<MapViewProps> = ({ mapStyleObject }) => {
  // Our custom hook provides a continuous stream of location updates.
  const userLocation = useUserLocation();

  return (
    <MapLibreMapView
      style={styles.map}
      mapStyle={mapStyleObject}
      compassEnabled={true}
    >
      {/* The UserLocation component is only for displaying the puck. */}
      <UserLocation
        visible={true}
        showsUserHeadingIndicator={true}
      />
      
      {/*
        By binding the Camera's props directly to our `userLocation` state,
        we ensure that every time the location updates, the camera's position
        is re-evaluated and the map view changes.
      */}
      <Camera
        centerCoordinate={
          userLocation
            ? [userLocation.coords.longitude, userLocation.coords.latitude]
            : [-74.0060, 40.7128] // A default location before the first update
        }
        // Bind the map's heading to the device's heading from our location object.
        heading={userLocation?.coords.heading ?? 0}
        zoomLevel={16}
        animationMode={'easeTo'}
        animationDuration={500} // A short animation for smooth tracking
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
