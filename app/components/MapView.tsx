import { Camera, MapView as MapLibreMapView, UserLocation, UserTrackingMode } from '@maplibre/maplibre-react-native';
import type { Feature } from 'geojson';
import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import MapControls from './MapControls';

interface MapViewProps {
  mapStyleObject: object;
}

const MapView: React.FC<MapViewProps> = ({ mapStyleObject }) => {
  const [followUser, setFollowUser] = useState(true);

  const onRegionWillChange = (event: Feature) => {
    if (event.properties?.isUserInteraction) {
      setFollowUser(false);
    }
  };

  const recenter = () => {
    setFollowUser(true);
  };

  return (
    <View style={styles.container}>
      <MapLibreMapView
        style={styles.map}
        mapStyle={mapStyleObject}
        compassEnabled={true}
        onRegionWillChange={onRegionWillChange}
      >
        <UserLocation
          visible={true}
          showsUserHeadingIndicator={true}
        />
        
        <Camera
          followUserLocation={followUser}
          // The correct enum member for normal tracking is 'Follow'.
          followUserMode={UserTrackingMode.Follow}
          followZoomLevel={8}
          minZoomLevel={3}
        />
      </MapLibreMapView>
      
      <MapControls recenter={recenter} />
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