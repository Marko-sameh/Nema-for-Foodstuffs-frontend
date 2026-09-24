import * as z from 'zod';

export const addressSchema = z.object({
  label: z.string().min(1, 'Label is required').max(50),
  street: z.string().min(5, 'Street address is required').max(200),
  city: z.string().min(2, 'City is required').max(50),
  state: z.string().optional(),
  postalCode: z.string().optional(),
  isDefault: z.boolean(),
});

export type AddressFormData = z.infer<typeof addressSchema>;
