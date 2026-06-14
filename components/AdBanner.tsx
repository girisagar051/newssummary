"use client";
import { useLang } from "@/context/LanguageContext";
import type { AdItem } from "@/lib/mockData";

interface Props {
  ad: AdItem;
  variant: "leaderboard" | "medium-rect" | "half-page" | "strip";
}

export default function AdBanner({ ad, variant }: Props) {
  const { t } = useLang();

  // Leaderboard: 728×90 (full width, short)
  if (variant === "leaderboard") {
    return (
      <div className="w-full overflow-hidden rounded-lg border border-[var(--border)] ad-shimmer" style={{ minHeight: 90 }}>
        <div
          className="ad-gif-pulse relative flex items-center justify-between px-6 py-0 h-[90px]"
          style={{ background: ad.gradient }}
        >
          {/* Left: Ad label */}
          <div className="absolute top-1.5 left-2">
            <span className="text-[9px] text-white/40 uppercase tracking-widest">विज्ञापन · Ad</span>
          </div>

          {/* Animated decorative circles */}
          <div className="absolute right-0 top-0 bottom-0 w-40 opacity-10">
            <div className="absolute top-2 right-4 w-16 h-16 border-2 border-white rounded-full" />
            <div className="absolute -top-4 right-12 w-24 h-24 border border-white rounded-full" />
          </div>

          <div className="flex items-center gap-4 z-10">
            <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center text-2xl border border-white/20 ad-bounce flex-shrink-0">
              {ad.emoji}
            </div>
            <div>
              <div className="text-white font-semibold text-sm headline ad-headline-slide">
                {ad.company}
              </div>
              <div className="text-white/80 text-xs mt-0.5">
                {t(ad.tagline, ad.taglineEn)}
              </div>
            </div>
          </div>

          <button className="z-10 shrink-0 bg-white text-[11px] font-semibold px-5 py-2 rounded-lg ad-cta-blink hover:opacity-90 transition-opacity"
            style={{ color: "#C41E3A" }}>
            {t(ad.cta, ad.ctaEn)}
          </button>
        </div>
      </div>
    );
  }

  // Medium rectangle: 300×250
  if (variant === "medium-rect") {
    return (
      <div className="w-full rounded-xl border border-[var(--border)] overflow-hidden ad-shimmer" style={{ height: 250 }}>
        <div className="relative h-full flex flex-col items-center justify-center gap-4 px-5 py-4 text-center ad-gif-pulse"
          style={{ background: ad.gradient }}>
          <div className="absolute top-1.5 right-2">
            <span className="text-[9px] text-white/40 uppercase tracking-widest">Ad</span>
          </div>
          {/* Decorative ring */}
          <div className="absolute top-0 left-0 w-32 h-32 border border-white/10 rounded-full -translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-0 right-0 w-24 h-24 border border-white/10 rounded-full translate-x-1/3 translate-y-1/3" />

          <div className="w-16 h-16 bg-white/15 rounded-2xl flex items-center justify-center text-4xl border border-white/20 ad-bounce z-10">
            {ad.emoji}
          </div>
          <div className="z-10">
            <div className="text-white font-bold text-base headline ad-headline-slide">{ad.company}</div>
            <div className="text-white/80 text-xs mt-1 leading-relaxed">{t(ad.tagline, ad.taglineEn)}</div>
          </div>
          <button className="z-10 bg-white text-xs font-semibold px-6 py-2.5 rounded-lg ad-cta-blink hover:opacity-90 transition-opacity"
            style={{ color: "#C41E3A" }}>
            {t(ad.cta, ad.ctaEn)}
          </button>
        </div>
      </div>
    );
  }

  // Half page: 300×600
  if (variant === "half-page") {
    return (
      <div className="w-full rounded-xl border border-[var(--border)] overflow-hidden ad-shimmer" style={{ height: 400 }}>
        <div className="relative h-full flex flex-col items-center justify-center gap-5 px-5 py-6 text-center ad-gif-pulse"
          style={{ background: ad.gradient }}>
          <div className="absolute top-1.5 right-2">
            <span className="text-[9px] text-white/40 uppercase tracking-widest">Ad</span>
          </div>

          {/* Animated rings */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-56 h-56 border border-white/5 rounded-full" />
            <div className="absolute w-40 h-40 border border-white/8 rounded-full" />
          </div>

          <div className="w-20 h-20 bg-white/15 rounded-3xl flex items-center justify-center text-5xl border border-white/20 ad-bounce z-10">
            {ad.emoji}
          </div>
          <div className="z-10">
            <div className="text-white font-bold text-xl headline">{ad.company}</div>
            <div className="text-white/70 text-sm mt-2 leading-relaxed max-w-[200px] mx-auto">
              {t(ad.tagline, ad.taglineEn)}
            </div>
          </div>

          {/* Animated offer badge */}
          <div className="z-10 bg-white/20 border border-white/30 rounded-xl px-5 py-2 ad-headline-slide">
            <span className="text-white font-bold text-lg">50% OFF</span>
            <div className="text-white/70 text-[10px]">{t("सीमित समय", "Limited time")}</div>
          </div>

          <button className="z-10 w-full max-w-[180px] bg-white text-sm font-bold px-6 py-3 rounded-xl ad-cta-blink hover:opacity-90 transition-opacity"
            style={{ color: "#C41E3A" }}>
            {t(ad.cta, ad.ctaEn)}
          </button>
        </div>
      </div>
    );
  }

  // Strip: 320×50 (mobile banner style, full width)
  return (
    <div className="w-full overflow-hidden rounded-lg border border-[var(--border)] ad-shimmer">
      <div className="relative flex items-center justify-between px-4 h-[52px] ad-gif-pulse"
        style={{ background: ad.gradient }}>
        <div className="flex items-center gap-3 z-10">
          <span className="text-xl ad-bounce">{ad.emoji}</span>
          <div>
            <span className="text-white font-semibold text-xs headline">{ad.company} </span>
            <span className="text-white/75 text-xs">— {t(ad.tagline, ad.taglineEn)}</span>
          </div>
        </div>
        <div className="flex items-center gap-2 z-10">
          <span className="text-[9px] text-white/40">विज्ञापन</span>
          <button className="bg-white/90 text-[10px] font-bold px-3 py-1 rounded-md ad-cta-blink"
            style={{ color: "#C41E3A" }}>
            {t(ad.cta, ad.ctaEn)}
          </button>
        </div>
      </div>
    </div>
  );
}
