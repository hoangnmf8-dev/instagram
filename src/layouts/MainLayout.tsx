import Sidebar from '@/components/Sidebar';
import { Outlet } from 'react-router-dom';
import { useAuth } from '@/stores/authStore';
import io, { Socket } from "socket.io-client";
import { createContext, useEffect, useState} from 'react'
export const SocketContext = createContext(null);

export default function MainLayout() {
  const {token} = useAuth();
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    if(!token) return;

    const newSocket = io("https://instagram.f8team.dev", {
      auth: {
        token: token?.accessToken,
      },
    });
    newSocket.on("connect", () => {
      console.log("Connected to chat server");
    });

    setSocket(newSocket);
    return () => {
      newSocket.disconnect();
    }
  }, [token])

  return (
    <SocketContext.Provider value={socket}>
      <Sidebar />
      <Outlet />
    </SocketContext.Provider>
  )
}
