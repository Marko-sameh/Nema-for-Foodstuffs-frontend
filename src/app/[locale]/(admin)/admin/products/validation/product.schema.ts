import { z } from 'zod';

export const adminProductSchema = z.object({
  name: z.string().min(2, 'Product name is required'),
  sku: z.string().min(3, 'SKU must be at least 3 characters'),
  description: z.string().optional(),
  categoryId: z.string().uuid('Please select a category'),
  brand: z.string().optional(),
  unitType: z.enum(['WEIGHT', 'PIECE']),
  pricePerKg: z.number().positive().optional(),
  fixedPrice: z.number().positive().optional(),
  stockInGrams: z.number().nonnegative(),
  isFeatured: z.boolean(),
  isActive: z.boolean(),
  thumbnailUrl: z.string().url('Please enter a valid URL').optional().or(z.literal('')),
}).refine(
  (data) => (data.unitType === 'PIECE' ? !!data.fixedPrice : !!data.pricePerKg),
  {
    message: 'Price is required for selected unit type',
    path: ['pricePerKg'],
  }
);

export type AdminProductFormValues = z.infer<typeof adminProductSchema>;
