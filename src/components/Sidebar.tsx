import React, {useState} from 'react'
import { NavLink, useNavigate, Link } from 'react-router-dom';
import { HomeIcon, InstagramIcon, MessageIcon, SearchIcon, ExploreIcon, NotifyIcon, CreateIcon, MoreIcon, ReelIcon, } from './InstagramIcon';
import { Button } from "@/components/ui/button"
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
import { Input } from './ui/input';
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useAuth } from '@/stores/authStore';
import { handleLogout } from '@/services/httpRequest';
import { useForm } from "react-hook-form"
import {Form } from "../components/ui/form"
import { FloatingInput } from '@/components/FloatingInput'
import Footer from '@/components/Footer'
import Spinner from '@/components/Spinner';
import { zodResolver } from '@hookform/resolvers/zod';
import { changePassword } from '@/services/userServices';
import { 
  searchUser, 
  type searchHitoryPayload, 
  searchHitory, 
  getSearchHistory, 
  deleteItemHistory,
  deleteAllHistory
} from '@/services/searchService';
import { ChangePasswordValues, changePasswordSchema } from '@/schemas/editProfileSchema';
import { useMutation, useQueries, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast, Toaster } from 'sonner';
import useDebounce from '@/hooks/useDebounce';
import { searchUserKey, getSearchHistoryKey } from '@/cache_keys/searchKey';
import { X } from 'lucide-react';
import Loading from './Loading';

const BASE_URL = import.meta.env.VITE_BASE_URL;

