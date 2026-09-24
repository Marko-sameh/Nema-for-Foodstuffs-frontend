import * as z from 'zod';

export const categorySchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(50),
  slug: z.string().min(2, 'Slug must be at least 2 characters').max(50),
  description: z.string().optional(),
  imageUrl: z.any().optional(), // Can be string URL or File object from dropzone
});

export type CategoryFormData = z.infer<typeof categorySchema>;
