"use client";
import { useLang } from "@/context/LanguageContext";
import { type NewsItem } from "@/lib/mockData";

function catClass(cat: string): string {
  const map: Record<string, string> = {
    "राजनीति": "cat-राजनीति", "Politics": "cat-राजनीति",
    "अर्थतन्त्र": "cat-अर्थतन्त्र", "Economy": "cat-अर्थतन्त्र",
    "खेलकुद": "cat-खेलकुद", "Sports": "cat-खेलकुद",
    "प्रविधि": "cat-प्रविधि", "Technology": "cat-प्रविधि",
    "मनोरञ्जन": "cat-मनोरञ्जन", "Entertainment": "cat-मनोरञ्जन",
    "स्वास्थ्य": "cat-स्वास्थ्य", "Health": "cat-स्वास्थ्य",
    "स्थानीय": "cat-स्थानीय", "Local": "cat-स्थानीय",
  };
  return map[cat] ?? "";
}

const THUMB_BG = [
  "#e9e4da", "#dce8e0", "#e8e0d9", "#d9e0e8", "#e8dce0", "#e0dce8",
];

interface Props {
  items: NewsItem[];
  title?: { np: string; en: string };
  onSeeAll?: () => void;
}

export default function NewsFeed({
  items,
  title = { np: "ताजा समाचार", en: "Latest News" },
  onSeeAll,
}: Props) {
  const { t } = useLang();

  return (
    <section>
      <div className="section-head">
        <div className="section-head-accent" />
        <svg className="w-4 h-4 text-[var(--red)]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v2"/>
          <path d="M16 13H6"/><path d="M16 17H6"/><path d="M10 9H6"/>
        </svg>
        <h2 className="text-sm font-bold text-[var(--ink)] headline">{t(title.np, title.en)}</h2>
        {onSeeAll && (
          <button onClick={onSeeAll} className="ml-auto text-xs text-[var(--red)] hover:underline font-medium flex items-center gap-1">
            {t("सबै", "See all")}
            <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M9 18l6-6-6-6"/></svg>
          </button>
        )}
      </div>

      <div className="flex flex-col">
        {items.map((item, idx) => {
          const catLabel = t(item.category, item.categoryEn);
          return (
            <article key={item.id} className="news-card flex gap-3 p-3 rounded-xl cursor-pointer group mb-1.5 last:mb-0">
              {/* Thumb */}
              <div className="w-[76px] h-[64px] rounded-lg flex items-center justify-center text-2xl shrink-0 border border-[var(--border)]"
                style={{ background: THUMB_BG[idx % THUMB_BG.length] }}>
                <span className="opacity-50 select-none">{item.emoji}</span>
              </div>

              {/* Body */}
              <div className="flex-1 min-w-0">
                <h3 className="headline text-sm font-semibold text-[var(--ink)] leading-snug line-clamp-2 group-hover:text-[var(--red)] transition-colors">
                  {t(item.title, item.titleEn)}
                </h3>
                <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                  <span className={`text-[10px] font-semibold px-2 py-0.5 rounded ${catClass(catLabel)}`}>
                    {catLabel}
                  </span>
                  <span className="text-[10px] text-[var(--ink-3)]">{item.source}</span>
                  <span className="text-[10px] text-[var(--ink-3)]">·</span>
                  <span className="text-[10px] text-[var(--ink-3)]">{t(item.timeAgo, item.timeAgoEn)}</span>
                  {item.isBreaking && (
                    <span className="text-[9px] font-bold text-[var(--red)] flex items-center gap-1">
                      <span className="w-1 h-1 rounded-full bg-[var(--red)] animate-pulse" />
                      {t("ब्रेकिंग", "Breaking")}
                    </span>
                  )}
                </div>
                {/* Interest bar */}
                <div className="mt-2 h-[2px] bg-[var(--border)] rounded-full overflow-hidden">
                  <div className="h-full bg-[var(--red)] rounded-full transition-all" style={{ width: `${item.interestScore}%` }} />
                </div>
              </div>

              {/* Save icon */}
              <button className="shrink-0 self-start mt-0.5 opacity-0 group-hover:opacity-100 transition-opacity text-[var(--ink-3)] hover:text-[var(--red)]">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>
                </svg>
              </button>
            </article>
          );
        })}
      </div>
    </section>
  );
}
