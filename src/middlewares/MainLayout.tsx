import { useAuth } from '@/stores/authStore'
import { Navigate, Outlet } from 'react-router-dom';
import Sidebar from '@/components/Sidebar';

export default function MainLayout() {
  const {token} = useAuth();
  return (
    <div className='flex'>
      {token ? (<><Sidebar /><Outlet /></>) : <Navigate to="/login" replace/>}
    </div>
  )
}
