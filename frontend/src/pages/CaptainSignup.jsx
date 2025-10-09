import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { CaptainDataContext } from '../context/Captaincontext';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';


const CaptainSignup = () => {

  const navigate=useNavigate()

   const [email, setEmail] = useState('');
    const [firstname, setFirstname] = useState('');
    const [lastname, setLastname] = useState('');
    const [password, setPassword] = useState('');
    
    const [vehicleColor,setVehicleColor]=useState('');
    const [vehiclePlate,setVehiclePlate]=useState('');
    const[vehicleCapacity,setVehicleCapacity]=useState('');
    const[vehicleType,setVehicleType]=useState('');
   
    const {captain,setCaptain}=React.useContext(CaptainDataContext)



      const submitHandler = async (e) => {
    e.preventDefault();
    const captainData={
      email: email,
      fullname: { firstname:firstname, lastname:lastname },
      password: password,
      vehicle: { color: vehicleColor, plate: vehiclePlate, capacity: parseInt(vehicleCapacity,10), vehicleType: vehicleType }
    }

    const response=await axios.post(`${import.meta.env.VITE_BASE_URL}/captains/register`,captainData);
    if(response.status===201){
      const data=response.data
      setCaptain(data.captain)
      localStorage.setItem('token',data.token)
      navigate('/captain-home')}
    

    setEmail('');
    setFirstname('');
    setLastname('');
    setPassword(''); 
    setVehicleColor('');
    setVehiclePlate('');
    setVehicleCapacity('');
    setVehicleType('');
    
  }
  return (
    <div>
      <div className='p-7 h-screen flex flex-col justify-between'>
            <div>
              <img className="w-16 mb-10 "    src="https://media.istockphoto.com/id/1975996008/vector/green-scooter-motor-bike-delivery-courier-boy-with-box-vector-illustration-isolated-on-white.jpg?s=612x612&w=0&k=20&c=xAtSYWhMHnd_cyD2S7qDXb25d3K1K85XuJNu_EPyo3k="></img>
              <form onSubmit={submitHandler}>
                <h3 className='text-lg font-medium mb-2'>What's our Captain name</h3>
                <div className='flex gap-4 mb-5'>
                  <input
                    required
                    className='bg-[#eeeeee] w-1/2 rounded px-3 py-2 border text-base placeholder:text-sm'
                    type='text'
                    placeholder='First Name'
                    aria-label='First Name'
                    value={firstname}
                    onChange={(e) => setFirstname(e.target.value)}
                  />
                  <input
                    required
                    className='bg-[#eeeeee] w-1/2 rounded px-3 py-2 border text-base placeholder:text-sm'
                    type='text'
                    placeholder='Last Name'
                    aria-label='Last Name'
                    value={lastname}
                    onChange={(e) => setLastname(e.target.value)}
                  />
                </div>
                <h3 className='text-lg font-medium mb-2'>Email</h3>
                <input
                  required
                  className='bg-[#eeeeee] mb-5 rounded px-3 py-2 border w-full text-lg placeholder:text-sm'
                  type='email'
                  placeholder='email@example.com'
                  aria-label='Email'
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <h3 className='text-xl mb-2'>Enter Password</h3>
                <input
                  required
                  className='bg-[#eeeeee] mb-5 rounded px-3 py-2 border w-full text-lg placeholder:text-sm'
                  type='password'
                  placeholder='Enter Password'
                  aria-label='Password'
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <h3 className='text-xl mb-2'>Vehicle Information</h3>
                <div className='flex gap-4 mb-5'>
                <input
                  required
                  className='bg-[#eeeeee] mb-5 rounded px-3 py-2 border w-full text-lg placeholder:text-sm'
                  type='text'
                  placeholder='Vehicle Color'
                  aria-label='vehicle color'
                  value={vehicleColor}
                  onChange={(e) => setVehicleColor(e.target.value)}
                />
                 
                <input
                  required
                  className='bg-[#eeeeee] mb-5 rounded px-3 py-2 border w-full text-lg placeholder:text-sm'
                  type='text'
                  placeholder='Vehicle Plate'
                  aria-label='vehicle Plate'
                  value={vehiclePlate}
                  onChange={(e) => setVehiclePlate(e.target.value)}
                />
                </div>
                <div className='flex gap-4 mb-5'>
                <input
                  required
                  className='bg-[#eeeeee] mb-5 rounded px-3 py-2 border w-full text-lg placeholder:text-sm'
                  type='number'
                  placeholder='Vehicle Capacity'
                  aria-label='vehicle Capacity'
                  value={vehicleCapacity}
                  onChange={(e) => setVehicleCapacity(e.target.value)}
                />
                 
                
                <select
              required
              className='bg-[#eeeeee] mb-5 rounded px-3 py-2 border w-full text-lg placeholder:text-sm'
              value={vehicleType}
              onChange={(e) => {
                setVehicleType(e.target.value)
              }}
            >
              <option value="" disabled>Select Vehicle Type</option>
              <option value="car">car</option>
              <option value="auto">auto</option>
              <option value="bike">bike</option>
            </select>
                </div>
                <button
                  type='submit'
                  className='bg-[#111] text-white font-semibold mb-5 rounded px-4 py-2 w-full text-lg placeholder:text-base'
                >
                  Sign Up
                </button>
                <p className='text-center'>
                  Already have an account?{' '}
                  <Link to='/captain-login' className='text-blue-600'>
                    Create Account
                  </Link>
                </p>
              </form>
            </div>
            <div>
              <p className='text-sm text-center'>By signing up, you agree to our Terms of Service and Privacy Policy.</p>
            </div>
          </div>



    </div>
  )
}

export default CaptainSignup
