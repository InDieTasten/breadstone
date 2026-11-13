import { useState } from 'react';
import { entries } from '../wiki/index';
import type { WikiEntry } from '../wiki/types';
import { loadJSON, saveJSON, shuffle } from './shared';

const KEY = 'breadstone.matching.v1';
const PAIRS = 8;

interface Round {
  terms: WikiEntry[];
  defs: WikiEntry[];
}

function newRound(): Round {
  const picked = shuffle(entries).slice(0, PAIRS);
  return { terms: shuffle(picked), defs: shuffle(picked) };
}

export default function Matching() {
  const [round, setRound] = useState<Round>(newRound);
  const [termPick, setTermPick] = useState<string | null>(null);
  const [defPick, setDefPick] = useState<string | null>(null);
  const [solved, setSolved] = useState<string[]>([]);
  const [misses, setMisses] = useState(0);
  const [best, setBest] = useState<number | null>(() => loadJSON<number | null>(KEY, null));

  const finished = solved.length === round.terms.length;

  function pickCell(slug: string, isTerm: boolean) {
    if (solved.includes(slug)) return;
    const other = isTerm ? defPick : termPick;
    if (other === null) {
      if (isTerm) setTermPick(slug);
      else setDefPick(slug);
      return;
    }
    if (other === slug) {
      const nextSolved = [...solved, slug];
      setSolved(nextSolved);
      setTermPick(null);
      setDefPick(null);
      if (nextSolved.length === round.terms.length && (best === null || misses < best)) {
        setBest(misses);
        saveJSON(KEY, misses);
      }
    } else {
      setMisses((m) => m + 1);
      setTermPick(null);
      setDefPick(null);
    }
  }

  return (
    <div className="game">
      <p className="progress">
        {solved.length} / {PAIRS} pairs · {misses} misses{best !== null ? ` · best ${best}` : ''}
        <button
          type="button"
          className="reset"
          onClick={() => {
            setRound(newRound());
            setSolved([]);
            setMisses(0);
            setTermPick(null);
            setDefPick(null);
          }}
        >
          new round
        </button>
      </p>

      <div className="match-board">
        <div className="match-col">
          {round.terms.map((e) => (
            <button
              key={e.slug}
              type="button"
              className={`match-cell${solved.includes(e.slug) ? ' solved' : ''}${termPick === e.slug ? ' picked' : ''}`}
              disabled={solved.includes(e.slug)}
              onClick={() => pickCell(e.slug, true)}
            >
              {e.term}
            </button>
          ))}
        </div>
        <div className="match-col">
          {round.defs.map((e) => (
            <button
              key={e.slug}
              type="button"
              className={`match-cell def${solved.includes(e.slug) ? ' solved' : ''}${defPick === e.slug ? ' picked' : ''}`}
              disabled={solved.includes(e.slug)}
              onClick={() => pickCell(e.slug, false)}
            >
              {e.definition}
            </button>
          ))}
        </div>
      </div>

      {finished && (
        <p className="score-screen">
          All pairs with {misses} miss{misses === 1 ? '' : 'es'}.{' '}
          <button
            type="button"
            onClick={() => {
              setRound(newRound());
              setSolved([]);
              setMisses(0);
              setTermPick(null);
              setDefPick(null);
            }}
          >
            play again
          </button>
        </p>
      )}
    </div>
  );
}
