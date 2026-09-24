import { describe, it, expect } from 'vitest';
import { formatPrice, formatWeight } from '@/lib/utils';

describe('formatPrice', () => {
  it('formats a whole number amount as EGP currency', () => {
    expect(formatPrice(100, 'en')).toContain('100');
  });

  it('formats without a decimal for whole amounts', () => {
    const result = formatPrice(50, 'en');
    expect(result).not.toMatch(/50\.00/);
  });
});

describe('formatWeight', () => {
  it('formats grams under a kilo as grams', () => {
    expect(formatWeight(250)).toBe('250g');
  });

  it('formats exactly one kilo as kg without decimals', () => {
    expect(formatWeight(1000)).toBe('1kg');
  });

  it('formats fractional kilos with one decimal', () => {
    expect(formatWeight(1500)).toBe('1.5kg');
  });
});
