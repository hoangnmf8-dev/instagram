import {  } from 'react'
import Sidebar from '@/components/Sidebar';
import { Outlet } from 'react-router-dom';


export default function MainLayout() {
  

  return (
    <>
      <Sidebar />
      <Outlet />
    </>
  )
}
