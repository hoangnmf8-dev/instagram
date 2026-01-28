import { useQuery } from '@tanstack/react-query'
import React, { useEffect } from 'react'
import { getProfile } from '@/services/userServices'
import { profileKey } from '@/cache_keys/userKey'
import { useAuth } from '@/stores/authStore'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export default function Profile() {
  const {user, setUser} = useAuth();
  
  const {data, isFetching, refetch} = useQuery({
    queryKey: profileKey,
    queryFn: getProfile,
    staleTime: 60 * 1000,
    retry: 3
  })

  useEffect(() => {
    if(!data) return;
    setUser(data.data)
  }, [])

  return (
    <div className='flex-1 px-5 py-7.5'>
      <div className='max-w-250 mx-auto'>
        <div className='max-w-170 mx-auto'>
          <div className='flex items-center gap-10'>
            <div className='w-30 aspect-square'>
              <Avatar className='w-full h-full'>
                <AvatarImage
                  src={user.profilePicture}
                  alt="@shadcn"
                  className="grayscale w-full h-full"
                />
                <AvatarFallback className='text-5xl'>{user.username.slice(0,1)}</AvatarFallback>
              </Avatar>
            </div>
            <div className='flex flex-col justify-center'>
              <h1 className='font-bold text-2xl'>{user?.username}</h1>
              <h2 className="text-lg text-gray-400 font-light">{user?.fullName}</h2>
              <div>
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          </div>
          <div></div>
        </div>

        <div>

        </div>
      </div>
    </div>
  )
}
