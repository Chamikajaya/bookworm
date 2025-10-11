import { z } from "zod";

export const profileSchema = z.object({
  phoneNumber: z
    .string()
    .regex(
      /^\+?[1-9]\d{1,14}$/,
      "Invalid phone number format (use E.164 format)"
    )
    .optional()
    .or(z.literal("")),
  address: z
    .string()
    .max(500, "Address must be less than 500 characters")
    .optional(),
});

export type ProfileFormData = z.infer<typeof profileSchema>;
