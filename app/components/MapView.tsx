import { Camera, MapView as MapLibreMapView, UserLocation, type CameraRef } from '@maplibre/maplibre-react-native';
import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import useUserLocation from '../hooks/useUserLocation';
import MapControls from './MapControls';

interface MapViewProps {
  mapStyleObject: object;
}

const MapView: React.FC<MapViewProps> = ({ mapStyleObject }) => {
  const { location } = useUserLocation();
  // 1. We now use state to hold the camera instance. This avoids the previous type errors.
  const [camera, setCamera] = useState<CameraRef | null>(null);
  const hasCentered = useRef(false);

  // 2. This effect runs when the camera is ready AND the user's location is found.
  useEffect(() => {
    // By checking for `camera` and `location`, we eliminate the race condition.
    if (camera && location && !hasCentered.current) {
      // This ensures the initial animation to the user's location happens reliably.
      camera.flyTo([location.coords.longitude, location.coords.latitude], 2000);
      hasCentered.current = true; // Mark as centered to prevent this from running again.
    }
  }, [camera, location]); // The effect now correctly depends on both the camera and location.

  return (
    <View style={styles.container}>
      <MapLibreMapView
        style={styles.map}
        mapStyle={mapStyleObject}
        compassEnabled={true}
        // Add a minZoomLevel to prevent the user from zooming out to a blank world.
        minZoomLevel={3}
      >
        <UserLocation
          visible={true}
          showsUserHeadingIndicator={true}
        />
        
        {/* 3. The 'ref' prop is now a callback. When the Camera mounts, it calls `setCamera`
            with its instance, updating our state and triggering the useEffect. */}
        <Camera ref={setCamera} />

      </MapLibreMapView>
      
      {/* 4. We pass the camera state down to the controls. */}
      <MapControls camera={camera} location={location} />
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

export default MapView;
