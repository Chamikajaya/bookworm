import { z } from "zod";

const uploadUrlRequestSchema = z.object({
  fileExtension: z
    .string()
    .min(1, "File extension is required")
    .regex(
      /^\.(jpg|jpeg|png|webp|gif)$/i,
      "Invalid file extension format. Must be .jpg, .jpeg, .png, .webp, or .gif"
    )
    .transform((val) => val.toLowerCase()),
  contentType: z
    .string()
    .min(1, "Content type is required")
    .regex(
      /^image\/(jpeg|png|webp|gif)$/,
      "Invalid content type. Must be image/jpeg, image/png, image/webp, or image/gif"
    ),
});

type UploadUrlRequest = z.infer<typeof uploadUrlRequestSchema>;
export { uploadUrlRequestSchema, UploadUrlRequest };
