import React from 'react'

type Props = {
  mediaType: string,
  image: string,
  video: string
}

const BASE_URL = import.meta.env.VITE_BASE_URL;

export default function PostDetailContent({mediaType, image, video}: Props) {
  return (
    <div className='basis-2/5 flex items-center bg-black'>
      {mediaType === "image" ? 
        (<img className='w-full' src={`${BASE_URL}${image}`} alt="image"/>) 
        :
        (<video className='w-full' src={`${BASE_URL}${video}`} autoPlay loop muted>
        </video>)
      }
    </div>
  )
}
