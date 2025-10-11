import React from 'react'

const LocationSearchPanel = (props) => {


  

  const locations=['LokanathNagar,Konisi,Odisha','Gopalpur sea beach','Bhairabi Temple,golanthara']
  return (
    <div >
      {

        locations.map(function(elem,idx){
          return <div  key={idx} onClick={()=>{
            props.setVehiclePanel(true)
            props.setPanelOpen(false)
          }} className='flex border-2 p-3 gap-2  border-gray-100 active:border-black rounded-xl items-center my-2 justify-start' >
            <h2 className='bg-[#eee] p-2  h-8 flex items-center justify-center w-12 p-2 rounded-full'><i class="ri-map-pin-fill"></i></h2>
                <h4 className='font-medium'>

                  {elem}
                </h4>
        </div>
        })
      }

        
    </div>
  )
}

export default LocationSearchPanel
