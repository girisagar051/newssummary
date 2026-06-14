"use client";
import { useState } from "react";
import { useLang } from "@/context/LanguageContext";

const PLANS = [
  {
    icon: "✉️",
    nameNp: "इमेल सूचना",
    nameEn: "Email Alerts",
    descNp: "दैनिक डाइजेस्ट + ब्रेकिङ",
    descEn: "Daily digest + breaking",
    priceNp: "निःशुल्क",
    priceEn: "Free",
    free: true,
  },
  {
    icon: "💬",
    nameNp: "WhatsApp",
    nameEn: "WhatsApp",
    descNp: "तत्काल सूचना",
    descEn: "Instant alerts",
    priceNp: "रु. ९९/महिना",
    priceEn: "NPR 99/mo",
    free: false,
  },
  {
    icon: "📱",
    nameNp: "SMS अलर्ट",
    nameEn: "SMS Alerts",
    descNp: "ब्रेकिङ न्यूज मात्र",
    descEn: "Breaking news only",
    priceNp: "रु. ४९/महिना",
    priceEn: "NPR 49/mo",
    free: false,
  },
];

export default function SubscriptionBox() {
  const { t } = useLang();
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = () => {
    if (email.includes("@")) setSubscribed(true);
  };

  return (
    <div className="rounded-xl bg-[var(--red)] text-white p-4">
      <div className="flex items-center gap-2 mb-1">
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/>
        </svg>
        <h3 className="text-sm font-bold headline">{t("सूचना सदस्यता", "News Alerts")}</h3>
      </div>
      <p className="text-xs opacity-80 mb-3 leading-relaxed">
        {t("आफ्नो मनपर्ने समाचार सिधै पाउनुहोस्", "Get your preferred news directly")}
      </p>

      <div className="flex flex-col gap-2 mb-3">
        {PLANS.map((plan) => (
          <div
            key={plan.nameEn}
            className="bg-white/15 rounded-lg px-3 py-2 flex items-center justify-between"
          >
            <div>
              <div className="text-xs font-medium">
                {plan.icon} {t(plan.nameNp, plan.nameEn)}
              </div>
              <div className="text-[10px] opacity-75 mt-0.5">
                {t(plan.descNp, plan.descEn)}
              </div>
            </div>
            {plan.free ? (
              <span className="text-[10px] bg-white/25 px-2 py-0.5 rounded font-medium">
                {t("निःशुल्क", "Free")}
              </span>
            ) : (
              <span className="text-[11px] opacity-80">{t(plan.priceNp, plan.priceEn)}</span>
            )}
          </div>
        ))}
      </div>

      {subscribed ? (
        <div className="bg-white/20 rounded-lg px-3 py-2 text-center text-xs">
          ✅ {t("सफलतापूर्वक सदस्यता लिइयो!", "Successfully subscribed!")}
        </div>
      ) : (
        <>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={t("इमेल ठेगाना", "Email address")}
            className="w-full bg-white/15 border border-white/25 rounded-lg px-3 py-2 text-xs text-white placeholder:text-white/50 mb-2 outline-none focus:border-white/60"
          />
          <button
            onClick={handleSubscribe}
            className="w-full bg-white text-red-700 rounded-lg py-2 text-xs font-medium hover:bg-gray-100 transition-colors"
          >
            {t("सदस्यता लिनुहोस्", "Subscribe Now")} →
          </button>
        </>
      )}
    </div>
  );
}
