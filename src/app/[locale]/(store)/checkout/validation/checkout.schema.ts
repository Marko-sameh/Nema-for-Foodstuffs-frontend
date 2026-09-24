import { z } from 'zod';
import { PaymentMethod } from '@/types/order';

export const checkoutSchema = z.object({
  addressId: z.string().min(1, { message: 'Please select a delivery address' }),
  paymentMethod: z.literal('COD' satisfies PaymentMethod),
  couponCode: z.string().optional(),
  notes: z.string().max(500).optional(),
});

export type CheckoutFormValues = z.infer<typeof checkoutSchema>;
