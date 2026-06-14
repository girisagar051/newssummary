"use client";
import { useLang } from "@/context/LanguageContext";
import { type AdItem } from "@/lib/mockData";

interface Props {
  ad: AdItem;
  variant?: "strip" | "sidebar";
}

export default function AdSlot({ ad, variant = "strip" }: Props) {
  const { t } = useLang();

  if (variant === "sidebar") {
    return (
      <div className="rounded-xl border border-dashed border-gray-300 bg-gray-50 p-4 text-center">
        <div className="text-[10px] text-gray-400 mb-2 uppercase tracking-wide">
          {t("विज्ञापन", "Advertisement")}
        </div>
        <div className="text-2xl mb-2">{ad.emoji}</div>
        <div className="text-sm font-medium text-gray-800 mb-1">{ad.company}</div>
        <div className="text-xs text-gray-500 mb-3 leading-relaxed">
          {t(ad.tagline, ad.taglineEn)}
        </div>
        <button className="w-full bg-red-700 text-white text-xs py-1.5 rounded-lg hover:bg-red-800 transition-colors">
          {t(ad.cta, ad.ctaEn)}
        </button>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-dashed border-gray-200 bg-gray-50 p-4 flex items-center justify-between gap-4">
      <div className="flex items-center gap-3">
        <span className="text-2xl">{ad.emoji}</span>
        <div>
          <div className="text-[10px] text-gray-400 mb-0.5 uppercase tracking-wide">
            {t("विज्ञापन", "Advertisement")} · {ad.company}
          </div>
          <div className="text-sm font-medium text-gray-800">
            {t(ad.tagline, ad.taglineEn)}
          </div>
        </div>
      </div>
      <div className="shrink-0 flex items-center gap-2">
        <span className="text-[9px] bg-gray-200 text-gray-500 px-2 py-0.5 rounded">
          Sponsored
        </span>
        <button className="bg-red-700 text-white text-xs px-4 py-1.5 rounded-lg hover:bg-red-800 transition-colors whitespace-nowrap">
          {t(ad.cta, ad.ctaEn)}
        </button>
      </div>
    </div>
  );
}
