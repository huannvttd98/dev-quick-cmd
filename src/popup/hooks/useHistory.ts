import { useCallback, useEffect, useState } from "react";
import type { HistoryEntry } from "../../types";
import { onStorageChange, storageGet, storageSet } from "../../lib/storage";

const KEY = "history";
const MAX_ENTRIES = 50;

export function useHistory() {
  const [history, setHistory] = useState<HistoryEntry[]>([]);

  useEffect(() => {
    storageGet<HistoryEntry[]>("local", KEY, []).then(setHistory);
    return onStorageChange("local", KEY, (v) => {
      if (Array.isArray(v)) setHistory(v as HistoryEntry[]);
    });
  }, []);

  const push = useCallback((id: string) => {
    setHistory((prev) => {
      const filtered = prev.filter((e) => e.id !== id);
      const next = [{ id, usedAt: Date.now() }, ...filtered].slice(0, MAX_ENTRIES);
      void storageSet("local", KEY, next);
      return next;
    });
  }, []);

  return { history, push };
}
