export function readStorage<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;

  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

export function writeStorage<T>(key: string, value: T) {
  if (typeof window === "undefined") return;
  localStorage.setItem(key, JSON.stringify(value));
}

export function readStringStorage(key: string) {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(key);
}

export function writeStringStorage(key: string, value: string) {
  if (typeof window === "undefined") return;
  localStorage.setItem(key, value);
}

export function removeStorage(key: string) {
  if (typeof window === "undefined") return;
  localStorage.removeItem(key);
}
