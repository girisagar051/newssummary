"use client";
import { useState } from "react";
import Link from "next/link";
import { useLang } from "@/context/LanguageContext";
import { useAuth } from "@/context/AuthContext";
import Topbar from "@/components/Topbar";
import type { User } from "@/context/AuthContext";

const PLANS: {
  id: User["subscription"];
  icon: string;
  nameNp: string;
  nameEn: string;
  priceNp: string;
  priceEn: string;
  billingNp: string;
  billingEn: string;
  color: string;
  highlight: boolean;
  badge?: { np: string; en: string };
  vatNp: string;
  vatEn: string;
  totalNp: string;
  totalEn: string;
  features: { np: string; en: string; ok: boolean }[];
}[] = [
  {
    id: "free",
    icon: "✉️",
    nameNp: "बेसिक",
    nameEn: "Basic",
    priceNp: "निःशुल्क",
    priceEn: "Free",
    billingNp: "सधैंको लागि",
    billingEn: "Forever",
    color: "border-gray-200",
    highlight: false,
    vatNp: "—", vatEn: "—",
    totalNp: "निःशुल्क", totalEn: "Free",
    features: [
      { np: "इमेल दैनिक डाइजेस्ट", en: "Email daily digest", ok: true },
      { np: "ब्रेकिङ न्यूज इमेल", en: "Breaking news email", ok: true },
      { np: "AI समाचार सिफारिस", en: "AI news recommendations", ok: true },
      { np: "WhatsApp सूचना", en: "WhatsApp alerts", ok: false },
      { np: "SMS अलर्ट", en: "SMS alerts", ok: false },
      { np: "विज्ञापन-मुक्त अनुभव", en: "Ad-free experience", ok: false },
    ],
  },
  {
    id: "whatsapp",
    icon: "💬",
    nameNp: "WhatsApp प्लान",
    nameEn: "WhatsApp Plan",
    priceNp: "रु. ९९",
    priceEn: "NPR 99",
    billingNp: "प्रति महिना",
    billingEn: "per month",
    color: "border-red-700",
    highlight: true,
    badge: { np: "लोकप्रिय", en: "Most Popular" },
    vatNp: "रु. १२.८७", vatEn: "NPR 12.87",
    totalNp: "रु. १११.८७", totalEn: "NPR 111.87",
    features: [
      { np: "इमेल दैनिक डाइजेस्ट", en: "Email daily digest", ok: true },
      { np: "ब्रेकिङ न्यूज इमेल", en: "Breaking news email", ok: true },
      { np: "AI समाचार सिफारिस", en: "AI news recommendations", ok: true },
      { np: "WhatsApp तत्काल सूचना", en: "WhatsApp instant alerts", ok: true },
      { np: "SMS अलर्ट", en: "SMS alerts", ok: false },
      { np: "विज्ञापन-मुक्त अनुभव", en: "Ad-free experience", ok: false },
    ],
  },
  {
    id: "premium",
    icon: "⚡",
    nameNp: "प्रिमियम",
    nameEn: "Premium",
    priceNp: "रु. १९९",
    priceEn: "NPR 199",
    billingNp: "प्रति महिना",
    billingEn: "per month",
    color: "border-gray-800",
    highlight: false,
    vatNp: "रु. २५.८७", vatEn: "NPR 25.87",
    totalNp: "रु. २२४.८७", totalEn: "NPR 224.87",
    features: [
      { np: "इमेल दैनिक डाइजेस्ट", en: "Email daily digest", ok: true },
      { np: "ब्रेकिङ न्यूज इमेल", en: "Breaking news email", ok: true },
      { np: "AI समाचार सिफारिस", en: "AI news recommendations", ok: true },
      { np: "WhatsApp तत्काल सूचना", en: "WhatsApp instant alerts", ok: true },
      { np: "SMS अलर्ट", en: "SMS alerts", ok: true },
      { np: "विज्ञापन-मुक्त अनुभव", en: "Ad-free experience", ok: true },
    ],
  },
];

const PAYMENT_METHODS = [
  { id: "khalti",     name: "Khalti",         logo: "🟣", colorClass: "border-purple-200 bg-purple-50" },
  { id: "esewa",      name: "eSewa",           logo: "🟢", colorClass: "border-green-200 bg-green-50" },
  { id: "card",       name: "Visa / Mastercard", logo: "💳", colorClass: "border-blue-200 bg-blue-50" },
  { id: "connectips", name: "ConnectIPS",      logo: "🏦", colorClass: "border-orange-200 bg-orange-50" },
];

