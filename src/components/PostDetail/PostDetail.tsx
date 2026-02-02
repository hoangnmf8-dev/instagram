import React, { useEffect, useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { getPostsNewfeedDetailKey, getPostsNewfeedKey } from '@/cache_keys/postsKey'
import { getPostNewsFeedDetail, getPostsNewfeed, likePost, savePost, unLikePost, unSavePost } from '@/services/postService'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import PostDetailContent from './PostDetailContent'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { userProfileKey } from '@/cache_keys/userKey'
import { getUserProfile } from '@/services/userServices'
import { useNavigate } from 'react-router-dom'
import UserInfo from '../UserInfo'
import PostDetailComment from './PostDetailComment'
import { getPostComment, createComment, createRepliesComment } from '@/services/commentService'
import { getPostCommentKey, getRepliesCommentKey } from '@/cache_keys/commentKey'
import { LikeIcon, UnLikeIcon, UnSaveIcon, SaveIcon, CommentIcon, MessageIcon } from '../InstagramIcon'
import calcTimeToNow from '@/utils/calcTimeToNow'
import { Button } from '../ui/button'
import { useForm } from 'react-hook-form'
import { SkeletonAvatar } from '../SkeletonAvatar'
import { toast, Toaster } from 'sonner'
import Loading from '../Loading'
import Spinner from '../Spinner'

type Props = {
  openPostDetail: boolean,
  setOpenPostDetail: (value: boolean) => void,
  postId: string,
  page: string
}

const BASE_URL = import.meta.env.VITE_BASE_URL;

export default function PostDetail({openPostDetail, setOpenPostDetail, postId, page}: Props) {
  const query = useQueryClient();
  const [openLoading, setOpenLoading] = useState(false);
  const[isReply, setIsReply] = useState(false);
  const [commentId, setCommentId] = useState("");
  const navigte = useNavigate();

  const {data: postDetail, isLoading: isLoadingPostDetail} = useQuery({
    queryKey: getPostsNewfeedDetailKey(postId, page),
    queryFn: () => getPostNewsFeedDetail(postId),
    retry: 3,
    enabled: openPostDetail
  });

  const {data: userData} = useQuery({
    queryKey: userProfileKey(postDetail?.data?.userId?._id),
    queryFn: () => getUserProfile(postDetail?.data?.userId?._id),
    retry: 3,
    enabled: !!postDetail?.data?.userId?._id
  })

  const handleClickUser = () => {
    navigte(`user/${userData.data._id}`);
  }

  const {data: commentData, isLoading: isLoadingComment} = useQuery({
    queryKey: getPostCommentKey(postId, page),
    queryFn: () => getPostComment(postId),
    retry: 3
  })

  const {register, handleSubmit, formState: {isValid}, setValue, setFocus} = useForm({
    defaultValues: {
      content: ""
    }
  })

  const mutationCreateComment = useMutation({
    mutationFn: (payload) => createComment(payload),
    onSuccess: () => {
      query.invalidateQueries({queryKey: getPostCommentKey(postId, page)});
      query.invalidateQueries({queryKey: getPostsNewfeedKey(page)})
    },
    onError: (error) => {
      toast.error(error.message);
    }
  })

  const mutationCreateRepliesComment = useMutation({
    mutationFn: (data) => createRepliesComment(postId, commentId, data),
    onSuccess: () => {
      query.invalidateQueries({queryKey: getPostsNewfeedKey(page)});
      query.invalidateQueries({queryKey: getPostCommentKey(postId, page)});
      query.invalidateQueries({queryKey: getRepliesCommentKey(page, postId, commentId)});
    }
  })

  const onSubmit = (data) => {
    if(!isReply) {
      mutationCreateComment.mutate({
        postId,
        payload: {
          content: data.content,
          parentCommentId: null
        }
      });
      setValue("content", "");
      return;
    }
    mutationCreateRepliesComment.mutate(data);
    setValue("content", "");
    setIsReply(false);
  }

  const mutationLikePost = useMutation({
    mutationFn: () => likePost(postId),
    onSuccess: () => {
      query.invalidateQueries({queryKey: getPostsNewfeedKey(page)});
      query.invalidateQueries({queryKey: getPostsNewfeedDetailKey(postId, page)});
    }
  })

  const handleLikePost = () => {
    mutationLikePost.mutate();
  }

    const mutationUnLikePost = useMutation({
      mutationFn: () => unLikePost(postId),
      onSuccess: () => {
        query.invalidateQueries({queryKey: getPostsNewfeedKey(page)});
        query.invalidateQueries({queryKey: getPostsNewfeedDetailKey(postId, page)});
      }
    })

    const handleUnLikePost = () => {
      mutationUnLikePost.mutate();
    }

    const mutationUnSavePost = useMutation({
      mutationFn: () => unSavePost(postId),
      onSuccess: () => {
        query.invalidateQueries({queryKey: getPostsNewfeedKey(page)});
        query.invalidateQueries({queryKey: getPostsNewfeedDetailKey(postId, page)});
      }
    })

    const handleUnSavePost = () => {
      mutationUnSavePost.mutate();
    }

    const mutationSavePost = useMutation({
      mutationFn: () => savePost(postId),
      onSuccess: () => {
        query.invalidateQueries({queryKey: getPostsNewfeedKey(page)});
        query.invalidateQueries({queryKey: getPostsNewfeedDetailKey(postId, page)});
      }
    })

    const handleSavePost = () => {
      mutationSavePost.mutate();
    }

  return (
    <div>
      {postDetail?.data?.userId ? 
          (
            <Dialog open={openPostDetail} onOpenChange={setOpenPostDetail}>
              <DialogTrigger></DialogTrigger>
              <DialogContent className='sm:max-w-230 p-0 overflow-hidden border-none max-h-[90%]'>
                <DialogHeader className='sr-only'>
                  <DialogTitle/>
                  <DialogDescription/>
                </DialogHeader>
                  {!isLoadingPostDetail ? 
                    <div className='flex'>
                    <PostDetailContent mediaType={postDetail?.data?.mediaType} image={postDetail?.data?.image} video={postDetail?.data?.video}/>

                    <div className='basis-3/5'>
                      <UserInfo userData={userData?.data} onClick={handleClickUser} className='p-4 w-[70%]'/>
                      <hr className='my-2'/>
                      {postDetail?.data?.caption && <UserInfo userData={userData?.data} onClick={handleClickUser} caption={postDetail?.data?.caption} className='p-4'/>}

                      <div className='overflow-auto h-90 [&::-webkit-scrollbar]:hidden p-4'>
                        {isLoadingComment ? 
                          Array(5).fill(0).map((_, index) => <SkeletonAvatar key={index}/>)
                          :commentData?.data?.comments?.map(comment => <PostDetailComment key={comment?._id} comment={comment} postId={postId} setIsReply={setIsReply} setValue={setValue} setFocus={setFocus} setCommentId={setCommentId} page={page}/>)}
                      </div>

                      <div className='flex justify-between py-4 px-4 items-center border-t-[0.5px]'>
                        <div className='flex items-center gap-5'>
                          {postDetail?.data?.isLiked ? <div className='hover:cursor-pointer' onClick={handleUnLikePost}><LikeIcon/></div> : <div className='hover:cursor-pointer' onClick={handleLikePost}><UnLikeIcon /></div>}
                          <div className='hover:cursor-pointer'><CommentIcon /></div>
                          <div className='hover:cursor-pointer'><MessageIcon /></div>
                        </div>
                        {postDetail?.data?.isSaved ? <div className='hover:cursor-pointer' onClick={handleUnSavePost}><SaveIcon /></div> : <div className='hover:cursor-pointer' onClick={handleSavePost}><UnSaveIcon /></div>}
                      </div>

                      <div className='pb-4 px-4'>
                        <p className='font-medium'>{postDetail?.data?.likes} {postDetail?.data?.likes > 1 ? "likes" : "like"}</p>
                        <p className='text-[12px] text-gray-500'>{calcTimeToNow(postDetail?.data?.createdAt)}</p>
                      </div>

                      <form onSubmit={handleSubmit(onSubmit)} className='flex border-t-[0.5px]'>
                        <input type="text" {...register("content", { required: "Bạn cần nhập gì đó!" })} placeholder='Add a commnent...' className='border px-4 py-4 flex-1 border-none outline-none' autoComplete="off"/>
                        <button className={`${isValid ? "text-insta-blue cursor-pointer" : "text-blue-300"} px-4 py-4`} disabled={!isValid}>Post</button>
                      </form>
                    </div>
                  </div>
                  : <Spinner width="w-8" border="border-3 border-insta-blue"/>
                  }  
              </DialogContent>
            </Dialog>
          )
        :
          <Dialog open={openPostDetail} onOpenChange={setOpenPostDetail}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle className='flex justify-center'>
                  {
                    isLoadingPostDetail ?
                    <Spinner width="w-8" border="border-3 border-insta-blue"/>
                    :
                    <p className='text-red-500 font-semibold text-2xl text-center'>This article no longer exists.</p>
                  }
                </DialogTitle>
                <DialogDescription>
                </DialogDescription>
              </DialogHeader>
            </DialogContent>
          </Dialog>
      }
      <Toaster position='top-right' richColors/>
    </div> 
  )
}
