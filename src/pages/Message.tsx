import { BigMessageIcon } from '@/components/InstagramIcon'
import { SocketContext } from '@/layouts/MainLayout';
import { use, useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { getConversationsKey } from '@/cache_keys/messageKey';

export default function Message() {
  const socket = use(SocketContext);
  const query = useQueryClient();

  useEffect(() => {
    if (!socket) return;

    const handleNewMessage = async (message) => {
      query.invalidateQueries({ queryKey: getConversationsKey });
    };
    socket.on("new_message", handleNewMessage);
    return () => {
      socket.off("new_message", handleNewMessage);
    };
  }, [socket, query]);
  
  return (
    <div className='h-screen flex-1 flex flex-col gap-3 items-center justify-center'>
      <div><BigMessageIcon /></div>
      <p className='text-[20px]'>Your messages</p>
      <p className='text-gray-500 text-[14px]'>Send a message to start a chat.</p>
    </div>
  )
}
