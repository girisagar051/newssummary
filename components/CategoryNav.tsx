"use client";
import { useLang } from "@/context/LanguageContext";
import { CATEGORIES } from "@/lib/mockData";

interface Props {
  active: string;
  onChange: (cat: string) => void;
}

export default function CategoryNav({ active, onChange }: Props) {
  const { lang } = useLang();

  return (
    <div className="border-b border-gray-100 bg-white">
      <div className="max-w-screen-xl mx-auto px-4">
        <div className="flex gap-1 overflow-x-auto py-2 scrollbar-hide">
          {CATEGORIES.map((cat) => {
            const label = lang === "np" ? cat.np : cat.en;
            const isActive = active === cat.np || active === cat.en;
            return (
              <button
                key={cat.np}
                onClick={() => onChange(cat.np)}
                className={`shrink-0 px-4 py-1.5 rounded-full text-xs font-medium transition-all ${
                  isActive
                    ? "bg-red-700 text-white border border-red-700"
                    : "text-gray-500 border border-gray-200 hover:border-gray-300 hover:text-gray-800 bg-white"
                }`}
              >
                {label}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
