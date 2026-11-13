export const MC_VERSION = '1.21.x';

export type WikiCategory = 'basics' | 'components' | 'timing' | 'mechanisms' | 'expert-jargon';

export const CATEGORY_ORDER: WikiCategory[] = ['basics', 'components', 'timing', 'mechanisms', 'expert-jargon'];

export const CATEGORY_LABELS: Record<WikiCategory, string> = {
  basics: 'Basics',
  components: 'Components',
  timing: 'Timing',
  mechanisms: 'Mechanisms',
  'expert-jargon': 'Expert jargon',
};

export interface WikiSection {
  heading: string;
  text: string;
}

export interface WikiExample {
  text: string;
  diagram?: string;
}

export interface WikiEntry {
  slug: string;
  term: string;
  aliases: string[];
  category: WikiCategory;
  definition: string;
  body: WikiSection[];
  example?: WikiExample;
  bedrockNote?: string;
  related: string[];
  mcVersion: string;
}

export type NewEntry = Omit<WikiEntry, 'mcVersion'>;

export function entry(e: NewEntry): WikiEntry {
  return { ...e, mcVersion: MC_VERSION };
}
