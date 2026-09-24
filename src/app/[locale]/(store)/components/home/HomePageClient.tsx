import { HeroBanner } from './HeroBanner';
import { CategoryShowcase } from './CategoryShowcase';
import { FeaturedProducts } from './FeaturedProducts';
import { PromiseSection } from './PromiseSection';
import { NewsletterSignup } from './NewsletterSignup';

export function HomePageClient() {
  return (
    <div className="bg-background">
      <HeroBanner />
      <CategoryShowcase />
      <FeaturedProducts />
      <PromiseSection />
      <NewsletterSignup />
    </div>
  );
}
