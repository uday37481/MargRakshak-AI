import { useState, useEffect } from 'react';

// Nashik BYK College Road default mock location
const NASHIK_DEFAULT = {
  latitude: 20.0084,
  longitude: 73.7635,
  accuracy: 10,
  speed: 0,
  timestamp: Date.now()
};

export function useGeolocation(enableRealTracking = false) {
  const [location, setLocation] = useState(NASHIK_DEFAULT);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser");
      return;
    }

    if (!enableRealTracking) {
      // By default, we use mock location for frontend testing
      return;
    }

    const handleSuccess = (position) => {
      // position.coords.speed is in meters/second, convert to km/h
      const speedKmh = position.coords.speed ? Math.round(position.coords.speed * 3.6) : 0;
      
      setLocation({
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        accuracy: position.coords.accuracy,
        speed: speedKmh,
        timestamp: position.timestamp
      });
      setError(null);
    };

    const handleError = (err) => {
      setError(err.message);
      // Fail gracefully with Nashik default
      setLocation(NASHIK_DEFAULT);
    };

    const options = {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 0
    };

    const watchId = navigator.geolocation.watchPosition(handleSuccess, handleError, options);

    return () => {
      navigator.geolocation.clearWatch(watchId);
    };
  }, [enableRealTracking]);

  return { location, error, setLocation };
}
