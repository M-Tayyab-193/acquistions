import { z } from 'zod';

export const signupSchema = z.object({
  name: z
    .string()
    .min(2, 'Name must be at least 2 characters long')
    .max(255)
    .trim(),
  email: z.email('Invalid email address').max(255).toLowerCase().trim(),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters long')
    .max(128),

  role: z.enum(['user', 'admin']).default('user'),
});

export const signinSchema = z.object({
  email: z.email('Invalid email address').max(255).toLowerCase().trim(),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters long')
    .max(128),
});
