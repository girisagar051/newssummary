import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Allow images from common Nepali news source domains
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "*.ekantipur.com" },
      { protocol: "https", hostname: "*.onlinekhabar.com" },
      { protocol: "https", hostname: "*.ratopati.com" },
      { protocol: "https", hostname: "*.setopati.com" },
      { protocol: "https", hostname: "*.lokantar.com" },
      { protocol: "https", hostname: "*.thahakhabar.com" },
      { protocol: "https", hostname: "*.nagariknews.com" },
      // Supabase storage
      { protocol: "https", hostname: "*.supabase.co" },
    ],
  },

  // Strict mode helps catch issues early
  reactStrictMode: true,

  // Compiler optimizations
  compiler: {
    // Remove console.log in production
    removeConsole: process.env.NODE_ENV === "production"
      ? { exclude: ["error", "warn"] }
      : false,
  },

  // Headers are also set in vercel.json — this handles self-hosted
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Content-Type-Options",  value: "nosniff" },
          { key: "X-Frame-Options",          value: "DENY" },
          { key: "X-XSS-Protection",         value: "1; mode=block" },
          { key: "Referrer-Policy",          value: "strict-origin-when-cross-origin" },
        ],
      },
    ];
  },
};

export default nextConfig;
