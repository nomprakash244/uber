const rideModel = require('../models/ride.model');
const mapService = require('./maps.service');
const crypto = require('crypto');

/**
 * Calculate estimated fare between pickup and destination
 */
async function getFare(pickup, destination) {
  if (!pickup || !destination) {
    throw new Error('Pickup and destination are required');
  }

  // ✅ Convert address → coordinates using Mapbox
  const pickupCoords = await mapService.getAddressCoordinate(pickup);
  const destinationCoords = await mapService.getAddressCoordinate(destination);

  // ✅ Get distance & time from Mapbox Directions API
  const distanceTime = await mapService.getDistanceTime(pickupCoords, destinationCoords);

  const baseFare = {
    auto: 30,
    car: 50,
    bike: 20,
  };

  const perKmRate = {
    auto: 10,
    car: 15,
    bike: 8,
  };

  const perMinuteRate = {
    auto: 2,
    car: 3,
    bike: 1.5,
  };

  // ✅ distance (in km), duration (in minutes)
  const fare = {
    auto: Math.round(
      baseFare.auto +
        distanceTime.distance * perKmRate.auto +
        distanceTime.duration * perMinuteRate.auto
    ),
    car: Math.round(
      baseFare.car +
        distanceTime.distance * perKmRate.car +
        distanceTime.duration * perMinuteRate.car
    ),
    bike: Math.round(
      baseFare.bike +
        distanceTime.distance * perKmRate.bike +
        distanceTime.duration * perMinuteRate.bike
    ),
  };

  return fare;
}

module.exports.getFare = getFare;

/**
 * Generate numeric OTP
 */
function getOtp(num) {
  return crypto
    .randomInt(Math.pow(10, num - 1), Math.pow(10, num))
    .toString();
}

/**
 * Create a new ride
 */
module.exports.createRide = async ({ user, pickup, destination, vehicleType }) => {
  if (!user || !pickup || !destination || !vehicleType) {
    throw new Error('All fields are required');
  }

  // ✅ Now fare calculation uses Mapbox coordinates internally
  const fare = await getFare(pickup, destination);

  const ride = await rideModel.create({
    user,
    pickup,
    destination,
    otp: getOtp(6),
    fare: fare[vehicleType],
  });

  return ride;
};

/**
 * Confirm a ride by captain
 */
module.exports.confirmRide = async ({ rideId, captain }) => {
  if (!rideId) throw new Error('Ride ID is required');

  await rideModel.findByIdAndUpdate(rideId, {
    status: 'accepted',
    captain: captain._id,
  });

  const ride = await rideModel
    .findById(rideId)
    .populate('user')
    .populate('captain')
    .select('+otp');

  if (!ride) throw new Error('Ride not found');

  return ride;
};

/**
 * Start a ride after OTP verification
 */
module.exports.startRide = async ({ rideId, otp, captain }) => {
  if (!rideId || !otp) throw new Error('Ride ID and OTP are required');

  const ride = await rideModel
    .findById(rideId)
    .populate('user')
    .populate('captain')
    .select('+otp');

  if (!ride) throw new Error('Ride not found');
  if (ride.status !== 'accepted') throw new Error('Ride not accepted');
  if (ride.otp !== otp) throw new Error('Invalid OTP');

  await rideModel.findByIdAndUpdate(rideId, { status: 'ongoing' });

  return ride;
};

/**
 * End an ongoing ride
 */
module.exports.endRide = async ({ rideId, captain }) => {
  if (!rideId) throw new Error('Ride ID is required');

  const ride = await rideModel
    .findOne({ _id: rideId, captain: captain._id })
    .populate('user')
    .populate('captain')
    .select('+otp');

  if (!ride) throw new Error('Ride not found');
  if (ride.status !== 'ongoing') throw new Error('Ride not ongoing');

  await rideModel.findByIdAndUpdate(rideId, { status: 'completed' });

  return ride;
};
