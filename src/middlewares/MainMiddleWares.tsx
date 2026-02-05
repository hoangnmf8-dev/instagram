import { useAuth } from '@/stores/authStore'
import { Navigate, Outlet } from 'react-router-dom';


export default function MainLayout() {
  const {token} = useAuth();
  return (
    <div>
      {token ? <Outlet /> : <Navigate to="/login" replace/>}
    </div>
  )
}
