"use client";
import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useLang } from "@/context/LanguageContext";
import { useAuth } from "@/context/AuthContext";
import AuthModal from "@/components/AuthModal";

const NAV_LINKS = [
  { np: "मुख्य", en: "Home", href: "/" },
  { np: "राजनीति", en: "Politics", href: "/?cat=राजनीति" },
  { np: "अर्थतन्त्र", en: "Economy", href: "/?cat=अर्थतन्त्र" },
  { np: "खेलकुद", en: "Sports", href: "/?cat=खेलकुद" },
  { np: "प्रविधि", en: "Tech", href: "/?cat=प्रविधि" },
  { np: "मनोरञ्जन", en: "Entertainment", href: "/?cat=मनोरञ्जन" },
  { np: "अन्तर्राष्ट्रिय", en: "World", href: "/?cat=अन्तर्राष्ट्रिय" },
  { np: "स्वास्थ्य", en: "Health", href: "/?cat=स्वास्थ्य" },
];

export default function Topbar() {
  const { lang, setLang, t } = useLang();
  const { user, openAuth, logout } = useAuth();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (searchOpen) searchRef.current?.focus();
  }, [searchOpen]);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleSubscribe = () => {
    if (user) {
      router.push("/subscribe");
    } else {
      openAuth();
    }
  };

  const SUB_BADGE: Record<string, { label: string; color: string }> = {
    free:     { label: "Free",      color: "bg-gray-100 text-gray-500" },
    whatsapp: { label: "WhatsApp",  color: "bg-green-100 text-green-700" },
    sms:      { label: "SMS",       color: "bg-purple-100 text-purple-700" },
    premium:  { label: "Premium",   color: "bg-amber-100 text-amber-700" },
  };

  const today = new Date().toLocaleDateString(lang === "np" ? "ne-NP" : "en-US", {
    weekday: "long", year: "numeric", month: "long", day: "numeric",
  });

  return (
    <>
    <AuthModal />
    <header className="sticky top-0 z-50 bg-[var(--bg-card)] border-b border-[var(--border)] shadow-sm">

      {/* ── Row 1: Utility bar ── */}
      <div className="border-b border-[var(--border)] bg-[var(--bg)]">
        <div className="max-w-7xl mx-auto px-4 h-8 flex items-center gap-4 text-[11px] text-[var(--ink-3)]">
          <span className="hidden sm:block truncate">{today}</span>
          <div className="flex items-center gap-3 ml-auto">
            <a href="#" aria-label="Facebook" className="hover:text-[var(--red)] transition-colors">
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
            </a>
            <a href="#" aria-label="Twitter" className="hover:text-[var(--red)] transition-colors">
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
            </a>
            <a href="#" aria-label="YouTube" className="hover:text-[var(--red)] transition-colors">
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46a2.78 2.78 0 0 0-1.95 1.96A29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58A2.78 2.78 0 0 0 3.41 19.54C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-1.96A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z"/><polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" fill="white"/></svg>
            </a>
            <span className="text-[var(--border)]">|</span>
            <button onClick={() => setLang(lang === "np" ? "en" : "np")} className="flex items-center gap-1 font-semibold hover:text-[var(--red)] transition-colors">
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
              {lang === "np" ? "EN" : "नेपाली"}
            </button>
          </div>
        </div>
      </div>

      {/* ── Row 2: Logo + Search + Auth ── */}
      <div className="max-w-7xl mx-auto px-4 h-14 flex items-center gap-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <div className="w-8 h-8 bg-[var(--red)] rounded-lg flex items-center justify-center">
            <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v2"/>
              <path d="M18 14H6"/><path d="M18 10H6"/><path d="M18 6H6"/>
            </svg>
          </div>
          <div>
            <span className="text-[var(--red)] font-extrabold text-xl headline leading-none tracking-tight">खबरपाटी</span>
            <span className="block text-[9px] text-[var(--ink-3)] font-medium tracking-widest uppercase leading-none">KhabarPati</span>
          </div>
        </Link>

        {/* Search bar (desktop) */}
        <div className="flex-1 max-w-md hidden md:block">
          <div className="relative">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--ink-3)]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            <input type="text" placeholder={t("समाचार खोज्नुहोस्...", "Search news...")}
              className="w-full pl-9 pr-3 py-2 text-sm bg-[var(--bg)] border border-[var(--border)] rounded-lg focus:outline-none focus:border-[var(--red)] focus:ring-1 focus:ring-[var(--red)]/20 transition-colors"
              value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
          </div>
        </div>

        {/* Right actions */}
        <div className="ml-auto flex items-center gap-2">
          <button onClick={() => setSearchOpen(!searchOpen)} className="md:hidden w-9 h-9 flex items-center justify-center rounded-lg border border-[var(--border)] hover:border-[var(--red)] transition-colors text-[var(--ink-3)]" aria-label="Search">
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          </button>

          {user ? (
            <div className="relative" ref={dropdownRef}>
              <button onClick={() => setDropdownOpen(v => !v)}
                className="flex items-center gap-2 border border-[var(--border)] rounded-lg px-2.5 py-1.5 hover:border-[var(--red)] transition-colors">
                <div className="w-6 h-6 rounded-full bg-[var(--red)] flex items-center justify-center text-white text-[10px] font-bold">
                  {user.name?.[0] ?? "U"}
                </div>
                <span className="text-xs font-medium text-[var(--ink)] hidden sm:block max-w-[80px] truncate">{user.name}</span>
                {user.subscription !== "free" && (
                  <span className="hidden sm:block text-[9px] font-bold px-1.5 py-0.5 bg-amber-100 text-amber-700 rounded-full border border-amber-200">PRO</span>
                )}
                <svg className={`w-3 h-3 text-[var(--ink-3)] transition-transform ${dropdownOpen ? "rotate-180" : ""}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="6 9 12 15 18 9"/></svg>
              </button>

              {dropdownOpen && (
                <div className="absolute right-0 top-full mt-1.5 w-52 bg-[var(--bg-card)] border border-[var(--border)] rounded-xl shadow-lg py-1 z-50">
                  <div className="px-3 py-2.5 border-b border-[var(--border)]">
                    <div className="text-xs font-semibold text-[var(--ink)] truncate">{user.name}</div>
                    <div className="text-[10px] text-[var(--ink-3)] mt-0.5">+977 {user.phone}</div>
                    <div className="mt-1.5 text-[9px] font-bold px-2 py-0.5 rounded-full inline-block bg-[var(--bg)] border border-[var(--border)] text-[var(--ink-3)] uppercase tracking-wide">
                      {user.subscription === "free" ? t("निःशुल्क", "Free") : user.subscription === "whatsapp" ? "WhatsApp" : "SMS"} {t("योजना", "Plan")}
                    </div>
                  </div>
                  <Link href="/account" onClick={() => setDropdownOpen(false)} className="flex items-center gap-2.5 px-3 py-2 text-xs text-[var(--ink)] hover:bg-[var(--bg)] hover:text-[var(--red)] transition-colors">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5 text-[var(--ink-3)]"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                    {t("मेरो खाता", "My Account")}
                  </Link>
                  <Link href="/account?tab=saved" onClick={() => setDropdownOpen(false)} className="flex items-center gap-2.5 px-3 py-2 text-xs text-[var(--ink)] hover:bg-[var(--bg)] hover:text-[var(--red)] transition-colors">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5 text-[var(--ink-3)]"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></svg>
                    <span className="flex-1">{t("सुरक्षित लेखहरू", "Saved")}</span>
                    {(user.savedArticles?.length ?? 0) > 0 && (
                      <span className="text-[9px] bg-[var(--red)] text-white rounded-full w-4 h-4 flex items-center justify-center font-bold">{user.savedArticles.length}</span>
                    )}
                  </Link>
                  <Link href="/subscribe" onClick={() => setDropdownOpen(false)} className="flex items-center gap-2.5 px-3 py-2 text-xs text-[var(--ink)] hover:bg-[var(--bg)] hover:text-[var(--red)] transition-colors">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5 text-[var(--ink-3)]"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                    {user.subscription === "free" ? t("सदस्यता लिनुहोस्", "Subscribe") : t("योजना व्यवस्थापन", "Manage Plan")}
                  </Link>
                  <div className="border-t border-[var(--border)] mt-1">
                    <button onClick={() => { logout(); setDropdownOpen(false); }} className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-red-600 hover:bg-red-50 transition-colors">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
                      {t("बाहिर निस्कनुहोस्", "Sign Out")}
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <button onClick={openAuth} className="text-xs font-semibold text-[var(--ink)] hover:text-[var(--red)] transition-colors px-2 hidden sm:block">
                {t("साइन इन", "Sign In")}
              </button>
              <button onClick={handleSubscribe} className="text-xs font-bold text-white bg-[var(--red)] hover:bg-[var(--red-dark)] transition-colors px-3.5 py-2 rounded-lg">
                {t("सदस्यता", "Subscribe")}
              </button>
            </div>
          )}

          <button onClick={() => setMobileOpen(!mobileOpen)} className="lg:hidden w-9 h-9 flex items-center justify-center rounded-lg border border-[var(--border)] hover:border-[var(--red)] transition-colors text-[var(--ink-3)]" aria-label="Menu">
            {mobileOpen
              ? <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              : <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
            }
          </button>
        </div>
      </div>

      {/* Mobile search expand */}
      {searchOpen && (
        <div className="md:hidden px-4 pb-3 border-t border-[var(--border)]">
          <div className="relative mt-3">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--ink-3)]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            <input ref={searchRef} type="text" placeholder={t("समाचार खोज्नुहोस्...", "Search news...")}
              className="w-full pl-9 pr-3 py-2 text-sm bg-[var(--bg)] border border-[var(--border)] rounded-lg focus:outline-none focus:border-[var(--red)]"
              value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
          </div>
        </div>
      )}

      {/* ── Row 3: Category Nav (desktop) ── */}
      <nav className="border-t border-[var(--border)] hidden lg:block">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center gap-0 overflow-x-auto scrollbar-hide">
            {NAV_LINKS.map((cat) => (
              <Link key={cat.en} href={cat.href}
                className="flex-shrink-0 px-4 py-2.5 text-[12px] font-semibold text-[var(--ink-2)] hover:text-[var(--red)] hover:bg-[var(--bg)] border-b-2 border-transparent hover:border-[var(--red)] transition-all whitespace-nowrap">
                {t(cat.np, cat.en)}
              </Link>
            ))}
            <div className="ml-auto flex-shrink-0 px-4 py-2.5 flex items-center gap-1.5">
              <span className="flex items-center gap-1 text-[11px] font-bold text-[var(--red)]">
                <span className="w-1.5 h-1.5 rounded-full bg-[var(--red)] animate-pulse inline-block" />
                {t("ब्रेकिंग", "LIVE")}
              </span>
            </div>
          </div>
        </div>
      </nav>

      {/* ── Mobile menu ── */}
      {mobileOpen && (
        <div className="lg:hidden border-t border-[var(--border)] bg-[var(--bg-card)]">
          <nav className="px-4 py-3 grid grid-cols-3 gap-1">
            {NAV_LINKS.map((cat) => (
              <Link key={cat.en} href={cat.href} onClick={() => setMobileOpen(false)}
                className="text-center text-xs font-semibold text-[var(--ink-2)] hover:text-[var(--red)] px-2 py-2 rounded-lg hover:bg-[var(--bg)] border border-[var(--border)] transition-colors">
                {t(cat.np, cat.en)}
              </Link>
            ))}
          </nav>
          <div className="border-t border-[var(--border)] px-4 py-3">
            {user ? (
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-[var(--red)] flex items-center justify-center text-white font-bold">{user.name?.[0] ?? "U"}</div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-semibold text-[var(--ink)] truncate">{user.name}</div>
                  <div className="text-[11px] text-[var(--ink-3)]">+977 {user.phone}</div>
                </div>
                <button onClick={() => { logout(); setMobileOpen(false); }} className="text-xs text-red-600 font-semibold px-3 py-1.5 border border-red-200 rounded-lg hover:bg-red-50 transition-colors">
                  {t("निस्कनुहोस्", "Sign out")}
                </button>
              </div>
            ) : (
              <div className="flex gap-2">
                <button onClick={() => { openAuth(); setMobileOpen(false); }} className="flex-1 text-sm font-semibold text-[var(--ink)] border border-[var(--border)] py-2 rounded-lg hover:border-[var(--red)] hover:text-[var(--red)] transition-colors">
                  {t("साइन इन", "Sign In")}
                </button>
                <button onClick={handleSubscribe} className="flex-1 text-sm font-bold text-white bg-[var(--red)] hover:bg-[var(--red-dark)] transition-colors py-2 rounded-lg">
                  {t("सदस्यता", "Subscribe")}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
    </>
  );
}
