import type { ReactNode } from "react";
import { forwardRef } from "react";

interface Props {
  value: string;
  onChange: (value: string) => void;
  action?: ReactNode;
}

export const SearchBar = forwardRef<HTMLInputElement, Props>(function SearchBar(
  { value, onChange, action },
  ref,
) {
  return (
    <div className="relative flex items-center border-b border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-800">
      <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
        🔍
      </span>
      <input
        ref={ref}
        autoFocus
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Search commands…"
        className="flex-1 bg-transparent py-3 pl-10 pr-3 text-sm text-slate-900 placeholder-slate-400 focus:outline-none dark:text-slate-100"
      />
      {action && <div className="pr-1.5">{action}</div>}
    </div>
  );
});
