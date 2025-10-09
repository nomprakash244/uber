import React, { useState,useContext } from 'react';
import { Link,useNavigate } from 'react-router-dom';
import axios from 'axios';
import {UserDataContext}  from '../context/UserContext';  

const UserSignup = () => {
  const [email, setEmail] = useState('');
  const [firstname, setFirstname] = useState('');
  const [lastname, setLastname] = useState('');
  const [password, setPassword] = useState('');
  
  const navigate=useNavigate()

  const {user,setUser}=useContext(UserDataContext)

  const submitHandler = async (e) => {
    e.preventDefault();
    const newUser={
       email: email,
      fullname: {  firstname, lastname },
      password: password,
    }
    const response=await axios.post(`${import.meta.env.VITE_BASE_URL}/users/register`,newUser);

    if(response.status===201){
      const data=response.data
      setUser(data.user)
      
      navigate('/Home')}


    console.log(userData);
    setEmail('');
    setFirstname('');
    setLastname('');
    setPassword('');  
  };

  return (
    <div className='p-7 h-screen flex flex-col justify-between'>
      <div>
        <img
          className="w-16 mb-10"
          src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQGtDRk78nK-4kd9htj9nCA4zWEPppOHQ5mVQ&s"
          alt="Logo"
        />
        <form onSubmit={submitHandler}>
          <h3 className='text-lg font-medium mb-2'>What's your name</h3>
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
          <button
            type='submit'
            className='bg-[#111] text-white font-semibold mb-5 rounded px-4 py-2 w-full text-lg placeholder:text-base'
          >
            Create Account
          </button>
          <p className='text-center'>
            Already have an account?{' '}
            <Link to='/login' className='text-blue-600'>
              Login here
            </Link>
          </p>
        </form>
      </div>
      <div>
        <p className='text-sm text-center'>By signing up, you agree to our Terms of Service and Privacy Policy.</p>
      </div>
    </div>
  );
};

export default UserSignup;
