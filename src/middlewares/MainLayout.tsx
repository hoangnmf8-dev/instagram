import { useAuth } from '@/stores/authStore'
import { Navigate, Outlet } from 'react-router-dom';
import Sidebar from '@/components/Sidebar';

export default function MainLayout() {
  const {token} = useAuth();
  return (
    <div>
      {token ? (<><Sidebar /><div className='relative left-20'><Outlet /></div></>) : <Navigate to="/login" replace/>}
    </div>
  )
}
