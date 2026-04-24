import { CATEGORIES } from "../../data/categories";
import type { CategoryId } from "../../types";

export type TabId = "all" | "favorites" | "recent" | CategoryId;

interface Props {
  active: TabId;
  onChange: (tab: TabId) => void;
}

const SPECIAL_TABS: { id: TabId; label: string; emoji: string }[] = [
  { id: "all", label: "All", emoji: "📚" },
  { id: "favorites", label: "Favorites", emoji: "⭐" },
  { id: "recent", label: "Recent", emoji: "🕘" },
];

export function CategoryTabs({ active, onChange }: Props) {
  const tabs = [
    ...SPECIAL_TABS,
    ...CATEGORIES.map((c) => ({
      id: c.id as TabId,
      label: c.label,
      emoji: c.emoji,
    })),
  ];

  return (
    <div className="flex gap-1 overflow-x-auto border-b border-slate-200 bg-slate-50 px-2 py-1.5 dark:border-slate-700 dark:bg-slate-900">
      {tabs.map((t) => (
        <button
          key={t.id}
          onClick={() => onChange(t.id)}
          className={`whitespace-nowrap rounded px-2 py-1 text-xs font-medium transition-colors ${
            active === t.id
              ? "bg-blue-500 text-white"
              : "text-slate-600 hover:bg-slate-200 dark:text-slate-300 dark:hover:bg-slate-800"
          }`}
        >
          <span className="mr-1">{t.emoji}</span>
          {t.label}
        </button>
      ))}
    </div>
  );
}
