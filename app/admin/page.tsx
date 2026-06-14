"use client";
import { useState } from "react";
import Link from "next/link";
import { SOURCES } from "@/lib/mockData";

// ── Mock admin data ──────────────────────────────────────────────────────────
const STATS = [
  { label: "दैनिक पाठकहरू", labelEn: "Daily Readers", value: "१२,४५०", delta: "+८.२%", up: true },
  { label: "कुल सदस्यहरू", labelEn: "Total Users", value: "३,८२१", delta: "+१२.५%", up: true },
  { label: "WhatsApp सदस्यहरू", labelEn: "WA Subscribers", value: "४५६", delta: "+३.१%", up: true },
  { label: "आजको राजस्व", labelEn: "Today's Revenue", value: "रु. ८,७४०", delta: "-२.३%", up: false },
];

const ADS_DATA = [
  { id: "AD-001", company: "नबिल बैंक", slot: "Strip", impressions: "१२,४५०", clicks: "३४५", ctr: "२.७७%", status: "active" },
  { id: "AD-002", company: "Oliz Park Homes", slot: "Sidebar", impressions: "९,८२०", clicks: "१८९", ctr: "१.९२%", status: "active" },
  { id: "AD-003", company: "Daraz Nepal", slot: "Inline", impressions: "७,२३०", clicks: "४५१", ctr: "6.२४%", status: "active" },
  { id: "AD-004", company: "Himalayan Bank", slot: "Strip", impressions: "0", clicks: "0", ctr: "–", status: "paused" },
];

const USERS_DATA = [
  { name: "राम बहादुर श्रेष्ठ", email: "ram@example.com", plan: "free", joined: "२०८१ फागुन", active: true },
  { name: "सीता देवी पौडेल", email: "sita@example.com", plan: "whatsapp", joined: "२०८१ माघ", active: true },
  { name: "हरि प्रसाद अधिकारी", email: "hari@example.com", plan: "premium", joined: "२०८१ पुष", active: true },
  { name: "गीता कुमारी थापा", email: "geeta@example.com", plan: "free", joined: "२०८२ बैशाख", active: false },
  { name: "बिनोद कुमार झा", email: "binod@example.com", plan: "whatsapp", joined: "२०८२ जेठ", active: true },
];

const PLAN_BADGE: Record<string, string> = {
  free: "bg-gray-100 text-gray-600",
  whatsapp: "bg-green-100 text-green-700",
  premium: "bg-amber-100 text-amber-700",
};

