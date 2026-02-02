import React from 'react'
import { getUserProfile } from '@/services/userServices';
import { userProfileKey } from '@/cache_keys/userKey';
import { useQuery } from '@tanstack/react-query';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import calcTimeToNow from '@/utils/calcTimeToNow';

const BASE_URL = import.meta.env.VITE_BASE_URL;

export default function ReplyComment({reply}) {
  const {data: userData} = useQuery({
    queryKey: userProfileKey(reply?.userId?._id),
    queryFn: () => getUserProfile(reply?.userId?._id),
    retry: 3
  });

  return (
    <div className={`flex gap-2`}>
      <Avatar className='w-8 h-8'>
        <AvatarImage src={userData?.profilePicture ? `${BASE_URL}${userData?.profilePicture}` : "/common_img/meme-hai-1.jpg"} className="w-full h-full object-cover"/>
        <AvatarFallback>CN</AvatarFallback>
      </Avatar>
      <div className='flex flex-col justify-center'>
        <h4 className='text-black font-semibold text-[14px] hover:cursor-pointer'>
          {userData?.data?.username}
          <span className='font-light ml-3'>{reply?.content}</span>
        </h4>
        <p className='text-[11px] text-gray-500 font-300'>{calcTimeToNow(reply?.createdAt)}</p>
      </div>
    </div>
  )
}
