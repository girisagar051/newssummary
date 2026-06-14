-- ═══════════════════════════════════════════════════════════════
--  KhabarPati — Seed Data
--  Run after 001_init.sql
-- ═══════════════════════════════════════════════════════════════

-- ─── Breaking Tickers ─────────────────────────────────────────
INSERT INTO public.breaking_tickers (text_np, text_en, priority) VALUES
  ('काठमाडौंमा आज भारी वर्षाको सम्भावना, मौसम विभागको चेतावनी', 'Heavy rainfall warning for Kathmandu today, Met Department alert', 10),
  ('नेपाल–भारत सीमा विवाद: परराष्ट्र मन्त्रालयको उच्चस्तरीय बैठक', 'Nepal-India border dispute: High-level foreign ministry meeting', 9),
  ('शेयर बजार: नेप्से सूचकाङ्क ४२ अंकले वृद्धि, कारोबार ३ अर्ब पार', 'NEPSE index rises 42 points, turnover crosses Rs 3 billion', 8),
  ('संसद अधिवेशन सुरु: प्रधानमन्त्री आज बजेट वक्तव्य दिँदै', 'Parliament session begins: PM to present budget statement today', 7),
  ('काठमाडौं महानगरले नयाँ फोहोर व्यवस्थापन योजना सार्वजनिक गर्यो', 'Kathmandu Metropolitan City unveils new waste management plan', 6)
ON CONFLICT DO NOTHING;

-- ─── Ads ──────────────────────────────────────────────────────
INSERT INTO public.ads (label, label_en, sponsor, cta, cta_en, gradient, badge, badge_color, size, priority) VALUES
  (
    'नेपालको नम्बर १ डिजिटल बैंकिङ अनुभव',
    'Nepal''s #1 Digital Banking Experience',
    'नबिल बैंक',
    'अहिले नै खाता खोल्नुहोस्',
    'Open Account Now',
    'linear-gradient(135deg, #1e3a5f 0%, #2563eb 100%)',
    'NEW',
    '#1d4ed8',
    'leaderboard',
    10
  ),
  (
    'एनसेल ५जी — नेपालको सबैभन्दा छिटो नेटवर्क',
    'Ncell 5G — Nepal''s Fastest Network',
    'Ncell',
    'प्याकेज हेर्नुहोस्',
    'View Packages',
    'linear-gradient(135deg, #7c2d12 0%, #dc2626 100%)',
    'HOT',
    '#dc2626',
    'medium-rect',
    9
  ),
  (
    'शिक्षाको नयाँ युग — अनलाइनमा पढ्नुहोस्',
    'New Era of Education — Study Online',
    'Mero School',
    'नि:शुल्क सुरु गर्नुहोस्',
    'Start Free',
    'linear-gradient(135deg, #064e3b 0%, #059669 100%)',
    'FREE',
    '#059669',
    'half-page',
    8
  ),
  (
    'दराज नेपाल — हरेक दिन नयाँ डिल',
    'Daraz Nepal — New Deals Every Day',
    'Daraz',
    'डिल हेर्नुहोस्',
    'See Deals',
    'linear-gradient(135deg, #f97316 0%, #ea580c 100%)',
    'SALE',
    '#ea580c',
    'strip',
    7
  )
ON CONFLICT DO NOTHING;

-- ─── Sample News Items ────────────────────────────────────────
INSERT INTO public.news_items (title, title_en, excerpt, category, category_en, source, url, emoji, interest_score, is_featured, is_breaking, published_at) VALUES
  (
    'संसदमा नयाँ बजेट पेश: शिक्षा र स्वास्थ्यमा ठूलो लगानी',
    'New Budget Presented in Parliament: Major Investment in Education and Health',
    'सरकारले आगामी आर्थिक वर्षको लागि १८ खर्ब रुपैयाँ बराबरको बजेट पेश गरेको छ। शिक्षा र स्वास्थ्य क्षेत्रमा गत वर्षको तुलनामा ३० प्रतिशत बढी बजेट विनियोजन गरिएको छ।',
    'राजनीति', 'Politics', 'Kantipur', 'https://ekantipur.com/sample/budget-2081', '🏛️', 90, true, true,
    NOW() - INTERVAL '2 hours'
  ),
  (
    'नेपाल क्रिकेट टिम: एशिया कप छनोटमा भारतसँग खेल आज',
    'Nepal Cricket Team: Match Against India in Asia Cup Qualifier Today',
    'नेपाल क्रिकेट टिम आज दिउँसो २ बजेदेखि भारतसँग एशिया कप छनोट खेल खेल्नेछ। यो खेलमा जित्न सके नेपाल मुख्य टूर्नामेन्टमा छनोट हुनेछ।',
    'खेलकुद', 'Sports', 'OnlineKhabar', 'https://onlinekhabar.com/sample/cricket-india', '🏏', 85, false, true,
    NOW() - INTERVAL '1 hour'
  ),
  (
    'नेपालमा विद्युतीय गाडीको माग बढ्दै, सरकारले अनुदान दिने घोषणा',
    'Demand for Electric Vehicles Rising in Nepal, Government Announces Subsidy',
    'नेपाल सरकारले विद्युतीय गाडी खरिदमा ५ लाख रुपैयाँसम्मको अनुदान दिने घोषणा गरेको छ। यस नीतिले देशमा हरित ऊर्जाको प्रयोग बढाउने अपेक्षा गरिएको छ।',
    'अर्थतन्त्र', 'Economy', 'Ratopati', 'https://ratopati.com/sample/ev-subsidy', '🚗', 78, false, false,
    NOW() - INTERVAL '3 hours'
  ),
  (
    'चन्द्रागिरि हिल्समा नयाँ पर्यटकीय गन्तव्य निर्माण हुँदै',
    'New Tourist Destination Being Developed at Chandragiri Hills',
    'काठमाडौं नजिकको चन्द्रागिरि हिल्समा अत्याधुनिक पर्यटकीय पूर्वाधार विकास गरिँदैछ। नयाँ केबलकार र रिसोर्ट निर्माणले पर्यटन क्षेत्रलाई थप बढावा दिनेछ।',
    'पर्यटन', 'Tourism', 'Setopati', 'https://setopati.com/sample/chandragiri', '🏔️', 72, false, false,
    NOW() - INTERVAL '5 hours'
  ),
  (
    'काठमाडौंमा स्टार्टअप हब: ५० नयाँ प्रविधि कम्पनी दर्ता',
    'Startup Hub in Kathmandu: 50 New Tech Companies Registered',
    'काठमाडौं उपत्यकामा प्रविधि स्टार्टअपको लहर आएको छ। गत महिना मात्रै ५० भन्दा बढी नयाँ प्रविधि कम्पनीहरू दर्ता भएका छन्, जसले युवा रोजगारीमा सहयोग पुग्नेछ।',
    'प्रविधि', 'Technology', 'Lokantar', 'https://lokantar.com/sample/startups', '💻', 80, false, false,
    NOW() - INTERVAL '4 hours'
  )
ON CONFLICT (url) DO NOTHING;
