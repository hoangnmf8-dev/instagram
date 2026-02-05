import * as z from "zod"
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png"];

export const editProfileSchema = z.object({
  fullName: z.string().trim().optional(), //không dùng min,max vì sẽ không sử dụng được optional
  bio: z.string().trim().optional(),
  website: z.string().trim().optional(),
  gender: z.enum(["male", "female", "other"], "Dữ liệu không hợp lệ").optional(),
  profilePicture: z.any() //vì input file trả về obj FileList nên dùng any để phù hợp
  .optional() //vì user có thể k truyền file ảnh(k muốn đổi avatar) nên có thể giá trị là undefined, nên đặt ở đầu
  .refine((files) => !files || files.length === 0 || ACCEPTED_IMAGE_TYPES.includes(files?.[0]?.type), "Ảnh không đúng định dạng") //callback trong refine trả về true sẽ không kích hoạt message
})

export type editProfileValues = z.infer<typeof editProfileSchema>;

export const changePasswordSchema = z.object({
  currentPassword: z.string().trim().min(8, "Password must be at least 8 characters long.")
  .regex(/[A-Z]/, "Password must contain at least one uppercase letter.")
  .regex(/[a-z]/, "Password must contain at least one lowercase letter."),
  newPassword: z.string().trim().min(8, "Password must be at least 8 characters long.")
  .regex(/[A-Z]/, "Password must contain at least one uppercase letter.")
  .regex(/[a-z]/, "Password must contain at least one lowercase letter."),
  confirmPassword: z.string().trim().min(8, "Confirm password must be at least 8 characters.")
  .regex(/[A-Z]/, "Confirm password must contain at least one uppercase letter.")
  .regex(/[a-z]/, "Confirm password must contain at least one lowercase letter."),
}).superRefine(({currentPassword, newPassword, confirmPassword}, context) => {
  if(newPassword !== confirmPassword) {
    context.addIssue({
      code: "custom",
      message: "Confirm password does not match.",
      path: ["confirmPassword"]
    })
  }
  if(newPassword === currentPassword) {
    context.addIssue({
      code: "custom",
      message: "New password must be unique from your current password.",
      path: ["newPassword"]
    })
  }
})
export type ChangePasswordValues = z.infer<typeof changePasswordSchema>;