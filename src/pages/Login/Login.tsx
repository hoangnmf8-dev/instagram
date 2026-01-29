import React from 'react'
import InstagramIcon from "../../components/InstagramIcon"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { login } from '@/services/authService'
import { Link, useNavigate } from 'react-router-dom'
import { Form } from "@/components/ui/form"
import { Button } from "@/components/ui/button"
import { loginSchema, type LoginValues } from '@/schemas/loginSchema'
import { FloatingInput } from '@/components/FloatingInput'
import { Toaster, toast } from 'sonner';
import Footer from '@/components/Footer'
import { useMutation } from '@tanstack/react-query'
import { useAuth } from '@/stores/authStore'
import Spinner from '@/components/Spinner'
import InstagramLogo from '../../components/InstagramIcon'

export default function Login() {
  const {setUser, setToken} = useAuth();
  const navigate = useNavigate();

  const mutation = useMutation({
    mutationFn: (data) => login(data),
    onSuccess: ({data}) => {
      toast.success("Đăng nhập thành công");
      setUser(data.user);
      setToken(data.tokens);
      navigate("/");
    }, 
    onError: (error) => {
      toast.error(error.message);
    }
  })

  const form = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  })

  const onSubmit = async (data: LoginValues) => {
    mutation.mutate(data);
  }
  return (
    <div className='h-screen'>
      <div className="h-full">
        <div className='flex h-[90%] border-b border-b-devider'>
          <div className="basis-3/5 flex flex-col pt-10 border-r-3 border-r-devider px-20">
            <InstagramLogo size={100}/>
            <h1 className="text-[2.8vw] text-center mt-7.5 px-5">See everyday moments from your <span className='text-transparent bg-clip-text bg-linear-to-r from-[#ff5c00] via-[#ff0069] to-[#d300c5]'>close friends</span>.</h1>
            <div className='flex justify-center'>
              <img className='w-100' src="/login_img/pAv7hjq-51n.png" alt="login_img" />
            </div>
          </div>
          <div className="basis-2/5 flex flex-col items-center justify-center px-15 gap-2">
            <h1 className='text-lg'>Log into Instagram</h1>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-2 pt-5 flex flex-col gap-4">
                <FloatingInput 
                  control={form.control} 
                  name="email" 
                  label="Email" 
                />
                
                <FloatingInput 
                  control={form.control} 
                  name="password" 
                  label="Password" 
                  type="password" 
                />
  
                <Button 
                  type="submit" 
                  className="w-full bg-[#0095f6] hover:bg-[#1877f2] font-semibold mt-4 py-6 rounded-full hover:cursor-pointer"
                  disabled={!form.formState.isValid || mutation.isPending}
                >
                  {mutation.isPending ? <Spinner width='w-5' border="border-2 border-white"/> : "Log in"}
                </Button>
              </form>
            </Form>
            <Link 
              to="/forgot-password"
              className="w-full bg-transparent hover:bg-gray-200 mt-4 py-3 rounded-full transtion-all duration-150 hover:cursor-pointer text-black text-center"
              >
              Forgot password?
            </Link>
            <Link 
              to="/signup"
              className="w-full border border-insta-blue bg-transparent hover:bg-gray-200 mt-4 py-3 rounded-full transtion-all duration-150 hover:cursor-pointer text-insta-blue text-center"
              >
              Create new account
            </Link>
          </div>
        </div>
        <Footer />
      </div>
      <Toaster position='top-right' richColors/>
    </div>
  )
}
