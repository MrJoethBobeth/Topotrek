import * as Location from 'expo-location';
import { useEffect, useState } from 'react';

/**
 * A custom React hook to continuously track the user's current location and heading.
 * It handles permission requests and manages a location subscription.
 * @returns {Location.LocationObject | null} The user's latest location object, or null if not available.
 */
export function useUserLocation() {
  const [location, setLocation] = useState<Location.LocationObject | null>(null);

  useEffect(() => {
    let subscription: Location.LocationSubscription | null = null;

    const startWatching = async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        console.error('Permission to access location was denied');
        return;
      }

      // Start watching for position changes with high accuracy for navigation.
      subscription = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.BestForNavigation,
          timeInterval: 1000, // Update every 1 second
          distanceInterval: 1, // Update every 1 meter
        },
        (newLocation) => {
          setLocation(newLocation); // Update state with the new location
        }
      );
    };

    startWatching();

    // Cleanup function: This is crucial to prevent memory leaks.
    // It runs when the component using the hook unmounts.
    return () => {
      if (subscription) {
        subscription.remove();
      }
    };
  }, []); // Empty dependency array ensures this runs only once on mount.

  return location;
}
