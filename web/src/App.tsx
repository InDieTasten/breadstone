import { useEffect, useState, type FormEvent } from 'react';
import { createCircuit, getVersion, listCircuits, type Circuit, type Version } from './api';

export default function App() {
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
