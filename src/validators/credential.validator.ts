import { z } from "zod";

export const registrationSchema = z.object({
  email: z.string().trim().toLowerCase().email(),
  username: z.string().min(3).max(30),
  password: z.string().min(8).max(100),
});

export const loginSchema = z.object({
  email: z.string().trim().email(),
  password: z.string().min(8).max(100),
});

export type RegistrationBody = z.infer<typeof registrationSchema>;
