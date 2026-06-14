"use client";
import { useLang } from "@/context/LanguageContext";
import { VIDEO_ITEMS } from "@/lib/mockData";

const CAT_DOT: Record<string, string> = {
  "राजनीति": "#C41E3A", "Politics": "#C41E3A",
  "खेलकुद": "#b45309", "Sports": "#b45309",
  "अर्थतन्त्र": "#15803d", "Economy": "#15803d",
  "प्रविधि": "#1d4ed8", "Technology": "#1d4ed8",
  "स्थानीय": "#0f766e", "Local": "#0f766e",
};

// SVG play icon
function PlayIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
      <circle cx="12" cy="12" r="12" fill="rgba(0,0,0,0.5)" />
      <polygon points="10,8 17,12 10,16" fill="white" />
    </svg>
  );
}

export default function VideoSection() {
  const { t } = useLang();

  return (
    <section>
      {/* Section header */}
      <div className="section-head">
        <div className="section-head-accent" />
        <svg className="w-4 h-4 text-[var(--red)]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polygon points="5 3 19 12 5 21 5 3" />
        </svg>
        <h2 className="text-sm font-bold text-[var(--ink)] headline">{t("भिडियो समाचार", "Video News")}</h2>
        <a href="#" className="ml-auto text-xs text-[var(--red)] hover:underline font-medium flex items-center gap-1">
          {t("सबै", "All")}
          <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M9 18l6-6-6-6"/></svg>
        </a>
      </div>

      {/* Horizontal scroll */}
      <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide w-full min-w-0">
        {VIDEO_ITEMS.map((v) => {
          const catColor = CAT_DOT[t(v.category, v.categoryEn)] ?? "#6b6962";
          return (
            <article
              key={v.id}
              className="news-card rounded-xl overflow-hidden cursor-pointer group flex-shrink-0 w-[220px]"
            >
              {/* Thumbnail */}
              <div
                className="relative flex items-center justify-center"
                style={{ height: 124, background: v.bgColor }}
              >
                <span className="text-5xl opacity-25 select-none">{v.emoji}</span>
                {/* Play button */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-10 h-10 opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all">
                    <PlayIcon />
                  </div>
                </div>
                {/* Duration badge */}
                <span className="absolute bottom-2 right-2 bg-black/70 text-white text-[10px] font-medium px-1.5 py-0.5 rounded">
                  {v.duration}
                </span>
                {/* Category dot */}
                <span className="absolute top-2 left-2 w-2 h-2 rounded-full" style={{ background: catColor }} />
              </div>

              {/* Content */}
              <div className="p-2.5">
                <h3 className="text-xs font-semibold text-[var(--ink)] leading-snug line-clamp-2 group-hover:text-[var(--red)] transition-colors headline">
                  {t(v.title, v.titleEn)}
                </h3>
                <div className="flex items-center gap-1.5 mt-1.5 text-[10px] text-[var(--ink-3)]">
                  <span className="font-medium">{v.channel}</span>
                  <span>·</span>
                  {/* View icon */}
                  <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                    <circle cx="12" cy="12" r="3"/>
                  </svg>
                  <span>{v.views}</span>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
