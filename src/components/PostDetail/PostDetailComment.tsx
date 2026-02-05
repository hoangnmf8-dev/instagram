import React, { useState } from 'react'
import { userProfileKey } from '@/cache_keys/userKey'
import { getUserProfile } from '@/services/userServices'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import UserInfo from '../UserInfo'
import { useNavigate } from 'react-router-dom'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import calcTimeToNow from '@/utils/calcTimeToNow'
import { Button } from '../ui/button'
import { DotIcon } from '../InstagramIcon'
import { LikeIcon } from '../InstagramIcon'
import { UnLikeIcon } from '../InstagramIcon'
import { useAuth } from '@/stores/authStore'
import { deleteComment, editComment, likeComment, unLikeComment } from '@/services/commentService'
import { getPostCommentKey } from '@/cache_keys/commentKey'
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
import { Ghost } from 'lucide-react'
import { toast, Toaster } from 'sonner'
import { getPostsNewfeedDetailKey, getPostsNewfeedKey } from '@/cache_keys/postsKey'
import ReplyComment from './ReplyComment'
import { getRepliesCommentKey } from '@/cache_keys/commentKey'
import { getRepliesComment } from '@/services/commentService'
import Spinner from '../Spinner'
import { useForm } from 'react-hook-form'

const BASE_URL = import.meta.env.VITE_BASE_URL;

