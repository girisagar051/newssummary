"use client";
import { useLang } from "@/context/LanguageContext";
import { INTEREST_TAGS } from "@/lib/mockData";

interface Props {
  selected: string[];
  onChange: (tags: string[]) => void;
}

export default function InterestTags({ selected, onChange }: Props) {
  const { t } = useLang();

  const toggle = (np: string) => {
    if (selected.includes(np)) {
      onChange(selected.filter((s) => s !== np));
    } else {
      onChange([...selected, np]);
    }
  };

  return (
    <div className="news-card rounded-xl overflow-hidden">
      <div className="section-head px-4 pt-3 pb-2.5 mb-0 border-b border-[var(--border)]">
        <div className="section-head-accent" />
        <svg className="w-4 h-4 text-[var(--red)]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/>
        </svg>
        <span className="text-xs font-bold text-[var(--ink)] headline">{t("तपाईंको रुचि", "Your Interests")}</span>
      </div>
      <div className="px-4 py-3">
        <div className="flex flex-wrap gap-1.5">
          {INTEREST_TAGS.map((tag) => {
            const isSelected = selected.includes(tag.np);
            return (
              <button key={tag.np} onClick={() => toggle(tag.np)}
                className={`px-3 py-1 rounded-full text-[11px] border transition-all font-medium ${
                  isSelected
                    ? "bg-red-50 border-[var(--red)] text-[var(--red)]"
                    : "border-[var(--border)] text-[var(--ink-3)] hover:border-[var(--ink-3)]"
                }`}>
                {t(tag.np, tag.en)}
              </button>
            );
          })}
        </div>
        <p className="text-[10px] text-[var(--ink-3)] mt-3 flex items-center gap-1.5">
          <svg className="w-3 h-3 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/></svg>
          {t("हाम्रो AI ले तपाईंको रुचि ट्र्याक गर्दैछ", "Our AI tracks your interests")}
        </p>
      </div>
    </div>
  );
}
