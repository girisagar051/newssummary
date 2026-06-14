"use client";
import { useLang } from "@/context/LanguageContext";
import { type NewsItem } from "@/lib/mockData";

const BG_COLORS = [
  "#1e293b", "#1e3a5f", "#14532d", "#3b0764", "#7c2d12", "#0f4c5c",
];

function catClass(cat: string): string {
  const map: Record<string, string> = {
    "राजनीति": "cat-राजनीति", "Politics": "cat-राजनीति",
    "अर्थतन्त्र": "cat-अर्थतन्त्र", "Economy": "cat-अर्थतन्त्र",
    "खेलकुद": "cat-खेलकुद", "Sports": "cat-खेलकुद",
    "प्रविधि": "cat-प्रविधि", "Technology": "cat-प्रविधि",
    "मनोरञ्जन": "cat-मनोरञ्जन", "Entertainment": "cat-मनोरञ्जन",
    "स्वास्थ्य": "cat-स्वास्थ्य", "Health": "cat-स्वास्थ्य",
  };
  return map[cat] ?? "";
}

interface Props {
  featured: NewsItem;
  secondary: NewsItem[];
}

export default function HeroGrid({ featured, secondary }: Props) {
  const { t } = useLang();

  return (
    <section>
      {/* Section header */}
      <div className="section-head">
        <div className="section-head-accent" />
        <svg className="w-4 h-4 text-[var(--red)]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
        </svg>
        <h2 className="text-sm font-bold text-[var(--ink)] headline">{t("मुख्य समाचार", "Top Stories")}</h2>
      </div>

      {/* Newspaper grid: large featured left + stacked right */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {/* Featured — takes 2 columns */}
        <article className="md:col-span-2 news-card rounded-xl overflow-hidden cursor-pointer group">
          {/* Thumb */}
          <div className="relative flex items-center justify-center h-56 md:h-72"
            style={{ background: BG_COLORS[0] }}>
            <span className="text-7xl opacity-20 select-none">{featured.emoji}</span>
            <span className="absolute top-3 left-3 bg-black/60 text-white text-[10px] font-medium px-2 py-0.5 rounded">
              {featured.source}
            </span>
            <span className={`absolute top-3 right-3 text-[10px] font-semibold px-2.5 py-0.5 rounded ${catClass(t(featured.category, featured.categoryEn))}`}>
              {t(featured.category, featured.categoryEn)}
            </span>
            {featured.isBreaking && (
              <div className="absolute bottom-3 left-3 flex items-center gap-1.5 bg-[var(--red)] text-white text-[10px] font-bold px-2.5 py-1 rounded-full">
                <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                {t("ब्रेकिंग", "Breaking")}
              </div>
            )}
          </div>
          <div className="p-4">
            <h2 className="headline text-lg font-bold text-[var(--ink)] leading-snug group-hover:text-[var(--red)] transition-colors">
              {t(featured.title, featured.titleEn)}
            </h2>
            <p className="text-sm text-[var(--ink-2)] mt-2 leading-relaxed line-clamp-2">
              {t(featured.excerpt, featured.excerptEn)}
            </p>
            <div className="flex items-center gap-3 mt-3 text-[11px] text-[var(--ink-3)]">
              <span className="flex items-center gap-1">
                <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                {t(featured.timeAgo, featured.timeAgoEn)}
              </span>
              <span className="flex items-center gap-1">
                <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                {featured.views}
              </span>
              <button className="ml-auto flex items-center gap-1 hover:text-[var(--red)] transition-colors">
                <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>
                {t("सेयर", "Share")}
              </button>
            </div>
          </div>
        </article>

        {/* Secondary stack */}
        <div className="flex flex-col gap-3">
          {secondary.slice(0, 3).map((item, i) => (
            <article key={item.id} className="news-card rounded-xl overflow-hidden cursor-pointer group flex md:flex-col">
              {/* Thumb — short */}
              <div className="relative flex items-center justify-center w-24 md:w-full shrink-0 md:h-28"
                style={{ background: BG_COLORS[(i + 1) % BG_COLORS.length] }}>
                <span className="text-3xl opacity-20 select-none">{item.emoji}</span>
                <span className={`absolute top-1.5 left-1.5 text-[9px] font-semibold px-1.5 py-0.5 rounded ${catClass(t(item.category, item.categoryEn))}`}>
                  {t(item.category, item.categoryEn)}
                </span>
              </div>
              <div className="p-3 flex-1">
                <h3 className="headline text-xs font-semibold text-[var(--ink)] leading-snug line-clamp-3 group-hover:text-[var(--red)] transition-colors">
                  {t(item.title, item.titleEn)}
                </h3>
                <div className="flex items-center gap-2 mt-2 text-[10px] text-[var(--ink-3)]">
                  <span>{item.source}</span>
                  <span>·</span>
                  <span>{t(item.timeAgo, item.timeAgoEn)}</span>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