export default function PostDetailComment({comment, postId, setIsReply, setValue, setFocus, setCommentId, page}) {
  const query = useQueryClient();
  const [openEditComment, setOpenEditComment] = useState(false);
  const {user} = useAuth();
  const navigate = useNavigate();
  const [openRepliesComment, setOpenRepliesComment] = useState(false);
  const {register, handleSubmit, formState: {isValid}} = useForm({
    defaultValues: {
      content: comment?.content
    }
  })

  const {data: userData, isFetching: isFetchingUserData} = useQuery({
    queryKey: userProfileKey(comment?._id),
    queryFn: () => getUserProfile(comment?.userId?._id),
    retry: 3
  })

  const handleClickUser = () => {
    navigate(`user/${comment.user.id}`)
  }

  const mutataionLikeComment = useMutation({
    mutationFn: () => likeComment(postId, comment._id),
    onMutate: async () => {
      await query.cancelQueries({queryKey: getPostCommentKey(postId, page)});
      const previousData = query.getQueryData(getPostCommentKey(postId, page));

      query.setQueryData(getPostCommentKey(postId, page), (old: any) => ({
        ...old,
        data: {
          ...old.data,
          comments: old.data.comments.map((item: any) =>
            item._id === comment._id 
              ? { 
                  ...item, 
                  likedBy: item.likedBy.includes(user?._id) 
                    ? item.likedBy.filter(id => id !== user?._id)
                    : [...item.likedBy, user?._id], 
                  likes: item.likedBy.includes(user?._id) ? item.likes - 1 : item.likes + 1
                } 
              : item
          )
        }
      }));
      return {previousData};
    },
     onError: (err, newTodo, context) => {
      query.setQueryData(getPostCommentKey(postId, page), context?.previousData);
    },
    onSettled: () => {
      query.invalidateQueries({ queryKey: getPostCommentKey(postId, page) });
    },
  });

  const handleLikeComment = () => {
    mutataionLikeComment.mutate();
  }

  const mutataionUnLikeComment = useMutation({
    mutationFn: () => unLikeComment(postId, comment._id),
    onMutate: async () => {
      await query.cancelQueries({queryKey: getPostCommentKey(postId, page)});
      const previousData = query.getQueryData(getPostCommentKey(postId, page));

      query.setQueryData(getPostCommentKey(postId, page), (old: any) => ({
        ...old,
        data: {
          ...old.data,
          comments: old.data.comments.map((item: any) =>
            item._id === comment._id 
              ? { 
                  ...item, 
                  likedBy: item.likedBy.includes(user?._id) 
                    ? item.likedBy.filter(id => id !== user?._id)
                    : [...item.likedBy, user?._id], 
                  likes: item.likedBy.includes(user?._id) ? item.likes - 1 : item.likes + 1
                } 
              : item
          )
        }
      }));
      return {previousData};
    },
     onError: (err, newTodo, context) => {
      query.setQueryData(getPostCommentKey(postId, page), context?.previousData);
    },
    onSettled: () => {
      query.invalidateQueries({ queryKey: getPostCommentKey(postId, page) });
    },
  });

  const handleUnLikeComment = () => {
    mutataionUnLikeComment.mutate();
  }

  const mutationDeleteComment = useMutation({
    mutationFn: () => deleteComment(postId, comment._id),
    onSuccess: () => {
      query.invalidateQueries({queryKey: getPostCommentKey(postId, page)});
      query.invalidateQueries({queryKey: getPostsNewfeedKey(page)})
    },
    onError: (error) => {
      toast.error(error.message);
    }
  })

  const handleDeleteComment = () => {
    mutationDeleteComment.mutate();
  }

  const {data: repliesData, isFetching: isFetchingReplies, refetch: refetchReplies} = useQuery({
    queryKey: getRepliesCommentKey(postId, comment._id, page),
    queryFn: () => getRepliesComment(postId, comment._id),
    retry: 3,
    enabled: false
  })

  const hanldeShowReplies = () => {
    refetchReplies();
    setOpenRepliesComment(true);
  }

  const mutationEditComment = useMutation({
    mutationFn: (data) => editComment(postId, comment._id, data),
    onSuccess: () => {
      query.invalidateQueries({queryKey: getPostCommentKey(postId, page)});
    }
  })
  const onSubmitEditComment = (data) => {
    mutationEditComment.mutate(data);
    setOpenEditComment(false);
  }

  const handleReply = () => {
    setCommentId(comment._id);
    setIsReply(true);
    setFocus("content");
    setValue("content", `@${comment.userId.username} `);
    setTimeout(() => {
    const input = document.querySelector('input[name="content"]');
    if (input instanceof HTMLInputElement) {
      const length = input.value.length;
      input.setSelectionRange(length, length); //bôi đen vị trí
    }
  }, 0);
  }
  return (
    <div className=''>
      <div className='flex justify-between items-center'>
        <div className={`flex gap-2 my-2`}>
          <Avatar className='w-10 h-10'>
            <AvatarImage src={userData?.profilePicture ? `${BASE_URL}${userData?.profilePicture}` : "/common_img/meme-hai-1.jpg"} className="w-full h-full object-cover"/>
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <div className='flex flex-col justify-center'>
            <h4 className='text-black font-semibold text-[14px] hover:cursor-pointer' onClick={handleClickUser}>
              {userData?.data?.username}
              <span className='font-light ml-3'>{comment?.content}</span>
            </h4>
            <div className='flex gap-3 items-center text-[12px] text-gray-500 font-300'>
              <span>{calcTimeToNow(comment?.createdAt)}</span>
              <Button className='bg-transparent hover:bg-transparent hover:cursor-pointer text-gray-500 text-[12px] outline-none' onClick={handleReply}>Reply</Button>
              {userData?.data?._id === user?._id && <div className='hover:cursor-pointer'>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className='hover:bg-transparent hover:cursor-pointer'><DotIcon/></Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    side='bottom'
                    align='start'
                    className='p-0'
                  >
                    <DropdownMenuGroup>
                      <DropdownMenuItem className='hover:cursor-pointer' onClick={() => setOpenEditComment(true)}>Edit</DropdownMenuItem>
                    </DropdownMenuGroup>
                    <DropdownMenuSeparator className='m-0'/>
                    <DropdownMenuItem className='text-red-500 hover:cursor-pointer' onClick={handleDeleteComment}>Delete</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                <Dialog open={openEditComment} onOpenChange={setOpenEditComment}>
                  <DialogHeader className='sr-only'>
                    <DialogTitle></DialogTitle>
                  </DialogHeader>
                  <DialogContent className='p-8'>
                    <form action="" className='flex flex-col gap-3' onSubmit={handleSubmit(onSubmitEditComment)}>
                      <label htmlFor="edit-comment" className='font-semibold'>Edit comment</label>
                      <textarea className='border-2' rows={5} {...register("content", { required: "Bạn cần nhập gì đó!" })}placeholder='Edit your comment...' id="edit-comment"></textarea>
                      <Button className={`${isValid ? "bg-insta-blue" : "bg-blue-300"}  hover:bg-blue-300 hover:cursor-pointer`} disabled={!isValid}>Save</Button>
                    </form>
                  </DialogContent>
                </Dialog>
              </div>}
            </div>
          </div>
        </div>
  
        {
          comment?.likedBy.includes(user?._id) ? <div className='hover:cursor-pointer' onClick={handleUnLikeComment}><LikeIcon /></div> : <div className='hover:cursor-pointer' onClick={handleLikeComment}><UnLikeIcon /></div>
        }
      </div>

      <div className='ml-16'>
        {openRepliesComment && repliesData?.data?.replies?.length > 0 &&  <div className='flex flex-col gap-5'>{comment?.replies?.map(reply => <ReplyComment key={reply._id} reply={reply}/>)}</div>}
        {!openRepliesComment && comment?.replies?.length > 0 && <button className='flex gap-1 items-center hover:bg-transparent hover:cursor-pointer p-0 m-0' onClick={hanldeShowReplies}>
          <div className='w-4 h-[0.5px] bg-gray-500'></div>
          <span className='text-[12px] text-gray-500'>View replies</span>
          {isFetchingReplies && <Spinner width='w-5' border="border-2 border-insta-blue"/>}
        </button> }
        { openRepliesComment && repliesData?.data?.replies?.length > 0 &&  <button className='flex gap-1 items-center mt-3 hover:bg-transparent hover:cursor-pointer p-0 m-0' onClick={() => setOpenRepliesComment(false)}>
          <div className='w-4 h-[0.5px] bg-gray-500'></div>
          <span className='text-[12px] text-gray-500'>Hide replies</span>
        </button>}
      </div>
    </div>
  )
}