export default function Sidebar() {
  const query = useQueryClient();
  const { user } = useAuth();
  const [value, setValue] = useState<string>("");
  const [openSearch, setOpenSearch] = useState<boolean>(false);
  const [openChangePassword, setOpenChangePassword] = useState(false);
  const debounceValue = useDebounce<string>(value, 500);
  const navigate = useNavigate();

  const navList = [
    {
      id: 1,
      to: "/",
      Icon: HomeIcon,
      title: "Home"
    },
    {
      id: 2,
      to: "/reels",
      Icon: ReelIcon,
      title: "Reels"
    },
    {
      id: 3,
      to: "/message",
      Icon: MessageIcon,
      title: "Messages"
    },
    {
      id: 4,
      to: "/explore",
      Icon: ExploreIcon,
      title: "Explore"
    },
  ]

  const form = useForm<ChangePasswordValues>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: ""
    }
  })

  const mutation = useMutation({
    mutationFn: (payload) => changePassword(payload),
    onSuccess: () => {
      toast.success("Thay đổi mật khẩu thành công");
      setOpenChangePassword(false);
      form.reset();
    },
    onError: (error) => {
      toast.error(error.message);
    }
  })

  const onSubmit = (data) => {
    mutation.mutate(data);    
  }

  const {data: searchUserData, isFetching: isFetchingSearchUser, refetch} = useQuery({
    queryKey: searchUserKey(debounceValue),
    queryFn: () => searchUser(debounceValue),
    retry: 3,
    enabled: !!debounceValue
  })

  const mutationClickUser = useMutation({
    mutationFn: (payload: searchHitoryPayload) => searchHitory(payload),
    onSuccess: ({data}) => {
      const id = data.searchedUserId;
      navigate(`/user/${id}`);
      setOpenSearch(false);
      setValue("");
      query.invalidateQueries({queryKey: getSearchHistoryKey});
    },
    onError: (error) => {
      toast.error(error.message);
    }
  })

  const handlePostSearch = (e: React.MouseEvent<HTMLDivElement>) => {
    const id = e.currentTarget.dataset.id;
    if(typeof id === "string" && typeof debounceValue === "string" && debounceValue) {
      mutationClickUser.mutate({
        searchedUserId: id,
        searchQuery: debounceValue
      });
      return;
    }
  }

  const {data: searchHistory, isFetching: isFetchingSearchHistory} = useQuery({
    queryKey: getSearchHistoryKey,
    queryFn: getSearchHistory,
    enabled: !!openSearch,
    retry: 3
  })

  const handleClickUser = (e: React.MouseEvent<HTMLDivElement>) => {
    const id = e.currentTarget.dataset.id;
    if(typeof id === "string") {
      navigate(`/user/${id}`);
      setOpenSearch(false);
      setValue("");
    }
  }

  const mutationDeleteItemHistory = useMutation({
    mutationFn: (id: string) => deleteItemHistory(id),
    onSuccess: () => {
      query.invalidateQueries({queryKey: getSearchHistoryKey});
    },
    onError: (error) => {
      toast.error(error.message);
    },
  })

  const handleDeleteItemHistory = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    const id = e.currentTarget.dataset.deleteId;
    mutationDeleteItemHistory.mutate(id);
  }

  const mutationDeleteAllHistory = useMutation({
    mutationFn: deleteAllHistory,
    onSuccess: () => {
      query.invalidateQueries({queryKey: getSearchHistoryKey});
    },
    onError: (error) => {
      toast.error(error.message);
    },
  })

  const handleDeleteAllHistory = () => {
    mutationDeleteAllHistory.mutate();
  }
  return (
    <aside className="fixed top-0 bottom-0 left-0 w-64 border-r h-screen p-4 shadow-lg z-40">
      <nav className='flex flex-col justify-between py-4 h-full'>
        <Link to="/" className='pl-3'><InstagramIcon /></Link>
        <div className='flex-1 flex justify-center gap-4 flex-col'>
          {navList.map(item => (
            <NavLink 
              key={item.id} 
              to={item.to} 
              className={({ isActive }) => 
                `w-full flex items-center gap-4 p-3 rounded-lg transition-all ${isActive ? "bg-gray-300" : "hover:bg-gray-200"}`
              }
            >
              {({ isActive }) => (
                <>
                  <item.Icon key={item.id}/>
                  <span className={`${isActive ? "text-black font-bold" : "text-black font-normal"}`}>
                    {item.title}
                  </span>
                </>
              )}
            </NavLink>
          ))}
          <div className='p-3 rounded-lg transition-all hover:bg-gray-200 hover:cursor-pointer'>
            <Sheet open={openSearch} onOpenChange={setOpenSearch}>
              <SheetTrigger className='w-full flex items-center hover:cursor-pointer gap-4'>
                <SearchIcon />
                Search
              </SheetTrigger>
              <SheetContent side='left' className='px-4 pt-6 pb-2 sm:max-w-115'>
                <SheetHeader>
                  <SheetTitle className='pt-3 pl-6 pr-3 pb-9 text-2xl font-semibold'>Search</SheetTitle>
                  <SheetDescription asChild>
                    <div>
                      <Input className='rounded-2xl bg-gray-100 focus-visible:ring-0' value={value} onChange={(e) => setValue(e.target.value)} placeholder='Search'/>
                      <div className='flex justify-between items-center px-3 mt-4 mb-4'>
                        <h3>Recent</h3>
                        <Button className='bg-transparent text-insta-blue p-0 hover:bg-transparent hover:cursor-pointer' onClick={handleDeleteAllHistory}>Clear all</Button>
                      </div>
                      <div className='flex flex-col gap-2 items-center overflow-y-auto max-h-137'>
                        {(isFetchingSearchUser)
                        ? 
                        <Spinner width='w-8' border='border-2 border-insta-blue' position='mt-50'/>
                        :
                       (searchUserData && (!searchUserData?.data?.length 
                        ? 
                          <p className='text-center mt-50 font-semibold text-red-500'>User not found</p> 
                        : 
                         <>
                          {searchUserData?.data?.map(data => (
                            <div key={data._id} data-id={data._id} className='flex w-full items-center justify-between py-3 px-4 rounded-md hover:bg-gray-100 hover:cursor-pointer' onClick={handlePostSearch}>
                              <div className='flex gap-2 w-full items-center'>
                                <Avatar className='w-11 h-11 rounded-full overflow-hidden'>
                                  <AvatarImage
                                    src={data?.profilePicture ? `${BASE_URL}${data?.profilePicture}` : "/common_img/meme-hai-1.jpg"}
                                    alt="@shadcn"
                                    className="object-cover w-full h-full"
                                  />
                                  <AvatarFallback>{data?.username?.slice(0,1)}</AvatarFallback>
                                </Avatar>
                                <div className='flex flex-col justify-center'>
                                  <h4 className='text-black font-semibold'>{data?.username}</h4>
                                  <p>{data?.fullName}</p>
                                </div>
                              </div>
                            </div>
                          ))}
                         </>
                        ) 
                        ||
                        (searchHistory && (!searchHistory?.data?.length 
                        ? 
                          <p className='text-center mt-50 font-semibold text-red-500'>No recent searches</p> 
                        : 
                         <>
                          {searchHistory?.data?.map(data => (
                            <div key={data.searchedUserId._id} data-id={data.searchedUserId._id} className='flex w-full items-center justify-between py-3 px-4 rounded-md hover:bg-gray-100 hover:cursor-pointer' onClick={handleClickUser}>
                              <div className='flex gap-2 w-full items-center'>
                                <Avatar className='w-11 h-11 rounded-full overflow-hidden'>
                                  <AvatarImage
                                    src={data?.searchedUserId.profilePicture ? `${BASE_URL}${data?.searchedUserId?.profilePicture}` : "/common_img/meme-hai-1.jpg"}
                                    alt="@shadcn"
                                    className="object-cover w-full h-full"
                                  />
                                  <AvatarFallback>{data?.searchedUserId?.username?.slice(0,1)}</AvatarFallback>
                                </Avatar>
                                <div className='flex flex-col justify-center'>
                                  <h4 className='text-black font-semibold'>{data?.searchedUserId?.username}</h4>
                                  <p>{data?.searchedUserId?.fullName}</p>
                                </div>
                              </div>
                              <div data-delete-id={data._id} onClick={handleDeleteItemHistory}><X /></div>
                            </div>
                          ))}
                         </>
                        ) )
                      )
                      }
                      </div>
                    </div>
                  </SheetDescription>
                </SheetHeader>
              </SheetContent>
            </Sheet>
          </div>
          <div className='flex items-center gap-4 p-3 rounded-lg transition-all hover:bg-gray-200 hover:cursor-pointer'>
            <NotifyIcon />
            <span>Notifications</span>
          </div>
          <div className='flex items-center gap-4 p-3 rounded-lg transition-all hover:bg-gray-200 hover:cursor-pointer'>
            <CreateIcon />
            <span>Create</span>
          </div>
          <NavLink to={`/user/${user?._id}`} className={({ isActive }) => `flex items-center gap-4 p-3 rounded-lg transition-all ${isActive ? "font-bold bg-gray-300" : "hover:bg-gray-200"}`
              }>
            <Avatar>
              <AvatarImage
                src={user?.profilePicture ? `${BASE_URL}${user?.profilePicture}` : "/common_img/meme-hai-1.jpg"}
                alt="@shadcn"
                className="object-cover"
              />
              <AvatarFallback>{user?.username.slice(0,1)}</AvatarFallback>
            </Avatar>
            <span>Profile</span>
          </NavLink>
        </div>
        <div className='flex items-center gap-4 p-3 rounded-lg transition-all hover:bg-gray-200 hover:cursor-pointer'>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button className='w-full outline-none! bg-transparent text-black border-none! shadow-none hover:bg-transparent hover:cursor-pointer flex items-center justify-start gap-4 p-0! text-[18px] font-light focus-visible:ring-[0]'><MoreIcon />More</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent 
                side="top"    
                align="end"  
                sideOffset={20}
            >
              <DropdownMenuGroup>
                <DropdownMenuItem className='hover:cursor-pointer px-3 py-2 text-md'>Xem bài viết đã lưu</DropdownMenuItem>
                <DropdownMenuItem className='hover:cursor-pointer px-3 py-2 text-md' onClick={() => setOpenChangePassword(true)}>Đổi mật khẩu</DropdownMenuItem>
                <DropdownMenuItem className='hover:cursor-pointer px-3 py-2 text-md text-red-500' onClick={handleLogout}>Đăng xuất</DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
          <Dialog open={openChangePassword} onOpenChange={() => {
            setOpenChangePassword(false);
            form.reset();
          }}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Đổi mật khẩu</DialogTitle>
                <DialogDescription>
                  Mật khẩu phải chứa tối thiểu 8 kí tự, 1 chữ cái in hoa, 1 chữ cái in thường
                </DialogDescription>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)}>
                    <div>
                      <FloatingInput 
                        control={form.control} 
                        name="currentPassword" 
                        label='Current password'
                        type='password'
                      />
                    </div>
                    <div>
                      <FloatingInput 
                        control={form.control} 
                        name="newPassword" 
                        label='New password'
                        type='password'
                      />
                    </div>
                    <div>
                      <FloatingInput 
                        control={form.control} 
                        name="confirmPassword" 
                        label='Confirm password'
                        type='password'
                      />
                    </div>
                    <Button type="submit" 
                      className={`w-full ${mutation.isPending ? "bg-blue-300 cursor-none" : "bg-insta-blue"} hover:bg-blue-700 mt-4 py-6 rounded-full transtion-all duration-150 hover:cursor-pointer text-white`} disabled={mutation.isPending}>
                        {mutation.isPending ? <Spinner width='w-5' border='border-2 border-white'/> : "Submit"}
                    </Button>
                  </form>
                </Form>
              </DialogHeader>
            </DialogContent>
          </Dialog>
        </div>
      </nav>
      <Toaster position='top-right' richColors />
    </aside>
  )
}