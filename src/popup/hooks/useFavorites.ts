import { useCallback, useEffect, useState } from "react";
import { onStorageChange, storageGet, storageSet } from "../../lib/storage";

const KEY = "favorites";

export function useFavorites() {
  const [favorites, setFavorites] = useState<string[]>([]);

  useEffect(() => {
    storageGet<string[]>("sync", KEY, []).then(setFavorites);
    return onStorageChange("sync", KEY, (v) => {
      if (Array.isArray(v)) setFavorites(v as string[]);
    });
  }, []);

  const toggle = useCallback((id: string) => {
    setFavorites((prev) => {
      const next = prev.includes(id)
        ? prev.filter((x) => x !== id)
        : [...prev, id];
      void storageSet("sync", KEY, next);
      return next;
    });
  }, []);

  const isFavorite = useCallback(
    (id: string) => favorites.includes(id),
    [favorites],
  );

  return { favorites, toggle, isFavorite };
}
