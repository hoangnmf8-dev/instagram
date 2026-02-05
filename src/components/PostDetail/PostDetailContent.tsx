import React from 'react'

type Props = {
  mediaType: string,
  image: string,
  video: string
}

const BASE_URL = import.meta.env.VITE_BASE_URL;

export default function PostDetailContent({mediaType, image, video}: Props) {
  return (
    <div className='basis-3/5 flex items-center justify-center bg-black'>
      {mediaType === "image" ? 
        (<img className='max-w-[80%] block' src={`${BASE_URL}${image}`} alt="image"/>) 
        :
        (<video className='max-w-[80%] h-full block' src={`${BASE_URL}${video}`} autoPlay loop muted>
        </video>)
      }
    </div>
  )
}
