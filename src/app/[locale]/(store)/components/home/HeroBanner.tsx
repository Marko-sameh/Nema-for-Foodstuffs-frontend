import { Link } from "@/i18n/navigation";
import { getTranslations } from "next-intl/server";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles, Truck } from "lucide-react";
import Image from "next/image";

export async function HeroBanner() {
  const t = await getTranslations("common");

  const stats = [
    {
      big: t("hero.stats.products.value", { defaultMessage: "+200" }),
      sm: t("hero.stats.products.label", {
        defaultMessage: "Available Products",
      }),
    },
    {
      big: t("hero.stats.hidden.value", { defaultMessage: "0" }),
      sm: t("hero.stats.hidden.label", { defaultMessage: "Hidden extras" }),
    },
    {
      big: t("hero.stats.rating.value", { defaultMessage: "4.9" }),
      sm: t("hero.stats.rating.label", { defaultMessage: "Happy families" }),
    },
  ];

  return (
    <section className="relative overflow-hidden bg-background">
      <div className="mx-auto grid max-w-7xl items-center gap-12 px-5 py-14 md:py-20 lg:grid-cols-2 lg:gap-16">
        {/* Text column */}
        <div className="text-center lg:text-start">
          <span className="inline-flex items-center gap-2 rounded-full border border-primary/25 bg-card px-4 py-2 text-[11px] font-bold uppercase tracking-[0.16em] text-primary">
            <Sparkles className="h-3.5 w-3.5" />
            {t("hero.badge", { defaultMessage: "Locked-in freshness" })}
          </span>

          <h1 className="display-xl mt-6 text-foreground">
            {t("hero.titleLine1", { defaultMessage: "Good food," })}{" "}
            <span className="italic text-primary">
              {t("hero.titleLine2", { defaultMessage: "ready when" })}
            </span>{" "}
            {t("hero.titleLine3", { defaultMessage: "you are." })}
          </h1>

          <p className="mx-auto mt-6 max-w-md text-base leading-relaxed text-muted-foreground lg:mx-0">
            {t("hero.subtitle", {
              defaultMessage:
                "Spices, herbs, and select goods — by the kilo, half, or quarter.",
            })}
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-6 lg:justify-start">
            <Link href="/products">
              <Button className="h-13 gap-2 rounded-full bg-primary px-8 text-sm font-bold text-primary-foreground hover:bg-primary/90">
                {t("hero.cta", { defaultMessage: "Browse Products" })}
                <ArrowRight className="h-4 w-4 flip-x" />
              </Button>
            </Link>
            <Link
              href="/categories"
              className="border-b-2 border-foreground pb-1 text-sm font-bold text-foreground transition-colors hover:border-primary hover:text-primary"
            >
              {t("hero.secondaryCta", { defaultMessage: "Shop by category" })}
            </Link>
          </div>

          <dl className="mt-12 flex items-center justify-center gap-8 lg:justify-start">
            {stats.map((s, i) => (
              <div
                key={i}
                className={i > 0 ? "border-s border-border ps-8" : ""}
              >
                <dt className="display-lg text-2xl text-foreground md:text-3xl">
                  {s.big}
                </dt>
                <dd className="mt-1 text-xs font-medium text-muted-foreground">
                  {s.sm}
                </dd>
              </div>
            ))}
          </dl>
        </div>

        {/* Image column */}
        <div className="relative mx-auto w-full max-w-xl">
          <div className="relative aspect-square overflow-hidden rounded-full border-8 border-card shadow-[0_30px_80px_-30px_rgba(18,26,22,0.45)]">
            <Image
              src="/images/hero-food.jpg"
              alt={t("hero.imageAlt", {
                defaultMessage: "Fresh spices, nuts and herbs",
              })}
              fill
              priority
              sizes="(max-width: 1024px) 90vw, 560px"
              className="object-cover"
            />
          </div>

          <div className="absolute -top-2 end-0 rounded-2xl bg-card px-5 py-3 shadow-xl sm:end-4">
            <div className="eyebrow">
              {t("hero.cardOneTitle", { defaultMessage: "Picked at peak" })}
            </div>
            <div className="font-display text-lg text-foreground">
              {t("hero.cardOneValue", { defaultMessage: "Freshly sourced" })}
            </div>
          </div>

          <div className="absolute -bottom-4 start-0 flex items-center gap-3 rounded-2xl bg-foreground px-5 py-4 text-background shadow-xl sm:start-4">
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground">
              <Truck className="h-5 w-5" />
            </span>
            <span>
              <span className="block text-sm font-bold">
                {t("hero.cardTwoTitle", { defaultMessage: "Fast delivery" })}
              </span>
              <span className="block text-xs opacity-70">
                {t("hero.cardTwoSubtitle", {
                  defaultMessage: "From us to your kitchen",
                })}
              </span>
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
