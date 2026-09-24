import { z } from 'zod';

export const productFiltersSchema = z.object({
  search: z.string().optional(),
  category: z.string().optional(),
  brand: z.string().optional(),
  isFeatured: z.boolean().optional(),
  minPrice: z.number().nonnegative().optional(),
  maxPrice: z.number().positive().optional(),
});

export type ProductFiltersInput = z.infer<typeof productFiltersSchema>;
