import React, { useRef, useState, useEffect, useContext } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import axios from 'axios'
import 'remixicon/fonts/remixicon.css'
import LocationSearchPanel from '../components/LocationSearchPanel'
import VehiclePanel from '../components/VehiclePanel'
import ConfirmRide from '../components/ConfirmRide'
import LookingForDriver from '../components/LookingForDriver'
import WaitingForDriver from '../components/WaitingForDriver'
import { SocketContext } from '../context/SocketContext'
import { UserDataContext } from '../context/UserContext'
import { useNavigate } from 'react-router-dom'
import LiveTracking from '../components/LiveTracking'


const Home = () => {
  const [pickup, setPickup] = useState('')
  const [destination, setDestination] = useState('')
  const [panelOpen, setPanelOpen] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [vehiclePanel, setVehiclePanel] = useState(false)
  const [confirmRidePanel, setConfirmRidePanel] = useState(false)
  const [vehicleFound, setVehicleFound] = useState(false)
  const [waitingForDriver, setWaitingForDriver] = useState(false)

  const [pickupSuggestions, setPickupSuggestions] = useState([])
  const [destinationSuggestions, setDestinationSuggestions] = useState([])
  const [activeField, setActiveField] = useState(null)
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

  useEffect(() => {
    if (user?._id) {
      socket.emit("join", { userType: "user", userId: user._id })
    }
  }, [user])

  useEffect(() => {
    socket.on('ride-confirmed', (ride) => {
      setVehicleFound(false)
      setWaitingForDriver(true)
      setRide(ride)
    })
    socket.on('ride-started', (ride) => {
      setWaitingForDriver(false)
      navigate('/riding', { state: { ride } })
    })
    return () => {
      socket.off('ride-confirmed')
      socket.off('ride-started')
    }
  }, [socket])

  const handlePickupChange = async (e) => {
    setPickup(e.target.value)
    try {
      const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/maps/get-suggestions`, {
        params: { input: e.target.value },
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      })
      setPickupSuggestions(response.data)
    } catch (err) {
      console.error(err)
    }
  }

  const handleDestinationChange = async (e) => {
    setDestination(e.target.value)
    try {
      const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/maps/get-suggestions`, {
        params: { input: e.target.value },
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      })
      setDestinationSuggestions(response.data)
    } catch (err) {
      console.error(err)
    }
  }

  const submitHandler = (e) => {
    e.preventDefault()
  }

  useGSAP(() => {
    gsap.to(panelRef.current, {
      height: panelOpen ? '70%' : '0%',
      padding: panelOpen ? 24 : 0,
      duration: 0.5,
      ease: panelOpen ? 'power3.out' : 'power3.inOut',
    })
    gsap.to(panelCloseRef.current, {
      opacity: panelOpen ? 1 : 0,
      duration: panelOpen ? 0.3 : 0.2,
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

  useGSAP(() => {
    gsap.to(vehiclePanelRef.current, {
      transform: vehiclePanel ? 'translateY(0)' : 'translateY(100%)',
    })
  }, [vehiclePanel])
  useGSAP(() => {
    gsap.to(confirmRidePanelRef.current, {
      transform: confirmRidePanel ? 'translateY(0)' : 'translateY(100%)',
    })
  }, [confirmRidePanel])
  useGSAP(() => {
    gsap.to(vehicleFoundRef.current, {
      transform: vehicleFound ? 'translateY(0)' : 'translateY(100%)',
    })
  }, [vehicleFound])
  useGSAP(() => {
    gsap.to(waitingForDriverRef.current, {
      transform: waitingForDriver ? 'translateY(0)' : 'translateY(100%)',
    })
  }, [waitingForDriver])

  async function findTrip() {
    setVehiclePanel(true)
    setPanelOpen(false)
    try {
      const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/rides/get-fare`, {
        params: { pickup, destination },
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      })
      setFare(response.data)
    } catch (err) {
      console.error(err)
    }
  }

  async function createRide() {
    try {
      await axios.post(`${import.meta.env.VITE_BASE_URL}/rides/create`, {
        pickup,
        destination,
        vehicleType,
      }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      })
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <div className='h-screen relative overflow-hidden'>
      {/* Menu Bar Top-Left */}
      <div className='absolute top-6 left-6 z-30'>
        <i
          onClick={() => setMenuOpen(!menuOpen)}
          className='ri-menu-line text-3xl text-white bg-black/40 p-2 rounded-lg cursor-pointer'
        ></i>
        <div
          ref={menuRef}
          className='absolute left-0 mt-3 bg-white shadow-xl rounded-lg py-3 px-5 w-52 opacity-0 z-40'
        >
          <ul className='space-y-3 text-gray-800 text-sm font-medium'>
            <li onClick={() => navigate('/settings')} className="cursor-pointer hover:text-black">🔧 Settings</li>
            <li onClick={() => navigate('/refer')} className='cursor-pointer hover:text-black'>🎁 Referrals</li>
            <li  onClick={() => navigate('/payment')} className='cursor-pointer hover:text-black'>💳 Payment</li>
            <li onClick={() => navigate('/profile')} className="cursor-pointer hover:text-black">👤 My Profile</li>
            <li onClick={() => navigate('/chatbot')} className="cursor-pointer hover:text-black">🤖 Assistant</li>
            <li onClick={() => navigate('/help')} className='cursor-pointer hover:text-black'>❓ Help</li>
          </ul>
        </div>
      </div>

      {/* Background */}
      <div className='h-screen w-screen'>
        <LiveTracking />
      </div>

      {/* Bottom form + panel */}
      <div className='flex flex-col justify-end absolute h-screen top-0 w-full'>
        <div className='bg-white h-[30%] p-6 relative'>
          <h5
            ref={panelCloseRef}
            onClick={() => setPanelOpen(false)}
            className='absolute opacity-0 top-6 right-6 text-xl cursor-pointer'
          >
            <i className='ri-arrow-down-wide-line'></i>
          </h5>

          

          <form onSubmit={submitHandler} className='relative'>
            <div className="line absolute h-16 w-1 top-[50%] left-10 bg-gray-900 rounded-full"></div>

            <input
              onClick={() => {
                setPanelOpen(true)
                setActiveField('pickup')
              }}
              value={pickup}
              onChange={handlePickupChange}
              className='bg-[#eee] px-12 py-2 text-lg rounded-lg w-full mt-5'
              type='text'
              placeholder='Add a pick-up location'
            />

            <input
              onClick={() => {
                setPanelOpen(true)
                setActiveField('destination')
              }}
              value={destination}
              onChange={handleDestinationChange}
              className='bg-[#eee] px-12 py-2 text-lg rounded-lg w-full mt-3'
              type='text'
              placeholder='Enter your destination'
            />

            <button
              onClick={findTrip}
              className='bg-black text-white px-4 py-2 rounded-lg mt-3 w-full'
            >
              Find Trip
            </button>
          </form>
        </div>

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
