import React from 'react'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

const BASE_URL = import.meta.env.VITE_BASE_URL;

type Props = {
  userData: any,
  onClick: () => void,
  caption: null | string,
  className: string,
  size: string,
}
export default function UserInfo({userData, onClick, caption = null, className = "", size="w-10 h-10"}: Props) {
  return (
    <div className={`flex gap-2 ${className}`}>
      <Avatar className={size}>
        <AvatarImage src={userData?.profilePicture ? `${BASE_URL}${userData?.profilePicture}` : "/common_img/meme-hai-1.jpg"} className="w-full h-full object-cover"/>
        <AvatarFallback>CN</AvatarFallback>
      </Avatar>
      <div className='flex flex-col justify-center'>
        <h4 className='text-black font-semibold text-[14px] hover:cursor-pointer' onClick={onClick}>
          {userData?.username}
          <span className='font-light ml-3'>{caption}</span>
        </h4>
        <p className='text-[11px] text-gray-500 font-300'>{userData?.fullName}</p>
      </div>
    </div>
  )
}
