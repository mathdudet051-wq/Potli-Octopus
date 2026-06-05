import { useState, useCallback } from "react";
import WinScreen from "./WinScreen";
import { useLang } from "@/LangContext";

const TRASH_ITEMS = ["🗑️","🥤","🛍️","🔩","🧴","🥡","🪣","🧃"];
const TREASURE_ITEMS = ["💎","🐠","🌺","⭐","🐙","🦀","🐬","🌸"];
const TOTAL = 20;
type Item = { id: number; emoji: string; isTrash: boolean };

export default function TrashTreasure() {
  const { lang, common, gameT } = useLang();
  const gm = gameT.trashTreasure as any;
  const [current, setCurrent] = useState<Item | null>(null);
  const [score, setScore] = useState(0);
  const [count, setCount] = useState(0);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [won, setWon] = useState(false);
  const [done, setDone] = useState(false);

  const next = useCallback(() => {
    const isTrash = Math.random() > 0.4;
    const pool = isTrash ? TRASH_ITEMS : TREASURE_ITEMS;
    setCurrent({ id: Date.now(), emoji: pool[Math.floor(Math.random() * pool.length)], isTrash });
  }, []);

  useState(() => { next(); });

  const finish = (isCorrect: boolean, curIsTrash: boolean) => {
    const nextCount = count + 1;
    if (isCorrect) {
      setScore((s) => s + 1);
      setFeedback(curIsTrash ? gm.trashGood : gm.skipGood);
    } else {
      setFeedback(curIsTrash ? gm.skipBad : gm.trashBad);
    }
    setCount(nextCount);
    setTimeout(() => {
      setFeedback(null);
      if (nextCount >= TOTAL) {
        const finalScore = score + (isCorrect ? 1 : 0);
        if (finalScore >= 12) setWon(true);
        else setDone(true);
      } else { next(); }
    }, 700);
  };

  const tap = () => { if (!current || feedback) return; finish(!!current.isTrash, !!current.isTrash); };
  const skip = () => { if (!current || feedback) return; finish(!current.isTrash, !!current.isTrash); };
  const reset = () => { setScore(0); setCount(0); setFeedback(null); setWon(false); setDone(false); next(); };

  if (won) return <WinScreen message={gm.winMessage} score={gm.winScore(`${score}/${TOTAL}`)} onReset={reset} />;

  return (
    <div className="max-w-sm mx-auto text-center">
      <p className="text-white text-xl font-bold mb-1" style={{ fontFamily: "'Fredoka One', cursive" }}>
        {lang === "hi" ? `चीज़ ${count + 1}/${TOTAL} — अंक: ${score}` : `Item ${count + 1}/${TOTAL} — Score: ${score}`}
      </p>
      <p className="text-cyan-200 text-sm mb-4" style={{ fontFamily: "'Fredoka One', cursive" }}>{gm.instruction}</p>
      {feedback && (
        <p className={`text-2xl font-bold mb-3 ${feedback.startsWith("✅") ? "text-green-300" : "text-red-300"}`}
          style={{ fontFamily: "'Fredoka One', cursive" }}>{feedback}</p>
      )}
      {done ? (
        <div className="text-center">
          <p className="text-white text-2xl mb-4" style={{ fontFamily: "'Fredoka One', cursive" }}>
            {gm.doneMsg ? gm.doneMsg(score, TOTAL) : `You scored ${score}/${TOTAL}! Try for 12+!`}
          </p>
          <button onClick={reset} className="bg-yellow-400 text-blue-900 font-bold py-3 px-8 rounded-full text-xl"
            style={{ fontFamily: "'Fredoka One', cursive" }}>{common.tryAgain}</button>
        </div>
      ) : (
        <>
          <div className="bg-white/20 rounded-3xl p-10 mb-6 text-center">
            <div className="text-8xl mb-2">{current?.emoji}</div>
          </div>
          <div className="flex gap-4">
            <button data-testid="btn-trash" onClick={tap}
              className="flex-1 py-4 rounded-3xl text-white font-bold text-lg shadow-lg active:scale-95 transition-transform"
              style={{ background: "linear-gradient(135deg, #e63946, #c1121f)", fontFamily: "'Fredoka One', cursive" }}>
              {gm.trashBtn}
            </button>
            <button data-testid="btn-keep" onClick={skip}
              className="flex-1 py-4 rounded-3xl text-white font-bold text-lg shadow-lg active:scale-95 transition-transform"
              style={{ background: "linear-gradient(135deg, #06d6a0, #028090)", fontFamily: "'Fredoka One', cursive" }}>
              {gm.keepBtn}
            </button>
          </div>
        </>
      )}
    </div>
  );
}
