// ─────────────────────────────────────────────────────────────
//  KhabarPati — Mock Data Layer
//  Replace fetchNews() in lib/newsApi.ts to wire live RSS feeds
// ─────────────────────────────────────────────────────────────

export type Category =
  | "राजनीति" | "अर्थतन्त्र" | "खेलकुद" | "प्रविधि" | "स्वास्थ्य"
  | "मनोरञ्जन" | "शिक्षा" | "वातावरण" | "विश्व" | "स्थानीय" | "व्यवसाय";

export type Source =
  | "Kantipur" | "OnlineKhabar" | "Ratopati" | "Lokantar"
  | "Thahakhabar" | "Setopati" | "Nagarik";

export interface NewsItem {
  id: string;
  title: string;
  titleEn: string;
  excerpt: string;
  excerptEn: string;
  category: Category;
  categoryEn: string;
  source: Source;
  sourceUrl: string;
  timeAgo: string;
  timeAgoEn: string;
  views: string;
  emoji: string;
  interestScore: number;
  isFeatured?: boolean;
  isBreaking?: boolean;
  // Extended fields from Supabase DB
  url?: string;
  imageUrl?: string;
  publishedAt?: string;
}

export interface VideoItem {
  id: string;
  title: string;
  titleEn: string;
  duration: string;
  views: string;
  channel: string;
  emoji: string;
  category: string;
  categoryEn: string;
  timeAgo: string;
  timeAgoEn: string;
  bgColor: string;
}

export interface PodcastItem {
  id: string;
  title: string;
  titleEn: string;
  host: string;
  hostEn: string;
  episode: number;
  duration: string;
  category: string;
  categoryEn: string;
  timeAgo: string;
  timeAgoEn: string;
  color: string;
}

export interface AuthorItem {
  id: string;
  name: string;
  nameEn: string;
  role: string;
  roleEn: string;
  source: string;
  initials: string;
  color: string;
  articleCount: number;
  latestTitle: string;
  latestTitleEn: string;
}

export interface TrendingTopic {
  rank: number;
  topic: string;
  topicEn: string;
  count: string;
}

export interface AdItem {
  id: string;
  company: string;
  tagline: string;
  taglineEn: string;
  cta: string;
  ctaEn: string;
  emoji: string;
  type: "leaderboard" | "medium-rect" | "half-page" | "strip" | "sidebar";
  gradient: string;
}

// ─── News ───────────────────────────────────────────────────

