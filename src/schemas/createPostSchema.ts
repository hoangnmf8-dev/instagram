import * as z from "zod"
const ACCEPTED_FILE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/gif", "video/mp4", "video/quicktime", "video/webm"];

export const createPostSchema = z.object({
  file: z.any()
  .refine((file) => ACCEPTED_FILE_TYPES.includes(file?.[0]?.type), "The file is not in the correct format.")
  .refine((file) => {
    const fileSize = +(file?.[0]?.size / (1024 * 1024)).toFixed(2)
    return fileSize <= 50
  }, "File size must not exceed 50MB."),
  caption: z.string().trim().optional()
});

export type CreatePostValues = z.infer<typeof createPostSchema>;