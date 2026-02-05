import { getConversations, markAsReadMessage } from '@/services/messageService'
import { getConversationsKey } from '@/cache_keys/messageKey'
import { useInfiniteQuery } from '@tanstack/react-query'
import { useAuth } from '@/stores/authStore'
import { SearchIcon, SearchUserToMessage } from '@/components/InstagramIcon'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { NavLink, useParams } from 'react-router-dom'
import calcTimeToNow from '@/utils/calcTimeToNow'
import { useEffect, useRef } from 'react'
import React, {useState} from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { searchUserKey } from '@/cache_keys/searchKey'
import useDebounce from '@/hooks/useDebounce';
import { searchUser } from '@/services/searchService'
import { useQuery } from '@tanstack/react-query'
import Skeleton from "@/components/Skeleton/Skeleton"
import { useNavigate } from 'react-router-dom'
import { getOrCreateConversation } from '@/services/messageService'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast, Toaster } from 'sonner';

const BASE_URL = import.meta.env.VITE_BASE_URL;

export default function MessageSidebar() {
  const {user} = useAuth();
  const listRef = useRef(null);
  const param = useParams();

  const {data: conversationData, isFetchingNextPage, hasNextPage} = useInfiniteQuery({
    queryKey: getConversationsKey,
    queryFn: getConversations,
    getNextPageParam: (lastPage) => {
      
    }
  });

  const query = useQueryClient();
  const [value, setValue] = useState<string>("");
  const debounceValue = useDebounce<string>(value, 500);
  const [openSearch, setOpenSearch] = useState<boolean>(false);

  const navigate = useNavigate();
  const {data: searchUserData, isFetching: isFetchingSearchUser} = useQuery({
    queryKey: searchUserKey(debounceValue),
    queryFn: () => searchUser(debounceValue),
    retry: 3,
    enabled: !!debounceValue
  })

  const mutationGetOrCreateConversation = useMutation({
    mutationFn: (userId) => getOrCreateConversation(userId),
    onSuccess: (data, userId) => {
      setOpenSearch(false);
      navigate(`/message-detail/${userId}?conversationId=${data.data._id}`);
      query.invalidateQueries({queryKey: getConversationsKey});
    }
  })

  const handleClickSearchUser = (e: React.MouseEvent<HTMLDivElement>) => {
    const userId = e.currentTarget.dataset.id;
    mutationGetOrCreateConversation.mutate(userId);
  }

  const mutationMarkAsRead = useMutation({
    mutationFn: (messageId) => markAsReadMessage(messageId),
    onSuccess: () => {
      query.invalidateQueries({queryKey: getConversationsKey});
    },
    onError: (error) => {
      toast.error(error.message);
    }
  });

  const handleMarkAsRead = (messageId: string, data) => {
    if(!messageId || data?.unreadCount <= 0) return;
    mutationMarkAsRead.mutate(messageId);
  }

  useEffect(() => {
    const activeElement = listRef.current?.querySelector('.active');
    if (activeElement) {
      activeElement.scrollIntoView({
        behavior: 'smooth',
        block: 'center',  
      });
    }
  });

  return (
    <div className='px-4 border'>
      <div className='w-100 bg-white h-screen'>
        <div className='flex justify-between pt-9 px-6 pb-3 items-center'>
          <h1 className='font-semibold text-xl'>{user?.username}</h1>
          <div onClick={() => setOpenSearch(true)} className='hover:cursor-pointer'><SearchUserToMessage /></div>
        </div>
        <div className='relative h-12 py-1 px-4'>
          <div className='absolute top-1/2 -translate-y-1/2 left-8'><SearchIcon color='#bbb'/></div>
          <input type="text" placeholder='Search...' className='w-full h-full border-none outline-[0.5px] rounded-2xl overflow-hidden bg-gray-100 pl-13 pr-4'/>
        </div>
        <div className='flex justify-between mt-10 px-4 items-center'>
          <h2 className='font-semibold text-[16px]'>Messages</h2>
          <a href='#' className='text-gray-500'>Request</a>
        </div>

        <div className='mt-6 pb-6 h-140 overflow-auto' ref={listRef}>
          {
          conversationData?.pages?.map(page => {
            return page.data.conversations.map(data => {
              const userConversationData = data?.participants?.find(userConversation => userConversation._id !== user._id);
            return (
                  <NavLink key={data?._id} to={`/message-detail/${userConversationData?._id}?conversationId=${data?._id}`} className={({isActive}) => `flex mt-2 gap-2 relative p-2
                    ${data?.unreadCount > 0 ? "bg-gray-200" : ""}
                    ${isActive ? "bg-gray-200 active": ""}
                  `}
                  onClick={() => handleMarkAsRead(data?.lastMessage?._id, data)}
                >
                <Avatar className='w-12 h-12'>
                  <AvatarImage src={userConversationData?.profilePicture ? `${BASE_URL}${userConversationData?.profilePicture}` : "/common_img/meme-hai-1.jpg"} className="w-full h-full object-cover"/>
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>
                <div className='flex flex-col justify-center gap-1'>
                  <h4 className='text-black font-semibold text-[14px] hover:cursor-pointer'>
                    {userConversationData?.username}
                  </h4>
                  <div className='text-[12px] text-gray-500 font-200 flex gap-2'>
                    {data?.lastMessage ? 
                      (
                        <>
                          <p>
                            {data?.lastMessage?.senderId === user?._id ? <strong className='font-semibold'>You: </strong> : ""}
                            <span className={`${data?.unreadCount > 0 ? "font-bold text-black" : ""}`}>{data?.lastMessage?.content}</span>
                          </p>
                          <span> · </span>
                          <p>{calcTimeToNow(data?.lastMessage?.createdAt)}</p>
                        </>
                      ) 
                      : 
                      <p>Start a conversation</p>
                    }
                  </div>
                </div>
                {data?.unreadCount > 0 && <div className='absolute top-0 -translate-y-1/2 right-3
                  w-5 text-[12px] aspect-square bg-red-500 text-white rounded-full flex items-center justify-center'>{data?.unreadCount}</div>}
              </NavLink>
            )
          });
          })
          }
        </div>
      </div>

      <Dialog open={openSearch} onOpenChange={setOpenSearch}>
        <DialogContent className='p-0 gap-0'>
          <DialogHeader className='sr-only'>
            <DialogTitle>New message</DialogTitle>
            <DialogDescription>
            </DialogDescription>
          </DialogHeader>
          <h1 className='text-center font-semibold text-lg pt-6 pb-2'>New message</h1>
          <div className='border px-3 flex items-center'>
            <span className='font-semibold'>To:</span>
            <input type="text" className='flex-1 outline-none py-2 pl-4 pr-2' placeholder='Search...' value={value} onChange={(e) => setValue(e.target.value)}/>
          </div>
          <div className='flex flex-col py-2 items-center overflow-y-auto h-137'>
            {isFetchingSearchUser && Array(10).fill(0).map((_, index) => <Skeleton key={index}/>)}
            {debounceValue ? (
              searchUserData?.data?.lenghth > 0 ? (searchUserData?.data?.map(data => (
              <div key={data._id} data-id={data._id} className='flex w-full items-center justify-between px-4 py-2 rounded-md hover:bg-gray-100 hover:cursor-pointer' onClick={handleClickSearchUser}>
                <div className='flex gap-2 w-full items-center'>
                  <Avatar className='w-9 h-9 rounded-full overflow-hidden'>
                    <AvatarImage
                      src={data?.profilePicture ? `${BASE_URL}${data?.profilePicture}` : "/common_img/meme-hai-1.jpg"}
                      alt="@shadcn"
                      className="object-cover w-full h-full"
                    />
                    <AvatarFallback>{data?.username?.slice(0,1)}</AvatarFallback>
                  </Avatar>
                  <div className='flex flex-col justify-center'>
                    <h4 className='text-black font-semibold text-[15px]'>{data?.username}</h4>
                    <p className='text-gray-500 font-200 text-[12px]'>{data?.fullName}</p>
                  </div>
                </div>
              </div>
            ))) : (!isFetchingSearchUser && <p className='text-red-500 font-semibold mt-6'>User not found</p>)
            ) : <p className='text-gray-500 font-semibold mt-6'>Get conversations</p>}
          </div>
        </DialogContent>
      </Dialog>
      <Toaster position='top-right' richColors/>
    </div>
  )
}
