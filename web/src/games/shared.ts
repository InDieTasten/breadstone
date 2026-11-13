export function shuffle<T>(items: T[]): T[] {
  const a = [...items];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function loadJSON<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

export function saveJSON(key: string, value: unknown): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // no storage available; progress just will not persist
  }
}

export function numberOptions(answer: number, max: number): number[] {
  const candidates: number[] = [];
  for (let delta = -2; delta <= 2; delta++) {
    const v = answer + delta;
    if (v >= 0 && v <= max) candidates.push(v);
  }
  const options: number[] = [answer];
  for (const v of shuffle(candidates)) {
    if (options.length === 4) break;
    if (!options.includes(v)) options.push(v);
  }
  return shuffle(options);
}
