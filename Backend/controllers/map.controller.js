const mapService = require('../services/maps.service');
const { validationResult } = require('express-validator');

/**
 * @desc Get coordinates from address using Mapbox Geocoding
 * @route GET /api/maps/coordinates?address=someaddress
 */
module.exports.getCoordinates = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { address } = req.query;

    try {
        const coordinates = await mapService.getAddressCoordinate(address);
        if (!coordinates) {
            return res.status(404).json({ message: 'Coordinates not found' });
        }
        res.status(200).json(coordinates);
    } catch (error) {
        console.error('Mapbox getCoordinates Error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

/**
 * @desc Get distance and time between two coordinates using Mapbox Directions API
 * @route GET /api/maps/distanceTime?origin=lat,lng&destination=lat,lng
 */
module.exports.getDistanceTime = async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { origin, destination } = req.query;

        if (!origin || !destination) {
            return res.status(400).json({ message: 'Origin and destination are required' });
        }

        // Parse "lat,lng" strings into numbers
        const [originLat, originLng] = origin.split(',').map(Number);
        const [destLat, destLng] = destination.split(',').map(Number);

        // Validate parsed values
        if (
            isNaN(originLat) || isNaN(originLng) ||
            isNaN(destLat) || isNaN(destLng)
        ) {
            return res.status(400).json({ message: 'Invalid coordinates format' });
        }

        // Call map service
        const distanceTime = await mapService.getDistanceTime(
            { lat: originLat, lng: originLng },
            { lat: destLat, lng: destLng }
        );

        res.status(200).json(distanceTime);
    } catch (err) {
        console.error('Mapbox getDistanceTime Error:', err);
        res.status(500).json({ message: 'Internal server error' });
    }
};

/**
 * @desc Get autocomplete location suggestions using Mapbox Places API
 * @route GET /api/maps/autoComplete?input=query
 */
module.exports.getAutoCompleteSuggestions = async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { input } = req.query;

        if (!input || input.trim().length < 2) {
            return res.status(400).json({ message: 'Query too short' });
        }

        const suggestions = await mapService.getAutoCompleteSuggestions(input);

        if (!suggestions || suggestions.length === 0) {
            return res.status(404).json({ message: 'No suggestions found' });
        }

        res.status(200).json(suggestions);
    } catch (err) {
        console.error('Mapbox getAutoCompleteSuggestions Error:', err);
        res.status(500).json({ message: 'Internal server error' });
    }
};
