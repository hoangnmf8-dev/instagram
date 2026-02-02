import React from 'react'
import { UnLikeIcon, LikeIcon, CommentIcon, SaveIcon, UnSaveIcon } from '../InstagramIcon'
import { getPostsNewfeed, likePost, savePost, unLikePost, unSavePost } from '@/services/postService'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { getPostsNewfeedKey } from '@/cache_keys/postsKey'

type Props = {
  comments: number 
  likes: number 
  isLiked: boolean
  isSaved: boolean
  likedBy: string[]
  savedBy: string[],
  userData: any,
  caption: string,
  postId: string,
  setOpenPostDetail: (value: boolean) => void,
  page: string
}
export default function PostAction({comments, likes, isLiked, isSaved, likedBy, savedBy, userData, caption, postId, setOpenPostDetail, page}: Props) {
  const query = useQueryClient();
  const mutationLikePost = useMutation({
  mutationFn: (id) => likePost(id),
  onMutate: async (postId) => {
    await query.cancelQueries({ queryKey: getPostsNewfeedKey(page) });
    const previousPosts = query.getQueryData(getPostsNewfeedKey(page));
    query.setQueryData(getPostsNewfeedKey(page), (old: any) => ({
      ...old,
      pages: old.pages.map((page: any) => ({
        ...page,
        data: {
          ...page.data,
          posts: page.data.posts.map((p: any) =>
            p._id === postId ? { ...p, isLiked: true, likes: p.likes + 1 } : p
          ),
        },
      })),
    }));
    return { previousPosts };
  },
  onError: (err, newTodo, context) => {
    query.setQueryData(getPostsNewfeedKey(page), context?.previousPosts);
  },
  onSettled: () => {
    query.invalidateQueries({ queryKey: getPostsNewfeedKey(page) });
  },
  });
  const mutationUnLikePost = useMutation({
    mutationFn: (id) => unLikePost(id),
    onMutate: async (postId) => {
    await query.cancelQueries({ queryKey: getPostsNewfeedKey(page) });
    const previousPosts = query.getQueryData(getPostsNewfeedKey(page));
    query.setQueryData(getPostsNewfeedKey(page), (old: any) => ({
      ...old,
      pages: old.pages.map((page: any) => ({
        ...page,
        data: {
          ...page.data,
          posts: page.data.posts.map((p: any) =>
            p._id === postId ? { ...p, isLiked: false, likes: p.likes - 1 } : p
          ),
        },
      })),
    }));
    return { previousPosts };
  },
  onError: (err, newTodo, context) => {
    query.setQueryData(getPostsNewfeedKey(page), context?.previousPosts);
  },
  onSettled: () => {
    query.invalidateQueries({ queryKey: getPostsNewfeedKey(page) });
  },
  });
  const mutationSavePost = useMutation({
    mutationFn: (id) => savePost(id),
    onMutate: async (postId) => {
    await query.cancelQueries({ queryKey: getPostsNewfeedKey(page) });
    const previousPosts = query.getQueryData(getPostsNewfeedKey(page));
    query.setQueryData(getPostsNewfeedKey(page), (old: any) => ({
      ...old,
      pages: old.pages.map((page: any) => ({
        ...page,
        data: {
          ...page.data,
          posts: page.data.posts.map((p: any) =>
            p._id === postId ? { ...p, isSaved: true } : p
          ),
        },
      })),
    }));
    return { previousPosts };
  },
  onError: (err, newTodo, context) => {
    query.setQueryData(getPostsNewfeedKey(page), context?.previousPosts);
  },
  onSettled: () => {
    query.invalidateQueries({ queryKey: getPostsNewfeedKey(page) });
  },
  });
  const mutationUnSavePost = useMutation({
    mutationFn: (id) => unSavePost(id),
    onMutate: async (postId) => {
    await query.cancelQueries({ queryKey: getPostsNewfeedKey(page) });
    const previousPosts = query.getQueryData(getPostsNewfeedKey(page));
    query.setQueryData(getPostsNewfeedKey(page), (old: any) => ({
      ...old,
      pages: old.pages.map((page: any) => ({
        ...page,
        data: {
          ...page.data,
          posts: page.data.posts.map((p: any) =>
            p._id === postId ? { ...p, isSaved: false } : p
          ),
        },
      })),
    }));
    return { previousPosts };
  },
  onError: (err, newTodo, context) => {
    query.setQueryData(getPostsNewfeedKey(page), context?.previousPosts);
  },
  onSettled: () => {
    query.invalidateQueries({ queryKey: getPostsNewfeedKey(page) });
  },
  });
  const handleLikePost = () => {
    mutationLikePost.mutate(postId);
  }
  const handleUnLikePost = () => {
    mutationUnLikePost.mutate(postId);
  }
  const handleSavePost = () => {
    mutationSavePost.mutate(postId);
  }
  const handleUnSavePost = () => {
    mutationUnSavePost.mutate(postId);
  }
  return (
    <div className='mt-4 px-3'>
      <div className='flex justify-between items-center'>
        <div className='flex items-center gap-4'>
          <div className='flex items-center gap-2 hover:cursor-pointer'>
            {isLiked ? <div onClick={handleUnLikePost}><LikeIcon/></div> : <div onClick={handleLikePost}><UnLikeIcon /></div>}
            <span>{likes}</span>
          </div>
          <div className='flex items-center gap-2 hover:cursor-pointer'>
            <div onClick={() => setOpenPostDetail(true)}><CommentIcon /></div>
            <span>{comments}</span>
          </div>
        </div>
        <div className='hover:cursor-pointer'>
          {isSaved ? <div onClick={handleUnSavePost}><SaveIcon/></div> : <div onClick={handleSavePost}><UnSaveIcon /></div>}
        </div>
      </div>

      <div className='mt-4 flex gap-2 items-center'>
        <h4 className='text-[14px] font-semibold'>{userData?.data?.username}</h4>
        <span>{caption}</span>
      </div>
    </div>
  )
}
