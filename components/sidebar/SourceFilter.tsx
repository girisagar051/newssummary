"use client";
import { useLang } from "@/context/LanguageContext";
import { SOURCES } from "@/lib/mockData";

interface Props {
  active: string[];
  onChange: (sources: string[]) => void;
}

export default function SourceFilter({ active, onChange }: Props) {
  const { t } = useLang();

  const toggle = (name: string) => {
    if (active.includes(name)) {
      if (active.length > 1) onChange(active.filter((s) => s !== name));
    } else {
      onChange([...active, name]);
    }
  };

  return (
    <div className="news-card rounded-xl overflow-hidden">
      <div className="section-head px-4 pt-3 pb-2.5 mb-0 border-b border-[var(--border)]">
        <div className="section-head-accent" />
        <svg className="w-4 h-4 text-[var(--red)]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M1 6l10.455-1.624L12 2l.545 2.376L23 6l-11 1.624L12 22l-.545-14.376z"/>
        </svg>
        <span className="text-xs font-bold text-[var(--ink)] headline">{t("समाचार स्रोत", "News Sources")}</span>
      </div>
      <div className="px-4 py-3">
        <p className="text-[11px] text-[var(--ink-3)] mb-2.5">{t("समाचार स्रोत छान्नुहोस्", "Select your sources")}</p>
        <div className="flex flex-wrap gap-1.5">
          {SOURCES.map((src) => {
            const isActive = active.includes(src.name);
            return (
              <button key={src.name} onClick={() => toggle(src.name)}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] border transition-all font-medium ${
                  isActive
                    ? "border-[var(--red)] bg-red-50 text-[var(--red)]"
                    : "border-[var(--border)] text-[var(--ink-3)] hover:border-[var(--ink-3)]"
                }`}>
                <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: src.color }} />
                {src.name}
                {isActive && (
                  <svg className="w-2.5 h-2.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
