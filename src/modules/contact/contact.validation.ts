import { z } from "zod";

const createContactMessage = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Name must be at least 2 characters")
    .max(60, "Name cannot exceed 60 characters"),

  email: z
    .string()
    .trim()
    .email("Please provide a valid email address"),

  subject: z
    .string()
    .trim()
    .min(3, "Subject must be at least 3 characters")
    .max(100, "Subject cannot exceed 100 characters"),

  message: z
    .string()
    .trim()
    .min(10, "Message must be at least 10 characters")
    .max(1000, "Message cannot exceed 1000 characters"),
});

export type CreateContactMessageInput =
  z.infer<typeof createContactMessage>;

export const ContactValidation = {
  createContactMessage,
};