import React, { useRef, useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import axios from 'axios';

// Set your Mapbox access token
mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN;

const CaptainRiding = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const rideData = location.state?.ride;

  // Map refs
  const mapRef = useRef(null);
  const mapContainerRef = useRef(null);
  const pickupMarkerRef = useRef(null);
  const destinationMarkerRef = useRef(null);
  const liveMarkerRef = useRef(null);
  
  // State
  const [loading, setLoading] = useState(true);
  const [pickupCoords, setPickupCoords] = useState(null);
  const [destinationCoords, setDestinationCoords] = useState(null);
  const [currentLocation, setCurrentLocation] = useState(null);

  // Geocode address using Mapbox Geocoding API
  const geocodeAddress = async (address) => {
    try {
      console.log('Geocoding address:', address);
      const response = await axios.get(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(address)}.json`,
        {
          params: {
            access_token: mapboxgl.accessToken,
            limit: 1
          }
        }
      );
      
      if (response.data && response.data.features && response.data.features.length > 0) {
        const coords = {
          lng: response.data.features[0].center[0],
          lat: response.data.features[0].center[1]
        };
        console.log('Geocoded to:', coords);
        return coords;
      }
      console.warn('No results for address:', address);
      return null;
    } catch (error) {
      console.error('Geocoding error:', error);
      return null;
    }
  };

  // Initialize map
  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    console.log('Initializing Mapbox map...');
    console.log('Ride data:', rideData);

    // Create map
    mapRef.current = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: [84.74495, 19.19958], // [lng, lat] - Berhampur default
      zoom: 13
    });

    // Add navigation controls
    mapRef.current.addControl(new mapboxgl.NavigationControl(), 'top-right');
    mapRef.current.addControl(new mapboxgl.FullscreenControl(), 'top-right');

    console.log('Mapbox map initialized successfully');

    // Cleanup
    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  // Geocode addresses
  useEffect(() => {
    const loadCoordinates = async () => {
      if (!rideData) {
        console.warn('No ride data available');
        setLoading(false);
        return;
      }

      console.log('Loading coordinates for:', rideData.pickup, rideData.destination);

      // Geocode pickup
      if (rideData.pickup) {
        const pickup = await geocodeAddress(rideData.pickup);
        if (pickup) {
          setPickupCoords(pickup);
          console.log('Pickup coords set:', pickup);
        }
      }

      // Geocode destination
      if (rideData.destination) {
        const dest = await geocodeAddress(rideData.destination);
        if (dest) {
          setDestinationCoords(dest);
          console.log('Destination coords set:', dest);
        }
      }

      setLoading(false);
    };

    loadCoordinates();
  }, [rideData]);

  // Add markers and route when coordinates are ready
  useEffect(() => {
    if (!mapRef.current || !pickupCoords || !destinationCoords) {
      console.log('Waiting for map or coordinates...', { 
        hasMap: !!mapRef.current, 
        hasPickup: !!pickupCoords, 
        hasDest: !!destinationCoords 
      });
      return;
    }

    console.log('Adding markers and route...');

    // Remove existing markers if any
    if (pickupMarkerRef.current) pickupMarkerRef.current.remove();
    if (destinationMarkerRef.current) destinationMarkerRef.current.remove();

    // Create pickup marker (Blue)
    const pickupEl = document.createElement('div');
    pickupEl.className = 'pickup-marker';
    pickupEl.style.backgroundImage = 'url(https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png)';
    pickupEl.style.width = '25px';
    pickupEl.style.height = '41px';
    pickupEl.style.backgroundSize = 'cover';
    pickupEl.style.cursor = 'pointer';

    pickupMarkerRef.current = new mapboxgl.Marker(pickupEl)
      .setLngLat([pickupCoords.lng, pickupCoords.lat])
      .setPopup(new mapboxgl.Popup().setHTML(`<b>Pickup</b><br>${rideData?.pickup || 'Pickup Location'}`))
      .addTo(mapRef.current);

    // Create destination marker (Blue)
    const destEl = document.createElement('div');
    destEl.className = 'destination-marker';
    destEl.style.backgroundImage = 'url(https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png)';
    destEl.style.width = '25px';
    destEl.style.height = '41px';
    destEl.style.backgroundSize = 'cover';
    destEl.style.cursor = 'pointer';

    destinationMarkerRef.current = new mapboxgl.Marker(destEl)
      .setLngLat([destinationCoords.lng, destinationCoords.lat])
      .setPopup(new mapboxgl.Popup().setHTML(`<b>Destination</b><br>${rideData?.destination || 'Destination'}`))
      .addTo(mapRef.current);

    // Get route using Mapbox Directions API
    getRoute([pickupCoords.lng, pickupCoords.lat], [destinationCoords.lng, destinationCoords.lat]);

    // Fit map to show both markers
    const bounds = new mapboxgl.LngLatBounds();
    bounds.extend([pickupCoords.lng, pickupCoords.lat]);
    bounds.extend([destinationCoords.lng, destinationCoords.lat]);
    mapRef.current.fitBounds(bounds, { padding: 100 });

    console.log('Markers added successfully');

  }, [pickupCoords, destinationCoords, rideData]);

  // Get route from Mapbox Directions API
  const getRoute = async (start, end) => {
    try {
      const response = await axios.get(
        `https://api.mapbox.com/directions/v5/mapbox/driving/${start[0]},${start[1]};${end[0]},${end[1]}`,
        {
          params: {
            geometries: 'geojson',
            access_token: mapboxgl.accessToken
          }
        }
      );

      const data = response.data.routes[0];
      const route = data.geometry.coordinates;

      console.log('Route fetched:', route);

      // Add route to map
      if (mapRef.current.getSource('route')) {
        mapRef.current.getSource('route').setData({
          type: 'Feature',
          properties: {},
          geometry: {
            type: 'LineString',
            coordinates: route
          }
        });
      } else {
        mapRef.current.addLayer({
          id: 'route',
          type: 'line',
          source: {
            type: 'geojson',
            data: {
              type: 'Feature',
              properties: {},
              geometry: {
                type: 'LineString',
                coordinates: route
              }
            }
          },
          layout: {
            'line-join': 'round',
            'line-cap': 'round'
          },
          paint: {
            'line-color': '#3b82f6',
            'line-width': 5,
            'line-opacity': 0.8
          }
        });
      }
    } catch (error) {
      console.error('Error fetching route:', error);
    }
  };

  // Track live location with smooth animation
  useEffect(() => {
    if (!mapRef.current || !navigator.geolocation) {
      console.warn('Map or geolocation not available');
      return;
    }

    const updateLiveLocation = (position) => {
      const { latitude, longitude, heading, speed } = position.coords;
      console.log('Live location update:', { latitude, longitude, heading, speed });

      const newLocation = [longitude, latitude];
      setCurrentLocation(newLocation);

      if (!liveMarkerRef.current) {
        // Create live location marker (Red with pulse effect)
        const liveEl = document.createElement('div');
        liveEl.className = 'live-location-marker';
        liveEl.innerHTML = `
          <div style="
            width: 40px;
            height: 40px;
            background: #ff0000;
            border: 3px solid white;
            border-radius: 50%;
            box-shadow: 0 0 10px rgba(255, 0, 0, 0.5);
            display: flex;
            align-items: center;
            justify-content: center;
            animation: pulse 2s infinite;
          ">
            <div style="
              width: 12px;
              height: 12px;
              background: white;
              border-radius: 50%;
            "></div>
          </div>
        `;

        // Add pulse animation
        const style = document.createElement('style');
        style.textContent = `
          @keyframes pulse {
            0% {
              box-shadow: 0 0 0 0 rgba(255, 0, 0, 0.7);
            }
            70% {
              box-shadow: 0 0 0 15px rgba(255, 0, 0, 0);
            }
            100% {
              box-shadow: 0 0 0 0 rgba(255, 0, 0, 0);
            }
          }
        `;
        document.head.appendChild(style);

        liveMarkerRef.current = new mapboxgl.Marker(liveEl)
          .setLngLat(newLocation)
          .setPopup(new mapboxgl.Popup().setHTML('<b>Your Live Location</b>'))
          .addTo(mapRef.current);
      } else {
        // Smoothly animate marker to new position
        liveMarkerRef.current.setLngLat(newLocation);
      }

      // Smoothly pan map to follow live location
      mapRef.current.easeTo({
        center: newLocation,
        duration: 1000, // 1 second smooth transition
        essential: true // This animation is considered essential with respect to prefers-reduced-motion
      });
    };

    const handleError = (err) => {
      console.error('Geolocation error:', err.message);
      if (err.code === 1) {
        alert('Please allow location access to track your ride');
      }
    };

    // Get initial position
    navigator.geolocation.getCurrentPosition(updateLiveLocation, handleError, {
      enableHighAccuracy: true,
      timeout: 5000,
      maximumAge: 0
    });

    // Watch position for continuous updates
    const watchId = navigator.geolocation.watchPosition(updateLiveLocation, handleError, {
      enableHighAccuracy: true,
      timeout: 5000,
      maximumAge: 0 // Don't use cached position
    });

    return () => {
      navigator.geolocation.clearWatch(watchId);
      if (liveMarkerRef.current) {
        liveMarkerRef.current.remove();
      }
    };
  }, []);

  const handleCompleteRide = () => {
    navigate('/captain-home', { state: { ride: rideData } });
  };

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-gray-100">
      {/* Header */}
      <div className="p-4 flex items-center justify-between w-full z-20 bg-white shadow-md flex-shrink-0">
        <img
          className="w-12"
          src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQGtDRk78nK-4kd9htj9nCA4zWEPppOHQ5mVQ&s"
          alt="Uber Logo"
        />
        <Link
          to="/captain-home"
          className="h-10 w-10 bg-white flex items-center justify-center rounded-full border-2 border-gray-200 hover:bg-gray-100 transition-colors"
        >
          <i className="text-lg font-medium ri-logout-box-r-line"></i>
        </Link>
      </div>

      {/* Map Container - 60% */}
      <div className="flex-1 w-full relative" style={{ height: '70%' }}>
        <div ref={mapContainerRef} className="w-full h-full" style={{ minHeight: '400px' }} />
        
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/90 backdrop-blur-sm text-gray-700 font-medium z-10">
            <div className="text-center">
              <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
              <p>Loading locations...</p>
            </div>
          </div>
        )}

        {/* Live tracking indicator */}
        {currentLocation && (
          <div className="absolute top-4 left-4 bg-red-500 text-white px-3 py-2 rounded-lg shadow-lg flex items-center gap-2 animate-pulse">
            <div className="w-2 h-2 bg-white rounded-full"></div>
            <span className="text-sm font-semibold">Live Tracking</span>
          </div>
        )}
      </div>

      {/* Bottom Panel - 40% */}
      <div className="flex-1 w-full bg-white shadow-2xl rounded-t-3xl overflow-y-auto" style={{ height: '40%' }}>
        <div className="w-full py-4">
          <div className="w-16 h-1.5 bg-gray-300 rounded-full mx-auto"></div>
        </div>

        <div className="px-6 pb-6">
          <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <i className="ri-map-pin-2-fill text-blue-600 text-xl"></i>
              </div>
              <div>
                <h4 className="text-lg font-semibold text-gray-800">En Route</h4>
                <p className="text-sm text-gray-500">Following the route</p>
              </div>
            </div>
            <button 
              className="bg-green-600 text-white font-semibold py-3 px-8 rounded-xl hover:bg-green-700 transition-all shadow-lg"
              onClick={handleCompleteRide}
            >
              <i className="ri-check-line mr-2"></i>
              Complete Ride
            </button>
          </div>

          <div className="bg-gray-50 rounded-2xl p-4 space-y-3">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                <i className="ri-map-pin-fill text-blue-600 text-lg"></i>
              </div>
              <div className="flex-1">
                <p className="text-xs text-gray-500 font-medium">PICKUP</p>
                <p className="text-sm font-semibold text-gray-800">{rideData?.pickup || 'Pickup Location'}</p>
              </div>
            </div>

            <div className="border-l-2 border-dashed border-gray-300 ml-4 h-6"></div>

            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                <i className="ri-map-pin-fill text-blue-600 text-lg"></i>
              </div>
              <div className="flex-1">
                <p className="text-xs text-gray-500 font-medium">DESTINATION</p>
                <p className="text-sm font-semibold text-gray-800">{rideData?.destination || 'Destination'}</p>
              </div>
            </div>
          </div>

          {rideData?.user && (
            <div className="mt-4 bg-yellow-50 rounded-2xl p-4 flex items-center gap-3">
              <div className="w-12 h-12 bg-yellow-200 rounded-full flex items-center justify-center">
                <i className="ri-user-fill text-yellow-700 text-xl"></i>
              </div>
              <div className="flex-1">
                <p className="text-xs text-gray-500 font-medium">PASSENGER</p>
                <p className="text-sm font-semibold text-gray-800">
                  {rideData.user.fullname?.firstname} {rideData.user.fullname?.lastname}
                </p>
              </div>
              <div className="text-right">
                <p className="text-lg font-bold text-gray-800">₹{rideData?.fare}</p>
                <p className="text-xs text-gray-500">Cash</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CaptainRiding;
