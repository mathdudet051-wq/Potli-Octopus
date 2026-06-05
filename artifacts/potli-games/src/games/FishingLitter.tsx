import { useState, useEffect } from "react";
import WinScreen from "./WinScreen";
import { useLang } from "@/LangContext";

const TRASH_ITEMS = ["🗑️","🥤","🛍️","🔩","🧴","🥡"];
const FISH_ITEMS = ["🐠","🐡","🐟","🦈","🐬","🐙"];
const TOTAL = 15;
type FloatingItem = { id: number; emoji: string; isTrash: boolean; x: number };

export default function FishingLitter() {
  const { lang, common, gameT } = useLang();
  const gm = gameT.fishingLitter as any;
  const [items, setItems] = useState<FloatingItem[]>([]);
  const [score, setScore] = useState(0);
  const [casts, setCasts] = useState(0);
  const [casting, setCasting] = useState(false);
  const [result, setResult] = useState<{ emoji: string; isTrash: boolean } | null>(null);
  const [won, setWon] = useState(false);
  const [done, setDone] = useState(false);

  useEffect(() => {
    const make = () => Array.from({ length: 6 }, (_, i) => {
      const isTrash = Math.random() > 0.4;
      const pool = isTrash ? TRASH_ITEMS : FISH_ITEMS;
      return { id: i + Date.now(), emoji: pool[Math.floor(Math.random() * pool.length)], isTrash, x: 10 + i * 14 };
    });
    setItems(make());
    const t = setInterval(() => setItems(make()), 3000);
    return () => clearInterval(t);
  }, []);

  const cast = () => {
    if (casting || done) return;
    setCasting(true);
    setTimeout(() => {
      const trash = items.filter((i) => i.isTrash);
      const fish = items.filter((i) => !i.isTrash);
      const catchTrash = trash.length > 0 && Math.random() > 0.3;
      const caught = catchTrash ? trash[Math.floor(Math.random() * trash.length)] : fish[Math.floor(Math.random() * fish.length)];
      if (caught) {
        setResult({ emoji: caught.emoji, isTrash: caught.isTrash });
        if (caught.isTrash) setScore((s) => s + 1);
      }
      const nextCasts = casts + 1;
      setCasts(nextCasts);
      setCasting(false);
      setTimeout(() => {
        setResult(null);
        if (nextCasts >= TOTAL) {
          if (score + (caught?.isTrash ? 1 : 0) >= 8) setWon(true);
          else setDone(true);
        }
      }, 800);
    }, 1000);
  };

  const reset = () => { setScore(0); setCasts(0); setCasting(false); setResult(null); setWon(false); setDone(false); };
  if (won) return <WinScreen message={gm.winMessage} score={gm.winScore(score)} onReset={reset} />;

  const litterLabel = lang === "hi" ? `कचरा: ${score} — बार: ${casts}/${TOTAL}` : `Litter: ${score} — Casts: ${casts}/${TOTAL}`;

  return (
    <div className="max-w-sm mx-auto text-center">
      <p className="text-white text-xl font-bold mb-1" style={{ fontFamily: "'Fredoka One', cursive" }}>{litterLabel}</p>
      <p className="text-cyan-200 text-sm mb-2" style={{ fontFamily: "'Fredoka One', cursive" }}>{gm.instruction}</p>
      {result && (
        <div className={`rounded-2xl px-4 py-2 mb-2 font-bold text-lg ${result.isTrash ? "bg-green-500/40 text-green-300" : "bg-orange-500/40 text-orange-300"}`}
          style={{ fontFamily: "'Fredoka One', cursive" }}>
          {result.emoji} {result.isTrash ? `${lang === "hi" ? "कचरा पकड़ा!" : "Litter caught!"} ${gm.litterCaught}` : gm.oops}
        </div>
      )}
      <div className="relative w-full rounded-3xl overflow-hidden border-4 border-white/30 mb-4"
        style={{ height: 260, background: "linear-gradient(180deg, #023e8a, #0077b6)" }}>
        <div className="absolute top-0 left-1/2 -translate-x-1/2">
          <div className="w-1 bg-yellow-400 mx-auto" style={{ height: casting ? 140 : 24, transition: "height 0.5s" }} />
          {casting && <div className="text-2xl text-center">🪝</div>}
        </div>
        <div className="text-4xl absolute top-0 left-1/2 -translate-x-1/2 -translate-y-2">🎣</div>
        <div className="absolute bottom-6 left-0 right-0 flex justify-around">
          {items.map((item) => (
            <span key={item.id} className="text-3xl animate-bob" style={{ animationDelay: `${Math.random()}s` }}>{item.emoji}</span>
          ))}
        </div>
      </div>
      {done && !won ? (
        <div>
          <p className="text-white text-xl mb-3" style={{ fontFamily: "'Fredoka One', cursive" }}>{gm.doneMsg(score)}</p>
          <button onClick={reset} className="bg-yellow-400 text-blue-900 font-bold py-3 px-8 rounded-full text-xl"
            style={{ fontFamily: "'Fredoka One', cursive" }}>{common.tryAgain}</button>
        </div>
      ) : (
        <button data-testid="btn-cast" onClick={cast} disabled={casting}
          className="w-full py-4 rounded-3xl text-blue-900 font-bold text-2xl shadow-lg active:scale-95 transition-transform disabled:opacity-50"
          style={{ background: casting ? "#ccc" : "linear-gradient(135deg, #ffd60a, #fb8500)", fontFamily: "'Fredoka One', cursive" }}>
          {casting ? gm.casting : common.cast}
        </button>
      )}
      <style>{`
        @keyframes bob { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-6px)} }
        .animate-bob { animation: bob 2s ease-in-out infinite; }
      `}</style>
    </div>
  );
}
