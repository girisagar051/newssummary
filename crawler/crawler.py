#!/usr/bin/env python3
"""
KhabarPati News Crawler
=======================
Fetches RSS feeds from Nepali news sources and upserts into Supabase.

Usage:
  pip install -r requirements.txt
  python crawler.py

Schedule with cron (every 30 min):
  */30 * * * * cd /path/to/crawler && python crawler.py >> crawler.log 2>&1

Or dry-run (no DB write):
  python crawler.py --dry-run
"""

import os
import re
import sys
import time
import logging
import argparse
import xml.etree.ElementTree as ET
from datetime import datetime, timezone
from typing import Optional
from urllib.request import urlopen, Request
from urllib.error import URLError

try:
    from supabase import create_client, Client
    SUPABASE_AVAILABLE = True
except ImportError:
    SUPABASE_AVAILABLE = False

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(message)s",
    datefmt="%Y-%m-%d %H:%M:%S",
)
log = logging.getLogger("crawler")

# ─── Config ───────────────────────────────────────────────────
SUPABASE_URL = os.getenv("CRAWLER_SUPABASE_URL") or os.getenv("NEXT_PUBLIC_SUPABASE_URL", "")
SUPABASE_KEY = os.getenv("CRAWLER_SUPABASE_KEY") or os.getenv("SUPABASE_SERVICE_ROLE_KEY", "")

FEEDS: list[dict] = [
    {"name": "Kantipur",     "url": "https://ekantipur.com/rss",              "category": "सामान्य", "category_en": "General"},
    {"name": "OnlineKhabar", "url": "https://www.onlinekhabar.com/feed",       "category": "सामान्य", "category_en": "General"},
    {"name": "Ratopati",     "url": "https://ratopati.com/feed",               "category": "सामान्य", "category_en": "General"},
    {"name": "Setopati",     "url": "https://setopati.com/feed",               "category": "सामान्य", "category_en": "General"},
    {"name": "Lokantar",     "url": "https://lokantar.com/feed",               "category": "सामान्य", "category_en": "General"},
    {"name": "Thahakhabar",  "url": "https://thahakhabar.com/feed",            "category": "सामान्य", "category_en": "General"},
    {"name": "Nagarik",      "url": "https://nagariknews.com/feed",            "category": "सामान्य", "category_en": "General"},
]

CATEGORY_RULES: list[tuple[str, str, list[str]]] = [
    ("राजनीति",       "Politics",       ["राजनीति","संसद","सरकार","मन्त्री","प्रधानमन्त्री","दल","चुनाव","नेता"]),
    ("अर्थतन्त्र",   "Economy",        ["अर्थ","बजेट","बैंक","शेयर","लगानी","व्यापार","रुपैयाँ","कर"]),
    ("खेलकुद",        "Sports",         ["क्रिकेट","फुटबल","खेल","टोली","खेलाडी","ओलम्पिक","स्वर्ण","रजत"]),
    ("प्रविधि",       "Technology",     ["प्रविधि","इन्टरनेट","डिजिटल","एआई","स्मार्टफोन","सफ्टवेयर","साइबर"]),
    ("मनोरञ्जन",     "Entertainment",  ["मनोरञ्जन","फिल्म","गीत","कलाकार","संगीत","टेलिसिरियल","अवार्ड"]),
    ("स्वास्थ्य",    "Health",         ["स्वास्थ्य","अस्पताल","बिरामी","डाक्टर","औषधि","रोग","कोरोना","खोप"]),
    ("अन्तर्राष्ट्रिय","International",["अन्तर्राष्ट्रिय","विदेश","भारत","चीन","अमेरिका","विश्व","संयुक्त राष्ट्र"]),
    ("पर्यटन",        "Tourism",        ["पर्यटन","हिमाल","ट्रेकिङ","पर्यटक","होटल","एभरेस्ट"]),
]

EMOJI_MAP: dict[str, str] = {
    "राजनीति": "🏛️", "अर्थतन्त्र": "💰", "खेलकुद": "🏆",
    "प्रविधि": "💻", "मनोरञ्जन": "🎬", "स्वास्थ्य": "🏥",
    "अन्तर्राष्ट्रिय": "🌍", "पर्यटन": "🏔️", "सामान्य": "📰",
}


def detect_category(text: str) -> tuple[str, str]:
    for cat_np, cat_en, keywords in CATEGORY_RULES:
        if any(kw in text for kw in keywords):
            return cat_np, cat_en
    return "सामान्य", "General"


def clean_html(raw: str) -> str:
    clean = re.sub(r"<[^>]+>", " ", raw or "")
    clean = re.sub(r"&[a-z]+;", " ", clean)
    return re.sub(r"\s+", " ", clean).strip()


