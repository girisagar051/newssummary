"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function LoginRedirect() {
  const router = useRouter();
  const { openAuth } = useAuth();

  useEffect(() => {
    router.replace("/");
    setTimeout(() => openAuth(), 150);
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center text-sm text-gray-400">
      रिडाइरेक्ट गर्दैछ…
    </div>
  );
}
