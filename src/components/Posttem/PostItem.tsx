import React, { useState } from 'react'
import PostContent from './PostContent'
import PostAction from './PostAction'
import { getUserProfile } from '@/services/userServices'
import { useQuery } from '@tanstack/react-query'
import { userProfileKey } from '@/cache_keys/userKey'
import PostDetail from '../PostDetail/PostDetail'
import { Video, Image } from 'lucide-react';
const BASE_URL = import.meta.env.VITE_BASE_URL;
export default function PostItem({post, page}) {
  const {data: userData} = useQuery({
    queryKey: userProfileKey(post?.userId?._id),
    queryFn: () => getUserProfile(post?.userId?._id),
    retry: 3,
    staleTime: 60 * 1000
  })
  
  const [openPostDetail, setOpenPostDetail] = useState(false);
  
  if(page === "newfeed") {
    return <div className='w-130 mt-9 pt-4 p-5 shadow-md rounded-2xl overflow-hidden'>
          <PostContent
            caption={post.caption}
            createdAt={post.createdAt}
            image={post.image}
            mediaType={post.mediaType}
            userId={post.userId}
            video={post.video}
            userData={userData}
            postId={post._id}
          />
          <PostAction 
            comments={post.comments} 
            likes={post.likes} 
            isLiked={post.isLiked}
            isSaved={post.isSaved}
            likedBy={post.likedBy}
            savedBy={post.savedBy}
            userData={userData}
            caption={post.caption}
            postId={post._id}
            setOpenPostDetail={setOpenPostDetail}
            page={page}
          />
          {openPostDetail && <PostDetail openPostDetail={openPostDetail} setOpenPostDetail={setOpenPostDetail} postId={post._id} page={page}/>}
        </div>
  }

  if(page === "explore") {
    return (
      <div className='basis-1/3 w-1/3 min-h-50 p-[0.5px] hover:cursor-pointer hover:brightness-70' onClick={() => setOpenPostDetail(true)}>
        {
          post?.mediaType === "image" ? 
        (<div className='bg-black h-full w-full flex items-center justify-center relative'>
          <div className='absolute right-2.5 top-2.5 text-white'><Image /></div>
          <img src={`${BASE_URL}${post?.image}`} alt="image"/>
        </div>) 
        :
        (<div className='bg-black h-full w-full flex items-center relative'>
          <div className='absolute right-2.5 top-2.5 text-white'><Video /></div>
          <video src={`${BASE_URL}${post?.video}`} autoPlay loop muted>
          </video>
        </div>)
        }
        {openPostDetail && <PostDetail openPostDetail={openPostDetail} setOpenPostDetail={setOpenPostDetail} postId={post._id} page={page}/>}
      </div>
    )
  }

  if(page === "user-profile") {
      return (
        <div className='basis-1/3 w-1/3 min-h-50 p-[0.5px] hover:cursor-pointer hover:brightness-70' onClick={() => setOpenPostDetail(true)}>
        {
          post?.mediaType === "image" ? 
        (<div className='bg-black h-full w-full flex items-center justify-center relative'>
          <div className='absolute right-2.5 top-2.5 text-white'><Image /></div>
          <img src={`${BASE_URL}${post?.image}`} alt="image"/>
        </div>) 
        :
        (<div className='bg-black h-full w-full flex items-center relative'>
          <div className='absolute right-2.5 top-2.5 text-white'><Video /></div>
          <video src={`${BASE_URL}${post?.video}`} autoPlay loop muted>
          </video>
        </div>)
        }
        {openPostDetail && <PostDetail openPostDetail={openPostDetail} setOpenPostDetail={setOpenPostDetail} postId={post._id} page={page}/>}
      </div>
      )
    }
}
