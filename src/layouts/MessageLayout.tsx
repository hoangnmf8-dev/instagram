import MessageSidebar from '@/components/MessageSidebar'
import { createContext, useEffect} from 'react'
import { Outlet } from 'react-router-dom'
import io from "socket.io-client";
import { useAuth } from '@/stores/authStore';
export const SocketContext = createContext(null);

const socket = io("https://instagram.f8team.dev", {
  auth: {
    token: useAuth?.getState()?.token?.accessToken,
  },
});
socket.on("connect", () => {
  console.log("Connected to chat server");
});

export default function MessageLayout() {
  return (
    <SocketContext.Provider value={socket}>
      <div className='ml-12.5 flex'>
        <MessageSidebar />
        <Outlet />
      </div>
    </SocketContext.Provider>
  )
}
