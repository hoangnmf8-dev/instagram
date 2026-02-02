import React from 'react'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { followUser, getFollowers, unFollowUser } from '@/services/followService'
import Spinner from '@/components/Spinner'
import { getFollowersKey, getFollowingKey } from '@/cache_keys/followKey'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { profileKey, userProfileKey } from '@/cache_keys/userKey'
import { Button } from './ui/button'
import { useNavigate } from 'react-router-dom'
import { getUserProfile } from '@/services/userServices'
import { useAuth } from '@/stores/authStore'
const BASE_URL = import.meta.env.VITE_BASE_URL;

export default function FollowDetail({follow, userId, setOpenFollowers}) {
  const {user} = useAuth();
  const query = useQueryClient();
  const navigate = useNavigate();
  const {data: userData, isLoading: userLoading} = useQuery({
   queryKey: userProfileKey(follow?._id),
   queryFn: () => getUserProfile(follow?._id),  
   staleTime: 100 * 1000,
   retry: 3,
 })

  const mutationUnFollowUser = useMutation({
    mutationFn: (userId) => unFollowUser(userId),
    onSuccess: (data, userId) => {
      query.invalidateQueries({queryKey: userProfileKey(userId)});
      query.invalidateQueries({queryKey: profileKey});
      query.invalidateQueries({queryKey: getFollowersKey(userId)});
      query.invalidateQueries({queryKey: getFollowingKey(user.id)});
    }
  });

  const handleUnFollowUser = (userId: string) => {
    mutationUnFollowUser.mutate(userId);
  }

  const mutationFollowUser = useMutation({
    mutationFn: (userId) => followUser(userId),
    onSuccess: (data, userId) => {
      query.invalidateQueries({queryKey: userProfileKey(userId)});
      query.invalidateQueries({queryKey: getFollowersKey(userId)});
      query.invalidateQueries({queryKey: getFollowingKey(user.id)});
      query.invalidateQueries({queryKey: profileKey});
    }
  });

  const handleFollowUser = (userId) => {
    mutationFollowUser.mutate(userId);
  }

  const handleClickUser = (e: React.MouseEvent<HTMLDivElement>) => {
      const id = e.currentTarget.dataset.id;
      if(typeof id === "string") {
        navigate(`/user/${id}`);
      };
      setOpenFollowers(false);
    }
  return (
    <div key={follow._id} className='flex justify-between items-center'>
      <div className='flex flex-1 gap-2 items-center hover:cursor-pointer' data-id={follow?._id} onClick={handleClickUser}>
        <Avatar className='w-11 h-11'>
          <AvatarImage src={follow?.profilePicture ? `${BASE_URL}${follow?.profilePicture}` : "/common_img/meme-hai-1.jpg"} className="w-full h-full object-cover"/>
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
        <div className='flex flex-col justify-center'>
          <h4 className='text-black font-semibold text-[14px]'>{follow?.username}</h4>
          <p className='text-[11px] text-gray-500 font-300'>{follow?.fullName}</p>
        </div>
      </div>
      {userData?.data?.isFollowing ? 
        <Button className='bg-gray-300 text-black hover:cursor-pointer hover:bg-gray-500' onClick={() => handleUnFollowUser(follow?._id)}>
          {mutationUnFollowUser.isPending ? <Spinner width='w-5' border="border-2 border-white"/> : "UnFollow"}
        </Button>
        :
        <Button className='bg-transparent text-insta-blue hover:cursor-pointer hover:text-blue-400 hover:bg-transparent' onClick={() => handleFollowUser(follow?._id)}>
          {mutationFollowUser.isPending ? <Spinner width='w-5' border="border-2 border-insta-blue"/> : "Follow"}
        </Button>
      }
    </div>
  )
}
