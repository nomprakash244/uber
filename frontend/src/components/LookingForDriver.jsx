import React from 'react';
import { useNavigate } from 'react-router-dom';

const LookingForDriver = (props) => {
  const navigate = useNavigate();

  // When captain is found
  const handleCaptainFound = () => {
    props.setVehicleFound(false);

    navigate('/review-rating', {
      state: {
        ride: {
          pickup: props.pickup,
          destination: props.destination,
          fare: props.fare[props.vehicleType],
          vehicleType: props.vehicleType,
          status: 'captain-found',
          captain: {
            name: 'Jacky Nayak',
            rating: 4.8,
            vehicleNumber: 'MH12AB1234',
          },
        },
        userType: 'user',
      },
    });
  };

  // When no captain found
  const handleCaptainNotFound = () => {
    props.setVehicleFound(false);
    navigate('/Home');
  };

  return (
    <div>
      {/* Close Button */}
      <h5
        className='p-1 text-center w-[93%] absolute top-0 cursor-pointer'
        onClick={() => props.setVehicleFound(false)}
      >
        <i className="text-3xl text-gray-200 ri-arrow-down-wide-line"></i>
      </h5>

      {/* Title */}
      <h3 className='text-2xl font-semibold mb-3 text-center'>
        Looking for a Driver
      </h3>

      {/* Loading Spinner */}
      <div className='flex justify-center mb-4'>
        <div className='relative'>
          <div className='w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin'></div>
          <div className='absolute inset-0 flex items-center justify-center'>
            <i className="ri-car-line text-blue-600 text-2xl"></i>
          </div>
        </div>
      </div>

      {/* Ride Details */}
      <div className='flex gap-2 justify-between flex-col items-center'>
        <img
          className='h-20 object-contain'
          src="https://swyft.pl/wp-content/uploads/2023/05/how-many-people-can-a-uberx-take.jpg"
          alt="Vehicle"
        />

        <div className='w-full mt-5'>
          {/* Pickup */}
          <div className='flex items-center gap-5 p-3 border-b-2'>
            <i className="ri-map-pin-user-fill text-green-600 text-xl"></i>
            <div>
              <h3 className='text-lg font-medium'>Pickup</h3>
              <p className='text-sm -mt-1 text-gray-600'>{props.pickup}</p>
            </div>
          </div>

          {/* Destination */}
          <div className='flex items-center gap-5 p-3 border-b-2'>
            <i className="text-xl ri-map-pin-2-fill text-red-600"></i>
            <div>
              <h3 className='text-lg font-medium'>Destination</h3>
              <p className='text-sm -mt-1 text-gray-600'>{props.destination}</p>
            </div>
          </div>

          {/* Fare */}
          <div className='flex items-center gap-5 p-3 border-b-2'>
            <i className="ri-currency-line text-blue-600 text-xl"></i>
            <div>
              <h3 className='text-lg font-medium'>₹{props.fare[props.vehicleType]}</h3>
              <p className='text-sm -mt-1 text-gray-600'>Cash</p>
            </div>
          </div>

          {/* Vehicle Type */}
          <div className='flex items-center gap-5 p-3'>
            <i className="ri-car-line text-purple-600 text-xl"></i>
            <div>
              <h3 className='text-lg font-medium capitalize'>{props.vehicleType}</h3>
              <p className='text-sm -mt-1 text-gray-600'>Vehicle Type</p>
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div className='w-full flex flex-col gap-3 mt-4'>
          <button
            onClick={handleCaptainFound}
            className='w-full bg-green-500 text-white font-semibold py-3 px-6 rounded-lg hover:bg-green-600 active:bg-green-700 transition-colors duration-200 flex items-center justify-center gap-2'
          >
            <i className="ri-user-star-line text-xl"></i>
            Captain Found
          </button>

          <button
            onClick={handleCaptainNotFound}
            className='w-full bg-red-500 text-white font-semibold py-3 px-6 rounded-lg hover:bg-red-600 active:bg-red-700 transition-colors duration-200 flex items-center justify-center gap-2'
          >
            <i className="ri-close-circle-line text-xl"></i>
            Captain Not Found
          </button>
        </div>
      </div>
    </div>
  );
};

export default LookingForDriver;