export const NEWS_ITEMS: NewsItem[] = [
  {
    id: "1",
    title: "संसद अधिवेशनमा बजेट प्रस्तुत — प्रमुख बुँदाहरू र विपक्षको प्रतिक्रिया",
    titleEn: "Budget presented in parliament — key highlights and opposition response",
    excerpt: "सरकारले आगामी आर्थिक वर्षको लागि १८ खर्ब रुपैयाँभन्दा बढीको बजेट प्रस्तुत गरेको छ। शिक्षा, स्वास्थ्य र पूर्वाधार विकासमा विशेष जोड दिइएको यस बजेटप्रति विपक्षी दलहरूले आपत्ति जनाएका छन्।",
    excerptEn: "The government has presented a budget of over NPR 1.8 trillion. Opposition parties raised objections to the budget's emphasis on education, health, and infrastructure.",
    category: "राजनीति",
    categoryEn: "Politics",
    source: "Kantipur",
    sourceUrl: "https://ekantipur.com",
    timeAgo: "३ घण्टा अगाडि",
    timeAgoEn: "3 hours ago",
    views: "२४,५००",
    emoji: "🏛️",
    interestScore: 94,
    isFeatured: true,
  },
  {
    id: "2",
    title: "नेपाल राष्ट्र बैंकले ब्याजदर घटायो — कर्जा प्रवाहमा सहजता आउने",
    titleEn: "Nepal Rastra Bank cuts interest rate — credit flow to ease",
    excerpt: "केन्द्रीय बैंकले नीतिगत ब्याजदर ०.५ प्रतिशत बिन्दुले घटाउने निर्णय गरेको छ।",
    excerptEn: "The central bank has decided to cut the policy interest rate by 0.5 percentage points.",
    category: "अर्थतन्त्र", categoryEn: "Economy",
    source: "OnlineKhabar", sourceUrl: "https://onlinekhabar.com",
    timeAgo: "१ घण्टा अगाडि", timeAgoEn: "1 hour ago",
    views: "८,२३०", emoji: "📈", interestScore: 87,
  },
  {
    id: "3",
    title: "नेपाली फुटबल टोलीले SAFF च्याम्पियनसिपको फाइनलमा प्रवेश गर्यो",
    titleEn: "Nepal football team reaches SAFF Championship final",
    excerpt: "नेपालले सेमिफाइनलमा भारतलाई हराउँदै ऐतिहासिक उपलब्धि हासिल गर्यो।",
    excerptEn: "Nepal achieved a historic feat by defeating India in the semi-final.",
    category: "खेलकुद", categoryEn: "Sports",
    source: "Ratopati", sourceUrl: "https://ratopati.com",
    timeAgo: "५ घण्टा अगाडि", timeAgoEn: "5 hours ago",
    views: "३१,४००", emoji: "⚽", interestScore: 81,
  },
  {
    id: "4",
    title: "संयुक्त राष्ट्रसंघमा नेपालको पहल — जलवायु परिवर्तनविरुद्ध नयाँ प्रस्ताव",
    titleEn: "Nepal's initiative at the UN — new climate change proposal",
    excerpt: "नेपालले हिमालय क्षेत्रका देशहरूको तर्फबाट विशेष जलवायु कोष स्थापनाको माग गरेको छ।",
    excerptEn: "Nepal demanded a special climate fund on behalf of Himalayan nations.",
    category: "विश्व", categoryEn: "World",
    source: "Lokantar", sourceUrl: "https://lokantar.com",
    timeAgo: "२ घण्टा अगाडि", timeAgoEn: "2 hours ago",
    views: "५,८००", emoji: "🌏", interestScore: 72,
  },
  {
    id: "5",
    title: "सगरमाथा आरोहण सिजन — यो वर्ष ५०० भन्दा बढी आरोहीले चढे",
    titleEn: "Everest climbing season — more than 500 climbers this year",
    excerpt: "यो वर्षको बसन्त सिजनमा विश्व रेकर्ड संख्यामा आरोहीले सगरमाथा आरोहण गरेका छन्।",
    excerptEn: "A record number of climbers summited Everest this spring season.",
    category: "स्थानीय", categoryEn: "Local",
    source: "Thahakhabar", sourceUrl: "https://thahakhabar.com",
    timeAgo: "४ घण्टा अगाडि", timeAgoEn: "4 hours ago",
    views: "१२,१००", emoji: "🏔️", interestScore: 65,
  },
  {
    id: "6",
    title: "नेपालमा डेङ्गु संक्रमणको संख्यामा वृद्धि — स्वास्थ्य मन्त्रालयको चेतावनी",
    titleEn: "Dengue cases surge in Nepal — Ministry of Health warning",
    excerpt: "मनसुनपूर्व नै डेङ्गुको प्रकोप फैलिन थालेकाले सतर्क रहन आग्रह गरिएको छ।",
    excerptEn: "The Ministry of Health urged the public to remain alert as dengue spreads before monsoon.",
    category: "स्वास्थ्य", categoryEn: "Health",
    source: "OnlineKhabar", sourceUrl: "https://onlinekhabar.com",
    timeAgo: "६ घण्टा अगाडि", timeAgoEn: "6 hours ago",
    views: "९,३५०", emoji: "💊", interestScore: 90, isBreaking: true,
  },
  {
    id: "7",
    title: "नेपालमा ५G सेवा विस्तारको तयारी — NTC र Ncell दुवैको घोषणा",
    titleEn: "Nepal prepares for 5G rollout — NTC and Ncell announce plans",
    excerpt: "सरकारले अर्को वर्षसम्म प्रमुख शहरहरूमा ५G सेवा शुरू गर्ने लक्ष्य राखेको छ।",
    excerptEn: "The government has set a target to launch 5G in major cities by next year.",
    category: "प्रविधि", categoryEn: "Technology",
    source: "Ratopati", sourceUrl: "https://ratopati.com",
    timeAgo: "७ घण्टा अगाडि", timeAgoEn: "7 hours ago",
    views: "७,६२०", emoji: "🚀", interestScore: 74,
  },
  {
    id: "8",
    title: "संसद विघटनको माग — नागरिक समाजको ज्ञापनपत्र",
    titleEn: "Demand to dissolve parliament — civil society memorandum",
    excerpt: "प्रमुख नागरिक समाजका संगठनहरूले संसद विघटन गरी मध्यावधि निर्वाचन गर्न माग गरेका छन्।",
    excerptEn: "Major civil society organizations demanded dissolution and mid-term elections.",
    category: "राजनीति", categoryEn: "Politics",
    source: "Kantipur", sourceUrl: "https://ekantipur.com",
    timeAgo: "८ घण्टा अगाडि", timeAgoEn: "8 hours ago",
    views: "१५,२००", emoji: "📋", interestScore: 94,
  },
  {
    id: "9",
    title: "रेमिट्यान्स आय बढ्यो — नेपाली अर्थतन्त्रमा सकारात्मक प्रभाव",
    titleEn: "Remittance income rises — positive impact on Nepali economy",
    excerpt: "चालु आर्थिक वर्षको पहिलो नौ महिनामा रेमिट्यान्स आप्रवाह १४ प्रतिशतले बढेको छ।",
    excerptEn: "Remittance inflows increased 14% in the first nine months of the fiscal year.",
    category: "अर्थतन्त्र", categoryEn: "Economy",
    source: "OnlineKhabar", sourceUrl: "https://onlinekhabar.com",
    timeAgo: "५ घण्टा अगाडि", timeAgoEn: "5 hours ago",
    views: "६,४५०", emoji: "💰", interestScore: 87,
  },
  {
    id: "10",
    title: "नेपाली एथलेटले एसियन गेम्समा पदक जिते — ऐतिहासिक उपलब्धि",
    titleEn: "Nepali athlete wins medal at Asian Games — historic achievement",
    excerpt: "एथलेटिक्स खेलमा नेपालले एसियन गेम्समा पहिलो पटक पदक जितेको छ।",
    excerptEn: "Nepal won a medal at the Asian Games in athletics for the first time.",
    category: "खेलकुद", categoryEn: "Sports",
    source: "Ratopati", sourceUrl: "https://ratopati.com",
    timeAgo: "११ घण्टा अगाडि", timeAgoEn: "11 hours ago",
    views: "२०,१००", emoji: "🏃", interestScore: 81,
  },
];

