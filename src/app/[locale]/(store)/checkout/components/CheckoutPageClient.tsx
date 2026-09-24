'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { useAddresses } from '@/app/[locale]/(account)/addresses/hooks/useAddresses';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { checkoutSchema, CheckoutFormValues } from '../validation/checkout.schema';
import { usePlaceOrder, useApplyCoupon } from '../hooks/useCheckout';
import { useRouter } from '@/i18n/navigation';
import { useLocaleFormat } from '@/lib/use-locale-format';
import { useLocalizedName } from '@/lib/i18n-content';
import { useSettings } from '../../settings/hooks/useSettings';
import { useServerCart } from '../../cart/hooks/useCart';
import { PageHeader } from '@/components/shared/PageHeader';
import { PageLoading } from '@/components/shared/LoadingState';
import { SelectField } from '@/components/forms/SelectField';
import { TextareaField } from '@/components/forms/TextareaField';
import { FormError } from '@/components/forms/FormError';
import { SectionCard } from '@/components/shared/SectionCard';
import { Wallet } from 'lucide-react';

function CheckoutLineItem({ item, formatPrice }: { item: { id: string; product?: { name?: string | null; nameAr?: string | null; nameEn?: string | null }; quantity: number; price: number }; formatPrice: (n: number) => string }) {
  const name = useLocalizedName(item.product ?? {});
  return (
    <div className="flex justify-between items-center text-sm">
      <div className="text-muted-foreground">
        {name} <span className="text-xs">x{item.quantity}</span>
      </div>
      <div className="font-medium">{formatPrice(item.price * item.quantity)}</div>
    </div>
  );
}

