'use client';

import { Link } from '@/i18n/navigation';
import { Category } from '@/types/product';
import { cn } from '@/lib/utils';
import { useLocalizedName } from '@/lib/i18n-content';
import Image from 'next/image';

interface CategoryCardProps {
  category: Category;
  className?: string;
}

export function CategoryCard({ category, className }: CategoryCardProps) {
  const categoryName = useLocalizedName(category);
  return (
    <Link
      href={`/categories/${category.slug}`}
      className={cn(
        'group relative flex flex-col items-center justify-center h-40 md:h-48 rounded-2xl overflow-hidden border-0 glass-card transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-primary/15',
        className
      )}
    >
      {category.imageUrl ? (
        <Image
          src={category.imageUrl}
          alt={categoryName}
          fill
          sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 16vw"
          className="object-cover transition-transform duration-700 group-hover:scale-110"
        />
      ) : (
        <div className="absolute inset-0 w-full h-full bg-gradient-to-br from-primary/20 to-secondary/20"></div>
      )}
      
      {/* Gradient Overlay for Text Readability */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent opacity-80 group-hover:opacity-90 transition-opacity"></div>
      
      <div className="relative z-10 p-4 w-full h-full flex items-end">
        <h3 className="font-bold text-xl text-white group-hover:text-primary transition-colors tracking-wide drop-shadow-md">
          {categoryName}
        </h3>
      </div>
    </Link>
  );
}
