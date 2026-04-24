import { useCallback, useEffect, useState } from "react";
import { fetchImportQueue, type ImportJobStatus, type ImportQueueJob } from "../../lib/api";

interface Props {
  open: boolean;
  onClose: () => void;
}

const STATUS_STYLES: Record<ImportJobStatus, string> = {
  pending:
    "bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-200",
  processing:
    "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300",
  done:
    "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300",
  failed:
    "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300",
};

export function JobsDialog({ open, onClose }: Readonly<Props>) {
  const [jobs, setJobs] = useState<ImportQueueJob[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      setJobs(await fetchImportQueue());
    } catch (err) {
      setError((err as { message?: string })?.message ?? "Cannot load queue");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!open) return;
    void load();
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
      }
    };
    window.addEventListener("keydown", handler, true);
    return () => window.removeEventListener("keydown", handler, true);
  }, [open, load, onClose]);

  if (!open) return null;

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
          <span className="text-xl">📋</span>
          <div className="min-w-0 flex-1">
            <div className="text-sm font-semibold text-slate-900 dark:text-slate-100">
              Import queue
            </div>
            <div className="text-[10px] uppercase tracking-wide text-slate-400">
              {jobs.length} job{jobs.length === 1 ? "" : "s"}
            </div>
          </div>
          <button
            onClick={() => void load()}
            disabled={loading}
            className="rounded p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-900 disabled:opacity-50 dark:hover:bg-slate-700 dark:hover:text-slate-100"
            title="Refresh"
            aria-label="Refresh"
          >
            {loading ? "⏳" : "🔄"}
          </button>
          <button
            onClick={onClose}
            className="rounded p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-900 dark:hover:bg-slate-700 dark:hover:text-slate-100"
            title="Close (Esc)"
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">
          {error && (
            <div className="p-4 text-center text-xs text-red-600 dark:text-red-400">
              {error}
            </div>
          )}
          {!error && jobs.length === 0 && !loading && (
            <div className="p-8 text-center text-xs text-slate-500 dark:text-slate-400">
              No jobs yet. Upload a JSON file to enqueue one.
            </div>
          )}
          {jobs.length > 0 && (
            <ul className="divide-y divide-slate-100 dark:divide-slate-700">
              {jobs.map((job) => (
                <JobRow key={job.jobId} job={job} />
              ))}
            </ul>
          )}
        </div>

        <div className="border-t border-slate-200 p-2 dark:border-slate-700">
          <button
            onClick={onClose}
            className="w-full rounded px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-700"
          >
            Close (Esc)
          </button>
        </div>
      </div>
    </div>
  );
}

function JobRow({ job }: { job: ImportQueueJob }) {
  const progress =
    job.commandCount && job.commandCount > 0
      ? `${job.importedCommands ?? 0}/${job.commandCount}`
      : undefined;
  return (
    <li className="px-3 py-2">
      <div className="flex items-center gap-2">
        <span
          className={`rounded px-1.5 py-0.5 text-[10px] font-semibold uppercase ${STATUS_STYLES[job.status]}`}
        >
          {job.status}
        </span>
        <span className="min-w-0 flex-1 truncate text-sm font-medium text-slate-900 dark:text-slate-100">
          {job.category ?? job.jobId.slice(0, 8)}
        </span>
        {progress && (
          <span className="text-[10px] text-slate-500 dark:text-slate-400">
            {progress}
          </span>
        )}
      </div>
      <div className="mt-0.5 text-[10px] text-slate-400">
        {formatTime(job.finishedAt ?? job.startedAt ?? job.createdAt)}
        {job.attempts && job.attempts > 1 ? ` · ${job.attempts} attempts` : ""}
      </div>
      {job.error && (
        <div className="mt-1 truncate text-[10px] text-red-600 dark:text-red-400">
          {job.error}
        </div>
      )}
    </li>
  );
}

function formatTime(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  const diff = Date.now() - d.getTime();
  const sec = Math.round(diff / 1000);
  if (sec < 60) return `${sec}s ago`;
  const min = Math.round(sec / 60);
  if (min < 60) return `${min}m ago`;
  const hr = Math.round(min / 60);
  if (hr < 24) return `${hr}h ago`;
  return d.toLocaleString();
}
