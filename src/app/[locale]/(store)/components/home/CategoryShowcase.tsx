'use client';

import { useCategoriesList } from '../../categories/hooks/useCategories';
import { Link } from '@/i18n/navigation';
import { useTranslations } from 'next-intl';
import { Skeleton } from '@/components/ui/skeleton';
import { useLocalizedName } from '@/lib/i18n-content';
import { ArrowUpRight } from 'lucide-react';
import Image from 'next/image';

const CATEGORY_ICONS: Record<string, string> = {
  'بهارات': '🌿', 'spices': '🌿', 'herbs': '🌿',
  'مكسرات': '🥜', 'nuts': '🥜', 'حبوب': '🌾', 'grains': '🌾',
  'فواكه': '🍎', 'fruits': '🍎', 'خضروات': '🥦', 'vegetables': '🥦',
  'منتجات': '📦', 'dairy': '🥛', 'ألبان': '🥛',
  'سكر': '🧂', 'ملح': '🧂', 'salt': '🧂', 'sugar': '🧂',
  'مغلفة': '🫙', 'canned': '🫙', 'default': '🛒',
};

function getCategoryIcon(name: string): string {
  const lower = name.toLowerCase();
  for (const [key, icon] of Object.entries(CATEGORY_ICONS)) {
    if (lower.includes(key)) return icon;
  }
  return '🛒';
}

function CategoryTile({ category }: { category: { id: string; slug: string; name: string; imageUrl?: string } }) {
  const name = useLocalizedName(category);
  return (
    <Link href={`/categories/${category.slug}`} className="group block">
      <div className="relative aspect-[4/5] overflow-hidden rounded-[1.75rem] bg-accent">
        {category.imageUrl ? (
          <Image
            src={category.imageUrl}
            alt={name}
            fill
            sizes="(max-width: 640px) 50vw, 25vw"
            className="object-cover transition-transform duration-700 group-hover:scale-105"
          />
        ) : (
          <span className="absolute inset-0 flex items-center justify-center text-6xl">{getCategoryIcon(name)}</span>
        )}
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-foreground/75 to-transparent p-4 pt-12">
          <div className="flex items-center justify-between gap-2">
            <span className="font-display text-lg text-background">{name}</span>
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-background text-foreground transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
              <ArrowUpRight className="h-4 w-4 flip-x" />
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}

export function CategoryShowcase() {
  const { data, isLoading } = useCategoriesList();
  const t = useTranslations('common');

  const categories = data?.data || [];

  if (!isLoading && categories.length === 0) return null;

  return (
    <section className="mx-auto max-w-7xl px-5 py-14">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <span className="eyebrow">{t('categories.eyebrow', { defaultMessage: 'Shop by category' })}</span>
          <h2 className="display-lg mt-2 text-foreground">
            {t('categories.title', { defaultMessage: 'Categories' })}
          </h2>
        </div>
        <Link
          href="/categories"
          className="border-b-2 border-foreground pb-1 text-sm font-bold text-foreground transition-colors hover:border-primary hover:text-primary"
        >
          {t('categories.viewAll', { defaultMessage: 'View All' })}
        </Link>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="aspect-[4/5] rounded-[1.75rem] bg-muted" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {categories.slice(0, 8).map((category) => (
            <CategoryTile key={category.id} category={category} />
          ))}
        </div>
      )}
    </section>
  );
}
