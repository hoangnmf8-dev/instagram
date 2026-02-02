import React, { useState } from 'react'

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import calcTimeToNow from '@/utils/calcTimeToNow'
import { useNavigate } from 'react-router-dom'
import { DotIcon } from '../InstagramIcon';
import { useAuth } from '@/stores/authStore';
import { Button } from '../ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { useForm } from 'react-hook-form';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { deletePost, editPost, getPostNewsFeedDetail } from '@/services/postService';
import { getPostsNewfeedKey } from '@/cache_keys/postsKey';
import { toast, Toaster } from 'sonner';
const BASE_URL = import.meta.env.VITE_BASE_URL;


type UserId = {
  _id: string,
  username: string
}

type Props = {
  caption:string,
  createdAt:string,
  image:string,
  mediaType:string,
  userId:UserId,
  video:string,
  userData: any,
  postId: string
}

export default function PostContent({caption, createdAt, image, mediaType, userId, video, userData, postId}: Props) {
  const {user} = useAuth();
  const query = useQueryClient();
  const navigate = useNavigate();
  const handleClickUser = (e: React.MouseEvent<HTMLHeadingElement>) => {
    const id = e.currentTarget.dataset.id;
    navigate(`user/${id}`);
  }


  const mutationEditCaptionPost = useMutation({
    mutationFn: (payload) => editPost({postId, payload}),
    onSuccess: () => {
      toast.success("Update post successfully");
      query.invalidateQueries({queryKey: getPostsNewfeedKey("newfeed")});
      query.invalidateQueries({queryKey: getPostsNewfeedKey("explore")});
      setOpenEditPost(false);
    },
    onError: (error) => {
      toast.error(error.message);
    }
  })
  const [openEditPost, setOpenEditPost] = useState(false);
  const {register, handleSubmit, formState: {isValid}} = useForm({
    defaultValues: {
      caption: caption || ""
    }
  });

  const onSubmit = (data) => {
    mutationEditCaptionPost.mutate(data);
  }

  const mutationDeletePost = useMutation({
    mutationFn: () => deletePost(postId),
    onSuccess: () => {
      toast.success("Delete post successfully");
      query.invalidateQueries({queryKey: getPostsNewfeedKey("newfeed")});
      query.invalidateQueries({queryKey: getPostsNewfeedKey("explore")});
      setOpenEditPost(false);
    },
    onError: (error) => {
      toast.error(error.message);
    }
  });

  const handleDeletePost = () => {
    mutationDeletePost.mutate();
  }
  return (
    <div>
      <div className='flex flex-1 justify-between items-center mb-4' data-id={userData?.data?._id}>
        <div className='flex gap-2 items-center'>
          <Avatar className='w-10 h-10'>
            <AvatarImage src={userData?.data?.profilePicture ? `${BASE_URL}${userData?.data?.profilePicture}` : "/common_img/meme-hai-1.jpg"} className="w-full h-full object-cover"/>
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <div className='flex flex-col justify-center'>
            <div className='flex items-center gap-1'>
              <h4 data-id={userId._id} className='text-black font-semibold text-[14px] hover:cursor-pointer' onClick={handleClickUser}>{userData?.data?.username}</h4>
              <span className='text-gray-500'>•</span>
              <span className='text-gray-500 text-[12px]'>{userData?.data?.createdAt && calcTimeToNow(userData?.data?.createdAt)}</span>
            </div>
            <p className='text-[11px] text-gray-500 font-300'>{userData?.data?.fullName}</p>
          </div> 
        </div>
        {userId?._id === user?._id ? 
            <>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button  variant={'ghost'} className='p-0 w-8 h-8 rounded-full hover:cursor-pointer'><DotIcon/></Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className='p-0 gap-0'>
                  <DropdownMenuGroup>
                    <DropdownMenuItem className='hover:cursor-pointer' onClick={() => setOpenEditPost(true)}>Edit</DropdownMenuItem>
                  </DropdownMenuGroup>
                  <DropdownMenuGroup>
                    <DropdownMenuSeparator className='m-0'/>
                    <DropdownMenuItem className='text-red-500 hover:cursor-pointer' onClick={handleDeletePost}>Delete</DropdownMenuItem>
                  </DropdownMenuGroup>
                </DropdownMenuContent>
              </DropdownMenu>

              <Dialog open={openEditPost} onOpenChange={setOpenEditPost}>
                <DialogContent>
                  <DialogHeader className='sr-only'>
                    <DialogTitle>Edit and Delete post</DialogTitle>
                    <DialogDescription>
                    </DialogDescription>
                  </DialogHeader>
                  <form action="" className='flex flex-col gap-3 mt-5' onSubmit={handleSubmit(onSubmit)}>
                    <label htmlFor="caption">Edit caption</label>
                    <textarea className='border p-2' id="caption" rows={5} placeholder='Enter your caption...' {...register("caption")}></textarea>
                    <Button className='bg-insta-blue hover:bg-blue-300'>Save</Button>
                  </form>
                </DialogContent>
              </Dialog>
            </>
          : 
          null
        }
      </div>

      {mediaType === "image" ? 
        (<img className='justify-self-center' src={`${BASE_URL}${image}`} alt="image"/>) 
        :
        (<video src={`${BASE_URL}${video}`} autoPlay loop muted>
        </video>)
      }
      <Toaster position='top-right' richColors/>
    </div>
  )
}
