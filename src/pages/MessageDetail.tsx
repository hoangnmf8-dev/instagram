import { getConversationsKey, getMessageInConversationKey } from '@/cache_keys/messageKey'
import { getMessageInConversation, markAsReadMessage, sendImageMessage, sendTextMessage } from '@/services/messageService';
import { useAuth } from '@/stores/authStore';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useLocation, useNavigate } from 'react-router-dom'
import UserInfo from '@/components/UserInfo';
import { getUserProfile } from '@/services/userServices';
import { userProfileKey } from '@/cache_keys/userKey';
import { NoteIcon } from '@/components/InstagramIcon';
import Loading from '@/components/Loading';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from '@/components/ui/button';
import calcTimeToNow, { isCloseToEachOther } from '@/utils/calcTimeToNow';
import { ImagePlus, X } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { sendMessageSchema, type sendMessageSchemaValues } from '@/schemas/sendMessageSchema';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast, Toaster } from 'sonner';
import { useEffect, useRef, useState, use } from 'react';
import Spinner from '@/components/Spinner';
import { SocketContext } from '@/layouts/MessageLayout';
import TypingIndicator from '@/components/TypingIndicator';
const BASE_URL = import.meta.env.VITE_BASE_URL;

export default function MessageDetail() {
  const socket = use(SocketContext);
  const query = useQueryClient();
  const location = useLocation();
  const conversationIdFromUrl = location.search.replace("?conversationId=", "");
  const {user} = useAuth();
  const navigate = useNavigate();
  const messageBoxRef = useRef<HTMLDivElement>(null);
  const lastMessageRef = useRef<HTMLDivElement>(null);
  const [preview, setPreview] = useState<string>("");
  const [isShowTyping, setShowTyping] = useState<boolean>(false);

  let stopTyping = useRef<number | null>(null);

  const {data: messageData, isLoading} = useQuery({
    queryKey: getMessageInConversationKey(location.search.replace("?conversationId=", "")),
    queryFn: () => getMessageInConversation(location.search.replace("?conversationId=", "")),
    retry: 3
  });

  const {data: otherUserData, isLoading: isLoadingOtherUserData} = useQuery({
    queryKey: userProfileKey(location.pathname.replace("/message-detail/", "")),
    queryFn: () => getUserProfile(location.pathname.replace("/message-detail/", "")),
    retry: 3
  });

  const formSendMessage = useForm<sendMessageSchemaValues>({
    resolver: zodResolver(sendMessageSchema),
    defaultValues: {
      image: undefined,
      content: ""
    }
  })

  const mutationSendTextMessage = useMutation({
    mutationFn: (payload) => sendTextMessage(payload),
    onSuccess: () => {
      query.invalidateQueries({queryKey: getMessageInConversationKey(location.search.replace("?conversationId=", ""))});
      query.invalidateQueries({queryKey: getConversationsKey});
      formSendMessage.setValue("content","");
      setPreview("");
    },
    onError: (error) => {
      toast.error(error.message);
    }
  })

  const mutationSendImageMessage = useMutation({
    mutationFn: (payload) => sendImageMessage(payload),
    onSuccess: () => {
      query.invalidateQueries({queryKey: getMessageInConversationKey(location.search.replace("?conversationId=", ""))});
      query.invalidateQueries({queryKey: getConversationsKey});
      formSendMessage.setValue("content","");
      setPreview("");
    },
    onError: (error) => {
      toast.error(error.message);
    }
  })

  const onSubmit = (data) => {
    if(data.content && !preview) {
      const payload = {
        conversationId: location.search.replace("?conversationId=", ""),
        recipientId: location.pathname.replace("/message-detail/", ""),
        messageType: "text",
        content: data.content
      }
      mutationSendTextMessage.mutate(payload);
    }
    if(data.image) {
      const formData = new FormData();
      formData.append("conversationId", location.search.replace("?conversationId=", ""));
      formData.append("recipientId", location.pathname.replace("/message-detail/", ""));
      formData.append("messageType", "image");
      formData.append("image", data.image[0]);
      mutationSendImageMessage.mutate(formData);
    }
  }

  useEffect(() => {
    if(messageBoxRef.current && messageData) {
      messageBoxRef.current.scrollTo({
        top: messageBoxRef.current.scrollHeight,
        behavior: "smooth"
      })
    }
  }, [messageData])

  useEffect(() => {
    return () => {
      URL.revokeObjectURL(preview)
    };
  }, [preview])

  const mutationMarkAsRead = useMutation({
    mutationFn: (messageId) => markAsReadMessage(messageId),
    onSuccess: () => {
      query.invalidateQueries({queryKey: getConversationsKey});
    },
    onError: (error) => {
      toast.error(error.message);
    }
  });

  useEffect(() => {
    if (!socket) return;

    const handleNewMessage = async (message) => {
      if(message.conversationId === conversationIdFromUrl) {
        if (message.senderId !== user?._id) {
          mutationMarkAsRead.mutate(message._id);
        }
      }
      query.invalidateQueries({ queryKey: getConversationsKey });
      query.invalidateQueries({ 
        queryKey: getMessageInConversationKey(conversationIdFromUrl) 
      });
    };
    socket.on("new_message", handleNewMessage);
    return () => {
      socket.off("new_message", handleNewMessage);
    };
  }, [socket, conversationIdFromUrl, query]);

  const handleType = () => {
    console.log(1)
    socket?.emit("typing", {
      conversationId: conversationIdFromUrl,
      recipientId: location.pathname.replace("/message-detail/", ""),
    });

    clearTimeout(stopTyping.current);

    stopTyping.current = setTimeout(() => {
      socket?.emit("stop_typing", {
        conversationId: conversationIdFromUrl,
        recipientId: location.pathname.replace("/message-detail/", ""),
      });
    }, 500)
  }

  useEffect(() => {
    const handleTyping = ({ conversationId, userId }) => {
      if(conversationId === conversationIdFromUrl) {
        setShowTyping(true);
      }
    }
    socket.on("user_typing", handleTyping);
    const handleStopTyping = ({ conversationId, userId }) => {
      if(conversationId === conversationIdFromUrl) {
        setShowTyping(false);
      }
    }
    // Receive stop typing
    socket.on("user_stop_typing", handleStopTyping);

    return () => {
      socket?.off("user_typing", handleTyping);
      socket?.off("user_stop_typing", handleStopTyping);
    }
  }, [conversationIdFromUrl, socket]);

  return (
    <div className='flex-1 relative flex flex-col pb-14'>
      {isLoading && <Loading />}
      <div className='flex items-center justify-between p-4 border-b'>
        <UserInfo userData={otherUserData?.data} size="w-11 h-11" className='hover:cursor-pointer' onClick={() => navigate(`/user/${otherUserData?.data?._id}`)}/>
        <NoteIcon />
      </div>
      <div className='mt-5 flex-1 max-h-150 flex flex-col gap-1 items-center overflow-auto [&::-webkit-scrollbar]:hidden' ref={messageBoxRef}>
        <Avatar className="w-24 h-24">
          <AvatarImage src={otherUserData?.data?.profilePicture ? `${BASE_URL}${otherUserData?.data?.profilePicture}` : "/common_img/meme-hai-1.jpg"} className="w-full h-full object-cover"/>
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
        <h2 className='text-lg font-semibold'>{otherUserData?.data?.username}</h2>
        <p className='text-gray-500 text-md'>{otherUserData?.data?.fullName}</p>
        <Button className='mt-3 text-black bg-gray-200 hover:cursor-pointer hover:bg-gray-300' onClick={() => navigate(`/user/${otherUserData?.data?._id}`)}>View profile</Button>

        <div className='flex-1 w-full mt-6 px-4'>
          <div className='flex flex-col gap-3'>
            {messageData?.data?.messages?.map((message, index) => {
              const prevMessage = messageData?.data?.messages[index - 1];;
              const isShowTime = !prevMessage || !isCloseToEachOther(message?.createdAt, prevMessage?.createdAt); 
              return (
                <div className='flex flex-col items-center' key={message?._id} ref={index === messageData?.data?.messages?.length - 1 ? lastMessageRef : null}>
                  {isShowTime && <span className='text-gray-500 text-[12px]'>{calcTimeToNow(message?.createdAt)}</span>}
                  <div className={`${message?.senderId?._id !== user?._id ? "" : "flex-row-reverse"} flex items-center gap-2 w-full`}>
                    {
                      message?.senderId?._id !== user?._id && <Avatar>
                      <AvatarImage src={ message?.senderId?.profilePicture ? `${BASE_URL}${ message?.senderId?.profilePicture}` : "/common_img/meme-hai-1.jpg"} className="w-full h-full object-cover"/>
                      <AvatarFallback>CN</AvatarFallback>
                    </Avatar>
                    }
                    {message?.imageUrl ? <img src={`${BASE_URL}${message?.imageUrl}`} className='w-80'/> : <p className={`${message?.senderId?._id !== user?._id ? "bg-white border" : "bg-insta-blue text-white"} rounded-2xl py-2 px-4`}>{message?.content}</p>}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
      {isShowTyping && <TypingIndicator />}
      <div className={`absolute bottom-2 left-1/2 -translate-x-1/2 min-h-12 h-auto w-[95%] border rounded-2xl border-gray-500
      flex flex-col bg-white z-40 px-6 ${preview && "pt-4"}`}>
        {preview && <div className='relative w-80'>
          <img className='w-full block' src={`${preview}`} />
          <div className='absolute top-0 right-0 translate-x-1/2 -translate-y-1/2 w-6 aspect-square border rounded-full flex items-center justify-center hover:cursor-pointer' onClick={() => setPreview("")}><X className='size-4'/></div>
        </div>}
        <Form {...formSendMessage}>
          <form className='flex flex-1 gap-3 items-center' onSubmit={formSendMessage.handleSubmit(onSubmit)}>
            <FormField 
              name="image"
              control={formSendMessage.control}
              render={({field}) => (
                <FormItem>
                  <FormLabel className='hover:cursor-pointer' htmlFor='image-message'><ImagePlus /></FormLabel>
                  <FormControl>
                      <Input onChange={e => {
                        if(e.target.files) {
                          const url = URL.createObjectURL(e.target.files[0]);
                          setPreview(url);
                          field.onChange(e.target.files)
                        }
                      }} className='hidden' id="image-message" type='file'/>
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField 
              name="content"
              control={formSendMessage.control}
              render={({field}) => (
                <FormItem className='flex-1 h-full'>
                  <FormControl>
                      <Input {...field} className='h-full block border-none focus-visible:ring-0 focus-visible:ring-offset-0 shadow-none' id="text-message" type='text' autoComplete={"off"} disabled={!!preview} onChange={(e) => {
                        handleType();
                        field.onChange(e)
                      }}/>
                  </FormControl>
                </FormItem>
              )}
            />
            <Button variant={"ghost"} className={`${formSendMessage.formState.isValid ? "text-insta-blue" : "text-blue-300"} px-0 hover:bg-transparent hover:cursor-pointer`} disabled={!formSendMessage.formState.isValid}>
              {mutationSendTextMessage.isPending || mutationSendImageMessage.isPending ? <Spinner width='w-5' border="border-2 border-insta-blue"/> : "Send"}
            </Button>
          </form>
        </Form>
      </div>
      <Toaster position='top-right' richColors/>
    </div>
  )
}
