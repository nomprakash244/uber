const axios = require('axios');
const captainModel = require('../models/captain.model');

const MAPBOX_ACCESS_TOKEN = process.env.MAPBOX_ACCESS_TOKEN;

/**
 * 1️⃣ Convert address → coordinates (Mapbox Geocoding API)
 */
module.exports.getAddressCoordinate = async (address) => {
  if (!address) throw new Error('Address is required');

  const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(address)}.json`;

  try {
    const response = await axios.get(url, {
      params: {
        access_token: MAPBOX_ACCESS_TOKEN,
        limit: 1,
      },
    });

    if (!response.data.features?.length) {
      throw new Error('No coordinates found');
    }

    const [lng, lat] = response.data.features[0].center;

    return { lat, lng };
  } catch (error) {
    console.error('Mapbox getAddressCoordinate Error:', error.response?.data || error.message);
    throw new Error('Unable to fetch coordinates');
  }
};

/**
 * 2️⃣ Get distance and time (Mapbox Directions API)
 */
module.exports.getDistanceTime = async (origin, destination) => {
  if (!origin || !destination) {
    throw new Error('Origin and destination are required');
  }

  const url = `https://api.mapbox.com/directions/v5/mapbox/driving/${origin.lng},${origin.lat};${destination.lng},${destination.lat}`;

  try {
    const response = await axios.get(url, {
      params: {
        access_token: MAPBOX_ACCESS_TOKEN,
        geometries: 'geojson',
      },
    });

    if (!response.data.routes?.length) {
      throw new Error('No routes found');
    }

    const route = response.data.routes[0];
    return {
      distance: route.distance / 1000, // kilometers
      duration: route.duration / 60,   // minutes
    };
  } catch (error) {
    console.error('Mapbox getDistanceTime Error:', error.response?.data || error.message);
    throw new Error('Unable to fetch distance and time');
  }
};

/**
 * 3️⃣ Autocomplete suggestions (Mapbox Geocoding API)
 */
module.exports.getAutoCompleteSuggestions = async (input) => {
  if (!input) throw new Error('Query is required');

  const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(input)}.json`;

  try {
    const response = await axios.get(url, {
      params: {
        access_token: MAPBOX_ACCESS_TOKEN,
        autocomplete: true,
        limit: 5,
      },
    });

    if (!response.data.features?.length) {
      throw new Error('No suggestions found');
    }

    return response.data.features.map((feature) => feature.place_name);
  } catch (error) {
    console.error('Mapbox getAutoCompleteSuggestions Error:', error.response?.data || error.message);
    throw new Error('Unable to fetch suggestions');
  }
};

/**
 * 4️⃣ Find captains within a given radius
 * MongoDB expects coordinates in [longitude, latitude] order.
 */
/**
 * Find captains within a given radius (in km)
 */
module.exports.getCaptainsInTheRadius = async (lat, lng, radiusInKm) => {
  try {
    const radiusInMeters = radiusInKm * 1000;

    const captains = await captainModel.find({
      location: {
        $near: {
          $geometry: { type: "Point", coordinates: [lng, lat] },
          $maxDistance: radiusInMeters
        }
      }
    });

    console.log(`🚖 Captains found in ${radiusInKm}km radius:`, captains.map(c => c._id));
    return captains;
  } catch (err) {
    console.error('❌ Error finding captains in radius:', err);
    return [];
  }
};

