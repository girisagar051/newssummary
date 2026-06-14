"use client";
import { useLang } from "@/context/LanguageContext";
import { type TrendingTopic } from "@/lib/mockData";

interface Props {
  topics: TrendingTopic[];
}

export default function TrendingWidget({ topics }: Props) {
  const { t } = useLang();

  return (
    <div className="news-card rounded-xl overflow-hidden">
      <div className="section-head px-4 pt-3 pb-2.5 mb-0 border-b border-[var(--border)]">
        <div className="section-head-accent" />
        <svg className="w-4 h-4 text-[var(--red)]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/>
        </svg>
        <span className="text-xs font-bold text-[var(--ink)] headline">{t("ट्रेन्डिङ", "Trending")}</span>
      </div>
      <div className="divide-y divide-[var(--border)]">
        {topics.map((topic) => (
          <button key={topic.rank} className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-[var(--bg)] transition-colors text-left group">
            <span className="text-sm font-bold text-[var(--border)] min-w-[18px] tabular-nums">{topic.rank}</span>
            <span className="flex-1 text-xs text-[var(--ink-2)] group-hover:text-[var(--red)] transition-colors">
              {t(topic.topic, topic.topicEn)}
            </span>
            <span className="text-[10px] text-[var(--ink-3)] shrink-0">{topic.count}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
