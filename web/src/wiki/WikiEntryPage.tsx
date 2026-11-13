import { href } from '../router';
import { CATEGORY_LABELS, getEntry } from './index';
import { Diagram } from './svg/diagrams';

export default function WikiEntryPage({ slug }: { slug: string }) {
  const entry = getEntry(slug);

  if (!entry) {
    return (
      <main>
        <section>
          <h2>Unknown entry</h2>
          <p className="def">
            No glossary entry “{slug}”. <a href={href('/wiki')}>Back to the index</a>.
          </p>
        </section>
      </main>
    );
  }

  const related = entry.related
    .map(getEntry)
    .filter((e): e is NonNullable<typeof e> => e !== undefined && e.slug !== entry.slug);

  return (
    <main>
      <nav className="topnav">
        <a href={href('/')}>breadstone</a>
        <span>·</span>
        <a href={href('/wiki')}>wiki</a>
        <span>·</span>
        <span className="current">{entry.term}</span>
      </nav>

      <article className="entry-page">
        <section>
          <h2>{entry.term}</h2>
          <div className="badges">
            <span className="badge category">{CATEGORY_LABELS[entry.category]}</span>
            <span className="badge version">Java {entry.mcVersion}</span>
          </div>
          {entry.aliases.length > 0 && <p className="aliases-line">also: {entry.aliases.join(', ')}</p>}
          <p className="definition">{entry.definition}</p>
          {entry.body.map((s) => (
            <div className="body-section" key={s.heading}>
              <h3>{s.heading}</h3>
              <p>{s.text}</p>
            </div>
          ))}
        </section>

        {entry.example && (
          <section>
            <h3>Example</h3>
            <p>{entry.example.text}</p>
            {entry.example.diagram && <Diagram id={entry.example.diagram} />}
          </section>
        )}

        {entry.bedrockNote && (
          <aside className="bedrock">
            <span className="badge bedrock-badge">Bedrock</span>
            <p>{entry.bedrockNote}</p>
          </aside>
        )}

        {related.length > 0 && (
          <section>
            <h3>Related</h3>
            <ul className="related">
              {related.map((r) => (
                <li key={r.slug}>
                  <a className="term-link" href={href(`/wiki/${r.slug}`)}>
                    {r.term}
                  </a>
                  <span className="def"> — {r.definition}</span>
                </li>
              ))}
            </ul>
          </section>
        )}
      </article>
    </main>
  );
}
