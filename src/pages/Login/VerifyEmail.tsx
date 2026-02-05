import React, { useEffect } from 'react'
import { resendEmail } from '@/services/authService'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Alert,
  AlertDescription,
} from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import Spinner from '@/components/Spinner'
import {useMutation} from "@tanstack/react-query"
import { useParams } from 'react-router-dom'
import { useAuth } from '@/stores/authStore'
import { toast, Toaster } from 'sonner'

export default function VerifyEmail() {
  const {user} = useAuth();
  const resendMutation = useMutation({
    mutationFn: () => resendEmail({
      email: user?.email
    }),
    onSuccess: () => {
      toast.success("A verification email has been resent.");
    }
  });

  return (
    <div className="flex items-center justify-center min-h-screen p-4 bg-slate-50">
      <Card className="w-full max-w-sm">
        <CardHeader className="text-center">
          <CardTitle>Xác thực email</CardTitle>
          <CardDescription>Chúng tôi đã gửi cho bạn link xác thực về email của bạn. Vui lòng kiểm tra hộp thư để kích hoạt tài khoản</CardDescription>
        </CardHeader>
        
        <CardContent className="grid gap-4">
          <div className="space-y-2">
            <Button 
              variant="outline" 
              className="w-full bg-insta-blue text-white hover:cursor-pointer" 
              onClick={resendMutation.mutate}
              disabled={resendMutation.isPending}
            >
              {resendMutation.isPending ? <Spinner width='w-5' border='border-2 border-white' /> : "Gửi lại Email xác thực"}
            </Button>
          </div>
        </CardContent>
      </Card>
      <Toaster position='top-right' richColors />
    </div>
  )
}
