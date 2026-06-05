import { useState } from "react";
import WinScreen from "./WinScreen";
import { useLang } from "@/LangContext";

const GOAL = 15;
const SEAWEED_EMOJIS = ["🌿","🪴","🌾","🌱"];
type Plant = { id: number; emoji: string; x: number; height: number };

export default function SeaweedGarden() {
  const { gameT } = useLang();
  const gm = gameT.seaweedGarden as any;
  const [plants, setPlants] = useState<Plant[]>([]);
  const [won, setWon] = useState(false);

  const plant = (e: React.MouseEvent<HTMLDivElement>) => {
    if (won) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 90 + 5;
    setPlants((prev) => {
      const next = [...prev, {
        id: Date.now(),
        emoji: SEAWEED_EMOJIS[Math.floor(Math.random() * SEAWEED_EMOJIS.length)],
        x, height: 40 + Math.random() * 50,
      }];
      if (next.length >= GOAL) setWon(true);
      return next;
    });
  };

  const reset = () => { setPlants([]); setWon(false); };
  if (won) return <WinScreen message={gm.winMessage} score={gm.winScore(GOAL)} onReset={reset} />;
  const pct = Math.min(100, Math.round((plants.length / GOAL) * 100));

  return (
    <div className="max-w-md mx-auto text-center">
      <p className="text-white text-xl font-bold mb-2" style={{ fontFamily: "'Fredoka One', cursive" }}>
        {plants.length}/{GOAL}
      </p>
      {plants.length >= 7 && plants.length < GOAL && (
        <p className="text-green-300 text-lg font-bold mb-2" style={{ fontFamily: "'Fredoka One', cursive" }}>{gm.growing}</p>
      )}
      <div className="w-full bg-white/20 rounded-full h-5 mb-3 border-2 border-white/40 overflow-hidden">
        <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, background: "linear-gradient(90deg, #06d6a0, #4cc9f0)" }} />
      </div>
      <div data-testid="garden" onClick={plant}
        className="relative w-full rounded-3xl overflow-hidden border-4 border-white/40 cursor-pointer select-none"
        style={{ height: 340, background: "linear-gradient(180deg, #0096c7 0%, #023e8a 60%, #c2a15f 100%)" }}>
        {plants.map((p) => (
          <div key={p.id} className="absolute bottom-4 flex flex-col items-center pointer-events-none"
            style={{ left: `${p.x}%`, transform: "translateX(-50%)" }}>
            {Array.from({ length: Math.ceil(p.height / 12) }).map((_, i) => (
              <span key={i} className="text-2xl leading-none animate-sway" style={{ animationDelay: `${i * 0.1}s` }}>{p.emoji}</span>
            ))}
          </div>
        ))}
        {plants.length === 0 && (
          <div className="absolute inset-0 flex items-center justify-center">
            <p className="text-white/60 text-xl text-center px-6" style={{ fontFamily: "'Fredoka One', cursive" }}>{gm.instruction}</p>
          </div>
        )}
      </div>
      <style>{`
        @keyframes sway { 0%,100% { transform: rotate(-5deg); } 50% { transform: rotate(5deg); } }
        .animate-sway { animation: sway 2s ease-in-out infinite; }
      `}</style>
    </div>
  );
}
