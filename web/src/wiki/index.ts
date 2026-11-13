import { CATEGORY_LABELS, type WikiEntry } from './types';
import { basics } from './entries/basics';
import { components } from './entries/components';
import { timing } from './entries/timing';
import { mechanisms } from './entries/mechanisms';
import { expert } from './entries/expert';

export const entries: WikiEntry[] = [...basics, ...components, ...timing, ...mechanisms, ...expert];

export function getEntry(slug: string): WikiEntry | undefined {
  return entries.find((e) => e.slug === slug);
}

export function matchesQuery(e: WikiEntry, query: string): boolean {
  const needle = query.trim().toLowerCase();
  if (!needle) return true;
  const haystack = [e.term, e.definition, CATEGORY_LABELS[e.category], ...e.aliases].join(' ').toLowerCase();
  return needle.split(/\s+/).every((word) => haystack.includes(word));
}

export { CATEGORY_LABELS, CATEGORY_ORDER } from './types';
