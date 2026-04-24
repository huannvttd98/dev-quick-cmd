type StorageArea = "sync" | "local";

export async function storageGet<T>(
  area: StorageArea,
  key: string,
  fallback: T,
): Promise<T> {
  const result = await chrome.storage[area].get(key);
  const value = result[key];
  return value === undefined ? fallback : (value as T);
}

export async function storageSet<T>(
  area: StorageArea,
  key: string,
  value: T,
): Promise<void> {
  await chrome.storage[area].set({ [key]: value });
}

export function onStorageChange(
  area: StorageArea,
  key: string,
  callback: (newValue: unknown) => void,
): () => void {
  const listener = (
    changes: { [k: string]: chrome.storage.StorageChange },
    areaName: string,
  ) => {
    if (areaName !== area) return;
    if (key in changes) callback(changes[key].newValue);
  };
  chrome.storage.onChanged.addListener(listener);
  return () => chrome.storage.onChanged.removeListener(listener);
}