export function CheckoutPageClient() {
  const { formatPrice } = useLocaleFormat();
  const t = useTranslations('checkout');
  const router = useRouter();
  const { data: cart, isLoading: isCartLoading } = useServerCart();
  const { mutate: createOrder, isPending, error } = usePlaceOrder();
  const { mutate: applyCoupon, isPending: isApplyingCoupon } = useApplyCoupon();
  const { data: settings } = useSettings();
  const { data: addressesData } = useAddresses();

  const [couponInput, setCouponInput] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<{ code: string; discount: number } | null>(null);

  const items = cart?.items ?? [];
  const subtotal = cart?.subtotal ?? 0;
  const shippingFee = settings?.shipping_fee !== undefined ? Number(settings.shipping_fee) : 0;
  const discount = appliedCoupon?.discount ?? 0;
  const total = Math.max(0, subtotal + shippingFee - discount);

  const addressOptions = addressesData?.data?.map((addr) => ({
    label: `${addr.label || t('address', { defaultMessage: 'Address' })} - ${addr.street}`,
    value: addr.id,
  })) || [];

  const defaultAddressId = addressOptions.length > 0 ? addressOptions[0].value : '';

  const form = useForm<CheckoutFormValues>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      addressId: defaultAddressId,
      paymentMethod: 'COD',
      couponCode: '',
      notes: '',
    },
  });

  const handleApplyCoupon = () => {
    if (!couponInput.trim()) return;
    applyCoupon(couponInput.trim(), {
      onSuccess: (res) => {
        if (res.valid) {
          setAppliedCoupon({ code: couponInput.trim(), discount: res.discount });
          form.setValue('couponCode', couponInput.trim());
        } else {
          setAppliedCoupon(null);
          form.setValue('couponCode', '');
        }
      },
      onError: () => {
        setAppliedCoupon(null);
      },
    });
  };

  const onSubmit = (values: CheckoutFormValues) => {
    createOrder({
      ...values,
      couponCode: appliedCoupon?.code || undefined,
    });
  };

  if (isCartLoading) {
    return <PageLoading />;
  }

  if (items.length === 0) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-bold mb-4">{t('emptyCart', { defaultMessage: 'Your cart is empty' })}</h2>
        <Button onClick={() => router.push('/products')}>{t('browseProducts', { defaultMessage: 'Browse Products' })}</Button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-5 py-12">
      <PageHeader 
        eyebrow={t('eyebrow', { defaultMessage: 'Secure Checkout' })}
        title={t('title', { defaultMessage: 'Checkout' })} 
        description={t('subtitle', { defaultMessage: 'Complete your order details.' })} 
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 mt-8">
        {/* Checkout Form */}
        <div className="lg:col-span-7 space-y-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6" id="checkout-form" noValidate>
              <FormError message={(error as Error)?.message} />

              <SectionCard title={t('deliveryAddress', { defaultMessage: 'Delivery Address' })} description={t('deliveryDesc', { defaultMessage: 'Select where you want your order delivered.' })}>
                <SelectField
                  control={form.control}
                  name="addressId"
                  options={addressOptions}
                />
              </SectionCard>

              <SectionCard title={t('paymentMethod', { defaultMessage: 'Payment Method' })}>
                <div className="flex items-center gap-3 rounded-lg border border-primary bg-primary/5 p-4">
                  <Wallet className="h-5 w-5 text-primary" />
                  <div>
                    <p className="font-medium">{t('payment.cod', { defaultMessage: 'Cash on Delivery (COD)' })}</p>
                    <p className="text-sm text-muted-foreground">
                      {t('payment.codOnlyDesc', { defaultMessage: 'Currently the only available payment method. Pay in cash when your order arrives.' })}
                    </p>
                  </div>
                </div>
              </SectionCard>

              <SectionCard title={t('additionalOptions', { defaultMessage: 'Additional Options' })}>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">{t('promoCode', { defaultMessage: 'Promo Code (Optional)' })}</label>
                    <div className="flex gap-2">
                      <Input
                        value={couponInput}
                        onChange={(e) => setCouponInput(e.target.value)}
                        placeholder={t('enterCode', { defaultMessage: 'Enter code' })}
                        disabled={isApplyingCoupon}
                      />
                      <Button type="button" variant="outline" onClick={handleApplyCoupon} disabled={isApplyingCoupon || !couponInput.trim()}>
                        {isApplyingCoupon ? t('applying', { defaultMessage: 'Applying...' }) : t('apply', { defaultMessage: 'Apply' })}
                      </Button>
                    </div>
                    {appliedCoupon && (
                      <p className="text-sm text-emerald-600">
                        {t('couponApplied', { defaultMessage: 'Coupon "{code}" applied: -{amount}', code: appliedCoupon.code, amount: formatPrice(appliedCoupon.discount) })}
                      </p>
                    )}
                  </div>
                  <TextareaField
                    control={form.control}
                    name="notes"
                    label={t('orderNotes', { defaultMessage: 'Order Notes (Optional)' })}
                    placeholder={t('specialInstructions', { defaultMessage: 'Any special instructions for delivery...' })}
                  />
                </div>
              </SectionCard>
            </form>
          </Form>
        </div>

        {/* Order Summary sidebar */}
        <div className="lg:col-span-5">
          <div className="bg-card border rounded-2xl p-6 sticky top-24 shadow-sm">
            <h2 className="font-bold text-lg mb-4">{t('orderSummary', { defaultMessage: 'Order Summary' })}</h2>

            <div className="space-y-3 max-h-64 overflow-y-auto pe-1">
              {items.map((item) => (
                <CheckoutLineItem key={item.id} item={item} formatPrice={formatPrice} />
              ))}
            </div>

            <div className="space-y-3 text-sm border-t pt-4">
              <div className="flex justify-between text-muted-foreground">
                <span>{t('subtotal', { defaultMessage: 'Subtotal' })}</span>
                <span className="font-medium text-foreground">{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>{t('delivery', { defaultMessage: 'Delivery' })}</span>
                <span className="font-medium text-foreground">{formatPrice(shippingFee)}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-emerald-600">
                  <span>{t('discount', { defaultMessage: 'Discount' })}</span>
                  <span className="font-medium">-{formatPrice(discount)}</span>
                </div>
              )}
              <div className="flex justify-between items-center pt-4 border-t mt-4">
                <span className="font-bold text-base">{t('totalToPay', { defaultMessage: 'Total to Pay' })}</span>
                <span className="font-bold text-2xl text-primary">{formatPrice(total)}</span>
              </div>
            </div>

            <Button
              type="submit"
              form="checkout-form"
              className="w-full h-14 text-lg font-bold mt-8 shadow-lg shadow-primary/20"
              disabled={isPending}
            >
              {isPending ? t('processing', { defaultMessage: 'Processing...' }) : t('placeOrder', { defaultMessage: 'Place Order' })}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
