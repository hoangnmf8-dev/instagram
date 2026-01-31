import React from 'react'

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import calcTimeToNow from '@/utils/calcTimeToNow'
import { useNavigate } from 'react-router-dom'
const BASE_URL = import.meta.env.VITE_BASE_URL;


type UserId = {
  _id: string,
  username: string
}

type Props = {
  caption:string,
  createdAt:string,
  image:string,
  mediaType:string,
  userId:UserId,
  video:string,
  userData: any
}

export default function PostContent({caption, createdAt, image, mediaType, userId, video, userData}: Props) {
  const navigate = useNavigate();
  const handleClickUser = (e: React.MouseEvent<HTMLHeadingElement>) => {
    const id = e.currentTarget.dataset.id;
    navigate(`user/${id}`);
  }

  return (
    <div>
      <div className='flex flex-1 gap-2 items-center mb-4' data-id={userData?.data?._id}>
        <Avatar className='w-10 h-10'>
          <AvatarImage src={userData?.data?.profilePicture ? `${BASE_URL}${userData?.data?.profilePicture}` : "/common_img/meme-hai-1.jpg"} className="w-full h-full object-cover"/>
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
        <div className='flex flex-col justify-center'>
          <div className='flex items-center gap-1'>
            <h4 data-id={userId._id} className='text-black font-semibold text-[14px] hover:cursor-pointer' onClick={handleClickUser}>{userData?.data?.username}</h4>
            <span className='text-gray-500'>•</span>
            <span className='text-gray-500 text-[12px]'>{userData?.data?.createdAt && calcTimeToNow(userData?.data?.createdAt)}</span>
          </div>
          <p className='text-[11px] text-gray-500 font-300'>{userData?.data?.fullName}</p>
        </div>  
      </div>

      {mediaType === "image" ? 
        (<img className='justify-self-center' src={`${BASE_URL}${image}`} alt="image"/>) 
        :
        (<video src={`${BASE_URL}${video}`} autoPlay loop muted>
        </video>)
      }
    </div>
  )
}
