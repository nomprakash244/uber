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
import ReferPage from './pages/ReferPage'
import Help from "./pages/Help";
import Faqs from "./pages/Faqs";
import FaqDetail from "./pages/FaqDetail";
import UserProfile from './pages/UserProfile';
import UserSettings from './pages/UserSettings';
import ChatWindow from './pages/ChatWindow'


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
       <Route path='/refer' element={<ReferPage />} />
        <Route path='/chatbot' element={<ChatWindow />} />
       <Route path="/help" element={<Help />} />
        <Route path="/help/:category" element={<Faqs />} />
        <Route path="/help/:category/:id" element={<FaqDetail />} />
          <Route path="/profile" element={
  <UserProtectedWrapper>
    <UserProfile />
  </UserProtectedWrapper>
}/>

<Route path="/settings" element={
  <UserProtectedWrapper>
    <UserSettings />
  </UserProtectedWrapper>
}/>


      </Routes>
    </div>
  )
}

export default App
