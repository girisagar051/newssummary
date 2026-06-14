"use client";
import { useState, useMemo, useEffect } from "react";
import { useLang } from "@/context/LanguageContext";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";

import Topbar from "@/components/Topbar";
import BreakingTicker from "@/components/BreakingTicker";
import HeroGrid from "@/components/HeroGrid";
import NewsFeed from "@/components/NewsFeed";
import AdBanner from "@/components/AdBanner";
import VideoSection from "@/components/VideoSection";
import PodcastSection from "@/components/PodcastSection";
import AuthorsSection from "@/components/AuthorsSection";
import ForYouSection from "@/components/ForYouSection";

import SubscriptionBox from "@/components/sidebar/SubscriptionBox";
import TrendingWidget from "@/components/sidebar/TrendingWidget";
import SourceFilter from "@/components/sidebar/SourceFilter";
import InterestTags from "@/components/sidebar/InterestTags";

import { NEWS_ITEMS, TRENDING_TOPICS, ADS, SOURCES } from "@/lib/mockData";

const ALL_SOURCES = SOURCES.map((s) => s.name);

export default function HomePage() {
  const { t } = useLang();
  const { user, toggleSource } = useAuth();

  const [localSources, setLocalSources] = useState<string[]>(ALL_SOURCES.slice(0, 4));
  const activeSources = user ? user.preferredSources : localSources;

  const [interests, setInterests] = useState<string[]>(
    user ? user.interests : ["राजनीति", "खेलकुद", "स्वास्थ्य", "अर्थतन्त्र"]
  );

  useEffect(() => {
    if (user) setInterests(user.interests);
  }, [user]);

  const handleSourceToggle = (sources: string[]) => {
    if (user) {
      const added = sources.filter((s) => !activeSources.includes(s));
      const removed = activeSources.filter((s) => !sources.includes(s));
      [...added, ...removed].forEach((s) => toggleSource(s));
    } else {
      setLocalSources(sources);
    }
  };

  const filteredNews = useMemo(() => {
    return NEWS_ITEMS.filter((item) => activeSources.includes(item.source));
  }, [activeSources]);

  const featured = filteredNews.find((i) => i.isFeatured) ?? filteredNews[0];
  const secondary = filteredNews.filter((i) => i.id !== featured?.id).slice(0, 3);
  const feedItems = filteredNews.filter((i) => i.id !== featured?.id).slice(3);

  const forYouItems = useMemo(() => {
    return NEWS_ITEMS.filter(
      (i) => interests.includes(i.category) || interests.includes(i.categoryEn)
    ).sort((a, b) => b.interestScore - a.interestScore).slice(0, 6);
  }, [interests]);

  return (
    <div className="min-h-screen flex flex-col">
      <Topbar />
      <BreakingTicker />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 py-5">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-6">

          {/* ── Main content column ── */}
          <div className="flex flex-col gap-6 min-w-0">

            {/* Source banner when logged in */}
            {user && (
              <div className="flex items-center justify-between bg-red-50 border border-red-100 rounded-xl px-4 py-2.5">
                <p className="text-xs text-[var(--red)] flex items-center gap-1.5">
                  <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 6l10.455-1.624L12 2l.545 2.376L23 6l-11 1.624L12 22l-.545-14.376z"/></svg>
                  {t(`${user.preferredSources.length} स्रोतहरूबाट समाचार देखाइँदैछ`, `Showing news from ${user.preferredSources.length} sources`)}
                </p>
                <Link href="/account" className="text-xs text-[var(--red)] font-semibold hover:underline">
                  {t("स्रोत परिवर्तन", "Change sources")} →
                </Link>
              </div>
            )}

            {/* Hero grid */}
            {featured ? (
              <HeroGrid featured={featured} secondary={secondary} />
            ) : (
              <div className="text-center py-16 text-[var(--ink-3)] border border-[var(--border)] rounded-xl">
                <div className="text-4xl mb-3">📭</div>
                <p className="text-sm">{t("चयनित स्रोतहरूमा समाचार फेला परेन", "No news found for selected sources")}</p>
                <button onClick={() => handleSourceToggle(ALL_SOURCES)} className="text-xs text-[var(--red)] mt-2 inline-block hover:underline">
                  {t("सबै स्रोत सक्रिय गर्नुहोस्", "Enable all sources")}
                </button>
              </div>
            )}

            {/* Leaderboard ad (728×90) */}
            <AdBanner ad={ADS[0]} variant="leaderboard" />

            {/* Main news feed */}
            {feedItems.length > 0 && (
              <NewsFeed items={feedItems.slice(0, 5)} title={{ np: "ताजा समाचार", en: "Latest News" }} />
            )}

            {/* Video section */}
            <VideoSection />

            {/* Strip ad (mobile-style) */}
            <AdBanner ad={ADS[3] ?? ADS[1]} variant="strip" />

            {/* Podcast section */}
            <PodcastSection />

            {/* Authors section */}
            <AuthorsSection />

            {/* More news */}
            {feedItems.length > 5 && (
              <NewsFeed items={feedItems.slice(5)} title={{ np: "थप समाचार", en: "More News" }} />
            )}
          </div>

          {/* ── Right sidebar ── */}
          <aside className="flex flex-col gap-4 min-w-0">

            {/* User card OR subscription box */}
            {user ? (
              <div className="news-card rounded-xl p-4">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-full bg-[var(--red)] flex items-center justify-center text-white font-bold headline">
                    {user.name?.[0] ?? "U"}
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-[var(--ink)]">{user.name}</div>
                    <div className="text-[11px] text-[var(--ink-3)]">{t("स्वागत छ!", "Welcome back!")}</div>
                  </div>
                </div>
                <Link href="/account" className="block w-full text-center text-xs border border-[var(--border)] rounded-lg py-2 text-[var(--ink-2)] hover:border-[var(--red)] hover:text-[var(--red)] transition-colors">
                  {t("खाता सेटिङ", "Account Settings")} →
                </Link>
              </div>
            ) : (
              <SubscriptionBox />
            )}

            {/* Trending */}
            <TrendingWidget topics={TRENDING_TOPICS} />

            {/* Medium rectangle ad (300×250) */}
            <AdBanner ad={ADS[1]} variant="medium-rect" />

            {/* Source filter */}
            <SourceFilter active={activeSources} onChange={handleSourceToggle} />
            {user && (
              <div className="text-[10px] text-[var(--ink-3)] text-center -mt-2">
                {t("स्रोत परिवर्तन खातामा सेभ हुन्छ", "Source changes save to your account")}
              </div>
            )}

            {/* Half-page ad (300×600 → rendered as 300×400 here) */}
            <AdBanner ad={ADS[2] ?? ADS[0]} variant="half-page" />

            {/* Interest tags */}
            <InterestTags
              selected={interests}
              onChange={(tags) => {
                setInterests(tags);
                if (user) user.interests = tags;
              }}
            />
          </aside>
        </div>
      </main>

      {/* For You section */}
      {forYouItems.length > 0 && (
        <div className="border-t border-[var(--border)] bg-[var(--bg-card)]">
          <ForYouSection items={forYouItems} />
        </div>
      )}

      {/* Footer */}
      <footer className="bg-[var(--ink)] text-gray-400 mt-auto">
        <div className="max-w-7xl mx-auto px-4 py-10">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-7 h-7 bg-[var(--red)] rounded-lg flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v2"/><path d="M18 14H6"/><path d="M18 10H6"/></svg>
                </div>
                <span className="text-white text-sm font-bold headline">खबरपाटी</span>
              </div>
              <p className="text-xs leading-relaxed">
                {t("नेपालको स्मार्ट न्यूज हब — AI-powered समाचार एग्रीगेटर", "Nepal's smart news hub — AI-powered news aggregator")}
              </p>
            </div>
            <div>
              <h4 className="text-white text-xs font-semibold mb-3">{t("समाचार स्रोत", "Sources")}</h4>
              <ul className="text-xs space-y-2">
                {SOURCES.map((s) => (
                  <li key={s.name}><a href={s.url} target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">{s.name}</a></li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-white text-xs font-semibold mb-3">{t("सेवाहरू", "Services")}</h4>
              <ul className="text-xs space-y-2">
                <li><a href="#" className="hover:text-white transition-colors">{t("इमेल अलर्ट", "Email Alerts")}</a></li>
                <li><a href="#" className="hover:text-white transition-colors">WhatsApp {t("सूचना", "Alerts")}</a></li>
                <li><a href="#" className="hover:text-white transition-colors">SMS {t("सूचना", "Alerts")}</a></li>
                <li><a href="#" className="hover:text-white transition-colors">{t("विज्ञापन", "Advertise")}</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white text-xs font-semibold mb-3">{t("सम्पर्क", "Contact")}</h4>
              <ul className="text-xs space-y-2">
                <li><a href="#" className="hover:text-white transition-colors">{t("हाम्रोबारे", "About Us")}</a></li>
                <li><a href="#" className="hover:text-white transition-colors">{t("गोपनीयता नीति", "Privacy Policy")}</a></li>
                <li><a href="#" className="hover:text-white transition-colors">{t("प्रयोगका सर्तहरू", "Terms of Use")}</a></li>
                <li><a href="mailto:hello@khabarpati.com" className="hover:text-white transition-colors">hello@khabarpati.com</a></li>
              </ul>
            </div>
          </div>
          {/* Social icons row */}
          <div className="border-t border-gray-800 pt-5 flex items-center justify-between text-[11px] gap-4 flex-wrap">
            <span>© 2025 खबरपाटी. {t("सर्वाधिकार सुरक्षित।", "All rights reserved.")}</span>
            <div className="flex items-center gap-4">
              {[
                { label: "Facebook", path: "M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" },
                { label: "Twitter", path: "M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" },
              ].map(({ label, path }) => (
                <a key={label} href="#" aria-label={label} className="text-gray-500 hover:text-white transition-colors">
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d={path} /></svg>
                </a>
              ))}
              <span>{t("काठमाडौं, नेपाल", "Kathmandu, Nepal")}</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
