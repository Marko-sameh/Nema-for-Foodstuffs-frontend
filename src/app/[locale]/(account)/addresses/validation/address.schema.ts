import * as z from 'zod';

export const addressSchema = z.object({
  label: z.string().min(1, 'Label is required').max(50),
  fullName: z.string().min(2, 'Full name is required').max(100),
  phone: z.string().min(5, 'Phone number is required').max(20),
  street: z.string().min(3, 'Street address is required').max(200),
  city: z.string().min(2, 'City is required').max(50),
  governorate: z.string().min(2, 'Governorate is required').max(50),
  postalCode: z.string().optional(),
  isDefault: z.boolean(),
});

export type AddressFormData = z.infer<typeof addressSchema>;
