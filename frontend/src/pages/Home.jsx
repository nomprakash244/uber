import React,{useRef, useState} from 'react'
import {useGSAP} from '@gsap/react'
import gsap from 'gsap'
import 'remixicon/fonts/remixicon.css'
import LocationSearchPanel from '../components/LocationSearchPanel'

const Home = () => {

  const [pickup,setPickup]=useState('')
  const [destination,setDestination]=useState('')
  const [panelOpen,setPanelOpen]=useState(false)
const panelRef=useRef(null)
const panelCloseRef=useRef(null)

  const submitHandler=(e)=>
  {
    e.preventDefault()
  }


  useGSAP(function(){
    if(panelOpen){
      gsap.to(panelRef.current,{
      height:'70%',
      padding:24
    })
    gsap.to(panelCloseRef.current,{
      opacity:1
    })
    }
    else{
      gsap.to(panelRef.current,{
      height:'0%',
      padding:24
     
    })
     gsap.to(panelCloseRef.current,{
      opacity:0
    })
    }
  },[panelOpen])
  return (
    <div className='h-screen relative'>
      <img className="w-16 left-5 top-5 absolute"    src="https://media.istockphoto.com/id/1975996008/vector/green-scooter-motor-bike-delivery-courier-boy-with-box-vector-illustration-isolated-on-white.jpg?s=612x612&w=0&k=20&c=xAtSYWhMHnd_cyD2S7qDXb25d3K1K85XuJNu_EPyo3k="></img>
      <div className='h-screen w-screen'>
        <img className='h-full w-full object-cover ' src='https://miro.medium.com/v2/resize:fit:1400/0*gwMx05pqII5hbfmX.gif'></img>
      </div>
      <div className='flex   flex-col justify-end absolute h-screen  top-0 w-full '>
        <div className= ' bg-white  h-[30%] p-6 relative'>
          <h5 ref={panelCloseRef}
          onClick={()=>{
            setPanelOpen(false)
          }}
          className='absolute  opacity-0 top-6 right-6 text-xl '>
            <i className="ri-arrow-down-wide-line"></i>
          </h5>
          <h4 className='text-2xl  font-semibold'>Find a trip
        </h4>
        <form onSubmit={(e)=>{
          submitHandler(e)
        }}>
          <div className="line absolute h-16 w-1 top-[50%] left-10 bg-gray-900 rounded-full  "></div>
          <input  
          onClick={()=>{setPanelOpen(true)}}
          value={pickup}
          onChange={(e)=>{
            setPickup(e.target.value)
          }}
          className='bg-[#eee]   px-12 py-2 text-lg rounded-lg w-full mt-5'type='text' placeholder='Enter pickup location'></input>
          <input  

                 onClick={()=>{setPanelOpen(true)}}
          value={destination}
          onChange={(e)=>{
            setDestination(e.target.value)
          }}
          className='bg-[#eee]   px-12 py-2 text-lg rounded-lg w-full mt-3' type='text' placeholder='Enter your destination'></input>
          
        </form>
        </div>
        <div ref={panelRef} className=' bg-white  h-0'>
          <LocationSearchPanel/>

        </div>
      </div>
    
    
    </div>
  )
}

export default Home
