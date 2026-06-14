"use client";
import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  useCallback,
} from "react";
import { createClient } from "@/lib/supabase/client";
import type { SupabaseClient, User as SupabaseUser } from "@supabase/supabase-js";
import { SOURCES } from "@/lib/mockData";

// ─── Types ────────────────────────────────────────────────────
export interface User {
  id: string;
  name: string;
  phone: string;
  email?: string;
  avatar: string;
  joinedDate: string;
  subscription: "free" | "whatsapp" | "sms" | "premium";
  interests: string[];
  preferredSources: string[];
  savedArticles: string[];
  notifEmail: boolean;
  notifWhatsapp: boolean;
  notifSms: boolean;
}

export type AuthStep = "idle" | "phone" | "otp" | "name" | "done";

interface AuthContextType {
  user: User | null;
  authStep: AuthStep;
  authError: string | null;
  isLoading: boolean;
  pendingPhone: string;
  openAuth: () => void;
  closeAuth: () => void;
  sendOtp: (phone: string) => Promise<void>;
  verifyOtp: (otp: string) => Promise<void>;
  completeProfile: (name: string) => Promise<void>;
  logout: () => void;
  updateUser: (updates: Partial<User>) => void;
  toggleSaved: (articleId: string) => void;
  toggleSource: (sourceName: string) => void;
  upgradePlan: (plan: User["subscription"]) => void;
}

const ALL_SOURCES = SOURCES.map((s) => s.name);

// ─── Helpers ──────────────────────────────────────────────────
function makeAvatar(name: string): string {
  return name.trim().slice(0, 2);
}

function nepaliDate(): string {
  // Simple approximation — replace with a proper BS library if needed
  const now = new Date();
  const months = ["बैशाख","जेठ","असार","साउन","भदौ","असोज","कार्तिक","मंसिर","पुस","माघ","फागुन","चैत"];
  // BS year ≈ AD year + 56/57; month offset ≈ -3.5 months
  const bsYear = now.getFullYear() + 57;
  const bsMonth = (now.getMonth() + 9) % 12;
  return `${bsYear} ${months[bsMonth]}`;
}

/** Map a Supabase profile row → our User shape */
function profileToUser(
  sbUser: SupabaseUser,
  profile: Record<string, unknown> | null
): User {
  const phone = String(sbUser.phone ?? "").replace("+977", "");
  const name = String(profile?.name ?? phone);
  return {
    id: sbUser.id,
    name,
    phone,
    email: String(sbUser.email ?? profile?.email ?? ""),
    avatar: makeAvatar(name || phone),
    joinedDate: nepaliDate(),
    subscription: (profile?.subscription as User["subscription"]) ?? "free",
    interests: (profile?.interests as string[]) ?? ["राजनीति", "खेलकुद"],
    preferredSources: (profile?.preferred_sources as string[]) ?? ALL_SOURCES,
    savedArticles: (profile?.saved_articles as string[]) ?? [],
    notifEmail: (profile?.notif_email as boolean) ?? true,
    notifWhatsapp: (profile?.notif_whatsapp as boolean) ?? false,
    notifSms: (profile?.notif_sms as boolean) ?? false,
  };
}

// ─── Context ──────────────────────────────────────────────────
const AuthContext = createContext<AuthContextType>({
  user: null,
  authStep: "idle",
  authError: null,
  isLoading: false,
  pendingPhone: "",
  openAuth: () => {},
  closeAuth: () => {},
  sendOtp: async () => {},
  verifyOtp: async () => {},
  completeProfile: async () => {},
  logout: () => {},
  updateUser: () => {},
  toggleSaved: () => {},
  toggleSource: () => {},
  upgradePlan: () => {},
});

