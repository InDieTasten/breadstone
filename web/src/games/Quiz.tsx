import { useState } from 'react';
import { href } from '../router';
import { entries } from '../wiki/index';
import type { WikiEntry } from '../wiki/types';
import { shuffle } from './shared';

interface Question {
  entry: WikiEntry;
  options: WikiEntry[];
}

function buildQuiz(): Question[] {
  return shuffle(entries)
    .slice(0, 10)
    .map((e) => {
      const sameCategory = entries.filter((o) => o.category === e.category && o.slug !== e.slug);
      const distractors = shuffle(sameCategory).slice(0, 3);
      return { entry: e, options: shuffle([e, ...distractors]) };
    });
}

export default function Quiz() {
  const [questions, setQuestions] = useState<Question[]>(buildQuiz);
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<(string | null)[]>(() => Array(10).fill(null));
  const [revealed, setRevealed] = useState(false);

  const answered = answers[index] !== null;
  const finished = revealed;
  const score = answers.filter((a, i) => a !== null && a === questions[i].entry.slug).length;

  function answer(slug: string) {
    if (answered) return;
    setAnswers((prev) => prev.map((a, i) => (i === index ? slug : a)));
  }

  function restart() {
    setQuestions(buildQuiz());
    setAnswers(Array(10).fill(null));
    setIndex(0);
    setRevealed(false);
  }

  if (finished) {
    return (
      <div className="game">
        <p className="score-screen big">
          {score} / {questions.length} correct
        </p>
        <ol className="review">
          {questions.map((q, i) => {
            const correct = answers[i] === q.entry.slug;
            const chosen = q.options.find((o) => o.slug === answers[i]);
            return (
              <li key={q.entry.slug} className={correct ? 'ok' : 'bad'}>
                <a className="term-link" href={href(`/wiki/${q.entry.slug}`)}>
                  {q.entry.term}
                </a>
                <p className="def">{q.entry.definition}</p>
                {!correct && chosen && <p className="your-answer">your pick: {chosen.definition}</p>}
              </li>
            );
          })}
        </ol>
        <button type="button" onClick={restart}>
          new quiz
        </button>
      </div>
    );
  }

  const q = questions[index];
  return (
    <div className="game">
      <p className="progress">
        Question {index + 1} / {questions.length} · {score} correct so far
      </p>
      <h3 className="quiz-question">
        What does <span className="quiz-term">{q.entry.term}</span> mean?
      </h3>
      <ul className="options">
        {q.options.map((o) => {
          const state = !answered
            ? ''
            : o.slug === q.entry.slug
              ? ' correct'
              : o.slug === answers[index]
                ? ' wrong'
                : '';
          return (
            <li key={o.slug}>
              <button type="button" className={`option${state}`} onClick={() => answer(o.slug)} disabled={answered}>
                {o.definition}
              </button>
            </li>
          );
        })}
      </ul>
      {answered && index + 1 < questions.length && (
        <button type="button" onClick={() => setIndex(index + 1)}>
          next
        </button>
      )}
      {answered && index + 1 === questions.length && (
        <button type="button" onClick={() => setRevealed(true)}>
          see results
        </button>
      )}
    </div>
  );
}
