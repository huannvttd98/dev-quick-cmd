import type { CategoryId } from "../../types";

export type TabId = "all" | "favorites" | "recent" | CategoryId;

interface Props {
  active: TabId;
  onChange: (tab: TabId) => void;
}

const MAIN_TABS: { id: "all" | "favorites" | "recent"; label: string; emoji: string }[] = [
  { id: "all", label: "All", emoji: "📚" },
  { id: "favorites", label: "Favorites", emoji: "⭐" },
  { id: "recent", label: "Recent", emoji: "🕘" },
];

export function CategoryTabs({ active, onChange }: Props) {
  const isMainActive = (id: string) => id === active;

  return (
    <div className="flex gap-1 border-b border-slate-200 bg-slate-50 px-2 py-1.5 dark:border-slate-700 dark:bg-slate-900">
      {MAIN_TABS.map((t) => (
        <button
          key={t.id}
          onClick={() => onChange(t.id)}
          className={`flex-1 rounded px-2 py-1 text-xs font-medium transition-colors ${
            isMainActive(t.id)
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
