import React,{ useContext } from 'react'
import { Routes, Route } from 'react-router-dom'
import Start from './pages/Start'
import UserLogin from './pages/UserLogin'
import UserSignup from './pages/UserSignup'
import Captainlogin from './pages/Captainlogin'
import CaptainSignup from './pages/CaptainSignup'
import Home from './pages/Home'
import UserProtectedWrapper from './pages/UserProtectedWrapper'
import UserLogout from './pages/UserLogout'
import CaptainHome from './pages/CaptainHome'
import CaptainProtectWrapper from './pages/CaptainProtectWrapper'

import CaptainLogout from './pages/CaptainLogout'

const App = () => {

 
  return (
    <div >
    <Routes>
      <Route path="/" element={<Start />} />
      <Route path="/login" element={<UserLogin />} />

      <Route path="/signup" element={<UserSignup />} />

      

      <Route path="/captain-login" element={<Captainlogin />} />
      <Route path="/captain-signup" element={<CaptainSignup />} />
      <Route path="/Home" element={
        <UserProtectedWrapper>
          <Home />
        </UserProtectedWrapper>
      } />
      <Route path='/users/logout' element={
        <UserProtectedWrapper>
          <UserLogout />
        </UserProtectedWrapper>
      } />
       <Route path="/captain-home" element={
        <CaptainProtectWrapper>
          <CaptainHome />
        </CaptainProtectWrapper>
      } />
      <Route path='/captains/logout' element={
          <CaptainProtectWrapper>
            <CaptainLogout />
          </CaptainProtectWrapper>
        } />
      


      </Routes>
    </div>
  )
}

export default App
