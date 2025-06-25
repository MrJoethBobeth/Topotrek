import { Stack } from "expo-router";
// Correctly import the entire library into the MapLibreGL namespace.
import * as MapLibreGL from '@maplibre/maplibre-react-native';
import React, { useEffect } from 'react';

export default function RootLayout() {
  
  // This hook runs once when the app's root component mounts.
  useEffect(() => {
    // Setting the access token is still good practice, even if null for open sources.
    MapLibreGL.setAccessToken(null);
  }, []);

  // Render the main app navigation stack. The map will load inside this.
  return <Stack />;
}
