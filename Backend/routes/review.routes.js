const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const reviewController = require('../controllers/review.controller');

// Submit review route (no auth required)
router.post(
  '/submit',
  [
    body('userName').isString().isLength({ min: 2 }).withMessage('Name is required'),
    body('userEmail').isEmail().withMessage('Valid email is required'),
    body('captainName').optional().isString(),
    body('rating').isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5'),
    body('review').isString().isLength({ min: 3 }).withMessage('Review must be at least 3 characters'),
    body('rideDetails').optional().isObject()
  ],
  reviewController.submitReview
);

module.exports = router;
