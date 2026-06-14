"use client";
import { useEffect, useState, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useLang } from "@/context/LanguageContext";
import { NEWS_ITEMS, INTEREST_TAGS, SOURCES } from "@/lib/mockData";
import Topbar from "@/components/Topbar";

type Tab = "notifications" | "sources" | "interests" | "saved" | "subscription";

const SUB_LABELS: Record<string, { np: string; en: string; color: string }> = {
  free:     { np: "निःशुल्क",   en: "Free",      color: "bg-gray-100 text-gray-600" },
  whatsapp: { np: "WhatsApp",   en: "WhatsApp",   color: "bg-green-100 text-green-700" },
  sms:      { np: "SMS",        en: "SMS",        color: "bg-purple-100 text-purple-700" },
  premium:  { np: "प्रिमियम",  en: "Premium",    color: "bg-amber-100 text-amber-700" },
};

const NAV: { id: Tab; icon: string; np: string; en: string }[] = [
  { id: "sources",       icon: "📡", np: "समाचार स्रोत",  en: "News Sources" },
  { id: "notifications", icon: "🔔", np: "सूचना सेटिङ",   en: "Notifications" },
  { id: "interests",     icon: "✨", np: "रुचिहरू",        en: "Interests" },
  { id: "saved",         icon: "🔖", np: "सेभ गरिएका",    en: "Saved" },
  { id: "subscription",  icon: "💳", np: "सदस्यता",        en: "Subscription" },
];

