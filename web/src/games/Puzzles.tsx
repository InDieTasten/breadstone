import { useState } from 'react';
import { loadJSON, numberOptions, saveJSON } from './shared';

const KEY = 'breadstone.puzzles.v1';

interface Puzzle {
  prompt: string;
  options: number[];
  answer: number;
  explain: string;
}

const pick = <T,>(xs: T[]): T => xs[Math.floor(Math.random() * xs.length)];

function genDust(): Puzzle {
  const strength = 8 + Math.floor(Math.random() * 8);
  const blocks = 3 + Math.floor(Math.random() * 12);
  const answer = Math.max(strength - blocks, 0);
  return {
    prompt: `A signal of strength ${strength} enters a straight dust run of ${blocks} blocks. With what strength does it leave the last block?`,
    options: numberOptions(answer, 15),
    answer,
    explain: `Each dust block costs one level: ${strength} − ${blocks} = ${answer}${strength - blocks < 0 ? ' (the signal dies on the way)' : '.'}`,
  };
}

function genDelay(): Puzzle {
  const repeaters = 2 + Math.floor(Math.random() * 4);
  const setting = 1 + Math.floor(Math.random() * 4);
  const answer = repeaters * setting * 2;
  return {
    prompt: `${repeaters} repeaters stand in a row, each set to setting ${setting}. How many game ticks does a pulse lose crossing all of them?`,
    options: numberOptions(answer, 40),
    answer,
    explain: `${repeaters} × ${setting} redstone ticks = ${repeaters * setting} rt, and one redstone tick is two game ticks → ${answer} gt.`,
  };
}

function genComparator(): Puzzle {
  const back = 7 + Math.floor(Math.random() * 9);
  const side = Math.floor(Math.random() * (back + 1));
  const answer = back - side;
  return {
    prompt: `A comparator in subtract mode receives ${back} from the block behind and ${side} from its side. What does it output?`,
    options: numberOptions(answer, 15),
    answer,
    explain: `Subtract mode outputs back − side: ${back} − ${side} = ${answer}.`,
  };
}

const GENERATORS: { label: string; gen: () => Puzzle }[] = [
  { label: 'dust strength', gen: genDust },
  { label: 'repeater delay', gen: genDelay },
  { label: 'comparator math', gen: genComparator },
];

export default function Puzzles() {
  const [puzzle, setPuzzle] = useState<Puzzle>(() => pick(GENERATORS).gen());
  const [chosen, setChosen] = useState<number | null>(null);
  const [streak, setStreak] = useState(0);
  const [best, setBest] = useState<number>(() => loadJSON<number>(KEY, 0));

  function next() {
    setPuzzle(pick(GENERATORS).gen());
    setChosen(null);
  }

  function choose(v: number) {
    if (chosen !== null) return;
    setChosen(v);
    if (v === puzzle.answer) {
      const nextStreak = streak + 1;
      setStreak(nextStreak);
      if (nextStreak > best) {
        setBest(nextStreak);
        saveJSON(KEY, nextStreak);
      }
    } else {
      setStreak(0);
    }
  }

  return (
    <div className="game">
      <p className="progress">
        streak {streak} · best {best}
      </p>
      <p className="puzzle-prompt">{puzzle.prompt}</p>
      <div className="option-chips">
        {puzzle.options.map((v) => {
          const state =
            chosen === null
              ? ''
              : v === puzzle.answer
                ? ' correct'
                : v === chosen
                  ? ' wrong'
                  : '';
          return (
            <button key={v} type="button" className={`chip option-chip${state}`} onClick={() => choose(v)} disabled={chosen !== null}>
              {v}
            </button>
          );
        })}
      </div>
      {chosen !== null && (
        <p className={`explain${chosen === puzzle.answer ? ' ok' : ' bad'}`}>
          {chosen === puzzle.answer ? 'Correct. ' : 'Not quite. '}
          {puzzle.explain}
        </p>
      )}
      {chosen !== null && (
        <button type="button" onClick={next}>
          next puzzle
        </button>
      )}
    </div>
  );
}
