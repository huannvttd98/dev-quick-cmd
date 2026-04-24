import { CATEGORY_BY_ID } from "../../data/categories";
import type { CategoryId } from "../../types";

interface Props {
  category: CategoryId;
  count: number;
  onBack: () => void;
}

export function CategoryHeader({ category, count, onBack }: Props) {
  const cat = CATEGORY_BY_ID[category];
  if (!cat) return null;
  return (
    <div className="flex items-center gap-2 border-b border-slate-200 bg-white px-3 py-2 dark:border-slate-700 dark:bg-slate-800">
      <button
        onClick={onBack}
        className="rounded px-1.5 py-0.5 text-xs text-slate-500 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-700 dark:hover:text-slate-100"
        title="Back to categories (Esc)"
      >
        ← Back
      </button>
      <span className="text-slate-300 dark:text-slate-600">|</span>
      <span className="text-lg">{cat.emoji}</span>
      <span className="text-sm font-semibold text-slate-900 dark:text-slate-100">
        {cat.label}
      </span>
      <span className="text-xs text-slate-400">({count})</span>
    </div>
  );
}
