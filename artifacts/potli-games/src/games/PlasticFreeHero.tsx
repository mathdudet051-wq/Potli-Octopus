import { useState } from "react";
import WinScreen from "./WinScreen";

const SWAPS = [
  { bad: { emoji: "🥤", label: "Plastic Bottle" }, good: { emoji: "🫗", label: "Reusable Bottle" } },
  { bad: { emoji: "🛍️", label: "Plastic Bag" }, good: { emoji: "👜", label: "Tote Bag" } },
  { bad: { emoji: "🥄", label: "Plastic Straw" }, good: { emoji: "🎋", label: "Bamboo Straw" } },
  { bad: { emoji: "🍽️", label: "Plastic Plate" }, good: { emoji: "🪵", label: "Bamboo Plate" } },
  { bad: { emoji: "🧴", label: "Plastic Soap" }, good: { emoji: "🧼", label: "Soap Bar" } },
  { bad: { emoji: "🥡", label: "Takeaway Box" }, good: { emoji: "🍱", label: "Lunchbox" } },
];

export default function PlasticFreeHero() {
  const [current, setCurrent] = useState(0);
  const [swapped, setSwapped] = useState(false);
  const [won, setWon] = useState(false);

  const doSwap = () => {
    if (swapped) return;
    setSwapped(true);
    setTimeout(() => {
      const next = current + 1;
      if (next >= SWAPS.length) {
        setWon(true);
      } else {
        setCurrent(next);
        setSwapped(false);
      }
    }, 800);
  };

  const reset = () => { setCurrent(0); setSwapped(false); setWon(false); };

  if (won) return <WinScreen message="You're a Plastic Free Hero!" score={`${SWAPS.length} swaps made!`} onReset={reset} />;

  const s = SWAPS[current];

  return (
    <div className="max-w-sm mx-auto text-center">
      <p className="text-white text-xl font-bold mb-1" style={{ fontFamily: "'Fredoka One', cursive" }}>
        Swap {current + 1} of {SWAPS.length}
      </p>
      <p className="text-cyan-200 text-sm mb-4" style={{ fontFamily: "'Fredoka One', cursive" }}>
        Tap to swap single-use plastic for an eco-friendly alternative!
      </p>

      <div className="flex items-center justify-center gap-4 mb-6">
        <div className="flex flex-col items-center bg-red-500/30 rounded-3xl p-5 border-4 border-red-400 flex-1">
          <span className="text-7xl mb-2">{swapped ? s.good.emoji : s.bad.emoji}</span>
          <span className="text-white font-bold text-sm" style={{ fontFamily: "'Fredoka One', cursive" }}>
            {swapped ? s.good.label : s.bad.label}
          </span>
          {swapped && <span className="text-green-300 text-xs mt-1" style={{ fontFamily: "'Fredoka One', cursive" }}>Eco Swapped! ♻️</span>}
        </div>
        <div className="text-4xl">
          {swapped ? "✅" : "➡️"}
        </div>
        <div className="flex flex-col items-center bg-green-500/30 rounded-3xl p-5 border-4 border-green-400 flex-1">
          <span className="text-7xl mb-2" style={{ opacity: swapped ? 1 : 0.3 }}>{s.good.emoji}</span>
          <span className="text-white font-bold text-sm" style={{ fontFamily: "'Fredoka One', cursive", opacity: swapped ? 1 : 0.5 }}>
            {s.good.label}
          </span>
          {!swapped && <span className="text-cyan-300 text-xs mt-1" style={{ fontFamily: "'Fredoka One', cursive" }}>Eco choice!</span>}
        </div>
      </div>

      {!swapped ? (
        <button data-testid="btn-swap" onClick={doSwap}
          className="w-full py-5 rounded-3xl text-white font-bold text-2xl shadow-lg active:scale-95 transition-transform"
          style={{ background: "linear-gradient(135deg, #06d6a0, #028090)", fontFamily: "'Fredoka One', cursive" }}>
          ♻️ Make the Swap!
        </button>
      ) : (
        <div className="py-5 rounded-3xl bg-green-500/30 border-2 border-green-400 text-green-300 font-bold text-xl"
          style={{ fontFamily: "'Fredoka One', cursive" }}>
          Great swap! Next one coming...
        </div>
      )}

      <div className="flex gap-1 justify-center mt-4">
        {SWAPS.map((_, i) => (
          <div key={i} className="w-4 h-4 rounded-full border-2 border-white/50"
            style={{ background: i < current ? "#06d6a0" : i === current ? "#ffd60a" : "rgba(255,255,255,0.2)" }} />
        ))}
      </div>
    </div>
  );
}
