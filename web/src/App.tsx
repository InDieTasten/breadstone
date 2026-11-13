import { useEffect, useState, type FormEvent } from 'react';
import { createCircuit, getVersion, listCircuits, type Circuit, type Version } from './api';
import GamesPage from './games/GamesPage';
import { href, useRoute } from './router';
import WikiEntryPage from './wiki/WikiEntryPage';
import WikiIndexPage from './wiki/WikiIndexPage';
import { entries } from './wiki/index';

export default function App() {
  const route = useRoute();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [route]);

  return (
    <>
      <nav className="topnav">
        <a href={href('/')} className={route.name === 'home' ? 'current' : undefined}>
          breadstone
        </a>
        <span>·</span>
        <a href={href('/wiki')} className={route.name === 'wiki' || route.name === 'entry' ? 'current' : undefined}>
          wiki
        </a>
        <span>·</span>
        <a href={href('/wiki/play')} className={route.name === 'games' ? 'current' : undefined}>
          games
        </a>
      </nav>

      {route.name === 'home' && <HomePage />}
      {route.name === 'wiki' && <WikiIndexPage />}
      {route.name === 'entry' && <WikiEntryPage slug={route.slug} />}
      {route.name === 'games' && <GamesPage />}
      {route.name === 'notfound' && (
        <main>
          <section>
            <h2>Not found</h2>
            <p className="def">
              Nothing lives at <code>{route.path}</code>. <a href={href('/')}>Back home</a>.
            </p>
          </section>
        </main>
      )}
    </>
  );
}

function HomePage() {
  const [version, setVersion] = useState<Version | null>(null);
  const [circuits, setCircuits] = useState<Circuit[]>([]);
  const [name, setName] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getVersion().then(setVersion).catch((e) => setError(String(e)));
    listCircuits().then(setCircuits).catch((e) => setError(String(e)));
  }, []);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    try {
      const created = await createCircuit(name);
      setCircuits((cs) => [...cs, created]);
      setName('');
      setError(null);
    } catch (err) {
      setError(String(err));
    }
  }

  return (
    <main>
      <header>
        <h1>breadstone</h1>
        <p className="tagline">BREADboard &times; redSTONE &mdash; circuit design for minecraft redstone</p>
        {version && <p className="version">scaffold v{version.version}</p>}
      </header>

      <section>
        <h2>Redstone wiki</h2>
        <p className="def">
          {entries.length} glossary entries on redstone jargon — ticks, latches, BUDs and the rest — with examples, and
          four little games to drill them in.
        </p>
        <p>
          <a href={href('/wiki')}>Browse the wiki</a> &nbsp;·&nbsp; <a href={href('/wiki/play')}>Play the games</a>
        </p>
      </section>

      <section>
        <h2>Circuits</h2>
        <form onSubmit={onSubmit}>
          <input value={name} onChange={(e) => setName(e.target.value)} placeholder="New circuit name" />
          <button type="submit">Add</button>
        </form>
        {error && <p className="error">{error}</p>}
        {circuits.length === 0 ? (
          <p className="empty">No circuits yet. The editor comes next.</p>
        ) : (
          <ul>
            {circuits.map((c) => (
              <li key={c.id}>
                <span className="id">#{c.id}</span> {c.name}
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}
