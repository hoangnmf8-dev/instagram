import React from 'react'
import { getSuggestedUserKey } from '@/cache_keys/searchKey'
import { useInfiniteQuery, useQuery } from '@tanstack/react-query'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useAuth } from '@/stores/authStore'
import { useNavigate } from 'react-router-dom'
import { getPostExplore } from '@/services/postService'
import { getPostsNewfeedKey } from '@/cache_keys/postsKey'
import PostItem from '@/components/Posttem/PostItem'
import LoadMoreTrigger from '@/components/LoadMoreTrigger'
import Spinner from '@/components/Spinner'
import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardHeader } from "@/components/ui/card"

const BASE_URL = import.meta.env.VITE_BASE_URL;
export default function Explore() {

  const {data: postExploreData, fetchNextPage, hasNextPage, isFetchingNextPage} = useInfiniteQuery({
    queryKey: getPostsNewfeedKey("explore"),
    queryFn: getPostExplore, // nhận 1 đối số có dạng obj chứa key pageParam và value từ getNextPageParam trả về
    getNextPageParam: (lastPage) => { //lastPage chính là response.data được trả về từ hàm gọi api ở service
      const {hasMore, offset, posts} = lastPage.data;
      if(!hasMore) return undefined;
      return offset + posts.length //Ném ngược về làm đối số của hàm queryFn
    }
  })
  
  return (
    <div>
      <div className='max-w-5xl mx-auto px-6 mt-12'>
        <div className="flex flex-wrap">
          {postExploreData?.pages?.map((page, index) => <React.Fragment key={index}>
            {page?.data?.posts.map((post: any) => post?.userId && <PostItem key={post?._id} post={post} page="explore"/>)}
          </React.Fragment>) }
          <LoadMoreTrigger
            disabled={!hasNextPage}
            onLoadMore={() => {
              if (hasNextPage && !isFetchingNextPage) {
                fetchNextPage()
              }
            }}
          />
          {isFetchingNextPage && <Spinner width='w-6' border='border-3 border-insta-blue' position='mt-3'/>}
        </div>
          {!hasNextPage && <div className='flex flex-col items-center gap-3 mt-6 text-transparent bg-clip-text bg-linear-to-r from-[#ff5c00] via-[#ff0069] to-[#d300c5]'>
            <img className='w-10' src="/common_img/illo-confirm-refresh-light.png" alt="complete" />
            <p className='font-semibold'>You're all caught up</p>
            <p>You've seen all new posts</p>
            </div>}
      </div>
    </div>
  )
}
