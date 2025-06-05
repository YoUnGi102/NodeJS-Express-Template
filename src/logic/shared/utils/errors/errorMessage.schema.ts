import { z } from 'zod';

export const errorSchema = z.object({
    status: z.number(),
    title: z.string(),
    message: z.string(),
})