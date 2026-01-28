import { z } from "zod"

export const loginSchema = z.object({
  email: z.string()
  .min(1, "Không được để trống.")
  .pipe(z.email({
    message: "Email không đúng định dạng"
  })),
  password: z.string()
  .min(8, "Mật khẩu phải có tối thiểu 8 kí tự")
  .regex(/[A-Z]/, "Mật khẩu phải có tối thiểu 1 chữ in hoa")
  .regex(/[a-z]/, "Mật khẩu phải có tối thiểu 1 chữ in thường"),
})

export const registerSchema = z.object({
  email: z.string()
  .min(1, "Không được để trống.")
  .pipe(z.email({
    message: "Email không đúng định dạng"
  })),
  password: z.string()
  .min(8, "Mật khẩu phải có tối thiểu 8 kí tự")
  .regex(/[A-Z]/, "Mật khẩu phải có tối thiểu 1 chữ in hoa")
  .regex(/[a-z]/, "Mật khẩu phải có tối thiểu 1 chữ in thường"),
  fullName: z.string().min(1, {
    message: "Không được để trống"
  }),
  username: z.string().min(1, {
    message: "Không được để trống"
  }),
  confirmPassword: z.string().min(8, "Xác nhận mật khẩu phải có tối thiểu 8 kí tự")
}).superRefine(({password, confirmPassword}, context) => {
  if(password !== confirmPassword) {
    context.addIssue({
      code: "custom",
      message: "Xác nhận mật khẩu không khớp",
      path: ["confirmPassword"] 
    })
  }
})

export const resetPasswordSchema = z.object({
  password: z.string()
  .min(8, "Mật khẩu phải có tối thiểu 8 kí tự")
  .regex(/[A-Z]/, "Mật khẩu phải có tối thiểu 1 chữ in hoa")
  .regex(/[a-z]/, "Mật khẩu phải có tối thiểu 1 chữ in thường"),
  confirmPassword: z.string()
  .min(8, "Mật khẩu phải có tối thiểu 8 kí tự")
  .regex(/[A-Z]/, "Mật khẩu phải có tối thiểu 1 chữ in hoa")
  .regex(/[a-z]/, "Xác nhận mật khẩu phải có tối thiểu 1 chữ in thường"),
}).superRefine(({password, confirmPassword}, context) => {
  if(password !== confirmPassword) {
    context.addIssue({
      code: "custom",
      message: "Xác nhận mật khẩu không khớp",
      path: ["confirmPassword"]
    })
  }
})


export type LoginValues = z.infer<typeof loginSchema>
export type RegisterValues = z.infer<typeof registerSchema>
export type ResetPasswordValues = z.infer<typeof resetPasswordSchema>