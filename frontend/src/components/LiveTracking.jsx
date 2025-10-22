import React, { useState, useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN;

const LiveTracking = () => {
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);
  const markerRef = useRef(null);

  const [currentPosition, setCurrentPosition] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Initialize Mapbox map
  useEffect(() => {
    mapRef.current = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: [84.74495, 19.19958], // default location (e.g., Berhampur)
      zoom: 15,
    });

    mapRef.current.addControl(new mapboxgl.NavigationControl());
    mapRef.current.addControl(new mapboxgl.FullscreenControl());

    // Clean up map instance on unmount
    return () => mapRef.current.remove();
  }, []);

  // Handle live tracking
  useEffect(() => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser');
      setLoading(false);
      return;
    }

    const updatePosition = (position) => {
      const { latitude, longitude } = position.coords;
      const newPos = { lat: latitude, lng: longitude };
      setCurrentPosition(newPos);
      setLoading(false);

      // If marker doesn't exist, create it
      if (!markerRef.current) {
        markerRef.current = new mapboxgl.Marker({ color: '#ff0000' })
          .setLngLat([longitude, latitude])
          .addTo(mapRef.current);
      } else {
        markerRef.current.setLngLat([longitude, latitude]);
      }

      // Smooth map movement
      if (mapRef.current) {
        mapRef.current.easeTo({
          center: [longitude, latitude],
          duration: 1000,
        });
      }
    };

    const handleError = (err) => {
      console.error('Geolocation error:', err);
      setError('Unable to retrieve location');
      setLoading(false);
    };

    navigator.geolocation.getCurrentPosition(updatePosition, handleError, {
      enableHighAccuracy: true,
    });

    const watchId = navigator.geolocation.watchPosition(updatePosition, handleError, {
      enableHighAccuracy: true,
      maximumAge: 1000,
    });

    return () => navigator.geolocation.clearWatch(watchId);
  }, []);

  return (
    <div className="relative w-full h-full">
      {/* Map Container */}
      <div
        ref={mapContainerRef}
        className="w-full h-full rounded-2xl shadow-md"
        style={{ border: '1px solid #ccc' }}
      />

      {/* Loading Overlay */}
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-white/80 backdrop-blur-sm text-gray-700 font-medium">
          Getting your location...
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-red-500 text-white px-4 py-2 rounded-lg shadow-md">
          {error}
        </div>
      )}
    </div>
  );
};

export default LiveTracking;