import type { ReactNode } from "react";
import { useEffect } from "react";
import { CATEGORY_BY_ID } from "../../data/categories";
import type { Command } from "../../types";

interface Props {
  command: Command | null;
  onCopy: (cmd: Command) => void;
  onClose: () => void;
}

export function DetailDialog({ command, onCopy, onClose }: Props) {
  useEffect(() => {
    if (!command) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
      } else if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        onCopy(command);
      }
    };
    window.addEventListener("keydown", handler, true);
    return () => window.removeEventListener("keydown", handler, true);
  }, [command, onCopy, onClose]);

  if (!command) return null;

  const cat = CATEGORY_BY_ID[command.category];

  return (
    <div
      className="fixed inset-0 z-20 flex items-end justify-center bg-slate-900/50 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="flex max-h-[92%] w-full flex-col overflow-hidden rounded-t-xl bg-white shadow-2xl dark:bg-slate-800"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-2 border-b border-slate-200 px-3 py-2 dark:border-slate-700">
          <span className="text-xl">{cat?.emoji}</span>
          <div className="min-w-0 flex-1">
            <div className="truncate text-sm font-semibold text-slate-900 dark:text-slate-100">
              {command.title}
            </div>
            <div className="text-[10px] uppercase tracking-wide text-slate-400">
              {cat?.label}
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-900 dark:hover:bg-slate-700 dark:hover:text-slate-100"
            title="Close (Esc)"
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-3 text-sm">
          <Section label="Command">
            <code className="block whitespace-pre-wrap break-all rounded bg-slate-100 px-2 py-1.5 font-mono text-xs text-slate-900 dark:bg-slate-900 dark:text-slate-100">
              {command.command}
            </code>
          </Section>

          {command.description && (
            <Section label="Description">
              <p className="text-slate-700 dark:text-slate-300">
                {command.description}
              </p>
            </Section>
          )}

          {command.docs && (
            <Section label="Details">
              <p className="whitespace-pre-wrap text-slate-700 dark:text-slate-300">
                {command.docs}
              </p>
            </Section>
          )}

          {command.placeholders && command.placeholders.length > 0 && (
            <Section label="Placeholders">
              <ul className="space-y-1">
                {command.placeholders.map((p) => (
                  <li key={p.key} className="text-xs">
                    <code className="font-mono text-blue-600 dark:text-blue-400">
                      {`{{${p.key}}}`}
                    </code>
                    <span className="mx-1.5 text-slate-400">—</span>
                    <span className="text-slate-700 dark:text-slate-300">
                      {p.hint}
                    </span>
                    {p.default && (
                      <span className="ml-1 text-slate-400">
                        (default: <code>{p.default}</code>)
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            </Section>
          )}

          {command.examples && command.examples.length > 0 && (
            <Section label="Examples">
              <ul className="space-y-1.5">
                {command.examples.map((ex, i) => (
                  <li key={i}>
                    <code className="block break-all rounded bg-slate-100 px-2 py-1 font-mono text-xs text-slate-800 dark:bg-slate-900 dark:text-slate-200">
                      {ex}
                    </code>
                  </li>
                ))}
              </ul>
            </Section>
          )}

          {command.tags && command.tags.length > 0 && (
            <Section label="Tags">
              <div className="flex flex-wrap gap-1">
                {command.tags.map((t) => (
                  <span
                    key={t}
                    className="rounded bg-slate-100 px-1.5 py-0.5 text-[10px] text-slate-600 dark:bg-slate-700 dark:text-slate-300"
                  >
                    #{t}
                  </span>
                ))}
              </div>
            </Section>
          )}
        </div>

        <div className="flex gap-2 border-t border-slate-200 p-2 dark:border-slate-700">
          <button
            onClick={onClose}
            className="flex-1 rounded px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-700"
          >
            Close (Esc)
          </button>
          <button
            onClick={() => onCopy(command)}
            className="flex-[2] rounded bg-blue-500 px-3 py-1.5 text-xs font-medium text-white hover:bg-blue-600"
          >
            📋 Copy (Enter)
          </button>
        </div>
      </div>
    </div>
  );
}

function Section({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="mb-3 last:mb-0">
      <div className="mb-1 text-[10px] font-semibold uppercase tracking-wide text-slate-400">
        {label}
      </div>
      {children}
    </div>
  );
}
