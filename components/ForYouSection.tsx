"use client";
import { useLang } from "@/context/LanguageContext";
import { type NewsItem } from "@/lib/mockData";

const BG_COLORS = ["#1e293b", "#14532d", "#1e3a5f", "#7c2d12", "#3b0764", "#0f4c5c"];

interface Props {
  items: NewsItem[];
}

export default function ForYouSection({ items }: Props) {
  const { t } = useLang();
  if (items.length === 0) return null;

  return (
    <section className="max-w-7xl mx-auto px-4 py-7">
      <div className="section-head">
        <div className="section-head-accent" />
        <svg className="w-4 h-4 text-[var(--red)]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
        </svg>
        <h2 className="text-sm font-bold text-[var(--ink)] headline">{t("तपाईंका लागि — AI सिफारिस", "For You — AI Picks")}</h2>
        <span className="text-[10px] text-[var(--ink-3)] ml-1 hidden sm:inline">{t("तपाईंको रुचिमा आधारित", "Based on your interests")}</span>
        <button className="ml-auto text-xs text-[var(--red)] hover:underline font-medium flex items-center gap-1">
          {t("कसरी काम गर्छ?", "How it works?")}
          <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M9 18l6-6-6-6"/></svg>
        </button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {items.map((item, i) => (
          <article key={item.id} className="news-card rounded-xl overflow-hidden cursor-pointer group">
            <div className="h-20 flex items-center justify-center relative" style={{ background: BG_COLORS[i % BG_COLORS.length] }}>
              <span className="text-3xl opacity-25 select-none">{item.emoji}</span>
              {/* Match score badge */}
              <div className="absolute top-1.5 right-1.5 bg-emerald-500/90 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full">
                {item.interestScore}%
              </div>
            </div>
            <div className="p-2.5">
              <p className="headline text-xs font-semibold text-[var(--ink)] leading-snug line-clamp-2 group-hover:text-[var(--red)] transition-colors">
                {t(item.title, item.titleEn)}
              </p>
              <div className="flex items-center gap-1 mt-2 text-[10px] text-[var(--ink-3)]">
                <svg className="w-3 h-3 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                {t(item.timeAgo, item.timeAgoEn)}
              </div>
              {/* Interest bar */}
              <div className="mt-2 h-[2px] bg-[var(--border)] rounded-full overflow-hidden">
                <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${item.interestScore}%` }} />
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
