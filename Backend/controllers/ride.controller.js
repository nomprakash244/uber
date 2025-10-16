const rideService = require('../services/ride.service');
const { validationResult } = require('express-validator');
const mapService = require('../services/maps.service');
const { sendMessageToSocketId } = require('../socket');
const rideModel = require('../models/ride.model');

/**
 * @desc Create a new ride request
 * @route POST /api/ride/create
 */
module.exports.createRide = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { pickup, destination, vehicleType } = req.body;

    try {
        // Create ride in DB
        const ride = await rideService.createRide({
            user: req.user._id,
            pickup,
            destination,
            vehicleType
        });

        res.status(201).json(ride);

        // Get pickup coordinates via Mapbox
        const pickupCoordinates = await mapService.getAddressCoordinate(pickup);

        if (!pickupCoordinates || !pickupCoordinates.lat || !pickupCoordinates.lng) {
            console.error('Invalid pickup coordinates');
            return;
        }

        // Find captains within 2 km radius
        const captainsInRadius = await mapService.getCaptainsInTheRadius(
            pickupCoordinates.lat,
            pickupCoordinates.lng,
            2
        );

        // Remove OTP before sending ride data to captains
        ride.otp = "";

        const rideWithUser = await rideModel.findOne({ _id: ride._id }).populate('user');

        // Notify captains via WebSocket
        captainsInRadius.forEach(captain => {
            if (captain.socketId) {
                sendMessageToSocketId(captain.socketId, {
                    event: 'new-ride',
                    data: rideWithUser
                });
            }
        });

    } catch (err) {
        console.error('Error in createRide:', err);
        return res.status(500).json({ message: err.message });
    }
};

/**
 * @desc Get estimated fare between two points
 * @route GET /api/ride/fare?pickup=...&destination=...
 */
module.exports.getFare = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { pickup, destination } = req.query;

    try {
        const fare = await rideService.getFare(pickup, destination);
        return res.status(200).json(fare);
    } catch (err) {
        console.error('Error in getFare:', err);
        return res.status(500).json({ message: err.message });
    }
};

/**
 * @desc Captain confirms a ride
 * @route POST /api/ride/confirm
 */
module.exports.confirmRide = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { rideId } = req.body;

    try {
        const ride = await rideService.confirmRide({
            rideId,
            captain: req.captain
        });

        sendMessageToSocketId(ride.user.socketId, {
            event: 'ride-confirmed',
            data: ride
        });

        return res.status(200).json(ride);
    } catch (err) {
        console.error('Error in confirmRide:', err);
        return res.status(500).json({ message: err.message });
    }
};

/**
 * @desc Captain starts the ride after OTP verification
 * @route POST /api/ride/start?rideId=...&otp=...
 */
module.exports.startRide = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { rideId, otp } = req.query;

    try {
        const ride = await rideService.startRide({
            rideId,
            otp,
            captain: req.captain
        });

        sendMessageToSocketId(ride.user.socketId, {
            event: 'ride-started',
            data: ride
        });

        return res.status(200).json(ride);
    } catch (err) {
        console.error('Error in startRide:', err);
        return res.status(500).json({ message: err.message });
    }
};

/**
 * @desc Captain ends the ride
 * @route POST /api/ride/end
 */
module.exports.endRide = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { rideId } = req.body;

    try {
        const ride = await rideService.endRide({
            rideId,
            captain: req.captain
        });

        sendMessageToSocketId(ride.user.socketId, {
            event: 'ride-ended',
            data: ride
        });

        return res.status(200).json(ride);
    } catch (err) {
        console.error('Error in endRide:', err);
        return res.status(500).json({ message: err.message });
    }
};
