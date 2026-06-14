"use client";
import { useState, useEffect, useRef } from "react";
import { useAuth } from "@/context/AuthContext";
import { useLang } from "@/context/LanguageContext";

const NP_FLAGS = ["🇳🇵 +977"];

export default function AuthModal() {
  const { authStep, authError, isLoading, pendingPhone, closeAuth, sendOtp, verifyOtp, completeProfile } = useAuth();
  const { t } = useLang();

  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [name, setName] = useState("");
  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);
  const phoneRef = useRef<HTMLInputElement>(null);

  const isOpen = authStep !== "idle" && authStep !== "done";

  // Focus phone input when modal opens
  useEffect(() => {
    if (authStep === "phone") {
      setPhone("");
      setOtp(["", "", "", "", "", ""]);
      setName("");
      setTimeout(() => phoneRef.current?.focus(), 80);
    }
    if (authStep === "otp") {
      setTimeout(() => otpRefs.current[0]?.focus(), 80);
    }
  }, [authStep]);

  // OTP box keyboard handler
  const handleOtpKey = (i: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace") {
      if (otp[i]) {
        const next = [...otp];
        next[i] = "";
        setOtp(next);
      } else if (i > 0) {
        otpRefs.current[i - 1]?.focus();
      }
    }
  };

  const handleOtpChange = (i: number, val: string) => {
    const digit = val.replace(/\D/g, "").slice(-1);
    const next = [...otp];
    next[i] = digit;
    setOtp(next);
    if (digit && i < 5) otpRefs.current[i + 1]?.focus();
    // Auto-submit when all 6 filled
    if (digit && i === 5) {
      const full = [...next.slice(0, 5), digit].join("");
      if (full.length === 6) verifyOtp(full);
    }
  };

  const handleOtpPaste = (e: React.ClipboardEvent) => {
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (pasted.length === 6) {
      setOtp(pasted.split(""));
      verifyOtp(pasted);
    }
  };

  if (!isOpen && authStep !== "done") return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/40 z-50 transition-opacity"
        onClick={closeAuth}
        aria-hidden="true"
      />

      {/* Panel — slides in from right on desktop, bottom sheet on mobile */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label={t("साइन इन", "Sign in")}
        className="fixed z-50 bottom-0 left-0 right-0 sm:bottom-auto sm:right-0 sm:top-0 sm:left-auto sm:w-[400px] sm:h-full bg-white sm:shadow-2xl flex flex-col"
        style={{ borderRadius: "24px 24px 0 0", transition: "transform .25s ease" }}
      >
        {/* Handle (mobile) */}
        <div className="flex justify-center pt-3 pb-1 sm:hidden">
          <div className="w-10 h-1 bg-gray-200 rounded-full" />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-5 pb-4 border-b border-gray-100">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-red-700 rounded-lg flex items-center justify-center text-white text-sm font-medium select-none">ख</div>
            <div>
              <div className="text-sm font-medium text-gray-900">खबरपाटी</div>
              <div className="text-[10px] text-gray-400">
                {authStep === "phone" && t("साइन इन / दर्ता", "Sign in / Register")}
                {authStep === "otp"   && t("OTP प्रमाणिकरण", "OTP Verification")}
                {authStep === "name"  && t("प्रोफाइल सेटअप", "Profile setup")}
              </div>
            </div>
          </div>
          <button
            onClick={closeAuth}
            className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-gray-200 transition-colors"
            aria-label="Close"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Step indicator */}
        <div className="flex items-center gap-1.5 px-6 py-3">
          {(["phone", "otp", "name"] as const).map((s, i) => (
            <div key={s} className="flex items-center gap-1.5">
              <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-medium transition-all ${
                authStep === s
                  ? "bg-red-700 text-white ring-4 ring-red-100"
                  : ["otp", "name"].indexOf(s) < ["otp", "name"].indexOf(authStep as "otp" | "name")
                  ? "bg-red-700 text-white"
                  : "bg-gray-100 text-gray-400"
              }`}>
                {["otp", "name"].indexOf(s) < ["phone", "otp", "name"].indexOf(authStep) ? "✓" : i + 1}
              </div>
              {i < 2 && <div className="w-5 h-px bg-gray-200" />}
            </div>
          ))}
          <span className="ml-2 text-xs text-gray-400">
            {authStep === "phone" && t("फोन नम्बर", "Phone")}
            {authStep === "otp"   && t("OTP प्रविष्टि", "Enter OTP")}
            {authStep === "name"  && t("नाम राख्नुहोस्", "Your name")}
          </span>
        </div>

        {/* Body */}
        <div className="flex-1 px-6 py-4 overflow-y-auto">

          {/* ── STEP 1: Phone ── */}
          {authStep === "phone" && (
            <div className="flex flex-col gap-5">
              <div>
                <h2 className="text-lg font-medium text-gray-900 mb-1">
                  {t("फोन नम्बरबाट प्रवेश गर्नुहोस्", "Sign in with your phone")}
                </h2>
                <p className="text-sm text-gray-500">
                  {t("हामी तपाईंको नम्बरमा OTP पठाउनेछौं।", "We'll send an OTP to your number.")}
                </p>
              </div>

              <div>
                <label className="text-xs font-medium text-gray-600 block mb-2">
                  {t("मोबाइल नम्बर", "Mobile number")}
                </label>
                <div className="flex gap-2">
                  <div className="flex items-center gap-1 bg-gray-50 border border-gray-200 rounded-xl px-3 text-sm text-gray-500 whitespace-nowrap">
                    🇳🇵 +977
                  </div>
                  <input
                    ref={phoneRef}
                    type="tel"
                    inputMode="numeric"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))}
                    onKeyDown={(e) => e.key === "Enter" && sendOtp(phone)}
                    placeholder="98XXXXXXXX"
                    className="flex-1 border border-gray-200 rounded-xl px-4 py-3 text-base text-gray-900 outline-none focus:border-red-300 focus:ring-2 focus:ring-red-50 transition-all tracking-widest placeholder:tracking-normal placeholder:text-gray-300"
                    maxLength={10}
                  />
                </div>
                {authError && (
                  <p className="text-xs text-red-600 mt-2 flex items-center gap-1">
                    <span>⚠️</span> {authError}
                  </p>
                )}
              </div>

              {/* Demo hint */}
              <div className="bg-amber-50 border border-amber-100 rounded-xl px-4 py-3">
                <p className="text-xs text-amber-700 font-medium mb-1">🧪 {t("परीक्षण मोड", "Demo mode")}</p>
                <p className="text-xs text-amber-600">
                  {t(
                    "कुनै पनि नम्बरले काम गर्छ। फर्कने प्रयोगकर्ताको लागि: 9800000001",
                    "Any number works. Returning user demo: 9800000001"
                  )}
                </p>
                <button
                  className="text-xs text-amber-700 underline mt-1"
                  onClick={() => setPhone("9800000001")}
                >
                  {t("यो नम्बर प्रयोग गर्नुहोस्", "Use this number")}
                </button>
              </div>

              <button
                onClick={() => sendOtp(phone)}
                disabled={isLoading || phone.length < 10}
                className="w-full bg-red-700 text-white rounded-xl py-3.5 text-sm font-medium hover:bg-red-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />{t("पठाउँदै...", "Sending...")}</>
                ) : (
                  <>{t("OTP पठाउनुहोस्", "Send OTP")} →</>
                )}
              </button>

              <p className="text-center text-xs text-gray-400">
                {t("साइन इन गरेर तपाईं हाम्रो", "By signing in you agree to our")}{" "}
                <a href="/terms" className="text-red-700 hover:underline">{t("सर्तहरूसँग सहमत हुनुहुन्छ", "Terms")}</a>
              </p>
            </div>
          )}

          {/* ── STEP 2: OTP ── */}
          {authStep === "otp" && (
            <div className="flex flex-col gap-5">
              <div>
                <h2 className="text-lg font-medium text-gray-900 mb-1">
                  {t("OTP प्रमाणिकरण", "Verify OTP")}
                </h2>
                <p className="text-sm text-gray-500">
                  {t(
                    `+977 ${pendingPhone} मा पठाइएको ६ अंकको कोड राख्नुहोस्।`,
                    `Enter the 6-digit code sent to +977 ${pendingPhone}.`
                  )}
                </p>
              </div>

              {/* 6-box OTP input */}
              <div className="flex gap-2 justify-between" onPaste={handleOtpPaste}>
                {otp.map((digit, i) => (
                  <input
                    key={i}
                    ref={(el) => { otpRefs.current[i] = el; }}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpChange(i, e.target.value)}
                    onKeyDown={(e) => handleOtpKey(i, e)}
                    className={`w-12 h-14 text-center text-xl font-medium border-2 rounded-xl outline-none transition-all ${
                      digit
                        ? "border-red-700 bg-red-50 text-red-700"
                        : "border-gray-200 text-gray-900 focus:border-red-300 focus:ring-2 focus:ring-red-50"
                    }`}
                  />
                ))}
              </div>

              {authError && (
                <p className="text-xs text-red-600 flex items-center gap-1">
                  <span>⚠️</span> {authError}
                </p>
              )}

              {/* Demo hint */}
              <div className="bg-amber-50 border border-amber-100 rounded-xl px-4 py-3">
                <p className="text-xs text-amber-600">
                  🧪 {t("परीक्षणको लागि जुनसुकै ६ अंक राख्नुहोस्", "For demo, enter any 6 digits")}
                </p>
                <button
                  className="text-xs text-amber-700 underline mt-1"
                  onClick={() => {
                    setOtp(["1","2","3","4","5","6"]);
                    verifyOtp("123456");
                  }}
                >
                  {t("123456 प्रयोग गर्नुहोस्", "Use 123456")}
                </button>
              </div>

              <button
                onClick={() => verifyOtp(otp.join(""))}
                disabled={isLoading || otp.some((d) => !d)}
                className="w-full bg-red-700 text-white rounded-xl py-3.5 text-sm font-medium hover:bg-red-800 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />{t("प्रमाणिकरण गर्दै...", "Verifying...")}</>
                ) : (
                  t("प्रमाणिकरण गर्नुहोस्", "Verify")
                )}
              </button>

              <button
                onClick={() => { setOtp(["","","","","",""]); sendOtp(pendingPhone); }}
                className="text-xs text-center text-gray-400 hover:text-red-700 transition-colors"
              >
                {t("OTP पुनः पठाउनुहोस्", "Resend OTP")}
              </button>
            </div>
          )}

          {/* ── STEP 3: Name (new users only) ── */}
          {authStep === "name" && (
            <div className="flex flex-col gap-5">
              <div>
                <h2 className="text-lg font-medium text-gray-900 mb-1">
                  {t("नमस्ते! तपाईंको नाम के हो?", "Hello! What's your name?")}
                </h2>
                <p className="text-sm text-gray-500">
                  {t("एकपटक राखेपछि खाता सिर्जना हुनेछ।", "Your account will be created right away.")}
                </p>
              </div>

              <div>
                <label className="text-xs font-medium text-gray-600 block mb-2">
                  {t("पूरा नाम", "Full name")}
                </label>
                <input
                  autoFocus
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && completeProfile(name)}
                  placeholder={t("राम बहादुर श्रेष्ठ", "Your full name")}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-base text-gray-900 outline-none focus:border-red-300 focus:ring-2 focus:ring-red-50 transition-all placeholder:text-gray-300"
                />
                {authError && (
                  <p className="text-xs text-red-600 mt-2 flex items-center gap-1">
                    <span>⚠️</span> {authError}
                  </p>
                )}
              </div>

              <button
                onClick={() => completeProfile(name)}
                disabled={isLoading || !name.trim()}
                className="w-full bg-red-700 text-white rounded-xl py-3.5 text-sm font-medium hover:bg-red-800 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />{t("खाता बनाउँदै...", "Creating account...")}</>
                ) : (
                  t("खाता बनाउनुहोस्", "Create account")
                )}
              </button>
            </div>
          )}
        </div>

        {/* Success flash */}
        {authStep === "done" && (
          <div className="absolute inset-0 flex items-center justify-center bg-white rounded-[24px] z-10">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center text-3xl mx-auto mb-3 animate-bounce">✅</div>
              <p className="text-base font-medium text-gray-900">{t("स्वागत छ!", "Welcome!")}</p>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