// ─── Provider ─────────────────────────────────────────────────
export function AuthProvider({ children }: { children: ReactNode }) {
  const [supabase] = useState<SupabaseClient>(() => createClient());
  const [user, setUser] = useState<User | null>(null);
  const [authStep, setAuthStep] = useState<AuthStep>("idle");
  const [authError, setAuthError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [pendingPhone, setPendingPhone] = useState("");

  // ── Load existing session on mount ──
  useEffect(() => {
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (session?.user) {
        await loadProfile(session.user);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        if (session?.user) {
          await loadProfile(session.user);
        } else {
          setUser(null);
        }
      }
    );

    return () => subscription.unsubscribe();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function loadProfile(sbUser: SupabaseUser) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", sbUser.id)
      .single();
    setUser(profileToUser(sbUser, profile));
  }

  // ── Auth actions ──
  const openAuth = useCallback(() => {
    setAuthStep("phone");
    setAuthError(null);
    setPendingPhone("");
  }, []);

  const closeAuth = useCallback(() => {
    setAuthStep("idle");
    setAuthError(null);
  }, []);

  const sendOtp = async (phone: string) => {
    const clean = phone.replace(/\s|-/g, "");
    if (!/^9[678]\d{8}$/.test(clean)) {
      setAuthError("मान्य नेपाली फोन नम्बर राख्नुहोस् (98XXXXXXXX)");
      return;
    }
    setIsLoading(true);
    setAuthError(null);
    setPendingPhone(clean);

    const { error } = await supabase.auth.signInWithOtp({
      phone: `+977${clean}`,
    });

    setIsLoading(false);
    if (error) {
      setAuthError(error.message);
    } else {
      setAuthStep("otp");
    }
  };

  const verifyOtp = async (otp: string) => {
    if (otp.length !== 6) {
      setAuthError("६ अंकको OTP राख्नुहोस्");
      return;
    }
    setIsLoading(true);
    setAuthError(null);

    const { data, error } = await supabase.auth.verifyOtp({
      phone: `+977${pendingPhone}`,
      token: otp,
      type: "sms",
    });

    if (error) {
      setIsLoading(false);
      setAuthError("OTP गलत छ वा म्याद सकिएको छ। फेरि प्रयास गर्नुहोस्।");
      return;
    }

    // Check if this is a new user (no name in profile)
    const { data: profile } = await supabase
      .from("profiles")
      .select("name")
      .eq("id", data.user!.id)
      .single();

    setIsLoading(false);

    if (!profile?.name) {
      setAuthStep("name");
    } else {
      await loadProfile(data.user!);
      setAuthStep("done");
      setTimeout(() => setAuthStep("idle"), 1200);
    }
  };

  const completeProfile = async (name: string) => {
    if (!name.trim()) {
      setAuthError("नाम राख्नुहोस्");
      return;
    }
    setIsLoading(true);
    setAuthError(null);

    const { data: { user: sbUser } } = await supabase.auth.getUser();
    if (!sbUser) {
      setIsLoading(false);
      setAuthError("सत्र समाप्त भयो। फेरि लगइन गर्नुहोस्।");
      return;
    }

    const { error } = await supabase
      .from("profiles")
      .upsert({
        id: sbUser.id,
        name: name.trim(),
        phone: pendingPhone || String(sbUser.phone ?? "").replace("+977", ""),
        interests: ["राजनीति", "खेलकुद"],
        preferred_sources: ALL_SOURCES,
        subscription: "free",
        notif_email: true,
        notif_whatsapp: false,
        notif_sms: false,
      });

    if (error) {
      setIsLoading(false);
      setAuthError(error.message);
      return;
    }

    await loadProfile(sbUser);
    setIsLoading(false);
    setAuthStep("done");
    setTimeout(() => setAuthStep("idle"), 1200);
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setAuthStep("idle");
  };

  const updateUser = useCallback(
    async (updates: Partial<User>) => {
      if (!user) return;
      // Optimistic update
      setUser({ ...user, ...updates });
      // Persist to Supabase
      const dbUpdates: Record<string, unknown> = {};
      if (updates.name !== undefined) dbUpdates.name = updates.name;
      if (updates.email !== undefined) dbUpdates.email = updates.email;
      if (updates.subscription !== undefined) dbUpdates.subscription = updates.subscription;
      if (updates.interests !== undefined) dbUpdates.interests = updates.interests;
      if (updates.preferredSources !== undefined) dbUpdates.preferred_sources = updates.preferredSources;
      if (updates.savedArticles !== undefined) dbUpdates.saved_articles = updates.savedArticles;
      if (updates.notifEmail !== undefined) dbUpdates.notif_email = updates.notifEmail;
      if (updates.notifWhatsapp !== undefined) dbUpdates.notif_whatsapp = updates.notifWhatsapp;
      if (updates.notifSms !== undefined) dbUpdates.notif_sms = updates.notifSms;

      if (Object.keys(dbUpdates).length > 0) {
        await supabase
          .from("profiles")
          .update(dbUpdates)
          .eq("id", user.id);
      }
    },
    [user, supabase]
  );

  const toggleSaved = useCallback(
    (articleId: string) => {
      if (!user) return;
      const saved = user.savedArticles.includes(articleId)
        ? user.savedArticles.filter((id) => id !== articleId)
        : [...user.savedArticles, articleId];
      updateUser({ savedArticles: saved });
    },
    [user, updateUser]
  );

  const toggleSource = useCallback(
    (sourceName: string) => {
      if (!user) return;
      const current = user.preferredSources;
      if (current.includes(sourceName) && current.length === 1) return;
      const next = current.includes(sourceName)
        ? current.filter((s) => s !== sourceName)
        : [...current, sourceName];
      updateUser({ preferredSources: next });
    },
    [user, updateUser]
  );

  const upgradePlan = useCallback(
    (plan: User["subscription"]) => {
      updateUser({ subscription: plan });
    },
    [updateUser]
  );

  return (
    <AuthContext.Provider
      value={{
        user, authStep, authError, isLoading, pendingPhone,
        openAuth, closeAuth, sendOtp, verifyOtp, completeProfile,
        logout, updateUser, toggleSaved, toggleSource, upgradePlan,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
