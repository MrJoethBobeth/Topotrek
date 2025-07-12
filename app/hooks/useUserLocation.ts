import * as Location from 'expo-location';
import { useEffect, useState } from 'react';

/**
 * A custom React hook to continuously track the user's current location and heading.
 * It handles permission requests and manages subscriptions for both location and heading updates.
 * @returns {{ location: Location.LocationObject | null; heading: Location.LocationHeadingObject | null }} An object containing the latest location and heading.
 */
export function useUserLocation() {
  const [userState, setUserState] = useState<{
    location: Location.LocationObject | null;
    heading: Location.LocationHeadingObject | null;
  }>({ location: null, heading: null });

  useEffect(() => {
    let locationSubscription: Location.LocationSubscription | null = null;
    let headingSubscription: Location.LocationSubscription | null = null;

    const startWatching = async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        console.error('Permission to access location was denied');
        return;
      }

      // Start watching for position changes
      locationSubscription = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.BestForNavigation,
          timeInterval: 1000,
          distanceInterval: 1,
        },
        (newLocation) => {
          setUserState((prevState) => ({ ...prevState, location: newLocation }));
        }
      );

      // Start watching for heading changes
      headingSubscription = await Location.watchHeadingAsync((newHeading) => {
        setUserState((prevState) => ({ ...prevState, heading: newHeading }));
      });
    };

    startWatching();

    // Cleanup function to remove subscriptions on unmount
    return () => {
      locationSubscription?.remove();
      headingSubscription?.remove();
    };
  }, []); // Empty dependency array ensures this runs only once.

  return userState;
}
