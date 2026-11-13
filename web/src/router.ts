import { useSyncExternalStore } from 'react';

export type Route =
  | { name: 'home' }
  | { name: 'wiki' }
  | { name: 'entry'; slug: string }
  | { name: 'games' }
  | { name: 'notfound'; path: string };

export function parseHash(hash: string): Route {
  const path = hash.replace(/^#/, '');
  const parts = path.split('/').filter(Boolean);
  if (parts.length === 0) return { name: 'home' };
  if (parts[0] === 'wiki') {
    if (parts.length === 1) return { name: 'wiki' };
    if (parts[1] === 'play') return { name: 'games' };
    if (parts.length === 2) return { name: 'entry', slug: decodeURIComponent(parts[1]) };
  }
  return { name: 'notfound', path };
}

function subscribe(onChange: () => void): () => void {
  window.addEventListener('hashchange', onChange);
  return () => window.removeEventListener('hashchange', onChange);
}

export function useRoute(): Route {
  return parseHash(useSyncExternalStore(subscribe, () => window.location.hash));
}

export function href(to: string): string {
  return `#${to}`;
}

export function navigate(to: string): void {
  window.location.hash = to;
}
