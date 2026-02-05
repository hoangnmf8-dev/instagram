import { useAuth } from '@/stores/authStore'
import React from 'react'
import { Navigate, Outlet, replace } from 'react-router-dom';

export default function AuthMiddleWare() {
  const {token} = useAuth();
  return (
    <>{token ? <Navigate to="/" replace/> : <Outlet />}</>
  )
}
