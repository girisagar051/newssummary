"use client";
import { useLang } from "@/context/LanguageContext";
import { PODCAST_ITEMS } from "@/lib/mockData";

function MicIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 text-[var(--red)]">
      <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/>
      <path d="M19 10v2a7 7 0 0 1-14 0v-2"/>
      <line x1="12" y1="19" x2="12" y2="23"/>
      <line x1="8" y1="23" x2="16" y2="23"/>
    </svg>
  );
}

function PlayMiniIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
      <polygon points="5 3 19 12 5 21 5 3"/>
    </svg>
  );
}

// Sound wave bars
function SoundWave({ color }: { color: string }) {
  return (
    <div className="flex items-center gap-[3px] h-6">
      {[3, 5, 7, 5, 8, 6, 4, 7, 5, 3].map((h, i) => (
        <div
          key={i}
          className="w-[3px] rounded-full opacity-60"
          style={{
            height: `${h * 2}px`,
            background: color,
            animation: `adBounce ${0.6 + i * 0.08}s ease infinite`,
          }}
        />
      ))}
    </div>
  );
}

export default function PodcastSection() {
  const { t } = useLang();

  return (
    <section>
      <div className="section-head">
        <div className="section-head-accent" />
        <MicIcon />
        <h2 className="text-sm font-bold text-[var(--ink)] headline">{t("पडकास्ट", "Podcasts")}</h2>
        <a href="#" className="ml-auto text-xs text-[var(--red)] hover:underline font-medium flex items-center gap-1">
          {t("सबै", "All")}
          <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M9 18l6-6-6-6"/></svg>
        </a>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {PODCAST_ITEMS.map((p) => (
          <article key={p.id} className="news-card rounded-xl p-4 cursor-pointer group">
            <div className="flex gap-3">
              {/* Avatar */}
              <div
                className="w-14 h-14 rounded-xl flex items-center justify-center text-white text-lg font-bold headline shrink-0"
                style={{ background: p.color }}
              >
                {p.episode}
              </div>
              {/* Info */}
              <div className="flex-1 min-w-0">
                <h3 className="text-xs font-semibold text-[var(--ink)] leading-snug line-clamp-2 group-hover:text-[var(--red)] transition-colors headline">
                  {t(p.title, p.titleEn)}
                </h3>
                <div className="text-[10px] text-[var(--ink-3)] mt-1 flex items-center gap-1">
                  <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                    <circle cx="12" cy="7" r="4"/>
                  </svg>
                  {t(p.host, p.hostEn)}
                </div>
              </div>
            </div>

            {/* Player bar */}
            <div className="mt-3 flex items-center justify-between gap-3">
              <SoundWave color={p.color} />
              <div className="flex items-center gap-3 text-[10px] text-[var(--ink-3)]">
                <span className="flex items-center gap-1">
                  <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10"/>
                    <polyline points="12 6 12 12 16 14"/>
                  </svg>
                  {p.duration}
                </span>
                <span>{t(p.timeAgo, p.timeAgoEn)}</span>
              </div>
              <button
                className="w-8 h-8 rounded-full flex items-center justify-center text-white shrink-0 hover:opacity-80 transition-opacity"
                style={{ background: p.color }}
              >
                <PlayMiniIcon />
              </button>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
