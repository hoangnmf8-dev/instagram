import MessageSidebar from '@/components/MessageSidebar'
import { Outlet } from 'react-router-dom'

export default function MessageLayout() {
  return (
    <div className='ml-12.5 flex'>
      <MessageSidebar />
      <Outlet />
    </div>
  )
}
