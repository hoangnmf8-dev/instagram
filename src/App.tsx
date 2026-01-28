import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Login from './pages/Login/Login'
import Register from './pages/Login/Register'
import VerifyEmail from './pages/Login/VerifyEmail'
import VerifyEmailSuccess from './pages/Login/VerifyEmailSuccess'
import ForgotPassword from './pages/Login/ForgotPassword'
import ResetPassword from './pages/Login/ResetPassword'
import MainLayout from './middlewares/MainLayout'
import Home from './pages/Home'
import Explore from './pages/Explore'
import Message from './pages/Message'
import Reels from './pages/Reels'
import Profile from './pages/Profile'

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login/>}/>
      <Route path="/signup" element={<Register />}/>
      <Route path="/verify-email" element={<VerifyEmail />}/>
      <Route path="/verify-email/:token" element={<VerifyEmailSuccess />}/>
      <Route path="/forgot-password" element={<ForgotPassword/>}/>
      <Route path="/reset-password/:token" element={<ResetPassword />}/>
      <Route element={<MainLayout />}>
        <Route index element={<Home />}/>
        <Route path="/explore" element={<Explore />}/>
        <Route path="/message" element={<Message />}/>
        <Route path='/reels' element={<Reels />} />
        <Route path="/profile" element={<Profile />} />
      </Route>
    </Routes>
  )
}
