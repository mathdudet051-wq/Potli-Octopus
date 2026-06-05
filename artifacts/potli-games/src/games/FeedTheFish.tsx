import { useState, useEffect } from "react";
import WinScreen from "./WinScreen";
import { useLang } from "@/LangContext";

const FOOD = ["🦐","🐚","🦑","🦞","🦀","🐛"];
const PLASTIC = ["🥤","🛍️","🔩","🧴","🪣","🥡"];
const TOTAL = 15;
type Item = { id: number; emoji: string; isFood: boolean; x: number; y: number };

export default function FeedTheFish() {
  const { lang, common, gameT } = useLang();
  const gm = gameT.feedFish as any;
  const [items, setItems] = useState<Item[]>([]);
  const [score, setScore] = useState(0);
  const [shown, setShown] = useState(0);
  const [feedback, setFeedback] = useState<{ msg: string; good: boolean } | null>(null);
  const [won, setWon] = useState(false);
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (shown >= TOTAL) return;
    const t = setTimeout(() => {
      const isFood = Math.random() > 0.4;
      const pool = isFood ? FOOD : PLASTIC;
      setItems((prev) => [...prev, {
        id: Date.now(), emoji: pool[Math.floor(Math.random() * pool.length)], isFood,
        x: 10 + Math.random() * 75, y: 20 + Math.random() * 50,
      }]);
      setShown((s) => s + 1);
    }, shown === 0 ? 200 : 1200);
    return () => clearTimeout(t);
  }, [shown]);

  useEffect(() => { if (shown >= TOTAL && items.length === 0 && !won) setDone(true); }, [shown, items, won]);

  const tap = (item: Item) => {
    setItems((prev) => prev.filter((i) => i.id !== item.id));
    if (item.isFood) {
      setScore((s) => { const n = s + 1; if (n >= 10) setWon(true); return n; });
      setFeedback({ msg: gm.yummy, good: true });
    } else {
      setFeedback({ msg: gm.plastic, good: false });
    }
    setTimeout(() => setFeedback(null), 800);
  };

  const reset = () => { setItems([]); setScore(0); setShown(0); setFeedback(null); setWon(false); setDone(false); };

  if (won) return <WinScreen message={gm.winMessage} score={gm.winScore(score)} onReset={reset} />;

  return (
    <div className="max-w-md mx-auto text-center">
      <p className="text-white text-xl font-bold mb-2" style={{ fontFamily: "'Fredoka One', cursive" }}>
        {common.score}: {score}
      </p>
      {feedback && (
        <p className={`text-2xl font-bold mb-2 ${feedback.good ? "text-green-300" : "text-red-300"}`}
          style={{ fontFamily: "'Fredoka One', cursive" }}>{feedback.msg}</p>
      )}
      <div className="relative w-full rounded-3xl overflow-hidden border-4 border-white/30 mb-4"
        style={{ height: 320, background: "linear-gradient(180deg, #48cae4, #023e8a)" }}>
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
          {["🐟","🐡","🐠"].map((f, i) => (
            <span key={i} className="text-4xl animate-swimFish" style={{ animationDelay: `${i * 0.3}s` }}>{f}</span>
          ))}
        </div>
        {items.map((item) => (
          <button key={item.id} onClick={() => tap(item)}
            className="absolute text-4xl active:scale-150 transition-transform"
            style={{ left: `${item.x}%`, top: `${item.y}%` }}>
            {item.emoji}
          </button>
        ))}
        {done && !won && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-3xl">
            <div className="text-center text-white">
              <p className="text-2xl mb-4" style={{ fontFamily: "'Fredoka One', cursive" }}>
                {lang === "hi" ? `${score} मछलियाँ खिलाई!` : `You fed ${score} fish!`}
              </p>
              <button onClick={reset} className="bg-yellow-400 text-blue-900 font-bold py-3 px-8 rounded-full text-xl"
                style={{ fontFamily: "'Fredoka One', cursive" }}>{common.tryAgain}</button>
            </div>
          </div>
        )}
      </div>
      <p className="text-cyan-200 text-sm" style={{ fontFamily: "'Fredoka One', cursive" }}>{gm.instruction}</p>
      <style>{`
        @keyframes swimFish { 0%,100% { transform: translateX(-8px); } 50% { transform: translateX(8px); } }
        .animate-swimFish { animation: swimFish 1.5s ease-in-out infinite; }
      `}</style>
    </div>
  );
}
