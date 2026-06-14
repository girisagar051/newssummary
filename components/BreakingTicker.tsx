"use client";
import { useLang } from "@/context/LanguageContext";
import { BREAKING_TICKERS } from "@/lib/mockData";

export default function BreakingTicker() {
  const { t } = useLang();
  const tickerText = BREAKING_TICKERS.map((b) => t(b.np, b.en)).join("     ·     ");
  const doubled = tickerText + "     ·     " + tickerText;

  return (
    <div className="bg-[var(--red)] text-white flex items-center gap-0 overflow-hidden h-9 text-xs border-b border-[var(--red-dark)]">
      {/* Live badge */}
      <div className="shrink-0 h-full flex items-center gap-2 bg-[var(--red-dark)] px-4 border-r border-white/20">
        {/* Live SVG icon */}
        <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="2" fill="white" stroke="none" className="animate-pulse" />
          <path d="M16.24 7.76a6 6 0 0 1 0 8.49m-8.48-.01a6 6 0 0 1 0-8.49m11.31-2.82a10 10 0 0 1 0 14.14m-14.14 0a10 10 0 0 1 0-14.14"/>
        </svg>
        <span className="font-bold text-[11px] tracking-widest uppercase">{t("ब्रेकिंग", "LIVE")}</span>
      </div>

      {/* Scrolling text */}
      <div className="overflow-hidden flex-1 relative">
        <div className="whitespace-nowrap font-medium tracking-wide" style={{ animation: "marquee 36s linear infinite" }}>
          {doubled}
        </div>
      </div>

      {/* Right mute/share icons */}
      <div className="shrink-0 flex items-center gap-3 px-4 border-l border-white/20 h-full">
        <button aria-label="Share" className="opacity-70 hover:opacity-100 transition-opacity">
          <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/>
            <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>
          </svg>
        </button>
      </div>

      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  );
}