def fetch_rss(url: str, timeout: int = 15) -> Optional[ET.Element]:
    try:
        req = Request(url, headers={"User-Agent": "KhabarPati-Crawler/1.0"})
        with urlopen(req, timeout=timeout) as resp:
            content = resp.read()
        return ET.fromstring(content)
    except URLError as e:
        log.warning("Network error fetching %s: %s", url, e)
    except ET.ParseError as e:
        log.warning("XML parse error for %s: %s", url, e)
    return None


def parse_items(root: ET.Element, feed: dict, limit: int = 10) -> list[dict]:
    ns = {"media": "http://search.yahoo.com/mrss/"}
    channel = root.find("channel")
    if channel is None:
        return []

    items = []
    for item in list(channel.findall("item"))[:limit]:
        title = clean_html(item.findtext("title") or "")
        url = (item.findtext("link") or "").strip()
        excerpt = clean_html(item.findtext("description") or "")
        pub_str = item.findtext("pubDate") or ""

        if not title or not url:
            continue

        image_url = None
        enc = item.find("enclosure")
        if enc is not None and "image" in (enc.get("type") or ""):
            image_url = enc.get("url")
        media_thumb = item.find("media:thumbnail", ns)
        if media_thumb is not None:
            image_url = image_url or media_thumb.get("url")

        try:
            from email.utils import parsedate_to_datetime
            pub_dt = parsedate_to_datetime(pub_str).astimezone(timezone.utc)
            published_at = pub_dt.isoformat()
        except Exception:
            published_at = datetime.now(timezone.utc).isoformat()

        combined = title + " " + excerpt
        cat_np, cat_en = detect_category(combined)
        if cat_np == "सामान्य":
            cat_np = feed["category"]
            cat_en = feed["category_en"]

        emoji = EMOJI_MAP.get(cat_np, "📰")

        items.append({
            "title": title,
            "excerpt": excerpt[:500] if excerpt else None,
            "category": cat_np,
            "category_en": cat_en,
            "source": feed["name"],
            "url": url,
            "image_url": image_url,
            "emoji": emoji,
            "interest_score": 50,
            "is_featured": False,
            "is_breaking": False,
            "views": 0,
            "published_at": published_at,
        })

    return items


def upsert_items(supabase: "Client", items: list[dict]) -> tuple[int, int]:
    inserted = skipped = 0
    for item in items:
        try:
            result = supabase.table("news_items").upsert(
                item, on_conflict="url"
            ).execute()
            if result.data:
                inserted += 1
        except Exception as e:
            log.debug("Skip %s: %s", item.get("url", "?")[:60], e)
            skipped += 1
    return inserted, skipped


def run_once(supabase: Optional["Client"] = None) -> None:
    total_inserted = total_skipped = 0

    for feed in FEEDS:
        log.info("Fetching %s → %s", feed["name"], feed["url"])
        root = fetch_rss(feed["url"])
        if root is None:
            log.warning("  Skipped (fetch/parse failed)")
            continue

        items = parse_items(root, feed, limit=10)
        log.info("  Parsed %d items", len(items))

        if supabase:
            ins, skip = upsert_items(supabase, items)
            total_inserted += ins
            total_skipped += skip
            log.info("  Upserted %d, skipped %d", ins, skip)
        else:
            for i in items:
                print(f"  [{i['category']}] {i['title'][:70]}")

    if supabase:
        log.info("Done. Total inserted/updated: %d, skipped: %d", total_inserted, total_skipped)


def main() -> None:
    parser = argparse.ArgumentParser(description="KhabarPati RSS Crawler")
    parser.add_argument("--dry-run", action="store_true", help="Print items without saving to DB")
    parser.add_argument("--interval", type=int, default=30, help="Minutes between runs (default: 30)")
    parser.add_argument("--once", action="store_true", help="Run once and exit")
    args = parser.parse_args()

    supabase = None
    if not args.dry_run:
        if not SUPABASE_AVAILABLE:
            log.error("supabase-py not installed. Run: pip install supabase")
            sys.exit(1)
        if not SUPABASE_URL or not SUPABASE_KEY:
            log.error("CRAWLER_SUPABASE_URL and CRAWLER_SUPABASE_KEY env vars must be set")
            sys.exit(1)
        supabase = create_client(SUPABASE_URL, SUPABASE_KEY)
        log.info("Connected to Supabase: %s", SUPABASE_URL[:40] + "...")
    else:
        log.info("Dry-run mode — no data will be saved")

    if args.once or args.dry_run:
        run_once(supabase)
    else:
        log.info("Running every %d minutes. Press Ctrl+C to stop.", args.interval)
        while True:
            run_once(supabase)
            log.info("Sleeping %d minutes...", args.interval)
            time.sleep(args.interval * 60)


if __name__ == "__main__":
    main()
