import { useState } from 'react';
import Flashcards from './Flashcards';
import Matching from './Matching';
import Puzzles from './Puzzles';
import Quiz from './Quiz';

const GAMES = [
  { id: 'flashcards', label: 'Flashcards', hint: 'flip through the glossary, mark what you know' },
  { id: 'matching', label: 'Matching', hint: 'pair terms with definitions' },
  { id: 'quiz', label: 'Quiz', hint: 'ten questions, four answers each' },
  { id: 'puzzles', label: 'Puzzles', hint: 'dust levels, repeater delays, comparator math' },
] as const;

type GameId = (typeof GAMES)[number]['id'];

export default function GamesPage() {
  const [game, setGame] = useState<GameId>('flashcards');

  return (
    <main>
      <section>
        <h2>Games</h2>
        <p className="lead">
          All four run off the same glossary as the wiki — learn a term, then prove it.
        </p>
        <div className="deck-picker">
          {GAMES.map((g) => (
            <button key={g.id} type="button" className={`chip${game === g.id ? ' active' : ''}`} onClick={() => setGame(g.id)}>
              {g.label}
            </button>
          ))}
        </div>
        <p className="game-hint">{GAMES.find((g) => g.id === game)?.hint}</p>
        {game === 'flashcards' && <Flashcards />}
        {game === 'matching' && <Matching />}
        {game === 'quiz' && <Quiz />}
        {game === 'puzzles' && <Puzzles />}
      </section>
    </main>
  );
}
