import { useQuery } from '@tanstack/react-query'
import React, { useEffect } from 'react'
import { getProfile, getUserProfile } from '@/services/userServices'
import { profileKey, userProfileKey } from '@/cache_keys/userKey'
import { useAuth } from '@/stores/authStore'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useParams, Link } from 'react-router-dom'
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

const BASE_URL = import.meta.env.VITE_BASE_URL;

export default function UserProfile() {
  const {user, setUser} = useAuth();
  const {id} = useParams();

  const {data: profileData, isFetching: profileFetching} = useQuery({
    queryKey: profileKey,
    queryFn: getProfile,
    staleTime: 10 * 1000,
    retry: 3
  })

  const {data: userData, isFetching: userFetching} = useQuery({
    queryKey: userProfileKey(id),
    queryFn: () => getUserProfile(id),  
    staleTime: 100 * 1000,
    retry: 3
  })

  useEffect(() => {
    if(userData && profileData?.data?._id === userData?.data?._id) {
      setUser(userData.data)
    }
  }, [userData]) //dữ liệu chưa kịp đổ về nên lấy từ cache, sau đó dữ liệu về thì k chạy lại do dependency là mảng rỗng, do vậy phải có dependency

  return (
    <div className='flex-1 px-5 py-7.5'>
      {(userFetching || profileFetching) && <Loading width='w-10' border='border-4 border-insta-blue' position='fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2'/>}
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
                <p><strong className='font-semibold text-[14px]'>{userData?.data?.postsCount || 0}</strong> posts</p>
                <p><strong className='font-semibold text-[14px]'>{userData?.data?.followersCount}</strong> followers</p>
                <p><strong className='font-semibold text-[14px]'>{userData?.data?.followingCount}</strong> following</p>
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
                <Button className='basis-1/2 bg-insta-blue hover:bg-blue-500 hover:cursor-pointer'>Follow</Button>
                <Button className='basis-1/2 bg-insta-blue hover:bg-blue-500 hover:cursor-pointer'>Message</Button>
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
              <Card className='border-none shadow-none'>
                <CardHeader>
                  <CardTitle className='text-center'>Không có bài viết</CardTitle>
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