// ─── Videos ─────────────────────────────────────────────────

export const VIDEO_ITEMS: VideoItem[] = [
  {
    id: "v1",
    title: "बजेट २०८२ को प्रमुख बुँदाहरू — विशेष विश्लेषण",
    titleEn: "Budget 2082 key highlights — special analysis",
    duration: "१८:४२", views: "१.२ लाख", channel: "Kantipur TV",
    emoji: "🎙️", category: "राजनीति", categoryEn: "Politics",
    timeAgo: "२ घण्टा अगाडि", timeAgoEn: "2 hours ago",
    bgColor: "#1e293b",
  },
  {
    id: "v2",
    title: "SAFF फाइनल हाइलाइट्स — नेपाल बनाम भारत",
    titleEn: "SAFF Final Highlights — Nepal vs India",
    duration: "१२:१५", views: "३.५ लाख", channel: "AP1 HD",
    emoji: "⚽", category: "खेलकुद", categoryEn: "Sports",
    timeAgo: "४ घण्टा अगाडि", timeAgoEn: "4 hours ago",
    bgColor: "#14532d",
  },
  {
    id: "v3",
    title: "काठमाडौंको ट्राफिक समस्या — कारण र समाधान",
    titleEn: "Kathmandu traffic crisis — causes and solutions",
    duration: "०९:३३", views: "५४,२००", channel: "NTV",
    emoji: "🚦", category: "स्थानीय", categoryEn: "Local",
    timeAgo: "५ घण्टा अगाडि", timeAgoEn: "5 hours ago",
    bgColor: "#3b0764",
  },
  {
    id: "v4",
    title: "नेपालको आर्थिक संकट — विशेषज्ञसँग कुराकानी",
    titleEn: "Nepal's economic crisis — expert interview",
    duration: "२३:०७", views: "८८,४००", channel: "Avenues TV",
    emoji: "📊", category: "अर्थतन्त्र", categoryEn: "Economy",
    timeAgo: "१ दिन अगाडि", timeAgoEn: "1 day ago",
    bgColor: "#0c4a6e",
  },
  {
    id: "v5",
    title: "सगरमाथा — हिमाल आरोहणको पूर्ण यात्रा",
    titleEn: "Everest — complete mountaineering journey",
    duration: "३५:२१", views: "२.१ लाख", channel: "Mountain TV",
    emoji: "🏔️", category: "स्थानीय", categoryEn: "Local",
    timeAgo: "२ दिन अगाडि", timeAgoEn: "2 days ago",
    bgColor: "#1c1917",
  },
  {
    id: "v6",
    title: "५G प्रविधि — नेपालमा कहिले आउँछ?",
    titleEn: "5G technology — when will it arrive in Nepal?",
    duration: "१४:५५", views: "३२,१००", channel: "Tech Nepal",
    emoji: "📱", category: "प्रविधि", categoryEn: "Technology",
    timeAgo: "३ दिन अगाडि", timeAgoEn: "3 days ago",
    bgColor: "#172554",
  },
];

