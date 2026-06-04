import { useState } from "react";
import WinScreen from "./WinScreen";

const CORALS = ["🪸","🌿","⭐","🌺","🍄","🌸","🦋","🐚"];
const GOAL = 20;

type Coral = { id: number; emoji: string; x: number; y: number; size: number };

export default function CoralBuilder() {
  const [corals, setCorals] = useState<Coral[]>([]);
  const [won, setWon] = useState(false);
  const nextId = { current: 0 };

  const plant = (e: React.MouseEvent<HTMLDivElement>) => {
    if (won) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    const emoji = CORALS[Math.floor(Math.random() * CORALS.length)];
    const newCoral: Coral = { id: Date.now(), emoji, x, y, size: 28 + Math.random() * 20 };
    setCorals((prev) => {
      const next = [...prev, newCoral];
      if (next.length >= GOAL) setWon(true);
      return next;
    });
  };

  const reset = () => { setCorals([]); setWon(false); };

  if (won) return <WinScreen message="Your reef is beautiful!" score={`${corals.length} corals planted!`} onReset={reset} />;

  const pct = Math.min(100, Math.round((corals.length / GOAL) * 100));

  return (
    <div className="max-w-md mx-auto">
      <div className="text-center mb-3">
        <p className="text-white text-xl font-bold mb-2" style={{ fontFamily: "'Fredoka One', cursive" }}>
          Plant {GOAL} corals to save the reef! ({corals.length}/{GOAL})
        </p>
        <div className="w-full bg-white/20 rounded-full h-5 overflow-hidden border-2 border-white/40">
          <div className="h-full rounded-full transition-all duration-300"
            style={{ width: `${pct}%`, background: "linear-gradient(90deg, #06d6a0, #4cc9f0)" }} />
        </div>
      </div>

      <div
        data-testid="reef-area"
        onClick={plant}
        className="relative w-full rounded-3xl overflow-hidden cursor-pointer border-4 border-white/40 select-none"
        style={{ height: 380, background: "linear-gradient(180deg, #023e8a 0%, #0077b6 40%, #1a5276 80%, #c2a15f 100%)" }}
      >
        {corals.map((c) => (
          <span
            key={c.id}
            className="absolute select-none pointer-events-none animate-growIn"
            style={{ left: `${c.x}%`, bottom: `${100 - c.y}%`, fontSize: c.size, transform: "translateX(-50%)" }}
          >
            {c.emoji}
          </span>
        ))}
        {corals.length === 0 && (
          <div className="absolute inset-0 flex items-center justify-center">
            <p className="text-white/70 text-xl text-center px-6" style={{ fontFamily: "'Fredoka One', cursive" }}>
              Tap anywhere to plant corals!
            </p>
          </div>
        )}
        {corals.length >= 7 && corals.length < GOAL && (
          <div className="absolute top-3 left-1/2 -translate-x-1/2 bg-green-400/80 text-white px-4 py-1 rounded-full text-sm font-bold"
            style={{ fontFamily: "'Fredoka One', cursive" }}>
            Your garden is growing!
          </div>
        )}
      </div>
      <style>{`
        @keyframes growIn { from { transform: translateX(-50%) scale(0); } to { transform: translateX(-50%) scale(1); } }
        .animate-growIn { animation: growIn 0.3s ease-out; }
      `}</style>
    </div>
  );
}