export default function SubscribePage() {
  const { t } = useLang();
  const { user, openAuth, upgradePlan } = useAuth();

  const [selectedPlanId, setSelectedPlanId] = useState<User["subscription"]>("whatsapp");
  const [step, setStep] = useState<"plans" | "payment" | "confirm">("plans");
  const [paymentMethod, setPaymentMethod] = useState("khalti");
  const [processing, setProcessing] = useState(false);

  const plan = PLANS.find((p) => p.id === selectedPlanId)!;

  const handlePay = async () => {
    setProcessing(true);
    await new Promise((r) => setTimeout(r, 1800));
    setProcessing(false);
    // Update user subscription in context
    upgradePlan(selectedPlanId);
    setStep("confirm");
  };

  /* ── Not logged in: show sign-in gate ── */
  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Topbar />
        <div className="flex-1 flex items-center justify-center px-4">
          <div className="text-center max-w-sm">
            <div className="text-4xl mb-4">🔔</div>
            <h2 className="text-base font-semibold text-gray-900 mb-2">
              {t("सदस्यता लिन पहिले साइन इन गर्नुहोस्", "Sign in to subscribe")}
            </h2>
            <p className="text-sm text-gray-500 mb-6">
              {t(
                "सदस्यता खरिद गर्न तपाईंको फोन नम्बर आवश्यक छ।",
                "Your phone number is required to purchase a subscription."
              )}
            </p>
            <button
              onClick={openAuth}
              className="bg-red-700 text-white px-6 py-2.5 rounded-xl text-sm font-medium hover:bg-red-800 transition-colors"
            >
              {t("साइन इन / दर्ता गर्नुहोस्", "Sign in / Register")}
            </button>
            <div className="mt-4">
              <Link href="/" className="text-xs text-gray-400 hover:text-gray-600">
                ← {t("गृहपृष्ठमा फर्कनुहोस्", "Back to home")}
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  /* ── Already on a paid plan ── */
  if (user.subscription !== "free" && step === "plans") {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Topbar />
        <div className="flex-1 flex items-center justify-center px-4">
          <div className="text-center max-w-sm">
            <div className="text-4xl mb-4">✅</div>
            <h2 className="text-base font-semibold text-gray-900 mb-2">
              {t("तपाईंसँग सदस्यता छ!", "You're already subscribed!")}
            </h2>
            <p className="text-sm text-gray-500 mb-2">
              {t(`हालको प्लान:`, "Current plan:")} <strong>{user.subscription}</strong>
            </p>
            <p className="text-xs text-gray-400 mb-6">
              {t("अर्को नवीकरण: २०८२ साउन १५", "Next renewal: 2082 Shrawan 15")}
            </p>
            <div className="flex gap-3 justify-center">
              <Link
                href="/account?tab=subscription"
                className="border border-gray-200 text-gray-700 text-sm px-5 py-2.5 rounded-xl hover:bg-gray-50 transition-colors"
              >
                {t("सदस्यता व्यवस्थापन", "Manage")}
              </Link>
              <button
                onClick={() => setStep("plans")}
                className="bg-red-700 text-white text-sm px-5 py-2.5 rounded-xl hover:bg-red-800 transition-colors"
              >
                {t("प्लान परिवर्तन", "Change plan")}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Topbar />

      {/* Progress bar */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-screen-md mx-auto px-4 py-3 flex items-center gap-3">
          {(["plans", "payment", "confirm"] as const).map((s, i) => (
            <div key={s} className="flex items-center gap-2">
              <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-medium ${
                step === s ? "bg-red-700 text-white ring-4 ring-red-100"
                : ["payment","confirm"].indexOf(s) <= ["payment","confirm"].indexOf(step) ? "bg-red-700 text-white"
                : "bg-gray-100 text-gray-400"
              }`}>
                {["payment","confirm"].indexOf(s) < ["plans","payment","confirm"].indexOf(step) ? "✓" : i + 1}
              </div>
              <span className={`text-xs hidden sm:inline ${step === s ? "text-gray-900 font-medium" : "text-gray-400"}`}>
                {s === "plans" ? t("योजना", "Plan") : s === "payment" ? t("भुक्तानी", "Payment") : t("पुष्टि", "Confirm")}
              </span>
              {i < 2 && <div className="w-8 h-px bg-gray-200" />}
            </div>
          ))}
        </div>
      </div>

      <div className="max-w-screen-md mx-auto w-full px-4 py-8">

        {/* ── Step: Plans ── */}
        {step === "plans" && (
          <>
            <div className="text-center mb-8">
              <h1 className="text-xl font-semibold text-gray-900 mb-1">
                {t("आफ्नो योजना छान्नुहोस्", "Choose your plan")}
              </h1>
              <p className="text-sm text-gray-500">
                {t("कुनै पनि समयमा रद्द गर्न सकिन्छ। VAT अलग।", "Cancel anytime. VAT not included.")}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
              {PLANS.map((p) => (
                <div
                  key={p.id}
                  onClick={() => setSelectedPlanId(p.id)}
                  className={`relative bg-white rounded-2xl border-2 p-5 cursor-pointer transition-all ${
                    selectedPlanId === p.id
                      ? "border-red-700 shadow-md shadow-red-100"
                      : p.color + " hover:border-gray-300"
                  }`}
                >
                  {p.badge && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                      <span className="bg-red-700 text-white text-[10px] font-semibold px-3 py-1 rounded-full">
                        {t(p.badge.np, p.badge.en)}
                      </span>
                    </div>
                  )}
                  {selectedPlanId === p.id && (
                    <div className="absolute top-3 right-3 w-5 h-5 bg-red-700 rounded-full flex items-center justify-center text-white text-[10px]">✓</div>
                  )}
                  <div className="text-2xl mb-2">{p.icon}</div>
                  <div className="text-sm font-semibold text-gray-900 mb-0.5">{t(p.nameNp, p.nameEn)}</div>
                  <div className="flex items-baseline gap-1 mb-4">
                    <span className="text-xl font-semibold text-gray-900">{t(p.priceNp, p.priceEn)}</span>
                    <span className="text-xs text-gray-400">{t(p.billingNp, p.billingEn)}</span>
                  </div>
                  <ul className="flex flex-col gap-2">
                    {p.features.map((f) => (
                      <li key={f.en} className={`flex items-center gap-2 text-xs ${f.ok ? "text-gray-700" : "text-gray-300"}`}>
                        <span className="shrink-0">{f.ok ? "✓" : "–"}</span>
                        {t(f.np, f.en)}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            <div className="flex justify-center">
              <button
                onClick={() => selectedPlanId !== "free" ? setStep("payment") : undefined}
                disabled={selectedPlanId === "free"}
                className="bg-red-700 text-white px-8 py-3 rounded-xl text-sm font-medium hover:bg-red-800 transition-colors disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed"
              >
                {selectedPlanId === "free"
                  ? t("यो प्लान निःशुल्क छ", "This plan is free")
                  : `${t("भुक्तानीमा जानुहोस्", "Proceed to payment")} →`}
              </button>
            </div>
          </>
        )}

        {/* ── Step: Payment ── */}
        {step === "payment" && (
          <div className="max-w-sm mx-auto">
            <div className="flex items-center gap-3 mb-6">
              <button
                onClick={() => setStep("plans")}
                className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-gray-200 transition-colors"
              >
                ←
              </button>
              <div>
                <h2 className="text-base font-semibold text-gray-900">{t("भुक्तानी विधि", "Payment method")}</h2>
                <p className="text-xs text-gray-400">{t(plan.nameNp, plan.nameEn)} — {t(plan.priceNp, plan.priceEn)}/{t("महिना", "mo")}</p>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 p-5 mb-4">
              <p className="text-xs font-medium text-gray-600 mb-3">{t("भुक्तानी माध्यम छान्नुहोस्", "Select payment method")}</p>
              <div className="grid grid-cols-2 gap-3 mb-5">
                {PAYMENT_METHODS.map((pm) => (
                  <button
                    key={pm.id}
                    onClick={() => setPaymentMethod(pm.id)}
                    className={`flex items-center gap-2 p-3 rounded-xl border-2 transition-all ${
                      paymentMethod === pm.id ? "border-red-700 ring-2 ring-red-50" : "border-gray-200 hover:border-gray-300"
                    } ${pm.colorClass}`}
                  >
                    <span className="text-xl">{pm.logo}</span>
                    <span className="text-xs font-medium text-gray-700">{pm.name}</span>
                  </button>
                ))}
              </div>

              {/* Amount summary */}
              <div className="border-t border-gray-100 pt-4 flex flex-col gap-2 text-sm">
                <div className="flex justify-between text-gray-600">
                  <span>{t(plan.nameNp, plan.nameEn)}</span>
                  <span>{t(plan.priceNp, plan.priceEn)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>{t("कर (१३% VAT)", "Tax (13% VAT)")}</span>
                  <span>{t(plan.vatNp, plan.vatEn)}</span>
                </div>
                <div className="flex justify-between font-semibold text-gray-900 border-t border-gray-100 pt-2 mt-1">
                  <span>{t("जम्मा", "Total")}</span>
                  <span>{t(plan.totalNp, plan.totalEn)}</span>
                </div>
              </div>
            </div>

            {/* Logged-in as info */}
            <div className="flex items-center gap-2 bg-gray-50 border border-gray-100 rounded-xl px-3 py-2.5 mb-4">
              <div className="w-6 h-6 rounded-full bg-red-100 flex items-center justify-center text-red-700 text-[11px] font-semibold shrink-0">
                {user.avatar.slice(0, 1)}
              </div>
              <div className="text-xs text-gray-600">
                {t("खाता:", "Account:")} <span className="font-medium">{user.name}</span> · +977 {user.phone}
              </div>
            </div>

            <button
              onClick={handlePay}
              disabled={processing}
              className="w-full bg-red-700 text-white rounded-xl py-3.5 text-sm font-medium hover:bg-red-800 transition-colors disabled:opacity-70 flex items-center justify-center gap-2"
            >
              {processing ? (
                <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />{t("प्रशोधन गर्दै...", "Processing...")}</>
              ) : (
                `${PAYMENT_METHODS.find(pm => pm.id === paymentMethod)?.name} ${t("बाट भुक्तानी गर्नुहोस्", "Pay now")} →`
              )}
            </button>
            <p className="text-center text-[10px] text-gray-400 mt-3">
              🔒 {t("SSL एन्क्रिप्टेड सुरक्षित भुक्तानी", "Secure SSL encrypted payment")}
            </p>
          </div>
        )}

        {/* ── Step: Confirm ── */}
        {step === "confirm" && (
          <div className="max-w-sm mx-auto text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center text-3xl mx-auto mb-4 animate-bounce">✅</div>
            <h2 className="text-lg font-semibold text-gray-900 mb-1">
              {t("भुक्तानी सफल भयो!", "Payment successful!")}
            </h2>
            <p className="text-sm text-gray-500 mb-6">
              {t(
                `${plan.nameNp} सदस्यता सक्रिय भयो। सूचना पठाउन सुरु हुनेछ।`,
                `Your ${plan.nameEn} subscription is now active.`
              )}
            </p>

            {/* Receipt */}
            <div className="bg-white border border-gray-100 rounded-2xl p-5 mb-6 text-left">
              <div className="text-xs font-medium text-gray-500 mb-3 uppercase tracking-wide">{t("रसिद", "Receipt")}</div>
              {[
                { label: { np: "प्रयोगकर्ता", en: "User" }, value: user.name },
                { label: { np: "योजना", en: "Plan" }, value: t(plan.nameNp, plan.nameEn) },
                { label: { np: "भुक्तानी विधि", en: "Payment" }, value: PAYMENT_METHODS.find(pm => pm.id === paymentMethod)?.name ?? paymentMethod },
                { label: { np: "जम्मा", en: "Total" }, value: t(plan.totalNp, plan.totalEn) },
                { label: { np: "अर्को नवीकरण", en: "Next renewal" }, value: "२०८२ साउन १५" },
              ].map((row) => (
                <div key={row.label.en} className="flex justify-between text-sm py-2 border-b border-gray-50 last:border-0">
                  <span className="text-gray-500">{t(row.label.np, row.label.en)}</span>
                  <span className="font-medium text-gray-900">{row.value}</span>
                </div>
              ))}
            </div>

            <div className="flex gap-3">
              <Link
                href="/account?tab=subscription"
                className="flex-1 border border-gray-200 text-gray-700 rounded-xl py-3 text-sm hover:bg-gray-50 transition-colors text-center"
              >
                {t("खातामा जानुहोस्", "My account")}
              </Link>
              <Link
                href="/"
                className="flex-1 bg-red-700 text-white rounded-xl py-3 text-sm font-medium hover:bg-red-800 transition-colors text-center"
              >
                {t("समाचार हेर्नुहोस्", "Read news")}
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
