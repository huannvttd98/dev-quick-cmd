import { forwardRef } from "react";

interface Props {
  value: string;
  onChange: (value: string) => void;
}

export const SearchBar = forwardRef<HTMLInputElement, Props>(function SearchBar(
  { value, onChange },
  ref,
) {
  return (
    <div className="relative border-b border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800">
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
        className="w-full bg-transparent py-3 pl-10 pr-3 text-sm text-slate-900 placeholder-slate-400 focus:outline-none dark:text-slate-100"
      />
    </div>
  );
});