const NAV_ITEMS = [
  { icon: "📊", label: "ओभरभ्यू", id: "overview" },
  { icon: "📰", label: "समाचार स्रोत", id: "sources" },
  { icon: "📣", label: "विज्ञापन", id: "ads" },
  { icon: "👥", label: "प्रयोगकर्ता", id: "users" },
  { icon: "🔔", label: "सूचना", id: "notifications" },
];

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState("overview");
  const [sourceStatus, setSourceStatus] = useState<Record<string, boolean>>(
    Object.fromEntries(SOURCES.map((s) => [s.name, true]))
  );

  return (
    <div className="min-h-screen bg-gray-50 flex">

      {/* ── Sidebar ── */}
      <aside className="w-56 bg-gray-900 flex flex-col shrink-0 min-h-screen">
        <div className="px-4 py-5 border-b border-gray-800">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-red-700 rounded-lg flex items-center justify-center text-white text-xs font-medium">ख</div>
            <div>
              <div className="text-white text-sm font-medium">खबरपाटी</div>
              <div className="text-gray-500 text-[10px]">Admin Panel</div>
            </div>
          </div>
        </div>

        <nav className="flex-1 px-3 py-4 flex flex-col gap-1">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-left text-sm transition-colors ${
                activeTab === item.id
                  ? "bg-red-700 text-white"
                  : "text-gray-400 hover:text-white hover:bg-gray-800"
              }`}
            >
              <span>{item.icon}</span>
              {item.label}
            </button>
          ))}
        </nav>

        <div className="px-4 py-4 border-t border-gray-800">
          <Link href="/" className="flex items-center gap-2 text-xs text-gray-500 hover:text-gray-300 transition-colors">
            ← साइटमा फर्कनुहोस्
          </Link>
        </div>
      </aside>

      {/* ── Main ── */}
      <main className="flex-1 overflow-auto">
        <div className="px-6 py-5">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-lg font-medium text-gray-900">
              {NAV_ITEMS.find((n) => n.id === activeTab)?.icon}{" "}
              {NAV_ITEMS.find((n) => n.id === activeTab)?.label}
            </h1>
            <div className="text-xs text-gray-400">
              अन्तिम अपडेट: भर्खरै
            </div>
          </div>

          {/* ── Overview ── */}
          {activeTab === "overview" && (
            <div className="flex flex-col gap-6">
              {/* Stat cards */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {STATS.map((s) => (
                  <div key={s.label} className="bg-white rounded-xl border border-gray-100 p-4">
                    <div className="text-xs text-gray-400 mb-1">{s.labelEn}</div>
                    <div className="text-xl font-medium text-gray-900">{s.value}</div>
                    <div className={`text-xs mt-1 font-medium ${s.up ? "text-green-600" : "text-red-600"}`}>
                      {s.delta} vs yesterday
                    </div>
                  </div>
                ))}
              </div>

              {/* Simple bar chart */}
              <div className="bg-white rounded-xl border border-gray-100 p-5">
                <div className="text-sm font-medium text-gray-800 mb-4">Weekly Readership</div>
                <div className="flex items-end gap-2 h-28">
                  {[65, 82, 74, 91, 88, 95, 100].map((pct, i) => (
                    <div key={i} className="flex-1 flex flex-col items-center gap-1">
                      <div
                        className="w-full bg-red-700 rounded-t-sm transition-all"
                        style={{ height: `${pct}%`, opacity: i === 6 ? 1 : 0.5 + i * 0.07 }}
                      ></div>
                      <span className="text-[10px] text-gray-400">
                        {["आइत", "सोम", "मंगल", "बुध", "बिही", "शुक्र", "शनि"][i]}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Top articles */}
              <div className="bg-white rounded-xl border border-gray-100 p-5">
                <div className="text-sm font-medium text-gray-800 mb-4">Top Articles Today</div>
                <div className="flex flex-col gap-3">
                  {[
                    { title: "संसद अधिवेशनमा बजेट प्रस्तुत", views: "24,500", source: "Kantipur" },
                    { title: "नेपाली फुटबल SAFF फाइनलमा", views: "31,400", source: "Ratopati" },
                    { title: "नेपाल राष्ट्र बैंकले ब्याजदर घटायो", views: "8,230", source: "OnlineKhabar" },
                  ].map((a, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <span className="text-sm font-medium text-gray-300 w-5">{i + 1}</span>
                      <div className="flex-1 text-sm text-gray-700 line-clamp-1">{a.title}</div>
                      <span className="text-xs text-gray-400">{a.source}</span>
                      <span className="text-xs font-medium text-gray-700 min-w-[50px] text-right">{a.views}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ── Sources ── */}
          {activeTab === "sources" && (
            <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
              <div className="px-5 py-3 border-b border-gray-100 flex items-center justify-between">
                <span className="text-sm font-medium text-gray-800">समाचार स्रोतहरू</span>
                <button className="text-xs bg-red-700 text-white px-3 py-1.5 rounded-lg hover:bg-red-800 transition-colors">
                  + नयाँ स्रोत थप्नुहोस्
                </button>
              </div>
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50">
                    <th className="text-left px-5 py-3 text-xs font-medium text-gray-500">स्रोत</th>
                    <th className="text-left px-5 py-3 text-xs font-medium text-gray-500">RSS URL</th>
                    <th className="text-left px-5 py-3 text-xs font-medium text-gray-500">अन्तिम क्रल</th>
                    <th className="text-left px-5 py-3 text-xs font-medium text-gray-500">स्थिति</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {SOURCES.map((src) => (
                    <tr key={src.name} className="hover:bg-gray-50 transition-colors">
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-2">
                          <span className="w-2.5 h-2.5 rounded-full" style={{ background: src.color }}></span>
                          <span className="font-medium text-gray-800">{src.name}</span>
                        </div>
                      </td>
                      <td className="px-5 py-3 text-xs text-gray-400 font-mono">{src.url}/feed</td>
                      <td className="px-5 py-3 text-xs text-gray-500">१५ मिनेट अगाडि</td>
                      <td className="px-5 py-3">
                        <button
                          onClick={() => setSourceStatus((prev) => ({ ...prev, [src.name]: !prev[src.name] }))}
                          className={`w-10 h-5 rounded-full transition-colors relative ${sourceStatus[src.name] ? "bg-green-500" : "bg-gray-300"}`}
                        >
                          <span className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-all ${sourceStatus[src.name] ? "left-5" : "left-0.5"}`}></span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* ── Ads ── */}
          {activeTab === "ads" && (
            <div className="flex flex-col gap-4">
              <div className="flex justify-end">
                <button className="text-xs bg-red-700 text-white px-3 py-1.5 rounded-lg hover:bg-red-800 transition-colors">
                  + नयाँ विज्ञापन थप्नुहोस्
                </button>
              </div>
              <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-100 bg-gray-50">
                      {["ID", "कम्पनी", "स्लट", "Impressions", "Clicks", "CTR", "स्थिति", ""].map((h) => (
                        <th key={h} className="text-left px-4 py-3 text-xs font-medium text-gray-500">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {ADS_DATA.map((ad) => (
                      <tr key={ad.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-4 py-3 text-xs font-mono text-gray-400">{ad.id}</td>
                        <td className="px-4 py-3 font-medium text-gray-800">{ad.company}</td>
                        <td className="px-4 py-3 text-xs text-gray-500">{ad.slot}</td>
                        <td className="px-4 py-3 text-gray-700">{ad.impressions}</td>
                        <td className="px-4 py-3 text-gray-700">{ad.clicks}</td>
                        <td className="px-4 py-3 font-medium text-green-700">{ad.ctr}</td>
                        <td className="px-4 py-3">
                          <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${ad.status === "active" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                            {ad.status === "active" ? "सक्रिय" : "रोकिएको"}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <button className="text-xs text-red-700 hover:underline">सम्पादन</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ── Users ── */}
          {activeTab === "users" && (
            <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
              <div className="px-5 py-3 border-b border-gray-100 flex items-center gap-3">
                <input
                  placeholder="प्रयोगकर्ता खोज्नुहोस्..."
                  className="border border-gray-200 rounded-lg px-3 py-1.5 text-sm flex-1 max-w-xs outline-none focus:border-red-300"
                />
                <select className="border border-gray-200 rounded-lg px-3 py-1.5 text-sm text-gray-600 outline-none">
                  <option>सबै योजना</option>
                  <option>निःशुल्क</option>
                  <option>WhatsApp</option>
                  <option>प्रिमियम</option>
                </select>
              </div>
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50">
                    {["प्रयोगकर्ता", "इमेल", "योजना", "सदस्य भएको", "स्थिति"].map((h) => (
                      <th key={h} className="text-left px-5 py-3 text-xs font-medium text-gray-500">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {USERS_DATA.map((u) => (
                    <tr key={u.email} className="hover:bg-gray-50 transition-colors">
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-full bg-red-100 flex items-center justify-center text-xs text-red-700 font-medium">
                            {u.name.slice(0, 2)}
                          </div>
                          <span className="font-medium text-gray-800">{u.name}</span>
                        </div>
                      </td>
                      <td className="px-5 py-3 text-gray-500 text-xs">{u.email}</td>
                      <td className="px-5 py-3">
                        <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${PLAN_BADGE[u.plan]}`}>
                          {u.plan === "free" ? "निःशुल्क" : u.plan === "whatsapp" ? "WhatsApp" : "प्रिमियम"}
                        </span>
                      </td>
                      <td className="px-5 py-3 text-xs text-gray-500">{u.joined}</td>
                      <td className="px-5 py-3">
                        <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${u.active ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                          {u.active ? "सक्रिय" : "निष्क्रिय"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="px-5 py-3 border-t border-gray-100 flex items-center justify-between">
                <span className="text-xs text-gray-400">जम्मा ३,८२१ प्रयोगकर्ता</span>
                <div className="flex gap-1">
                  {[1, 2, 3].map((p) => (
                    <button key={p} className={`w-7 h-7 rounded text-xs ${p === 1 ? "bg-red-700 text-white" : "text-gray-500 hover:bg-gray-100"}`}>{p}</button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ── Notifications ── */}
          {activeTab === "notifications" && (
            <div className="max-w-lg flex flex-col gap-4">
              <div className="bg-white rounded-xl border border-gray-100 p-5">
                <h3 className="text-sm font-medium text-gray-800 mb-4">ब्रोडकास्ट सूचना पठाउनुहोस्</h3>
                <div className="flex flex-col gap-3">
                  <div>
                    <label className="text-xs font-medium text-gray-600 mb-1.5 block">शीर्षक</label>
                    <input placeholder="सूचनाको शीर्षक..." className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm outline-none focus:border-red-300" />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-600 mb-1.5 block">सन्देश</label>
                    <textarea rows={3} placeholder="सूचनाको सन्देश..." className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm outline-none focus:border-red-300 resize-none"></textarea>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-600 mb-1.5 block">पठाउने च्यानल</label>
                    <div className="flex gap-2 flex-wrap">
                      {["✉️ Email", "💬 WhatsApp", "📱 SMS"].map((ch) => (
                        <label key={ch} className="flex items-center gap-1.5 text-xs text-gray-600 cursor-pointer">
                          <input type="checkbox" defaultChecked className="rounded" /> {ch}
                        </label>
                      ))}
                    </div>
                  </div>
                  <button className="bg-red-700 text-white rounded-xl py-2.5 text-sm font-medium hover:bg-red-800 transition-colors">
                    सूचना पठाउनुहोस् →
                  </button>
                </div>
              </div>

              <div className="bg-white rounded-xl border border-gray-100 p-5">
                <h3 className="text-sm font-medium text-gray-800 mb-3">हालैका सूचनाहरू</h3>
                {[
                  { msg: "बजेट प्रस्तुत — ब्रेकिङ", time: "२ घण्टा अगाडि", ch: "Email + WA" },
                  { msg: "SAFF फाइनल: नेपाल बनाम भारत", time: "५ घण्टा अगाडि", ch: "WA + SMS" },
                  { msg: "दैनिक डाइजेस्ट — आजको समाचार", time: "बिहान ७:०० बजे", ch: "Email" },
                ].map((n, i) => (
                  <div key={i} className="flex items-start gap-3 py-2.5 border-b border-gray-50 last:border-0">
                    <div className="w-1.5 h-1.5 rounded-full bg-red-700 mt-1.5 shrink-0"></div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-700">{n.msg}</p>
                      <p className="text-[11px] text-gray-400 mt-0.5">{n.time} · {n.ch}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
