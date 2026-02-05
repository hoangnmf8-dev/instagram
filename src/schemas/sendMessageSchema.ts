import * as z from "zod"
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png"];

export const sendMessageSchema = z.object({
  content: z.string().trim().optional(),
  image : z.any() 
  .optional() 
  .refine((image) => !image || image.length === 0 || ACCEPTED_IMAGE_TYPES.includes(image?.[0]?.type), "Ảnh không đúng định dạng") //callback trong refine trả về true sẽ không kích hoạt message
  .refine((image) => {
    const fileSize = +(image?.[0]?.size / (1024 * 1024)).toFixed(2)
    return !image || image.length === 0 || fileSize <= 10
  }, "File size must not exceed 10MB."),
}).superRefine(({content, image}, context) => {
  if(!content && !image) {
    context.addIssue({
      code: "custom",
      message: "",
      path: ["content"]
    })
  }
})

export type sendMessageSchemaValues = z.infer<typeof sendMessageSchema>;
