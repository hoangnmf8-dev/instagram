import React, { useEffect, useState } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useAuth } from '@/stores/authStore'
import { Field, FieldDescription, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Button } from '@/components/ui/button'
import { FormControl, FormField, FormItem, FormMessage, FormLabel } from "@/components/ui/form"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Spinner from '@/components/Spinner'
import { useForm } from 'react-hook-form'
import { zodResolver } from "@hookform/resolvers/zod"
import { Form } from "../components/ui/form"
import { FloatingInput } from '@/components/FloatingInput'
import { editProfileSchema, editProfileValues } from '@/schemas/editProfileSchema'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { editProfile } from '@/services/userServices'
import { toast, Toaster } from 'sonner'
import Loading from '@/components/Loading'
import { userProfileKey } from '@/cache_keys/userKey'
import { deleteProfilePicture } from '@/services/userServices'

const BASE_URL = import.meta.env.VITE_BASE_URL;

export default function EditProfile() {
  const queryClient = useQueryClient();

  const {user, setUser} = useAuth();
  const [preview, setPreview] = useState(user?.profilePicture ? `${BASE_URL}${user?.profilePicture}` : "common_img/meme-hai-1.jpg");

  const form = useForm<editProfileValues>({
    resolver: zodResolver(editProfileSchema),
    defaultValues: {
      fullName: user?.fullName || "",
      bio: user?.bio || "",
      website: user?.website || "",
      gender: user?.gender || "female",
      profilePicture: undefined
    }
  })

  const mutation = useMutation({
    mutationFn: (data) => editProfile(data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: userProfileKey(data.data._id) });
      toast.success("Cập nhật thông tin thành công");
      setPreview(data.data?.profilePicture ? `${BASE_URL}${data.data?.profilePicture}` : "/common_img/meme-hai-1.jpg");
      setUser(data.data);
    },
    onError: (error) => {
      toast.error(error.message);
    }
  })

  const onSubmit = (data) => {
    const formData = new FormData();
    
    if(data.fullName) formData.append("fullName", data.fullName);
    if(data.bio) formData.append("bio", data.bio);
    if(data.website) formData.append("website", data.website);
    if(data.gender) formData.append("gender", data.gender);
    
    if(data.profilePicture) formData.append("profilePicture", data.profilePicture[0]);
    mutation.mutate(formData);
  }

  const mutationDeletePicture = useMutation({
    mutationFn: deleteProfilePicture,
    onSuccess: (data) => {
      toast.success("Delete photo successfully");
      queryClient.invalidateQueries({queryKey: userProfileKey(user?._id)});
      setPreview(data.data?.profilePicture ? `${BASE_URL}${data.data?.profilePicture}` : "/common_img/meme-hai-1.jpg");
      setUser(data.data);
    },
    onError: (error) => {
      toast.error(error.message);
    }
  })

  const handleDeletePicture = () => {
    mutationDeletePicture.mutate();
  }

  useEffect(() => {
    return () => URL.revokeObjectURL(preview);
  }, [preview])
  return (
    <div className='flex-1'>
      {mutation.isPending && <Loading />}
      <div className='max-w-175 mx-auto pt-9'>
        <h1 className='text-xl font-semibold py-3 mb-4'>Edit profile</h1>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className='bg-[#f3f5f7] p-4 rounded-2xl flex items-center justify-between'>
              <div className='flex items-center gap-5'>
                <Avatar className='w-14 h-14 border border-gray-400'>
                  <AvatarImage
                    src={preview}
                    alt="@shadcn"
                    className="object-cover"
                  />
                  
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>
                <h2 className='font-semibold'>{user?.username}</h2>
              </div>
              <FormField
                control={form.control}
                name="profilePicture"
                render={({ field }) => (
                  <FormItem className='flex'>
                    <FormLabel htmlFor="picture" className='bg-[#4a5df9] text-white px-3 py-2 rounded-lg justify-center hover:cursor-pointer hover:bg-[#4a5ddf]'>Change photo</FormLabel>
                    <Button type="button" className={`${mutationDeletePicture.isPending ? "bg-[#4a5dd9]" : "bg-[#4a5df9]"} text-white px-3 py-2 rounded-lg justify-center hover:cursor-pointer hover:bg-[#4a5ddf] w-29`} onClick={handleDeletePicture} disabled={mutationDeletePicture.isPending || !user.profilePicture}>
                      {mutationDeletePicture.isPending ? <Spinner width='w-4' border="border-2 border-white" /> : "Delete photo"}
                    </Button>
                    <FormControl>
                      <Input id="picture" type="file" className='hidden' accept='image/*' onChange={(e) => {
                          const files = e.target.files;
                          if (files && files.length > 0) {
                            setPreview(URL.createObjectURL(files[0]));
                            field.onChange(files); //Chỉ truyền FileList vào để phù hợp với schema  
                          }
                        }}
                        onBlur={field.onBlur}
                        name={field.name}
                        ref={field.ref}
                      />
                    </FormControl>
                    <FormMessage/>
                  </FormItem>
                )}    
              />
            </div>
            <div className="mt-6">
              <label htmlFor='fullName' className='mb-2 block font-semibold'>Fullname</label>
              <FloatingInput 
                control={form.control} 
                name="fullName" 
                label="Full name" 
              />
            </div>
            <div className="mt-6">
              <label htmlFor='bio' className='mb-2 block font-semibold'>Bio</label>
              <FloatingInput 
                control={form.control} 
                name="bio" 
                label="Bio" 
              />
            </div>
            <div className="mt-6">
              <label htmlFor='website' className='mb-2 block font-semibold'>Website</label>
              <FloatingInput 
                control={form.control} 
                name="website" 
                label="Website" 
              />
            </div>
            <div className="mt-6">
              <FormField
                control={form.control}
                name="gender"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className='mb-2 block font-semibold'>Gender</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Female" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="female">Female</SelectItem>
                        <SelectItem value="male">Male</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <Button type="submit" 
                className={`w-full ${mutation.isPending ? "bg-blue-300 cursor-none" : "bg-insta-blue"} hover:bg-blue-700 mt-4 py-6 rounded-full transtion-all duration-150 hover:cursor-pointer text-white`} disabled={mutation.isPending}>
              {mutation.isPending ? <Spinner width='w-5' border='border-2 border-white'/> : "Submit"}
            </Button>
          </form>
        </Form>
      </div>
      <Toaster position='top-right' richColors/>
    </div>
  )
}



