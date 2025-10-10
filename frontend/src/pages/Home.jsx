import React, { useRef, useState } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import 'remixicon/fonts/remixicon.css'
import LocationSearchPanel from '../components/LocationSearchPanel'
import ReferPage from './ReferPage'
import { useNavigate } from 'react-router-dom'

const Home = () => {
  const [pickup, setPickup] = useState('')
  const [destination, setDestination] = useState('')
  const [panelOpen, setPanelOpen] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  const panelRef = useRef(null)
  const panelCloseRef = useRef(null)
  const menuRef = useRef(null)

  const navigate = useNavigate()


  const submitHandler = (e) => {
    e.preventDefault()
  }

  // Animate panel open/close
  useGSAP(() => {
    if (panelOpen) {
      gsap.to(panelRef.current, {
        height: '70%',
        padding: 24,
        duration: 0.5,
        ease: 'power3.out',
      })
      gsap.to(panelCloseRef.current, {
        opacity: 1,
        duration: 0.3,
      })
    } else {
      gsap.to(panelRef.current, {
        height: '0%',
        padding: 0,
        duration: 0.5,
        ease: 'power3.inOut',
      })
      gsap.to(panelCloseRef.current, {
        opacity: 0,
        duration: 0.2,
      })
    }
  }, [panelOpen])

  // Animate menu dropdown
  useGSAP(() => {
    gsap.to(menuRef.current, {
      opacity: menuOpen ? 1 : 0,
      y: menuOpen ? 0 : -10,
      display: menuOpen ? 'block' : 'none',
      duration: 0.3,
      ease: 'power2.out',
    })
  }, [menuOpen])

  return (
    <div className='h-screen relative'>

      {/* --- MENU BAR (TOP-LEFT) --- */}
      <div className='absolute top-6 left-6 z-30'>
        {/* Menu Icon */}
        <i
          onClick={() => setMenuOpen(!menuOpen)}
          className='ri-menu-line text-3xl text-white bg-black/40 p-2 rounded-lg cursor-pointer'
        ></i>

        {/* Dropdown Menu */}
        <div
          ref={menuRef}
          className='absolute left-0 mt-3 bg-white shadow-xl rounded-lg py-3 px-5 w-52 opacity-0 z-40'
        >
          <ul className='space-y-3 text-gray-800 text-sm font-medium'>
            <li className='cursor-pointer hover:text-black'>🔧 Settings</li>
            <li
  onClick={() => navigate('/refer')}
  className='cursor-pointer hover:text-black'
>
  🎁 Referrals
</li>

            <li className='cursor-pointer hover:text-black'>💳 Payment</li>
            <li className='cursor-pointer hover:text-black'>👤 My Profile</li>
            <li className='cursor-pointer hover:text-black'>🤖 Assistant</li>
            <li className='cursor-pointer hover:text-black ' onClick={() => navigate('/help')}>❓ Help</li>
          </ul>
        </div>
      </div>

      {/* --- BACKGROUND --- */}
      <div className='h-screen w-screen'>
        <img
          className='h-full w-full object-cover'
          src='https://miro.medium.com/v2/resize:fit:1400/0*gwMx05pqII5hbfmX.gif'
          alt='Background'
        />
      </div>

      {/* --- BOTTOM FORM + PANEL --- */}
      <div className='flex flex-col justify-end absolute h-screen top-0 w-full'>
        <div className='bg-white h-[30%] p-6 relative'>
          {/* Close Button */}
          <h5
            ref={panelCloseRef}
            onClick={() => setPanelOpen(false)}
            className='absolute opacity-0 top-6 right-6 text-xl cursor-pointer'
          >
            <i className='ri-arrow-down-wide-line'></i>
          </h5>

          <h4 className='text-2xl font-semibold mb-12 ml-12'></h4>

          {/* Form */}
          <form onSubmit={submitHandler}>
            <div className='line absolute h-16 w-1 top-[50%] left-10 bg-gray-900 rounded-full'></div>

            <input
              onClick={() => setPanelOpen(true)}
              value={pickup}
              onChange={(e) => setPickup(e.target.value)}
              className='bg-[#eee] px-12 py-2 text-lg rounded-lg w-full mt-5'
              type='text'
              placeholder='Enter pickup location'
            />

            <input
              onClick={() => setPanelOpen(true)}
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              className='bg-[#eee] px-12 py-2 text-lg rounded-lg w-full mt-3'
              type='text'
              placeholder='Enter your destination'
            />
          </form>
        </div>

        {/* Slide-up Panel */}
        <div ref={panelRef} className='bg-white h-0 overflow-hidden'>
          <LocationSearchPanel />
        </div>
      </div>
    </div>
  )
}

export default Home
