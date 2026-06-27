import { useState, useEffect, useCallback } from 'react';

export default function useGeolocation() {
  const [coords, setCoords] = useState(null);
  const [error, setError] = useState(null);
  const [watchId, setWatchId] = useState(null);

  const startWatching = useCallback(() => {
    if (!navigator.geolocation) {
      setError('Geolocation not supported');
      return;
    }

    // Clear any previous watch
    if (watchId) navigator.geolocation.clearWatch(watchId);

    const id = navigator.geolocation.watchPosition(
      (pos) => {
        setCoords({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        });
        setError(null);
      },
      (err) => {
        setError(err.message);
        setCoords(null);
      },
      { enableHighAccuracy: true, maximumAge: 10000, timeout: 10000 }
    );
    setWatchId(id);
  }, []); // watchId inside is fine, we just want to restart

  useEffect(() => {
    startWatching();
    return () => {
      if (watchId) navigator.geolocation.clearWatch(watchId);
    };
  }, [startWatching]);

  return { coords, error, retry: startWatching };
}