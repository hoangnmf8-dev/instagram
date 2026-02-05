import { z } from "zod"

export const loginSchema = z.object({
  email: z.string()
  .min(1, "This field is required.")
  .pipe(z.email({
    message: "Invalid email format."
  })),
  password: z.string()
  .min(8, "Password must be at least 8 characters long.")
  .regex(/[A-Z]/, "Password must contain at least one uppercase letter.")
  .regex(/[a-z]/, "Password must contain at least one lowercase letter."),
})

export const registerSchema = z.object({
  email: z.string()
  .min(1, "This field is required.")
  .pipe(z.email({
    message: "Invalid email format."
  })),
  password: z.string()
  .min(8, "Password must be at least 8 characters long.")
  .regex(/[A-Z]/, "Password must contain at least one uppercase letter.")
  .regex(/[a-z]/, "Password must contain at least one lowercase letter."),
  fullName: z.string().min(1, {
    message: "Không được để trống"
  }),
  username: z.string().min(1, {
    message: "This field is required."
  }),
  confirmPassword: z.string().min(8, "Confirm password must be at least 8 characters.")
}).superRefine(({password, confirmPassword}, context) => {
  if(password !== confirmPassword) {
    context.addIssue({
      code: "custom",
      message: "Confirm password does not match.",
      path: ["confirmPassword"] 
    })
  }
})

export const resetPasswordSchema = z.object({
  password: z.string()
  .min(8, "Password must be at least 8 characters long.")
  .regex(/[A-Z]/, "Password must contain at least one uppercase letter.")
  .regex(/[a-z]/, "Password must contain at least one lowercase letter."),
  confirmPassword: z.string()
  .min(8, "Confirm password must be at least 8 characters long.")
  .regex(/[A-Z]/, "Confirm password must contain at least one uppercase letter.")
  .regex(/[a-z]/, "Confirm password must contain at least one lowercase letter."),
}).superRefine(({password, confirmPassword}, context) => {
  if(password !== confirmPassword) {
    context.addIssue({
      code: "custom",
      message: "Confirm password does not match.",
      path: ["confirmPassword"]
    })
  }
})


export type LoginValues = z.infer<typeof loginSchema>
export type RegisterValues = z.infer<typeof registerSchema>
export type ResetPasswordValues = z.infer<typeof resetPasswordSchema>