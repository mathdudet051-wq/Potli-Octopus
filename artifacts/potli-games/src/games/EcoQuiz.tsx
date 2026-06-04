import { useState } from "react";
import WinScreen from "./WinScreen";

const QUESTIONS = [
  { q: "Should we throw plastic in the ocean?", correct: false },
  { q: "Does a turtle mistake plastic bags for jellyfish?", correct: true },
  { q: "Is recycling good for the Earth?", correct: true },
  { q: "Should we use single-use plastic bags every day?", correct: false },
  { q: "Do oceans produce oxygen for us to breathe?", correct: true },
  { q: "Is it OK to leave trash on the beach?", correct: false },
  { q: "Can we help sea creatures by picking up litter?", correct: true },
  { q: "Does plastic in the ocean hurt fish?", correct: true },
];

export default function EcoQuiz() {
  const [current, setCurrent] = useState(0);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState<"correct" | "wrong" | null>(null);
  const [won, setWon] = useState(false);

  const answer = (choice: boolean) => {
    if (feedback) return;
    const isCorrect = choice === QUESTIONS[current].correct;
    setFeedback(isCorrect ? "correct" : "wrong");
    if (isCorrect) setScore((s) => s + 1);
    setTimeout(() => {
      setFeedback(null);
      if (current + 1 >= QUESTIONS.length) {
        setWon(true);
      } else {
        setCurrent((c) => c + 1);
      }
    }, 1000);
  };

  const reset = () => { setCurrent(0); setScore(0); setFeedback(null); setWon(false); };

  if (won) return <WinScreen message="Quiz complete! You're an Eco Expert!" score={`${score}/${QUESTIONS.length} correct!`} onReset={reset} />;

  const q = QUESTIONS[current];

  return (
    <div className="max-w-md mx-auto text-center">
      <p className="text-white text-lg mb-1" style={{ fontFamily: "'Fredoka One', cursive" }}>
        Question {current + 1} of {QUESTIONS.length}
      </p>
      <img src="/potli.jpg" alt="Potli" className="w-20 h-20 mx-auto rounded-full border-4 border-yellow-400 object-cover mb-4" />

      <div className="bg-white/20 backdrop-blur rounded-3xl p-6 mb-6 relative min-h-24 flex items-center justify-center">
        <p className="text-white text-2xl font-bold leading-tight" style={{ fontFamily: "'Fredoka One', cursive" }}>
          {q.q}
        </p>
        {feedback && (
          <div className="absolute inset-0 flex items-center justify-center rounded-3xl text-5xl"
            style={{ background: feedback === "correct" ? "rgba(0,200,0,0.4)" : "rgba(255,0,0,0.4)" }}>
            {feedback === "correct" ? "✅" : "❌"}
          </div>
        )}
      </div>

      <div className="flex gap-4">
        <button data-testid="btn-yes" onClick={() => answer(true)}
          className="flex-1 py-6 rounded-3xl font-bold text-2xl shadow-lg active:scale-95 transition-transform text-white"
          style={{ background: "linear-gradient(135deg, #06d6a0, #028090)", fontFamily: "'Fredoka One', cursive" }}>
          👍 Yes!
        </button>
        <button data-testid="btn-no" onClick={() => answer(false)}
          className="flex-1 py-6 rounded-3xl font-bold text-2xl shadow-lg active:scale-95 transition-transform text-white"
          style={{ background: "linear-gradient(135deg, #e63946, #c1121f)", fontFamily: "'Fredoka One', cursive" }}>
          👎 No!
        </button>
      </div>

      <p className="text-yellow-300 mt-4 text-lg font-bold" style={{ fontFamily: "'Fredoka One', cursive" }}>
        Score: {score} ⭐
      </p>
    </div>
  );
}
