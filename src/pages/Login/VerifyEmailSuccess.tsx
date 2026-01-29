import React, { useEffect } from 'react'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { verifyEmail } from '@/services/authService'
import { useQuery } from '@tanstack/react-query'
import { verifyEmailKey } from '@/cache_keys/auth_key'
import { useNavigate, useParams } from 'react-router-dom'
import Spinner from '@/components/Spinner'

export default function VerifyEmailSuccess() {
  const param = useParams();
  const navigate = useNavigate();

  const {data, isFetching} = useQuery({
    queryKey: verifyEmailKey,
    queryFn: () => verifyEmail(param.token),
    staleTime: 10 * 1000
  })

  useEffect(() => {
    setTimeout(() => {
      if(data && data?.success) {
        navigate("/login");
      }
    }, 1000)
  }, [data])

  return (
    <div className='flex items-center justify-center h-screen'>
      <Card className='min-w-100 p-5'>
        <CardHeader className='p-0 flex flex-col items-center'>
          <CardTitle>Xác thực email</CardTitle>
        </CardHeader>
        <CardContent className='flex flex-col items-center gap-4'>
          {isFetching ? (<><p>Đang xác thực email. Vui lòng đợi một chút</p><Spinner width='w-5' border="border-2 border-insta-blue" /></>) : <p className='text-green-600'>Email đã xác thực thành công. Đang chuyển tới trang đăng nhập</p>}
        </CardContent>
      </Card>
    </div>
  )
}
