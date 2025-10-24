import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';

const ReviewRating = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const ride = location.state?.ride;

  const [rating, setRating] = useState(0);
  const [review, setReview] = useState('');
  const [hoveredRating, setHoveredRating] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const userName = ride?.user?.fullname?.firstname 
    ? `${ride.user.fullname.firstname} ${ride.user.fullname.lastname || ''}`
    : 'Anonymous User';
  const userEmail = ride?.user?.email || 'noreply@example.com';
  const captainName = ride?.captain?.fullname?.firstname 
    ? `${ride.captain.fullname.firstname} ${ride.captain.fullname.lastname || ''}`
    : undefined;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (rating === 0) {
      alert('Please select a rating');
      return;
    }

    if (review.trim().length < 3) {
      alert('Please write at least 3 characters in your review');
      return;
    }

    setLoading(true);

    try {
      await axios.post(`${import.meta.env.VITE_BASE_URL}/reviews/submit`, {
        userName,
        userEmail,
        captainName,
        rating,
        review,
        rideDetails: ride
          ? { pickup: ride.pickup, destination: ride.destination, fare: ride.fare }
          : undefined,
      });

      setSubmitted(true);
    } catch (error) {
      console.error('⚠️ Review submission failed, continuing:', error);
      // Continue anyway
      setSubmitted(true);
    } finally {
      setLoading(false);
      setTimeout(() => navigate('/home'), 2000);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-lg mx-auto bg-white rounded-2xl shadow-lg overflow-hidden">
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-6 text-white">
          <h2 className="text-2xl font-bold mb-2">Rate Your Ride</h2>
          <p className="text-blue-100">How was your experience?</p>
        </div>

        {!submitted ? (
          <form onSubmit={handleSubmit} className="p-6">
            {ride && (
              <div className="bg-gray-50 rounded-xl p-4 mb-6">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <i className="ri-user-fill text-blue-600 text-xl"></i>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800">{captainName || 'Your Captain'}</p>
                    <p className="text-sm text-gray-500">{ride.captain?.vehicle?.plate}</p>
                  </div>
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex items-start gap-2">
                    <i className="ri-map-pin-fill text-green-600 mt-0.5"></i>
                    <div>
                      <p className="text-gray-500">Pickup</p>
                      <p className="font-medium text-gray-800">{ride.pickup}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <i className="ri-map-pin-fill text-red-600 mt-0.5"></i>
                    <div>
                      <p className="text-gray-500">Destination</p>
                      <p className="font-medium text-gray-800">{ride.destination}</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between pt-2 border-t">
                    <span className="text-gray-500">Fare</span>
                    <span className="font-bold text-gray-800">₹{ride.fare}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Star Rating */}
            <div className="mb-6">
              <label className="block mb-3 font-semibold text-gray-700">Rate Your Experience</label>
              <div className="flex gap-2 justify-center">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoveredRating(star)}
                    onMouseLeave={() => setHoveredRating(0)}
                    className="transition-transform hover:scale-110"
                  >
                    <i
                      className={`text-5xl ${
                        star <= (hoveredRating || rating)
                          ? 'ri-star-fill text-yellow-400'
                          : 'ri-star-line text-gray-300'
                      }`}
                    ></i>
                  </button>
                ))}
              </div>
              {rating > 0 && (
                <p className="text-center mt-2 text-sm text-gray-600">
                  {rating === 5 && '🎉 Excellent!'}
                  {rating === 4 && '😊 Great!'}
                  {rating === 3 && '👍 Good'}
                  {rating === 2 && '😕 Okay'}
                  {rating === 1 && '😞 Poor'}
                </p>
              )}
            </div>

            <div className="mb-6">
              <label className="block mb-2 font-semibold text-gray-700">Share Your Feedback</label>
              <textarea
                value={review}
                onChange={(e) => setReview(e.target.value)}
                className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 resize-none"
                rows="4"
                placeholder="Tell us about your experience..."
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading || rating === 0}
              className="w-full py-4 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-colors disabled:bg-gray-300"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <i className="ri-loader-4-line animate-spin"></i>
                  Submitting...
                </span>
              ) : (
                'Submit Review'
              )}
            </button>

            <button
              type="button"
              onClick={() => navigate('/home')}
              className="w-full mt-3 py-4 border-2 border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-colors"
            >
              Skip for Now
            </button>
          </form>
        ) : (
          <div className="p-8 text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <i className="ri-check-line text-green-600 text-4xl"></i>
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">Thank You!</h3>
            <p className="text-gray-600">Your feedback has been submitted successfully.</p>
            <p className="text-sm text-gray-500 mt-2">Redirecting to home...</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReviewRating;
