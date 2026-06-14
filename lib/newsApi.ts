// ─────────────────────────────────────────────────────────────
//  KhabarPati — News API
//  Reads from Supabase with mock fallback when DB is empty.
// ─────────────────────────────────────────────────────────────

import { createClient } from "@/lib/supabase/client";
import {
  NEWS_ITEMS,
  TRENDING_TOPICS,
  type NewsItem,
  type TrendingTopic,
} from "./mockData";

// ─── RSS feed URLs (used by crawler, not Next.js) ─────────────
export const RSS_FEEDS = {
  Kantipur:    "https://ekantipur.com/rss",
  OnlineKhabar:"https://onlinekhabar.com/feed",
  Ratopati:    "https://ratopati.com/feed",
  Lokantar:    "https://lokantar.com/feed",
  Thahakhabar: "https://thahakhabar.com/feed",
  Setopati:    "https://setopati.com/feed",
  Nagarik:     "https://nagariknews.com/feed",
};

// ─── Shape returned by Supabase ────────────────────────────────
interface DbNewsRow {
  id: string;
  title: string;
  title_en: string | null;
  excerpt: string | null;
  excerpt_en: string | null;
  category: string;
  category_en: string;
  source: string;
  source_url: string | null;
  url: string;
  image_url: string | null;
  emoji: string;
  interest_score: number;
  is_featured: boolean;
  is_breaking: boolean;
  views: number;
  published_at: string;
}

function timeAgoNp(dateStr: string): { np: string; en: string } {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  const hrs = Math.floor(mins / 60);
  const days = Math.floor(hrs / 24);
  if (mins < 60) return { np: `${mins} मिनेट अघि`, en: `${mins}m ago` };
  if (hrs < 24) return { np: `${hrs} घण्टा अघि`, en: `${hrs}h ago` };
  return { np: `${days} दिन अघि`, en: `${days}d ago` };
}

function formatViews(n: number): string {
  if (n >= 1000) return `${(n / 1000).toFixed(1)}k`;
  return String(n);
}

function dbRowToNewsItem(row: DbNewsRow): NewsItem {
  const ago = timeAgoNp(row.published_at);
  return {
    id: row.id,
    title: row.title,
    titleEn: row.title_en ?? row.title,
    excerpt: row.excerpt ?? "",
    excerptEn: row.excerpt_en ?? row.excerpt ?? "",
    // Cast is safe — DB stores the same Nepali category names as the Category type
    category: row.category as import("./mockData").Category,
    categoryEn: row.category_en,
    source: row.source as import("./mockData").Source,
    sourceUrl: row.source_url ?? "",
    timeAgo: ago.np,
    timeAgoEn: ago.en,
    views: formatViews(row.views),
    url: row.url,
    imageUrl: row.image_url ?? undefined,
    emoji: row.emoji ?? "📰",
    interestScore: row.interest_score,
    isFeatured: row.is_featured,
    isBreaking: row.is_breaking,
    publishedAt: row.published_at,
  };
}

// ─── Cached fetch with mock fallback ──────────────────────────
let _cache: NewsItem[] | null = null;
let _cacheTime = 0;
const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes

async function fetchAllFromDb(): Promise<NewsItem[]> {
  const now = Date.now();
  if (_cache && now - _cacheTime < CACHE_TTL_MS) return _cache;

  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("news_items")
      .select("*")
      .order("published_at", { ascending: false })
      .limit(100);

    if (error || !data || data.length === 0) {
      // DB empty or error → fall back to mock
      return NEWS_ITEMS;
    }

    _cache = (data as DbNewsRow[]).map(dbRowToNewsItem);
    _cacheTime = now;
    return _cache;
  } catch {
    // Network error or no Supabase env vars → mock
    return NEWS_ITEMS;
  }
}

// ─── Public API ───────────────────────────────────────────────
export async function fetchTopNews(): Promise<NewsItem[]> {
  return fetchAllFromDb();
}

export async function fetchFeaturedNews(): Promise<NewsItem | null> {
  const items = await fetchTopNews();
  return items.find((i) => i.isFeatured) ?? items[0] ?? null;
}

export async function fetchBreakingNews(): Promise<NewsItem[]> {
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("news_items")
      .select("*")
      .eq("is_breaking", true)
      .order("published_at", { ascending: false })
      .limit(10);

    if (error || !data || data.length === 0) {
      return (await fetchTopNews()).filter((i) => i.isBreaking);
    }
    return (data as DbNewsRow[]).map(dbRowToNewsItem);
  } catch {
    return (await fetchTopNews()).filter((i) => i.isBreaking);
  }
}

export async function fetchByCategory(category: string): Promise<NewsItem[]> {
  const all = await fetchTopNews();
  if (category === "सबै" || category === "All") return all;
  return all.filter(
    (i) => i.category === category || i.categoryEn === category
  );
}

export async function fetchTrending(): Promise<TrendingTopic[]> {
  // Could aggregate from article_views in the future
  return TRENDING_TOPICS;
}

export async function fetchForYou(interestTags: string[]): Promise<NewsItem[]> {
  const all = await fetchTopNews();
  if (!interestTags.length) return all.slice(0, 6);
  return all
    .filter(
      (i) =>
        interestTags.includes(i.category) ||
        interestTags.includes(i.categoryEn)
    )
    .sort((a, b) => b.interestScore - a.interestScore)
    .slice(0, 6);
}

/** Increment view count (fire and forget) */
export async function recordView(articleId: string, userId?: string) {
  try {
    const supabase = createClient();
    await supabase.from("article_views").insert({
      article_id: articleId,
      user_id: userId ?? null,
    });
    // Also bump the counter on the article row
    await supabase.rpc("increment_views", { article_id: articleId });
  } catch {
    // Non-critical — ignore errors
  }
}
