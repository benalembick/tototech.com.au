import { z } from "zod";

export const contactSchema = z.object({
  name: z.string().trim().min(2, "Please enter your full name."),
  email: z.string().trim().email("Please enter a valid email address."),
  company: z.string().trim().min(2, "Please enter your organisation name."),
  phone: z
    .string()
    .trim()
    .optional()
    .refine((val) => !val || val.length >= 8, {
      message: "Please enter a valid phone number.",
    }),
  message: z.string().trim().min(10, "Tell us a little more about your project."),
});

export type ContactFormValues = z.infer<typeof contactSchema>;
