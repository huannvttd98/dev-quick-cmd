import { CATEGORIES } from "../../data/categories";
import type { CategoryId } from "../../types";

interface Props {
  counts: Record<string, number>;
  onSelect: (category: CategoryId) => void;
}

export function CategoryGrid({ counts, onSelect }: Props) {
  return (
    <div className="grid flex-1 grid-cols-2 gap-2 overflow-y-auto p-3 content-start">
      {CATEGORIES.map((cat) => (
        <button
          key={cat.id}
          onClick={() => onSelect(cat.id)}
          className="group flex flex-col items-start rounded-lg border border-slate-200 bg-white p-3 text-left transition-all hover:-translate-y-0.5 hover:border-blue-400 hover:shadow-md dark:border-slate-700 dark:bg-slate-800 dark:hover:border-blue-500"
        >
          <div className="mb-2 text-3xl">{cat.emoji}</div>
          <div className="text-sm font-semibold text-slate-900 dark:text-slate-100">
            {cat.label}
          </div>
          <div className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
            {counts[cat.id] ?? 0} commands
          </div>
        </button>
      ))}
    </div>
  );
}
