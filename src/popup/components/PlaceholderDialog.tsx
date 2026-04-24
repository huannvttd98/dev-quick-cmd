import { useEffect, useState } from "react";
import type { Command } from "../../types";

interface Props {
  command: Command | null;
  onSubmit: (values: Record<string, string>) => void;
  onCancel: () => void;
}

export function PlaceholderDialog({ command, onSubmit, onCancel }: Props) {
  const [values, setValues] = useState<Record<string, string>>({});

  useEffect(() => {
    if (command?.placeholders) {
      const defaults: Record<string, string> = {};
      for (const p of command.placeholders) {
        defaults[p.key] = p.default ?? "";
      }
      setValues(defaults);
    } else {
      setValues({});
    }
  }, [command]);

  useEffect(() => {
    if (!command) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onCancel();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [command, onCancel]);

  if (!command?.placeholders?.length) return null;

  return (
    <div
      className="fixed inset-0 z-10 flex items-center justify-center bg-slate-900/40 p-4"
      onClick={onCancel}
    >
      <div
        className="w-full max-w-xs rounded-lg bg-white p-4 shadow-xl dark:bg-slate-800"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-1 text-sm font-semibold text-slate-900 dark:text-slate-100">
          {command.title}
        </div>
        <code className="mb-3 block text-xs text-slate-500">
          {command.command}
        </code>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            onSubmit(values);
          }}
          className="space-y-2"
        >
          {command.placeholders.map((p, i) => (
            <div key={p.key}>
              <label className="text-xs text-slate-500 dark:text-slate-400">
                {p.hint}{" "}
                <code className="text-slate-400">{`{{${p.key}}}`}</code>
              </label>
              <input
                autoFocus={i === 0}
                type="text"
                value={values[p.key] ?? ""}
                onChange={(e) =>
                  setValues((v) => ({ ...v, [p.key]: e.target.value }))
                }
                className="mt-0.5 w-full rounded border border-slate-200 bg-slate-50 px-2 py-1 text-sm text-slate-900 focus:outline-none focus:ring-1 focus:ring-blue-400 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-100"
              />
            </div>
          ))}
          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onCancel}
              className="px-3 py-1 text-xs text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100"
            >
              Cancel (Esc)
            </button>
            <button
              type="submit"
              className="rounded bg-blue-500 px-3 py-1 text-xs text-white hover:bg-blue-600"
            >
              Copy (Enter)
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
