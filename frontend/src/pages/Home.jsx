import React from 'react'
import { Link } from 'react-router-dom'

const Home = () => {
  return (
    <div>
        <div className='bg-cover bg-center  bg-[url(https://plus.unsplash.com/premium_photo-1731842686156-74895c29a87b?q=80&w=686&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D)]  h-screen pt-8  flex justify-between flex-col w-full '>
            <img className="w-16 ml-8 "    src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ_wIQcbGvgMsBZhnYe_ItlOubQ2vC1BEc5HQ&s"></img>
            <div className='bg-white pb-7 py-5 px-4'>
                <h2 className='text-2xl font-bold'>Get Started with Speedo</h2>
                <Link to='/login' className=' flex items-center justify-center w-full bg-black text-white py-3 rounded mt-2'>Continue</Link>
            </div>

        </div>
      
    </div>
  )
}

export default Home
