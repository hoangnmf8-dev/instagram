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
  currentPassword: z.string().trim().min(8, "Mật khẩu phải có tối thiểu 8 kí tự")
  .regex(/[A-Z]/, "Mật khẩu phải có tối thiểu 1 chữ in hoa")
  .regex(/[a-z]/, "Mật khẩu phải có tối thiểu 1 chữ in thường"),
  newPassword: z.string().trim().min(8, "Mật khẩu phải có tối thiểu 8 kí tự")
  .regex(/[A-Z]/, "Mật khẩu phải có tối thiểu 1 chữ in hoa")
  .regex(/[a-z]/, "Mật khẩu phải có tối thiểu 1 chữ in thường"),
  confirmPassword: z.string().trim().min(8, "Xác nhận mật khẩu phải có tối thiểu 8 kí tự")
  .regex(/[A-Z]/, "Xác nhận mật khẩu phải có tối thiểu 1 chữ in hoa")
  .regex(/[a-z]/, "Xác nhận mật khẩu phải có tối thiểu 1 chữ in thường"),
}).superRefine(({currentPassword, newPassword, confirmPassword}, context) => {
  if(newPassword !== confirmPassword) {
    context.addIssue({
      code: "custom",
      message: "Xác nhận mật khẩu không khớp",
      path: ["confirmPassword"]
    })
  }
  if(newPassword === currentPassword) {
    context.addIssue({
      code: "custom",
      message: "Mật khẩu mới phải khác mật khẩu cũ",
      path: ["newPassword"]
    })
  }
})
export type ChangePasswordValues = z.infer<typeof changePasswordSchema>;