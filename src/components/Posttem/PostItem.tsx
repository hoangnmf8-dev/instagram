import React, { useState } from 'react'
import PostContent from './PostContent'
import PostAction from './PostAction'
import { getUserProfile } from '@/services/userServices'
import { useQuery } from '@tanstack/react-query'
import { userProfileKey } from '@/cache_keys/userKey'
import PostDetail from '../PostDetail/PostDetail'

export default function PostItem({post}) {
  const {data: userData} = useQuery({
    queryKey: userProfileKey(post?.userId?._id),
    queryFn: () => getUserProfile(post?.userId?._id),
    retry: 3,
    staleTime: 60 * 1000
  })

  const [openPostDetail, setOpenPostDetail] = useState(false);

  return (
    <div className='w-130 mt-9 pt-4 p-5 shadow-md rounded-2xl overflow-hidden'>
      <PostContent
        caption={post.caption}
        createdAt={post.createdAt}
        image={post.image}
        mediaType={post.mediaType}
        userId={post.userId}
        video={post.video}
        userData={userData}
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
      />
      {openPostDetail && <PostDetail openPostDetail={openPostDetail} setOpenPostDetail={setOpenPostDetail} postId={post._id}/>}
    </div>
  )
}
