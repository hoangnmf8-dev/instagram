import React from 'react'
import { NavLink, useNavigate } from 'react-router-dom';
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useAuth } from '@/stores/authStore';
import { handleLogout } from '@/services/httpRequest';

export default function Sidebar() {
  const {setUser, setToken, user} = useAuth();
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

  return (
    <aside className="w-64 border-r h-screen p-4">
      <nav className='flex flex-col justify-between py-4 h-full'>
        <div className='pl-3'><InstagramIcon /></div>
        <div className='flex-1 flex justify-center gap-4 flex-col'>
          {navList.map(item => (
            <NavLink 
              key={item.id} 
              to={item.to} 
              className={({ isActive }) => 
                `flex items-center gap-4 p-3 rounded-lg transition-all ${isActive ? "bg-gray-300" : "hover:bg-gray-200"}`
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
          <div className='flex items-center gap-4 p-3 rounded-lg transition-all hover:bg-gray-200 hover:cursor-pointer'>
            <SearchIcon />
            <span>Search</span>
          </div>
          <div className='flex items-center gap-4 p-3 rounded-lg transition-all hover:bg-gray-200 hover:cursor-pointer'>
            <NotifyIcon />
            <span>Notifications</span>
          </div>
          <div className='flex items-center gap-4 p-3 rounded-lg transition-all hover:bg-gray-200 hover:cursor-pointer'>
            <CreateIcon />
            <span>Create</span>
          </div>
          <NavLink to="/profile" className={({ isActive }) => `flex items-center gap-4 p-3 rounded-lg transition-all ${isActive ? "font-bold bg-gray-300" : "hover:bg-gray-200"}`
              }>
            <Avatar>
              <AvatarImage
                src={user.getprofilePicture}
                alt="@shadcn"
                className="grayscale"
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
                <DropdownMenuItem className='hover:cursor-pointer px-3 py-2 text-md text-red-500' onClick={handleLogout}>Đăng xuất</DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </nav>
    </aside>
  )
}