// ─── Podcasts ────────────────────────────────────────────────

export const PODCAST_ITEMS: PodcastItem[] = [
  {
    id: "p1",
    title: "नेपाली राजनीतिको भविष्य — संविधान र निर्वाचन",
    titleEn: "The future of Nepali politics — constitution and elections",
    host: "रमेश लेखक", hostEn: "Ramesh Lekhak",
    episode: 142, duration: "४५ मिन", category: "राजनीति", categoryEn: "Politics",
    timeAgo: "आज", timeAgoEn: "Today",
    color: "#C41E3A",
  },
  {
    id: "p2",
    title: "अर्थतन्त्र र युवा उद्यमिता — नयाँ सम्भावना",
    titleEn: "Economy and youth entrepreneurship — new possibilities",
    host: "सुनिता श्रेष्ठ", hostEn: "Sunita Shrestha",
    episode: 88, duration: "३२ मिन", category: "अर्थतन्त्र", categoryEn: "Economy",
    timeAgo: "हिजो", timeAgoEn: "Yesterday",
    color: "#15803d",
  },
  {
    id: "p3",
    title: "खेलकुदमा नेपाल — साफ देखि ओलम्पिकसम्म",
    titleEn: "Nepal in sports — from SAFF to Olympics",
    host: "बिनोद गुरुङ", hostEn: "Binod Gurung",
    episode: 57, duration: "५१ मिन", category: "खेलकुद", categoryEn: "Sports",
    timeAgo: "२ दिन अगाडि", timeAgoEn: "2 days ago",
    color: "#b45309",
  },
  {
    id: "p4",
    title: "प्रविधि र नेपाल — डिजिटल परिवर्तनको यात्रा",
    titleEn: "Tech and Nepal — journey of digital transformation",
    host: "अञ्जना पाठक", hostEn: "Anjana Pathak",
    episode: 34, duration: "२८ मिन", category: "प्रविधि", categoryEn: "Technology",
    timeAgo: "३ दिन अगाडि", timeAgoEn: "3 days ago",
    color: "#1d4ed8",
  },
];

// ─── Authors ─────────────────────────────────────────────────