function AccountContent() {
  const { user, openAuth, logout, updateUser, toggleSaved, toggleSource } = useAuth();
  const { t } = useLang();
  const searchParams = useSearchParams();
  const tabParam = searchParams.get("tab") as Tab | null;

  const [activeTab, setActiveTab] = useState<Tab>(tabParam ?? "sources");
  const [saveFeedback, setSaveFeedback] = useState(false);

  // Sync tab if URL param changes
  useEffect(() => {
    if (tabParam && NAV.some((n) => n.id === tabParam)) setActiveTab(tabParam);
  }, [tabParam]);

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Topbar />
        <div className="flex-1 flex items-center justify-center px-4">
          <div className="text-center max-w-sm">
            <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center text-3xl mx-auto mb-4">🔒</div>
            <h2 className="text-base font-medium text-gray-900 mb-2">
              {t("खाता हेर्न साइन इन गर्नुहोस्", "Sign in to view your account")}
            </h2>
            <p className="text-sm text-gray-500 mb-5">
              {t("तपाईंको व्यक्तिगत सेटिङ र सेभ गरिएका समाचारहरू यहाँ उपलब्ध छन्।", "Your personal settings and saved articles are here.")}
            </p>
            <button
              onClick={openAuth}
              className="bg-red-700 text-white px-6 py-2.5 rounded-xl text-sm font-medium hover:bg-red-800 transition-colors"
            >
              {t("साइन इन / दर्ता गर्नुहोस्", "Sign in / Register")}
            </button>
            <div className="mt-4">
              <Link href="/" className="text-xs text-gray-400 hover:text-gray-600">← {t("गृहपृष्ठमा फर्कनुहोस्", "Back to home")}</Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const savedItems = NEWS_ITEMS.filter((n) => user.savedArticles.includes(n.id));
  const sub = SUB_LABELS[user.subscription] ?? SUB_LABELS.free;

  const handleSave = () => {
    setSaveFeedback(true);
    setTimeout(() => setSaveFeedback(false), 2000);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Topbar />

      <div className="max-w-screen-lg mx-auto w-full px-4 py-6">
        <div className="grid grid-cols-1 md:grid-cols-[240px_1fr] gap-5">

          {/* ── Sidebar ── */}
          <aside className="flex flex-col gap-4">
            {/* Profile card */}
            <div className="bg-white rounded-2xl border border-gray-100 p-5 flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center text-red-700 text-xl font-semibold mb-3">
                {user.avatar}
              </div>
              <div className="text-sm font-medium text-gray-900">{user.name}</div>
              <div className="text-xs text-gray-400 mt-0.5">
                {user.email ? user.email : `+977 ${user.phone}`}
              </div>
              <span className={`text-[10px] font-medium px-2.5 py-1 rounded-full mt-2 inline-block ${sub.color}`}>
                {t(sub.np, sub.en)} {t("सदस्य", "Member")}
              </span>
              <div className="text-[11px] text-gray-400 mt-1">{t("सदस्य भएको", "Joined")} {user.joinedDate}</div>
              <button
                onClick={logout}
                className="mt-3 text-xs text-red-500 hover:text-red-700 transition-colors"
              >
                → {t("साइन आउट", "Sign out")}
              </button>
            </div>

            {/* Stats */}
            <div className="bg-white rounded-2xl border border-gray-100 p-4">
              <div className="grid grid-cols-3 gap-2">
                <div className="bg-gray-50 rounded-xl p-2.5 text-center">
                  <div className="text-base font-semibold text-gray-900">{user.savedArticles.length}</div>
                  <div className="text-[10px] text-gray-400">{t("सेभ", "Saved")}</div>
                </div>
                <div className="bg-gray-50 rounded-xl p-2.5 text-center">
                  <div className="text-base font-semibold text-gray-900">{user.preferredSources.length}</div>
                  <div className="text-[10px] text-gray-400">{t("स्रोत", "Sources")}</div>
                </div>
                <div className="bg-gray-50 rounded-xl p-2.5 text-center">
                  <div className="text-base font-semibold text-gray-900">{user.interests.length}</div>
                  <div className="text-[10px] text-gray-400">{t("रुचि", "Topics")}</div>
                </div>
              </div>
            </div>

            {/* Nav */}
            <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
              {NAV.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 text-left text-sm transition-colors border-b border-gray-50 last:border-0 ${
                    activeTab === item.id
                      ? "bg-red-50 text-red-700 font-medium"
                      : "text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  <span className="text-base">{item.icon}</span>
                  <span>{t(item.np, item.en)}</span>
                  {activeTab === item.id && <span className="ml-auto text-red-400 text-xs">›</span>}
                  {item.id === "saved" && user.savedArticles.length > 0 && (
                    <span className={`ml-auto text-[10px] font-medium px-1.5 py-0.5 rounded-full ${activeTab === item.id ? "bg-red-100 text-red-700" : "bg-gray-100 text-gray-500"}`}>
                      {user.savedArticles.length}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </aside>

          {/* ── Main panel ── */}
          <div className="flex flex-col gap-4">

            {/* ════ SOURCES ════ */}
            {activeTab === "sources" && (
              <div className="bg-white rounded-2xl border border-gray-100 p-5">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h2 className="text-sm font-semibold text-gray-900">
                      📡 {t("समाचार स्रोत छान्नुहोस्", "Choose news sources")}
                    </h2>
                    <p className="text-xs text-gray-400 mt-0.5">
                      {t("छानेका स्रोतहरूबाट मात्र समाचार देखाइनेछ।", "News will only show from selected sources.")}
                    </p>
                  </div>
                  <span className="text-xs bg-red-50 text-red-700 px-2.5 py-1 rounded-lg font-medium shrink-0">
                    {user.preferredSources.length}/{SOURCES.length} {t("सक्रिय", "active")}
                  </span>
                </div>

                <div className="flex gap-2 mb-4">
                  <button
                    onClick={() => updateUser({ preferredSources: SOURCES.map((s) => s.name) })}
                    className="text-xs px-3 py-1.5 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors"
                  >
                    {t("सबै छान्नुहोस्", "Select all")}
                  </button>
                  <button
                    onClick={() => updateUser({ preferredSources: [SOURCES[0].name] })}
                    className="text-xs px-3 py-1.5 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors"
                  >
                    {t("सबै हटाउनुहोस्", "Deselect all")}
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {SOURCES.map((src) => {
                    const active = user.preferredSources.includes(src.name);
                    const isLast = user.preferredSources.length === 1 && active;
                    return (
                      <div
                        key={src.name}
                        onClick={() => !isLast && toggleSource(src.name)}
                        className={`flex items-center gap-3 p-3.5 rounded-xl border-2 transition-all ${
                          active ? "border-red-200 bg-red-50" : "border-gray-100 bg-gray-50 opacity-60"
                        } ${isLast ? "cursor-not-allowed" : "cursor-pointer hover:border-red-300"}`}
                      >
                        <div
                          className="w-9 h-9 rounded-xl flex items-center justify-center text-white text-[11px] font-bold shrink-0"
                          style={{ background: src.color }}
                        >
                          {src.name.slice(0, 2)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-medium text-gray-800">{src.name}</div>
                          <a
                            href={src.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="text-[10px] text-gray-400 hover:text-red-700 transition-colors truncate block"
                          >
                            {src.url.replace("https://", "")}
                          </a>
                        </div>
                        <div
                          className={`w-10 h-5 rounded-full transition-colors relative shrink-0 ${active ? "bg-red-700" : "bg-gray-300"}`}
                        >
                          <span className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-all ${active ? "left-5" : "left-0.5"}`} />
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="mt-4 bg-blue-50 border border-blue-100 rounded-xl px-4 py-3 flex items-start gap-2">
                  <span className="text-blue-500">ℹ️</span>
                  <p className="text-xs text-blue-700 leading-relaxed">
                    {t(
                      "प्रत्येक सक्रिय स्रोतबाट नवीनतम १० समाचार देखाइनेछ। हरेक १० मिनेटमा अपडेट।",
                      "Latest 10 articles from each active source. Updates every 10 minutes."
                    )}
                  </p>
                </div>

                <button
                  onClick={handleSave}
                  className={`mt-4 w-full py-2.5 rounded-xl text-sm font-medium transition-all ${saveFeedback ? "bg-green-600 text-white" : "bg-red-700 text-white hover:bg-red-800"}`}
                >
                  {saveFeedback ? `✓ ${t("सेभ भयो!", "Saved!")}` : t("प्राथमिकता सेभ गर्नुहोस्", "Save preferences")}
                </button>
              </div>
            )}

            {/* ════ NOTIFICATIONS ════ */}
            {activeTab === "notifications" && (
              <div className="bg-white rounded-2xl border border-gray-100 p-5">
                <h2 className="text-sm font-semibold text-gray-900 mb-4">
                  🔔 {t("सूचना प्राथमिकता", "Notification preferences")}
                </h2>
                <div className="flex flex-col gap-3">
                  {[
                    {
                      icon: "✉️", np: "इमेल सूचना", en: "Email alerts",
                      key: "notifEmail" as const, free: true,
                      desc: { np: "दैनिक डाइजेस्ट + ब्रेकिङ न्यूज", en: "Daily digest + breaking news" },
                    },
                    {
                      icon: "💬", np: "WhatsApp सूचना", en: "WhatsApp alerts",
                      key: "notifWhatsapp" as const, free: false,
                      desc: { np: "तत्काल पुश सूचना — रु. ९९/महिना", en: "Instant push alerts — NPR 99/mo" },
                    },
                    {
                      icon: "📱", np: "SMS अलर्ट", en: "SMS alerts",
                      key: "notifSms" as const, free: false,
                      desc: { np: "ब्रेकिङ न्यूज मात्र — रु. ४९/महिना", en: "Breaking only — NPR 49/mo" },
                    },
                  ].map((item) => {
                    const locked = !item.free && user.subscription === "free";
                    return (
                      <div
                        key={item.key}
                        className={`flex items-center justify-between p-3.5 rounded-xl border transition-all ${
                          locked ? "border-gray-100 bg-gray-50 opacity-70" : "border-gray-100 bg-gray-50"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 bg-white rounded-lg flex items-center justify-center text-lg border border-gray-100 shrink-0">{item.icon}</div>
                          <div>
                            <div className="text-sm font-medium text-gray-800">{t(item.np, item.en)}</div>
                            <div className="text-xs text-gray-400">{t(item.desc.np, item.desc.en)}</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          {item.free
                            ? <span className="text-[10px] bg-green-100 text-green-700 px-2 py-0.5 rounded font-medium">{t("निःशुल्क", "Free")}</span>
                            : <span className="text-[10px] bg-amber-100 text-amber-700 px-2 py-0.5 rounded font-medium">{t("सशुल्क", "Paid")}</span>
                          }
                          {locked ? (
                            <Link href="/subscribe" className="text-[10px] text-red-600 hover:underline px-2 py-1 border border-red-200 rounded-lg bg-red-50">
                              {t("अनलक", "Unlock")}
                            </Link>
                          ) : (
                            <button
                              onClick={() => updateUser({ [item.key]: !user[item.key] })}
                              className={`w-11 h-6 rounded-full transition-colors relative ${user[item.key] ? "bg-red-700" : "bg-gray-200"}`}
                            >
                              <span className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-all ${user[item.key] ? "left-6" : "left-1"}`} />
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
                {user.subscription === "free" && (
                  <div className="mt-4 bg-amber-50 border border-amber-100 rounded-xl px-4 py-3">
                    <p className="text-xs text-amber-700">
                      💳 {t("WhatsApp/SMS सेवाको लागि सदस्यता आवश्यक छ।", "Subscription required for WhatsApp/SMS alerts.")}{" "}
                      <Link href="/subscribe" className="font-semibold underline">{t("अहिले लिनुहोस्", "Subscribe now")}</Link>
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* ════ INTERESTS ════ */}
            {activeTab === "interests" && (
              <div className="bg-white rounded-2xl border border-gray-100 p-5">
                <h2 className="text-sm font-semibold text-gray-900 mb-1">
                  ✨ {t("तपाईंको रुचि", "Your interests")}
                </h2>
                <p className="text-xs text-gray-400 mb-5">
                  {t("यसले तपाईंको AI समाचार सिफारिस अपडेट गर्छ", "This updates your AI news recommendations")}
                </p>
                <div className="flex flex-wrap gap-2">
                  {INTEREST_TAGS.map((tag) => {
                    const sel = user.interests.includes(tag.np);
                    return (
                      <button
                        key={tag.np}
                        onClick={() => {
                          const next = sel
                            ? user.interests.filter((i) => i !== tag.np)
                            : [...user.interests, tag.np];
                          if (next.length > 0) updateUser({ interests: next });
                        }}
                        className={`px-4 py-2 rounded-full text-xs border transition-all ${
                          sel ? "bg-red-700 text-white border-red-700" : "border-gray-200 text-gray-600 hover:border-gray-300 hover:bg-gray-50"
                        }`}
                      >
                        {t(tag.np, tag.en)}
                      </button>
                    );
                  })}
                </div>
                <div className="mt-5 flex items-start gap-2 bg-purple-50 border border-purple-100 rounded-xl px-4 py-3">
                  <span>🧠</span>
                  <p className="text-xs text-purple-700 leading-relaxed">
                    {t(
                      "हाम्रो AI एल्गोरिदमले तपाईंको ब्राउजिङ पैटर्न र रुचि मिलाएर व्यक्तिगत समाचार सिफारिस गर्छ।",
                      "Our AI combines your reading patterns and interests to personalise your news feed."
                    )}
                  </p>
                </div>
              </div>
            )}

            {/* ════ SAVED ════ */}
            {activeTab === "saved" && (
              <div className="bg-white rounded-2xl border border-gray-100 p-5">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-sm font-semibold text-gray-900">
                    🔖 {t("सेभ गरिएका समाचार", "Saved articles")}
                  </h2>
                  {savedItems.length > 0 && (
                    <span className="text-xs bg-gray-100 text-gray-500 px-2.5 py-1 rounded-lg">{savedItems.length} {t("वटा", "articles")}</span>
                  )}
                </div>
                {savedItems.length === 0 ? (
                  <div className="text-center py-12 text-gray-400">
                    <div className="text-4xl mb-3">📰</div>
                    <p className="text-sm mb-1">{t("कुनै समाचार सेभ गरिएको छैन", "No articles saved yet")}</p>
                    <p className="text-xs text-gray-300 mb-4">{t("समाचारमा 🔖 थिचेर सेभ गर्नुहोस्", "Tap 🔖 on any article to save it")}</p>
                    <Link href="/" className="text-xs text-red-700 hover:underline">
                      {t("समाचार हेर्नुहोस्", "Browse news")} →
                    </Link>
                  </div>
                ) : (
                  <div className="flex flex-col divide-y divide-gray-50">
                    {savedItems.map((item) => (
                      <div key={item.id} className="flex gap-3 py-3.5 group">
                        <div className="w-14 h-12 bg-gray-100 rounded-lg flex items-center justify-center text-xl shrink-0">{item.emoji}</div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-gray-800 leading-snug line-clamp-2 group-hover:text-red-700 transition-colors cursor-pointer">
                            {t(item.title, item.titleEn || item.title)}
                          </p>
                          <div className="flex items-center gap-2 mt-1 text-[11px] text-gray-400">
                            <span className="font-medium">{item.source}</span>
                            <span>·</span>
                            <span>{t(item.timeAgo, item.timeAgoEn || item.timeAgo)}</span>
                          </div>
                        </div>
                        <button
                          onClick={() => toggleSaved(item.id)}
                          className="shrink-0 text-red-400 hover:text-red-700 transition-colors self-start mt-1 p-1 rounded hover:bg-red-50"
                          title={t("हटाउनुहोस्", "Remove")}
                        >
                          🗑️
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* ════ SUBSCRIPTION ════ */}
            {activeTab === "subscription" && (
              <div className="flex flex-col gap-4">
                {/* Current plan */}
                <div className="bg-white rounded-2xl border border-gray-100 p-5">
                  <h2 className="text-sm font-semibold text-gray-900 mb-4">
                    💳 {t("हालको सदस्यता", "Current subscription")}
                  </h2>
                  <div className="flex items-center justify-between p-4 rounded-xl bg-gray-50 border border-gray-100">
                    <div>
                      <div className={`text-xs font-semibold px-2.5 py-1 rounded-full inline-block mb-1.5 ${sub.color}`}>
                        {t(sub.np, sub.en)}
                      </div>
                      <div className="text-xs text-gray-500">{t("अर्को नवीकरण:", "Next renewal:")} २०८२ साउन १५</div>
                    </div>
                    {user.subscription === "free" ? (
                      <Link
                        href="/subscribe"
                        className="bg-red-700 text-white text-xs px-4 py-2 rounded-xl hover:bg-red-800 transition-colors font-medium"
                      >
                        {t("अपग्रेड गर्नुहोस्", "Upgrade")} ✦
                      </Link>
                    ) : (
                      <button className="border border-gray-200 text-gray-600 text-xs px-4 py-2 rounded-xl hover:bg-gray-50 transition-colors">
                        {t("रद्द गर्नुहोस्", "Cancel plan")}
                      </button>
                    )}
                  </div>
                </div>

                {/* Plan features comparison */}
                <div className="bg-white rounded-2xl border border-gray-100 p-5">
                  <h3 className="text-xs font-semibold text-gray-700 mb-3">{t("तपाईंको प्लानमा के छ?", "What's included in your plan?")}</h3>
                  <div className="flex flex-col gap-2">
                    {[
                      { np: "इमेल दैनिक डाइजेस्ट", en: "Email daily digest", plans: ["free","whatsapp","sms","premium"] },
                      { np: "AI समाचार सिफारिस", en: "AI news recommendations", plans: ["free","whatsapp","sms","premium"] },
                      { np: "WhatsApp तत्काल सूचना", en: "WhatsApp instant alerts", plans: ["whatsapp","premium"] },
                      { np: "SMS अलर्ट", en: "SMS alerts", plans: ["sms","premium"] },
                      { np: "विज्ञापन-मुक्त अनुभव", en: "Ad-free experience", plans: ["premium"] },
                    ].map((feat) => {
                      const included = feat.plans.includes(user.subscription);
                      return (
                        <div key={feat.en} className={`flex items-center gap-2 text-xs ${included ? "text-gray-700" : "text-gray-300"}`}>
                          <span>{included ? "✅" : "⬜"}</span>
                          {t(feat.np, feat.en)}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Upgrade card */}
                {user.subscription === "free" && (
                  <div className="bg-gradient-to-br from-red-700 to-red-800 rounded-2xl p-5 text-white">
                    <h3 className="text-sm font-semibold mb-1">⚡ {t("प्रिमियममा अपग्रेड गर्नुहोस्", "Upgrade to Premium")}</h3>
                    <p className="text-xs opacity-80 mb-4 leading-relaxed">
                      {t("WhatsApp र SMS सूचना, विज्ञापन-मुक्त अनुभव र धेरै फाइदाहरू। रु. १९९/महिनाबाट।", "WhatsApp & SMS alerts, ad-free experience and more — from NPR 199/mo.")}
                    </p>
                    <Link
                      href="/subscribe"
                      className="inline-block bg-white text-red-700 text-xs font-semibold px-5 py-2 rounded-xl hover:bg-gray-100 transition-colors"
                    >
                      {t("योजनाहरू हेर्नुहोस्", "View plans")} →
                    </Link>
                  </div>
                )}
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}

export default function AccountPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-50" />}>
      <AccountContent />
    </Suspense>
  );
}
