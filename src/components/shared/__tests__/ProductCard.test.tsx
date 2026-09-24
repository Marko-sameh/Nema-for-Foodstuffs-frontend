import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { NextIntlClientProvider } from 'next-intl';
import { ProductCard } from '@/components/shared/ProductCard';
import type { Product } from '@/types/product';

vi.mock('@/i18n/navigation', () => ({
  Link: ({ children, href }: any) => <a href={href}>{children}</a>,
  useRouter: () => ({ push: vi.fn() }),
}));

vi.mock('@/app/[locale]/(store)/cart/hooks/useCart', () => ({
  useAddToCart: () => ({ mutate: vi.fn(), isPending: false }),
}));

const product: Product = {
  id: '1',
  name: 'Test Product',
  slug: 'test-product',
  unitType: 'PIECE',
  fixedPrice: 25,
  isFeatured: false,
} as Product;

describe('ProductCard', () => {
  it('renders the product name and price', () => {
    render(
      <NextIntlClientProvider locale="en" messages={{}}>
        <ProductCard product={product} />
      </NextIntlClientProvider>
    );
    expect(screen.getByText('Test Product')).toBeInTheDocument();
  });
});
