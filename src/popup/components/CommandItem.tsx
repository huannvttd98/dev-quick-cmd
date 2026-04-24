import { useEffect, useRef } from "react";
import type { Category, Command } from "../../types";

interface Props {
  command: Command;
  category?: Category;
  active: boolean;
  isFavorite: boolean;
  onOpenDetail: () => void;
  onToggleFavorite: () => void;
}

export function CommandItem({
  command,
  category,
  active,
  isFavorite,
  onOpenDetail,
  onToggleFavorite,
}: Readonly<Props>) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (active) {
      ref.current?.scrollIntoView({ block: "nearest" });
    }
  }, [active]);

  return (
    <div
      ref={ref}
      role="button"
      tabIndex={-1}
      onClick={onOpenDetail}
      className={`flex w-full cursor-pointer items-start gap-2 border-b border-slate-100 px-3 py-2 text-left transition-colors dark:border-slate-800 ${
        active
          ? "bg-blue-50 dark:bg-blue-950/50"
          : "hover:bg-slate-50 dark:hover:bg-slate-800/50"
      }`}
    >
      <span className="mt-0.5 shrink-0 text-lg leading-5">
        {category?.emoji ?? "⚡"}
      </span>
      <div className="min-w-0 flex-1">
        <div className="truncate text-sm font-medium text-slate-900 dark:text-slate-100">
          {command.title}
        </div>
        <code className="mt-0.5 block truncate font-mono text-xs text-slate-600 dark:text-slate-400">
          {command.command}
        </code>
        {command.description && (
          <div className="mt-0.5 truncate text-xs text-slate-500">
            {command.description}
          </div>
        )}
      </div>
      <button
        onClick={(e) => {
          e.stopPropagation();
          onToggleFavorite();
        }}
        className={`shrink-0 rounded p-1 text-lg leading-none transition-colors ${
          isFavorite
            ? "text-yellow-500 hover:text-yellow-600"
            : "text-slate-300 hover:text-yellow-500 dark:text-slate-600"
        }`}
        title={isFavorite ? "Remove from favorites" : "Add to favorites"}
        aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
      >
        {isFavorite ? "★" : "☆"}
      </button>
    </div>
  );
}
