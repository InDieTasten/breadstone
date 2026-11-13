import { useState } from 'react';
import { href } from '../router';
import { CATEGORY_LABELS, CATEGORY_ORDER, entries } from '../wiki/index';
import type { WikiCategory, WikiEntry } from '../wiki/types';
import { loadJSON, saveJSON, shuffle } from './shared';

const KEY = 'breadstone.flashcards.v1';

type Known = Record<string, 'known'>;

function poolFor(category: WikiCategory | 'all'): WikiEntry[] {
  return category === 'all' ? entries : entries.filter((e) => e.category === category);
}

export default function Flashcards() {
  const [category, setCategory] = useState<WikiCategory | 'all'>('all');
  const [known, setKnown] = useState<Known>(() => loadJSON<Known>(KEY, {}));
  const [deck, setDeck] = useState<WikiEntry[]>(() => shuffle(entries));
  const [flipped, setFlipped] = useState(false);

  const pool = poolFor(category);
  const current = deck.find((e) => known[e.slug] !== 'known');
  const done = pool.filter((e) => known[e.slug] === 'known').length;

  function pick(next: WikiCategory | 'all') {
    setCategory(next);
    setDeck(shuffle(poolFor(next)));
    setFlipped(false);
  }

  function rate(entry: WikiEntry, rating: 'known' | 'again') {
    if (rating === 'known') {
      const next = { ...known, [entry.slug]: 'known' as const };
      setKnown(next);
      saveJSON(KEY, next);
    } else {
      setDeck((d) => [...d.filter((e) => e.slug !== entry.slug), entry]);
    }
    setFlipped(false);
  }

  return (
    <div className="game">
      <div className="deck-picker">
        {(['all', ...CATEGORY_ORDER] as const).map((c) => (
          <button key={c} type="button" className={`chip${category === c ? ' active' : ''}`} onClick={() => pick(c)}>
            {c === 'all' ? 'All' : CATEGORY_LABELS[c]}
          </button>
        ))}
      </div>
      <p className="progress">
        {done} / {pool.length} known
        {done > 0 && (
          <button
            type="button"
            className="reset"
            onClick={() => {
              const next = { ...known };
              pool.forEach((e) => delete next[e.slug]);
              setKnown(next);
              saveJSON(KEY, next);
            }}
          >
            reset
          </button>
        )}
      </p>

      {!current ? (
        <div className="card done-card">
          <p>Deck cleared. Shuffle again?</p>
          <button type="button" onClick={() => pick(category)}>
            Shuffle
          </button>
        </div>
      ) : (
        <>
          <div className={`card flip-card${flipped ? ' flipped' : ''}`} onClick={() => setFlipped(!flipped)}>
            <div className="card-face">
              <p className="card-term">{current.term}</p>
              <span className="card-hint">click to reveal</span>
            </div>
            <div className="card-face back">
              <p className="card-definition">{current.definition}</p>
              <span className="card-hint">click to flip back</span>
            </div>
          </div>
          <div className="actions">
            <button type="button" className="secondary" onClick={() => rate(current, 'again')}>
              Again
            </button>
            <button type="button" onClick={() => rate(current, 'known')}>
              Known
            </button>
            <a className="jump" href={href(`/wiki/${current.slug}`)}>
              read entry
            </a>
          </div>
        </>
      )}
    </div>
  );
}