export const AUTHOR_ITEMS: AuthorItem[] = [
  {
    id: "a1",
    name: "युवराज घिमिरे", nameEn: "Yuvraj Ghimire",
    role: "वरिष्ठ सम्पादक", roleEn: "Senior Editor",
    source: "Kantipur", initials: "यु", color: "#C41E3A",
    articleCount: 1240,
    latestTitle: "संसदीय लोकतन्त्रको संकट र समाधानको बाटो",
    latestTitleEn: "The crisis of parliamentary democracy and the path forward",
  },
  {
    id: "a2",
    name: "सुधीर शर्मा", nameEn: "Sudheer Sharma",
    role: "राजनीतिक विश्लेषक", roleEn: "Political Analyst",
    source: "Setopati", initials: "सु", color: "#1a5a6b",
    articleCount: 876,
    latestTitle: "बजेट र विकासको प्राथमिकता — के सरकारको दिशा सही छ?",
    latestTitleEn: "Budget priorities — is the government on the right track?",
  },
  {
    id: "a3",
    name: "उमा रेग्मी", nameEn: "Uma Regmi",
    role: "अर्थ संवाददाता", roleEn: "Economy Reporter",
    source: "OnlineKhabar", initials: "उ", color: "#1a6b3a",
    articleCount: 643,
    latestTitle: "रेमिट्यान्स र बैंकिङ — नयाँ नीतिको असर",
    latestTitleEn: "Remittance and banking — impact of new policies",
  },
  {
    id: "a4",
    name: "दिपेश गौतम", nameEn: "Dipesh Gautam",
    role: "खेलकुद पत्रकार", roleEn: "Sports Journalist",
    source: "Ratopati", initials: "दि", color: "#1a3a6b",
    articleCount: 512,
    latestTitle: "SAFF जित र नेपाली फुटबलको भविष्य",
    latestTitleEn: "SAFF win and the future of Nepali football",
  },
  {
    id: "a5",
    name: "प्रतिमा थापा", nameEn: "Pratima Thapa",
    role: "स्वास्थ्य सम्वाददाता", roleEn: "Health Correspondent",
    source: "Nagarik", initials: "प्र", color: "#6b1a1a",
    articleCount: 389,
    latestTitle: "डेङ्गु महामारी — सरकारी तयारीको अवस्था",
    latestTitleEn: "Dengue epidemic — state of government preparedness",
  },
  {
    id: "a6",
    name: "निराजन कोइराला", nameEn: "Nirajan Koirala",
    role: "प्रविधि लेखक", roleEn: "Tech Writer",
    source: "Lokantar", initials: "नि", color: "#4a1a6b",
    articleCount: 298,
    latestTitle: "नेपालमा डिजिटल भुक्तानी — सुरक्षा र सुविधा",
    latestTitleEn: "Digital payments in Nepal — security and convenience",
  },
];

// ─── Other data ──────────────────────────────────────────────

export const TRENDING_TOPICS: TrendingTopic[] = [
  { rank: 1, topic: "बजेट २०८२", topicEn: "Budget 2082", count: "४२.१क" },
  { rank: 2, topic: "SAFF च्याम्पियनसिप", topicEn: "SAFF Championship", count: "३१.५क" },
  { rank: 3, topic: "राष्ट्र बैंक ब्याजदर", topicEn: "NRB Interest Rate", count: "१८.२क" },
  { rank: 4, topic: "सगरमाथा आरोहण", topicEn: "Everest Climbing", count: "१४.७क" },
  { rank: 5, topic: "डेङ्गु प्रकोप", topicEn: "Dengue Outbreak", count: "११.३क" },
];

export const BREAKING_TICKERS: { np: string; en: string }[] = [
  { np: "काठमाडौंमा भूकम्पको धक्का", en: "Earthquake tremor in Kathmandu" },
  { np: "प्रधानमन्त्री आज संसदमा", en: "PM addresses parliament today" },
  { np: "नेपाल-भारत व्यापार वार्ता सुरु", en: "Nepal-India trade talks begin" },
  { np: "मौसम: काठमाडौंमा वर्षाको सम्भावना", en: "Weather: Rain likely in Kathmandu" },
  { np: "सेयर बजारमा तेजी", en: "Stock market rallies" },
  { np: "ANFA ले नयाँ कोच नियुक्त गर्ने", en: "ANFA to appoint new coach" },
];

