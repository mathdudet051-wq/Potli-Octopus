import { useState, useEffect, useCallback } from "react";
import WinScreen from "./WinScreen";

const TRASH_ITEMS = ["🗑️","🥤","🛍️","🔩","🧴","🥡","🪣","🧃"];
const TREASURE_ITEMS = ["💎","🐠","🌺","⭐","🐙","🦀","🐬","🌸"];
const TOTAL = 20;

type Item = { id: number; emoji: string; isTrash: boolean };

export default function TrashTreasure() {
  const [current, setCurrent] = useState<Item | null>(null);
  const [score, setScore] = useState(0);
  const [mistakes, setMistakes] = useState(0);
  const [count, setCount] = useState(0);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [won, setWon] = useState(false);
  const [done, setDone] = useState(false);

  const next = useCallback(() => {
    const isTrash = Math.random() > 0.4;
    const pool = isTrash ? TRASH_ITEMS : TREASURE_ITEMS;
    setCurrent({ id: Date.now(), emoji: pool[Math.floor(Math.random() * pool.length)], isTrash });
  }, []);

  useEffect(() => { next(); }, [next]);

  const tap = () => {
    if (!current || feedback) return;
    if (current.isTrash) {
      setScore((s) => s + 1);
      setFeedback("✅ Trash caught!");
    } else {
      setMistakes((m) => m + 1);
      setFeedback("❌ That's treasure!");
    }
    const nextCount = count + 1;
    setCount(nextCount);
    setTimeout(() => {
      setFeedback(null);
      if (nextCount >= TOTAL) {
        setDone(true);
        if (score + (current.isTrash ? 1 : 0) >= 12) setWon(true);
      } else {
        next();
      }
    }, 700);
  };

  const skip = () => {
    if (!current || feedback) return;
    if (!current.isTrash) {
      setScore((s) => s + 1);
      setFeedback("✅ Left the treasure!");
    } else {
      setMistakes((m) => m + 1);
      setFeedback("❌ That was trash!");
    }
    const nextCount = count + 1;
    setCount(nextCount);
    setTimeout(() => {
      setFeedback(null);
      if (nextCount >= TOTAL) {
        setDone(true);
        if (score + (!current.isTrash ? 1 : 0) >= 12) setWon(true);
      } else {
        next();
      }
    }, 700);
  };

  const reset = () => { setScore(0); setMistakes(0); setCount(0); setFeedback(null); setWon(false); setDone(false); next(); };

  if (won) return <WinScreen message="Amazing sorting skills!" score={`${score}/${TOTAL} correct!`} onReset={reset} />;

  return (
    <div className="max-w-sm mx-auto text-center">
      <p className="text-white text-xl font-bold mb-1" style={{ fontFamily: "'Fredoka One', cursive" }}>
        Item {count + 1}/{TOTAL} — Score: {score}
      </p>
      <p className="text-cyan-200 text-sm mb-4" style={{ fontFamily: "'Fredoka One', cursive" }}>
        Tap "It's Trash!" or leave treasure alone!
      </p>

      {feedback && (
        <p className={`text-2xl font-bold mb-3 ${feedback.startsWith("✅") ? "text-green-300" : "text-red-300"}`}
          style={{ fontFamily: "'Fredoka One', cursive" }}>
          {feedback}
        </p>
      )}

      {done && !won ? (
        <div className="text-center">
          <p className="text-white text-2xl mb-4" style={{ fontFamily: "'Fredoka One', cursive" }}>
            You scored {score}/{TOTAL}! Try for 12+!
          </p>
          <button onClick={reset} className="bg-yellow-400 text-blue-900 font-bold py-3 px-8 rounded-full text-xl"
            style={{ fontFamily: "'Fredoka One', cursive" }}>Try Again!</button>
        </div>
      ) : (
        <>
          <div className="bg-white/20 rounded-3xl p-10 mb-6 text-center">
            <div className="text-9xl mb-2">{current?.emoji}</div>
          </div>
          <div className="flex gap-4">
            <button data-testid="btn-trash" onClick={tap}
              className="flex-1 py-4 rounded-3xl text-white font-bold text-lg shadow-lg active:scale-95 transition-transform"
              style={{ background: "linear-gradient(135deg, #e63946, #c1121f)", fontFamily: "'Fredoka One', cursive" }}>
              It's Trash! 🗑️
            </button>
            <button data-testid="btn-keep" onClick={skip}
              className="flex-1 py-4 rounded-3xl text-white font-bold text-lg shadow-lg active:scale-95 transition-transform"
              style={{ background: "linear-gradient(135deg, #06d6a0, #028090)", fontFamily: "'Fredoka One', cursive" }}>
              Keep it! 💎
            </button>
          </div>
        </>
      )}
    </div>
  );
}
