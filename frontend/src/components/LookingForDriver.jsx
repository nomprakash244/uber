import React from 'react'

const LookingForDriver = (props) => {
  return (
    <div>
      
      <h5 onClick={() => props.setvehicleFound(false)} className='p-1 text-center w-[90%] absolute top-0 '><i className=' text-3xl  text-gray-200  ri-arrow-down-wide-line'></i></h5>
        <h3 className='text-2xl font-semibold mb-5'>Looking for  your Ride</h3>
        <div className='flex justify-between flex-col items-center'>
          <img className='h-20' src='https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT0SgYmhbSTYNgEbSOnCH1xmIHny53WEtbVGw&s'></img>
        </div>

        <div className='w-full mt-5'>
          <div className='flex items-center gap-3 p-3 border-b-2 '>
          <i className=' text-lg ri-map-pin-user-fill'></i>
        

        <div >
          <h3 className='text-lg font-medium '>562/11
          </h3>
          <p className='text-sm text-gray-600'>Konisi Petrol pump</p>

        </div>
        </div>
        <div className='flex items-center gap-3  p-3 border-b-2'>
          <i className=' text-lg ri-map-pin-2-fill'></i>
        

        <div >
          <h3 className='text-lg font-medium '>562/11
          </h3>
          <p className='text-sm text-gray-600'>Konisi Petrol pump</p>

        </div>
        </div>
        <div className='flex items-center gap-3 p-3 border-b-2'>
          <i className=' ri-currency-line'></i>
        

        <div >
          <h3 className='text-lg font-medium '>₹193.22
          </h3>
          <p className='text-sm text-gray-600'>Cash</p>

        </div>
        </div>
        </div>
        <div>
          <button onClick={() => props.setconfirmRidePanel(false)} className='w-full bg-green-600 mt-5 text-white font-semibold p-2 rounded-lg  '>Confirm</button>


        </div>

    </div>
  )
}

export default LookingForDriver
