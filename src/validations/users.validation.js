import { z } from 'zod';

export const userIdSchema = z.object({
  id: z.coerce
    .number({
      required_error: 'User ID is required',
      invalid_type_error: 'User ID must be a number',
    })
    .int('User ID must be an integer')
    .positive('User ID must be a positive number'),
});

export const updateUserSchema = z
  .object({
    name: z
      .string()
      .min(2, 'Name must be at least 2 characters long')
      .max(255)
      .trim()
      .optional(),
    email: z.string().email('Invalid email address').max(255).toLowerCase().trim().optional(),
    role: z.enum(['user', 'admin'], {
      errorMap: () => ({ message: 'Role must be either "user" or "admin"' }),
    }).optional(),
  })
  .refine(data => Object.keys(data).length > 0, {
    message: 'At least one field must be provided for update',
  });
