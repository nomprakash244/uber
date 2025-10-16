import React, { useRef, useState, useEffect, useContext } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import axios from 'axios'
import 'remixicon/fonts/remixicon.css'
import { useNavigate } from 'react-router-dom'

import LocationSearchPanel from '../components/LocationSearchPanel'
import VehiclePanel from '../components/VehiclePanel'
import ConfirmRide from '../components/ConfirmRide'
import LookingForDriver from '../components/LookingForDriver'
import WaitingForDriver from '../components/WaitingForDriver'
import LiveTracking from '../components/LiveTracking'

import { SocketContext } from '../context/SocketContext'
import { UserDataContext } from '../context/UserContext'

const Home = () => {
  const [pickup, setPickup] = useState('')
  const [destination, setDestination] = useState('')
  const [activeField, setActiveField] = useState(null)

  const [panelOpen, setPanelOpen] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [vehiclePanel, setVehiclePanel] = useState(false)
  const [confirmRidePanel, setConfirmRidePanel] = useState(false)
  const [vehicleFound, setVehicleFound] = useState(false)
  const [waitingForDriver, setWaitingForDriver] = useState(false)
  

  const [pickupSuggestions, setPickupSuggestions] = useState([])
  const [destinationSuggestions, setDestinationSuggestions] = useState([])
  const [fare, setFare] = useState({})
  const [vehicleType, setVehicleType] = useState(null)
  const [ride, setRide] = useState(null)

  const panelRef = useRef(null)
  const panelCloseRef = useRef(null)
  const menuRef = useRef(null)
  const vehiclePanelRef = useRef(null)
  const confirmRidePanelRef = useRef(null)
  const vehicleFoundRef = useRef(null)
  const waitingForDriverRef = useRef(null)

  const { socket } = useContext(SocketContext)
  const { user } = useContext(UserDataContext)
  const navigate = useNavigate()

  // === SOCKET CONNECTIONS ===
  useEffect(() => {
    if (user?._id) socket.emit('join', { userType: 'user', userId: user._id })
  }, [user])

  useEffect(() => {
    socket.on('ride-confirmed', ride => {
      setVehicleFound(false)
      setWaitingForDriver(true)
      setRide(ride)
    })
    socket.on('ride-started', ride => {
      setWaitingForDriver(false)
      navigate('/riding', { state: { ride } })
    })
    return () => {
      socket.off('ride-confirmed')
      socket.off('ride-started')
    }
  }, [socket])

  // === HANDLE INPUT CHANGES ===
  const handleInputChange = async (value, type) => {
    if (!value.trim()) return
    try {
      const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/maps/get-suggestions`, {
        params: { input: value },
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      })
      if (type === 'pickup') setPickupSuggestions(response.data)
      else setDestinationSuggestions(response.data)
    } catch (err) {
      console.error(err)
    }
  }

  // === FIND TRIP ===
  const findTrip = async () => {
    setVehiclePanel(true)
    setPanelOpen(false)
    try {
      const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/rides/get-fare`, {
        params: { pickup, destination },
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      })
      setFare(response.data)
    } catch (err) {
      console.error(err)
    }
  }

  // === CREATE RIDE ===
  const createRide = async () => {
    try {
      await axios.post(
        `${import.meta.env.VITE_BASE_URL}/rides/create`,
        { pickup, destination, vehicleType },
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      )
    } catch (err) {
      console.error(err)
    }
  }

  // === GSAP ANIMATIONS ===
  useGSAP(() => {
    gsap.to(panelRef.current, {
      height: panelOpen ? '65%' : '0%',
      padding: panelOpen ? 20 : 0,
      duration: 0.5,
      ease: 'power3.inOut',
    })
    gsap.to(panelCloseRef.current, {
      opacity: panelOpen ? 1 : 0,
      rotate: panelOpen ? 180 : 0,
      duration: 0.4,
    })
  }, [panelOpen])

  useGSAP(() => {
    gsap.to(menuRef.current, {
      opacity: menuOpen ? 1 : 0,
      y: menuOpen ? 0 : -10,
      display: menuOpen ? 'block' : 'none',
      duration: 0.3,
      ease: 'power2.out',
    })
  }, [menuOpen])

  const animatePanel = (ref, open) =>
    gsap.to(ref.current, { transform: open ? 'translateY(0)' : 'translateY(100%)', duration: 0.4, ease: 'power3.inOut' })

  useGSAP(() => animatePanel(vehiclePanelRef, vehiclePanel), [vehiclePanel])
  useGSAP(() => animatePanel(confirmRidePanelRef, confirmRidePanel), [confirmRidePanel])
  useGSAP(() => animatePanel(vehicleFoundRef, vehicleFound), [vehicleFound])
  useGSAP(() => animatePanel(waitingForDriverRef, waitingForDriver), [waitingForDriver])

  const submitHandler = e => e.preventDefault()

  return (
    <div className='h-screen relative overflow-hidden'>
      {/* ==== Top Menu ==== */}
      <div className='absolute top-4 left-4 z-30'>
        <i
          onClick={() => setMenuOpen(!menuOpen)}
          className='ri-menu-line text-3xl text-white bg-black/40 p-2 rounded-lg cursor-pointer hover:bg-black/60 transition'
        ></i>

        <div
          ref={menuRef}
          className='absolute left-0 mt-3 bg-white shadow-xl rounded-lg py-3 px-5 w-52 opacity-0 z-40'
        >
          <ul className='space-y-3 text-gray-800 text-sm font-medium'>
            <li onClick={() => navigate('/settings')} className='cursor-pointer hover:text-black'>🔧 Settings</li>
            <li onClick={() => navigate('/refer')} className='cursor-pointer hover:text-black'>🎁 Referrals</li>
            <li onClick={() => navigate('/payment')} className='cursor-pointer hover:text-black'>💳 Payment</li>
            <li onClick={() => navigate('/profile')} className='cursor-pointer hover:text-black'>👤 My Profile</li>
            <li onClick={() => navigate('/chatbot')} className='cursor-pointer hover:text-black'>🤖 Assistant</li>
            <li onClick={() => navigate('/help')} className='cursor-pointer hover:text-black'>❓ Help</li>
          </ul>
        </div>
      </div>

      {/* ==== Map Background ==== */}
      <div className='h-screen w-screen'>
        <LiveTracking />
      </div>

      {/* ==== Bottom Form ==== */}
      <div className='flex flex-col justify-end absolute h-screen top-0 w-full'>
        <div className='bg-white h-[26%] px-5 pt-5 pb-6 relative shadow-lg'>
          {/* Down Arrow */}
          <h5
            ref={panelCloseRef}
            onClick={() => setPanelOpen(false)}
            className='absolute top-1 right-1 text-2xl cursor-pointer hover:opacity-70 transition'
          >
            <i className='ri-arrow-down-wide-line'></i>
          </h5>

          {/* Ride Search Inputs */}
          <form onSubmit={submitHandler} className='flex flex-col gap-3'>
            <input
              onClick={() => {
                setPanelOpen(true)
                setActiveField('pickup')
              }}
              value={pickup}
              onChange={e => {
                setPickup(e.target.value)
                handleInputChange(e.target.value, 'pickup')
              }}
              className='bg-[#f5f5f5] px-3 py-2.5 text-base rounded-lg w-full focus:outline-none'
              type='text'
              placeholder='Add a pick-up location'
            />

            <input
              onClick={() => {
                setPanelOpen(true)
                setActiveField('destination')
              }}
              value={destination}
              onChange={e => {
                setDestination(e.target.value)
                handleInputChange(e.target.value, 'destination')
              }}
              className='bg-[#f5f5f5] px-3 py-2.5 text-base rounded-lg w-full focus:outline-none'
              type='text'
              placeholder='Enter your destination'
            />

            <button
              type='button'
              onClick={findTrip}
              disabled={!pickup || !destination}
              className={`${
                pickup && destination
                  ? 'bg-black text-white'
                  : 'bg-gray-400 text-gray-200 cursor-not-allowed'
              } px-3 py-2.5 rounded-lg w-full text-base mt-1 transition`}
            >
              Find Trip
            </button>
          </form>
        </div>

        {/* ==== Location Search Panel ==== */}
        <div ref={panelRef} className='bg-white h-0 overflow-hidden'>
          <LocationSearchPanel
            suggestions={activeField === 'pickup' ? pickupSuggestions : destinationSuggestions}
            setPanelOpen={setPanelOpen}
            setVehiclePanel={setVehiclePanel}
            setPickup={setPickup}
            setDestination={setDestination}
            activeField={activeField}
          />
        </div>
      </div>

      {/* ==== Slide-up Panels ==== */}
      <div ref={vehiclePanelRef} className='fixed z-10 translate-y-full w-full bg-white bottom-0 px-3 py-10 pt-12'>
        <VehiclePanel
          selectVehicle={setVehicleType}
          fare={fare}
          setConfirmRidePanel={setConfirmRidePanel}
          setVehiclePanel={setVehiclePanel}
        />
      </div>

      <div ref={confirmRidePanelRef} className='fixed z-10 translate-y-full w-full bg-white bottom-0 px-3 py-6 pt-12'>
        <ConfirmRide
          createRide={createRide}
          pickup={pickup}
          destination={destination}
          fare={fare}
          vehicleType={vehicleType}
          setConfirmRidePanel={setConfirmRidePanel}
          setVehicleFound={setVehicleFound}
        />
      </div>

      <div ref={vehicleFoundRef} className='fixed z-10 translate-y-full w-full bg-white bottom-0 px-3 py-6 pt-12'>
        <LookingForDriver
          createRide={createRide}
          pickup={pickup}
          destination={destination}
          fare={fare}
          vehicleType={vehicleType}
          setVehicleFound={setVehicleFound}
        />
      </div>

      <div ref={waitingForDriverRef} className='fixed z-10 w-full bottom-0 bg-white px-3 py-6 pt-12'>
        <WaitingForDriver
          ride={ride}
          setVehicleFound={setVehicleFound}
          setWaitingForDriver={setWaitingForDriver}
          waitingForDriver={waitingForDriver}
        />
      </div>
    </div>
  )
}

export default Home
