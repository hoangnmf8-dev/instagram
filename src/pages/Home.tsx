import React from 'react'
import { getSuggestedUser } from '@/services/userServices'
import { getSuggestedUserKey } from '@/cache_keys/searchKey'
import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useAuth } from '@/stores/authStore'
import { useNavigate } from 'react-router-dom'
import { getPostsNewfeed } from '@/services/postService'
import { getPostsNewfeedKey } from '@/cache_keys/postsKey'
import PostItem from '@/components/Posttem/PostItem'
import LoadMoreTrigger from '@/components/LoadMoreTrigger'
import Spinner from '@/components/Spinner'
import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { followUser } from '@/services/followService'
import { userProfileKey } from '@/cache_keys/userKey'

const BASE_URL = import.meta.env.VITE_BASE_URL;
export default function Home() {
  const query = useQueryClient();
  const {user} = useAuth();
  const navigate = useNavigate();

  const {data: suggestedUserData, isFetching} = useQuery({
    queryKey: getSuggestedUserKey,
    queryFn: getSuggestedUser,
    staleTime: 60 * 1000,
    retry: 3
  });
  
  const handleClickUser = (e: React.MouseEvent<HTMLDivElement>) => {
    const id = e.currentTarget.dataset.id;
    if(typeof id === "string") {
      navigate(`/user/${id}`);
    }
  }

  const {data: postsNewfeedData, fetchNextPage, hasNextPage, isFetchingNextPage} = useInfiniteQuery({
    queryKey: getPostsNewfeedKey("newfeed"),
    queryFn: getPostsNewfeed, // nhận 1 đối số có dạng obj chứa key pageParam và value từ getNextPageParam trả về
    getNextPageParam: (lastPage) => { //lastPage chính là response.data được trả về từ hàm gọi api ở service
      const {hasMore, offset, posts} = lastPage.data;
      if(!hasMore) return undefined;
      return offset + posts.length //Ném ngược về làm đối số của hàm queryFn
    }
  })
  
  const mutationFollowUser = useMutation({
    mutationFn: (id) => followUser(id),
    onSuccess: (data, id) => {
      query.invalidateQueries({queryKey: getSuggestedUserKey});
      query.invalidateQueries({queryKey: userProfileKey(id)})
    }
  });

  const handleFollowUser = (id) => {
    mutationFollowUser.mutate(id)
  }
  return (
    <div>
      <div className='max-w-5xl mx-auto'>
        <div className='flex w-full'>
          <div className='basis-2/3'>
              <div className='max-w-157 mx-auto'>
                <div className='flex flex-col items-center'>
                  {
                    postsNewfeedData?.pages ?
                      postsNewfeedData?.pages?.map((page, index) => <React.Fragment key={index}>
                        {page?.data?.posts.map((post: any) => post?.userId && <PostItem key={post?._id} post={post} page="newfeed"/>)}
                      </React.Fragment>) 
                    :
                      ( 
                        Array(10).fill(0).map((_, index) => <Card key={index} className="w-130 mt-9 pt-4">
                          <CardHeader>
                            <Skeleton className="h-4 w-2/3" />
                            <Skeleton className="h-4 w-1/2" />
                          </CardHeader>
                          <CardContent>
                            <Skeleton className="aspect-video w-full" />
                          </CardContent>
                        </Card>)
                      )
                  }
                
                  <LoadMoreTrigger
                    disabled={!hasNextPage}
                    onLoadMore={() => {
                      if (hasNextPage && !isFetchingNextPage) {
                        fetchNextPage()
                      }
                    }}
                  />
                  {isFetchingNextPage && <Spinner width='w-6' border='border-3 border-insta-blue' position='mt-3'/>}
                  {!hasNextPage && <div className='flex flex-col items-center gap-3 mt-6 text-transparent bg-clip-text bg-linear-to-r from-[#ff5c00] via-[#ff0069] to-[#d300c5]'>
                    <img className='w-10' src="/common_img/illo-confirm-refresh-light.png" alt="complete" />
                    <p className='font-semibold'>You're all caught up</p>
                    <p>You've seen all new posts</p>
                    </div>}
                </div>
              </div>
          </div>
  
          <div className='basis-1/3 p-4 pl-16 mt-9'>
            <div className='flex flex-col gap-3 max-w-80'>
              <div className='flex justify-between items-center mb-4 hover:cursor-pointer' data-id={user?._id} onClick={handleClickUser}>
                <div className='flex gap-2 items-center'>
                  <Avatar className='w-11 h-11'>
                    <AvatarImage src={user?.profilePicture ? `${BASE_URL}${user?.profilePicture}` : "/common_img/meme-hai-1.jpg"} className="w-full h-full object-cover"/>
                    <AvatarFallback>CN</AvatarFallback>
                  </Avatar>
                  <div className='flex flex-col justify-center'>
                    <h4 className='text-black font-semibold text-[14px]'>{user?.username}</h4>
                    <p className='text-[11px] text-gray-500 font-300'>{user?.fullName}</p>
                  </div>
                </div>
              </div>
              <h3 className='text-gray-500 text-sm font-semibold'>Suggested for you</h3>
              {suggestedUserData?.data.map(suggestedUser => 
                <div key={suggestedUser._id} className='flex justify-between items-center'>
                  <div className='flex flex-1 gap-2 items-center hover:cursor-pointer' data-id={suggestedUser?._id} onClick={handleClickUser}>
                    <Avatar className='w-11 h-11'>
                      <AvatarImage src={suggestedUser?.profilePicture ? `${BASE_URL}${suggestedUser?.profilePicture}` : "/common_img/meme-hai-1.jpg"} className="w-full h-full object-cover"/>
                      <AvatarFallback>CN</AvatarFallback>
                    </Avatar>
                    <div className='flex flex-col justify-center'>
                      <h4 className='text-black font-semibold text-[14px]'>{suggestedUser?.username}</h4>
                      <p className='text-[11px] text-gray-500 font-300'>Suggested for you</p>
                    </div>
                  </div>
                  <Button className='bg-transparent text-insta-blue hover:cursor-pointer hover:text-blue-400 hover:bg-transparent' onClick={() => handleFollowUser(suggestedUser._id)}>Follow</Button>
                </div>)
              }
              <p className='text-[12px] text-gray-500 font-300 mt-4 uppercase'>© 2026 Instagram from Meta</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
