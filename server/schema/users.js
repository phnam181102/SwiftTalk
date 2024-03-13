import { z } from 'zod';

export const RegisterSchema = z.object({
    name: z.string(),
    email: z.string().email({ message: 'Invalid email address' }),
    password: z.string().min(6, { message: 'Must be 6 or more characters long' }),
});