export const ADS: AdItem[] = [
  {
    id: "ad-leader",
    company: "नबिल बैंक",
    tagline: "व्यक्तिगत ऋण ७.५% ब्याजमा — अनलाइन आवेदन दिनुहोस्",
    taglineEn: "Personal loan at 7.5% — apply online now",
    cta: "थप जान्नुहोस्",
    ctaEn: "Apply Now",
    emoji: "🏦",
    type: "leaderboard",
    gradient: "linear-gradient(135deg, #1a3a6b 0%, #0f2040 100%)",
  },
  {
    id: "ad-medium",
    company: "Oliz Park Homes",
    tagline: "काठमाडौंमा सुलभ मूल्यको फ्ल्याट",
    taglineEn: "Affordable flats in Kathmandu",
    cta: "हेर्नुहोस्",
    ctaEn: "View",
    emoji: "🏠",
    type: "medium-rect",
    gradient: "linear-gradient(135deg, #1a6b3a 0%, #0d3d20 100%)",
  },
  {
    id: "ad-half",
    company: "Daraz Nepal",
    tagline: "महा सेल! ५०% सम्म छुट — आज मात्र",
    taglineEn: "Mega Sale! Up to 50% off — today only",
    cta: "अहिले किन्नुहोस्",
    ctaEn: "Shop Now",
    emoji: "🛍️",
    type: "half-page",
    gradient: "linear-gradient(135deg, #f97316 0%, #c2410c 100%)",
  },
  {
    id: "ad-strip",
    company: "Ncell",
    tagline: "नयाँ डेटा प्याक — ३ GB मात्र रु. ९९",
    taglineEn: "New data pack — 3 GB for NPR 99 only",
    cta: "किन्नुहोस्",
    ctaEn: "Buy Now",
    emoji: "📡",
    type: "strip",
    gradient: "linear-gradient(135deg, #7e22ce 0%, #4c1d95 100%)",
  },
];

export const CATEGORIES = [
  { np: "सबै", en: "All" },
  { np: "राजनीति", en: "Politics" },
  { np: "अर्थतन्त्र", en: "Economy" },
  { np: "खेलकुद", en: "Sports" },
  { np: "प्रविधि", en: "Technology" },
  { np: "स्वास्थ्य", en: "Health" },
  { np: "मनोरञ्जन", en: "Entertainment" },
  { np: "शिक्षा", en: "Education" },
  { np: "वातावरण", en: "Environment" },
  { np: "विश्व", en: "World" },
  { np: "स्थानीय", en: "Local" },
  { np: "व्यवसाय", en: "Business" },
];

export const SOURCES = [
  { name: "Kantipur" as Source, color: "#C41E3A", url: "https://ekantipur.com" },
  { name: "OnlineKhabar" as Source, color: "#1a6b3a", url: "https://onlinekhabar.com" },
  { name: "Ratopati" as Source, color: "#1a3a6b", url: "https://ratopati.com" },
  { name: "Lokantar" as Source, color: "#6b4a1a", url: "https://lokantar.com" },
  { name: "Thahakhabar" as Source, color: "#4a1a6b", url: "https://thahakhabar.com" },
  { name: "Setopati" as Source, color: "#555555", url: "https://setopati.com" },
  { name: "Nagarik" as Source, color: "#1a5a6b", url: "https://nagariknews.com" },
];

export const INTEREST_TAGS = [
  { np: "राजनीति", en: "Politics" },
  { np: "अर्थतन्त्र", en: "Economy" },
  { np: "खेलकुद", en: "Sports" },
  { np: "प्रविधि", en: "Technology" },
  { np: "स्वास्थ्य", en: "Health" },
  { np: "मनोरञ्जन", en: "Entertainment" },
  { np: "शिक्षा", en: "Education" },
  { np: "वातावरण", en: "Environment" },
];
