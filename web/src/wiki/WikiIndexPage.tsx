import { useMemo, useState } from 'react';
import { href } from '../router';
import { CATEGORY_LABELS, CATEGORY_ORDER, entries, matchesQuery } from './index';

export default function WikiIndexPage() {
  const [query, setQuery] = useState('');

  const groups = useMemo(
    () =>
      CATEGORY_ORDER.map((category) => ({
        category,
        items: entries.filter((e) => e.category === category && matchesQuery(e, query)),
      })).filter((g) => g.items.length > 0),
    [query],
  );

  return (
    <main>
      <section>
        <h2>Redstone wiki</h2>
        <p className="lead">
          A glossary of redstone jargon — {entries.length} terms, each with a short explanation and an example. Describes
          Java behaviour; entries flag the Bedrock differences.
        </p>
        <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Filter terms…" aria-label="Filter terms" />

        {groups.length === 0 ? (
          <p className="empty">Nothing matches “{query}”.</p>
        ) : (
          groups.map((g) => (
            <div className="wiki-group" key={g.category}>
              <h3>
                {CATEGORY_LABELS[g.category]} <span className="count">{g.items.length}</span>
              </h3>
              <ul>
                {g.items.map((e) => (
                  <li key={e.slug}>
                    <a className="term-link" href={href(`/wiki/${e.slug}`)}>
                      {e.term}
                    </a>
                    {e.aliases.length > 0 && <span className="aliases"> · {e.aliases.join(', ')}</span>}
                    <p className="def">{e.definition}</p>
                  </li>
                ))}
              </ul>
            </div>
          ))
        )}
      </section>

      <section>
        <h3>Learn it the hard way</h3>
        <p className="def">
          Flashcards, a matching round and a quiz all run off this glossary. <a href={href('/wiki/play')}>Play →</a>
        </p>
      </section>
    </main>
  );
}
