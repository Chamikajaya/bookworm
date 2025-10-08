import { z } from "zod";

const updateProfileSchema = z.object({
  phoneNumber: z
    .string()
    .regex(
      /^\+[1-9]\d{1,14}$/,
      "Invalid phone number format. Must start with '+' and include country code."
    )

    .optional(),
  address: z.string().max(500, "Address too long").optional(),
});

export { updateProfileSchema };
