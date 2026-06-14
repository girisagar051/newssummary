"use client";
import { useLang } from "@/context/LanguageContext";
import { AUTHOR_ITEMS } from "@/lib/mockData";

export default function AuthorsSection() {
  const { t } = useLang();

  return (
    <section>
      <div className="section-head">
        <div className="section-head-accent" />
        <svg className="w-4 h-4 text-[var(--red)]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
          <circle cx="9" cy="7" r="4"/>
          <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
          <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
        </svg>
        <h2 className="text-sm font-bold text-[var(--ink)] headline">{t("हाम्रा लेखकहरू", "Our Columnists")}</h2>
        <a href="#" className="ml-auto text-xs text-[var(--red)] hover:underline font-medium flex items-center gap-1">
          {t("सबै", "All")}
          <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M9 18l6-6-6-6"/></svg>
        </a>
      </div>

      {/* Horizontal scroll of author cards */}
      <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide w-full min-w-0">
        {AUTHOR_ITEMS.map((a) => (
          <article key={a.id} className="news-card rounded-xl p-4 cursor-pointer group flex-shrink-0 w-[180px] text-center">
            {/* Avatar */}
            <div className="mx-auto w-14 h-14 rounded-full flex items-center justify-center text-white text-lg font-bold headline mb-2.5 border-2 border-white shadow-sm"
              style={{ background: a.color }}>
              {a.initials}
            </div>
            <div className="text-xs font-bold text-[var(--ink)] headline group-hover:text-[var(--red)] transition-colors">{t(a.name, a.nameEn)}</div>
            <div className="text-[10px] text-[var(--ink-3)] mt-0.5">{t(a.role, a.roleEn)}</div>
            {/* Source badge */}
            <div className="mt-1.5 inline-block text-[9px] font-semibold px-2 py-0.5 rounded-full border border-[var(--border)] text-[var(--ink-3)]">
              {a.source}
            </div>
            {/* Latest article preview */}
            <p className="text-[10px] text-[var(--ink-2)] mt-2.5 line-clamp-2 text-left leading-relaxed">
              {t(a.latestTitle, a.latestTitleEn)}
            </p>
            {/* Article count */}
            <div className="mt-2.5 flex items-center gap-1 text-[10px] text-[var(--ink-3)]">
              <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                <polyline points="14 2 14 8 20 8"/>
              </svg>
              {a.articleCount} {t("लेख", "articles")}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
