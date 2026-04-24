import { useCallback, useEffect, useMemo, useState } from "react";
import { fetchCategories, fetchCommands } from "../../lib/api";
import { createSearcher } from "../../lib/search";
import { storageGet, storageSet } from "../../lib/storage";
import type { Category, Command } from "../../types";

const CACHE_KEY = "api_cache_v1";

interface CacheShape {
  commands: Command[];
  categories: Category[];
  fetchedAt: number;
}

export function useCommands() {
  const [commands, setCommands] = useState<Command[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async (force = false) => {
    let hasCache = false;
    if (force) {
      setLoading(true);
      setError(null);
    } else {
      const cached = await storageGet<CacheShape | null>(
        "local",
        CACHE_KEY,
        null,
      );
      if (cached?.commands?.length) {
        hasCache = true;
        setCommands(cached.commands);
        setCategories(cached.categories);
        setLoading(false);
      }
    }

    try {
      const [cats, cmds] = await Promise.all([
        fetchCategories(),
        fetchCommands(),
      ]);
      setCategories(cats);
      setCommands(cmds);
      setError(null);
      await storageSet<CacheShape>("local", CACHE_KEY, {
        commands: cmds,
        categories: cats,
        fetchedAt: Date.now(),
      });
    } catch (e) {
      if (!hasCache) {
        const msg =
          (e as { message?: string })?.message ?? "Failed to load data";
        setError(msg);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const searcher = useMemo(() => createSearcher(commands), [commands]);

  const categoryById = useMemo<Record<string, Category>>(
    () => Object.fromEntries(categories.map((c) => [c.id, c])),
    [categories],
  );

  return {
    commands,
    categories,
    categoryById,
    searcher,
    loading,
    error,
    reload: () => load(true),
  };
}
