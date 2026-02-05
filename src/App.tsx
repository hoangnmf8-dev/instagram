import React, { useEffect } from 'react'
import { Route, Routes } from 'react-router-dom'
import Login from './pages/Login/Login'
import Register from './pages/Login/Register'
import VerifyEmail from './pages/Login/VerifyEmail'
import VerifyEmailSuccess from './pages/Login/VerifyEmailSuccess'
import ForgotPassword from './pages/Login/ForgotPassword'
import ResetPassword from './pages/Login/ResetPassword'
import MainMiddleWares from './middlewares/MainMiddleWares'
import Home from './pages/Home'
import Explore from './pages/Explore'
import Message from './pages/Message'
import Reels from './pages/Reels'
import UserProfile from './pages/UserProfile'
import EditProfile from './pages/EditProfile'
import AuthMiddleWare from './middlewares/AuthMiddleWare'
import MessageDetail from './pages/MessageDetail'
import MessageLayout from './layouts/MessageLayout'
import { useAuth } from './stores/authStore'
import MainLayout from './layouts/MainLayout'

export default function App() {
  return (
    <Routes>
      <Route element={<AuthMiddleWare />}>
        <Route path="/login" element={<Login/>}/>
        <Route path="/signup" element={<Register />}/>
        <Route path="/verify-email" element={<VerifyEmail />}/>
        <Route path="/verify-email/:token" element={<VerifyEmailSuccess />}/>
        <Route path="/forgot-password" element={<ForgotPassword/>}/>
        <Route path="/reset-password/:token" element={<ResetPassword />}/>
      </Route>
      <Route element={<MainMiddleWares />}>
        <Route element={<MainLayout />}>
          <Route index element={<Home />}/>
          <Route path="/explore" element={<Explore />}/>
          <Route element={<MessageLayout />}>
            <Route path="/message" element={<Message />}/>
            <Route path="/message-detail/:id" element={<MessageDetail />}/>
          </Route>
          <Route path='/reels' element={<Reels />} />
          <Route path="/user/:id" element={<UserProfile />} />
          <Route path="/edit-profile" element={<EditProfile />}/>
        </Route>
      </Route>
    </Routes>
  )
}
