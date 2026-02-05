import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import React, { useEffect, useState } from 'react'
import { getProfile, getUserProfile } from '@/services/userServices'
import { profileKey, userProfileKey } from '@/cache_keys/userKey'
import { useAuth } from '@/stores/authStore'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useParams, Link, useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import { OverviewUserIcon, PhotoIconUser, SaveUserIcon } from '@/components/InstagramIcon'
import Loading from '@/components/Loading'
import { followUser, getFollowers, getFollowing, unFollowUser } from '@/services/followService'
import Spinner from '@/components/Spinner'
import { getFollowersKey, getFollowingKey } from '@/cache_keys/followKey'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import FollowDetail from '@/components/FollowDetail'
import { getUserPost, getUserPostStats } from '@/services/postService'
import { getUserPostKey, getUserPostStatsKey } from '@/cache_keys/postsKey'
import LoadMoreTrigger from '@/components/LoadMoreTrigger'
import PostItem from '@/components/Posttem/PostItem'
import { getConversationsKey } from '@/cache_keys/messageKey'
import { getConversations, getOrCreateConversation } from '@/services/messageService'

const BASE_URL = import.meta.env.VITE_BASE_URL;

export default function UserProfile() {
  const {user, setUser} = useAuth();
  const {id} = useParams();
  const query = useQueryClient();
  const [openFollowers, setOpenFollowers] = useState(false);
  const [isFollowers, setIsFollowers] = useState("");
  const navigate = useNavigate();

  const {data: profileData, isLoading: profileLoading} = useQuery({
    queryKey: profileKey,
    queryFn: getProfile,
    staleTime: 10 * 1000,
    retry: 3
  })

  const {data: userData, isLoading: userLoading} = useQuery({
    queryKey: userProfileKey(id),
    queryFn: () => getUserProfile(id),  
    staleTime: 100 * 1000,
    retry: 3,
    enabled: !!id
  })

  const mutationGetOrCreateConversation = useMutation({
    mutationFn: (userId) => getOrCreateConversation(userId),
    onSuccess: (data, userId) => {
      navigate(`/message-detail/${userId}?conversationId=${data.data._id}`);
      query.invalidateQueries({queryKey: getConversationsKey});
    }
  })

  const handleGetOrCreateConversation = (userId) => {
    mutationGetOrCreateConversation.mutate(userId);
  }

  useEffect(() => {
    if(userData && profileData?.data?._id === userData?.data?._id) {
      setUser(userData.data)
    }
  }, [userData]) //dữ liệu chưa kịp đổ về nên lấy từ cache, sau đó dữ liệu về thì k chạy lại do dependency là mảng rỗng, do vậy phải có dependency

  const mutationUnFollowUser = useMutation({
    mutationFn: (userId) => unFollowUser(userId),
    onSuccess: (data, userId) => {
      query.invalidateQueries({queryKey: userProfileKey(userId)});
      query.invalidateQueries({queryKey: profileKey});
      query.invalidateQueries({queryKey: getFollowingKey(user?._id)});
    }
  });

  const handleUnFollowUser = (userId) => {
    mutationUnFollowUser.mutate(userId);
  }

  const mutationFollowUser = useMutation({
    mutationFn: (userId) => followUser(userId),
    onSuccess: (data, userId) => {
      query.invalidateQueries({queryKey: userProfileKey(userId)});
      query.invalidateQueries({queryKey: profileKey});
      query.invalidateQueries({queryKey: getFollowingKey(user?._id)});
    }
  });

  const handleFollowUser = (userId) => {
    mutationFollowUser.mutate(userId);
  }

  const {data: followersData, isLoading: isLoadingGetFollowers} = useQuery({
    queryKey: getFollowersKey(userData?.data?._id),
    queryFn: () => getFollowers(userData?.data?._id),
    retry: 3,
    enabled: !!userData?.data?._id
  });

  const {data: followingData, isLoading: isLoadingGetFollowing} = useQuery({
    queryKey: getFollowingKey(userData?.data?._id),
    queryFn: () => getFollowing(userData?.data?._id),
    retry: 3,
    enabled: !!userData?.data?._id
  });

  const handleGetFollowers = () => {
    setIsFollowers("followers");
    setOpenFollowers(true);
  }

  const handleGetFollowing = () => {
    setIsFollowers("following");
    setOpenFollowers(true);
  }

  const {data: postStatsData} = useQuery({
    queryKey: getUserPostStatsKey(userData?.data?._id),
    queryFn: () => getUserPostStats(userData?.data?._id),
    retry: 3,
    enabled: !!userData
  })


  const {data: userPostData, hasNextPage, isFetchingNextPage, fetchNextPage} = useInfiniteQuery({
    queryKey: getUserPostKey(userData?.data?._id),
    queryFn: ({pageParam}) => {
      return getUserPost({
        userId: userData?.data?._id,
        pageParam: pageParam
      })
    },
    getNextPageParam: (lastPage) => {
      const {offset, posts, hasMore} = lastPage?.data;
      if(!hasMore) return undefined;
      return offset + posts.length;
    }
  });
  
  return (
    <div className='flex-1 px-5 py-7.5 relative left-20'>
      {(userLoading || profileLoading) && <Loading width='w-10' border='border-4 border-insta-blue' position='fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2'/>}
      <div className='max-w-250 mx-auto'>
        <div className='max-w-170 mx-auto'>
          <div className='flex items-center gap-10'>
            <div className='w-35 aspect-square'>
              <Avatar className='w-full h-full'>
                <AvatarImage
                  src={userData?.data.profilePicture ? `${BASE_URL}${userData?.data.profilePicture}` : "/common_img/meme-hai-1.jpg"}
                  alt="@shadcn"
                  className="w-full h-full object-cover"
                />
                <AvatarFallback className='text-5xl'>{userData?.data?.username?.slice(0,1)}</AvatarFallback>
              </Avatar>
            </div>
            <div className='flex flex-col justify-center gap-2'>
              <h1 className='font-bold text-[24px]'>{userData?.data?.username}</h1>
              <h2 className="text-[14px] text-gray-400">{userData?.data?.fullName}</h2>
              <div className='flex gap-10'>
                <Button variant={"ghost"} className='hover:bg-transparent'><strong className='font-semibold text-[14px]'>{postStatsData?.data?.totalPosts || 0}</strong> posts</Button>
                <Button variant={"ghost"} className='hover:bg-transparent hover:cursor-pointer' onClick={handleGetFollowers}><strong className='font-semibold text-[14px]'>{followersData?.data?.followers?.length || 0}</strong> followers</Button>
                <Button variant={"ghost"} className='hover:bg-transparent hover:cursor-pointer' onClick={handleGetFollowing}><strong className='font-semibold text-[14px]'>{followingData?.data?.following?.length || 0}</strong> following</Button>
                <Dialog open={openFollowers} onOpenChange={setOpenFollowers}>
                  <DialogContent className='p-0'>
                    <DialogHeader className='gap-0'>
                      <DialogTitle className='flex justify-center p-4'>{isFollowers === "followers"?
                        "Followers"
                        :
                        "Following"
                      }</DialogTitle>
                      <hr />
                      <DialogDescription className='p-4 max-h-80 overflow-auto' asChild>
                        <div className='flex flex-col gap-3'>
                          {
                            isFollowers === "followers" ? 
                            (
                              followersData?.data?.followers?.length > 0 ? 
                              followersData?.data?.followers.map(follower => <FollowDetail key={follower?._id} follow={follower} userId={userData?.data?._id} setOpenFollowers={setOpenFollowers}/>)
                              :
                              <p className='text-center'>No followers yet</p>
                            )
                            :
                            (
                              followingData?.data?.following?.length > 0 ?
                              followingData?.data?.following.map(following => <FollowDetail key={following?._id} follow={following} userId={userData?.data?._id} setOpenFollowers={setOpenFollowers}/>)
                              :
                              <p className='text-center '>Not following anyone yet</p>
                            )
                          }
                        </div>
                      </DialogDescription>
                    </DialogHeader>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          </div>
          <div className='mt-6 w-full flex justify-between gap-3'>
            {(profileData && (profileData?.data?._id === userData?.data?._id)) ? 
              (<>
                <Link to="/edit-profile" className='basis-1/2 bg-[#f0f2f5] text-black py-3 text-center font-normal text-[15px] hover:bg-gray-300 hover:cursor-pointer rounded-lg'>Edit profile</Link>
                <Button className='basis-1/2 bg-[#f0f2f5] text-black py-6 hover:bg-gray-300 hover:cursor-pointer'>View archive</Button>
              </>)
              : 
              (<div className='flex gap-4 w-full px-4 mt-6'>
                {userData?.data?.isFollowing ? 
                  <Button className='basis-1/2 bg-gray-300 hover:bg-gray-500 hover:cursor-pointer' onClick={() => handleUnFollowUser(userData?.data?._id)}>
                    {mutationUnFollowUser.isPending ? <Spinner width='w-5' border="border-2 border-white"/> : "UnFollow"}
                  </Button>
                  :
                  <Button className='basis-1/2 bg-insta-blue hover:bg-blue-500 hover:cursor-pointer' onClick={() => handleFollowUser(userData?.data?._id)}>
                    {mutationFollowUser.isPending ? <Spinner width='w-5' border="border-2 border-white"/> : "Follow"}
                  </Button>
                }
                <Button className='basis-1/2 bg-insta-blue hover:bg-blue-500 hover:cursor-pointer' onClick={() => handleGetOrCreateConversation(userData?.data?._id)}>Message</Button>
              </div>)
            }
          </div>
        </div>

        <div className='mt-20'>
          <Tabs defaultValue="overview" className="w-full gap-0">
            <TabsList variant="line" className='w-full'>
              <TabsTrigger className='hover:cursor-pointer' value="overview">
                <OverviewUserIcon className='size-6' /> 
              </TabsTrigger>
              <TabsTrigger className='hover:cursor-pointer' value="analytics">
                <SaveUserIcon className='size-6'/>
              </TabsTrigger>
              <TabsTrigger className='hover:cursor-pointer' value="reports">
                <PhotoIconUser className='size-6' />
              </TabsTrigger>
            </TabsList>
              <hr className='h-.5 bg-gray-200'/>
            <TabsContent value="overview">
              <Card className='border-none shadow-none p-0'>
                <CardHeader className='p-0'>
                  <CardTitle className='text-center'>
                    <div className='max-w-5xl mx-auto mt-[0.5px]'>
                      <div className="flex flex-wrap">
                        {userPostData?.pages?.map((page, index) => <React.Fragment key={index}>
                          {page?.data?.posts.map((post: any) => <PostItem key={post?._id} post={post} page="user-profile"/>)}
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
                  </CardTitle>
                </CardHeader>
              </Card>
            </TabsContent>
            <TabsContent value="analytics">
              <Card className='border-none shadow-none'>
                <CardHeader>
                  <CardTitle className='text-center'>Không có bài viết</CardTitle>
                </CardHeader>
              </Card>
            </TabsContent>
            <TabsContent value="reports">
              <Card className='border-none shadow-none'>
                <CardHeader>
                  <CardTitle className='text-center'>Không có bài viết</CardTitle>
                </CardHeader>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
