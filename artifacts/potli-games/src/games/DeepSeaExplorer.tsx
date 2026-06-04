import { useState } from "react";
import WinScreen from "./WinScreen";

const DEPTHS = [
  { depth: 10, creature: "🐠", name: "Clownfish", fact: "Clownfish live in sea anemones and help clean them!" },
  { depth: 50, creature: "🐢", name: "Sea Turtle", fact: "Sea turtles can hold their breath for up to 7 hours!" },
  { depth: 100, creature: "🦑", name: "Squid", fact: "Squids can change colour in milliseconds to camouflage!" },
  { depth: 200, creature: "🐬", name: "Dolphin", fact: "Dolphins sleep with one eye open to watch for danger!" },
  { depth: 500, creature: "🦈", name: "Shark", fact: "Sharks have been on Earth for over 400 million years!" },
  { depth: 1000, creature: "🦑", name: "Giant Squid", fact: "Giant squids can grow up to 13 metres long!" },
  { depth: 3000, creature: "🐙", name: "Deep Octopus", fact: "Deep sea octopuses can glow in the dark!" },
  { depth: 10000, creature: "🐡", name: "Hadal Snailfish", fact: "The deepest fish lives 8km underwater in total darkness!" },
];

export default function DeepSeaExplorer() {
  const [level, setLevel] = useState(0);
  const [won, setWon] = useState(false);
  const [revealed, setRevealed] = useState(false);

  const dive = () => {
    if (!revealed) { setRevealed(true); return; }
    const next = level + 1;
    if (next >= DEPTHS.length) { setWon(true); return; }
    setLevel(next);
    setRevealed(false);
  };

  const reset = () => { setLevel(0); setWon(false); setRevealed(false); };

  if (won) return <WinScreen message="You explored the whole ocean!" score={`${DEPTHS.length} creatures discovered!`} onReset={reset} />;

  const d = DEPTHS[level];
  const darkness = Math.min(0.9, level * 0.1 + 0.1);

  return (
    <div className="max-w-sm mx-auto text-center">
      <p className="text-white text-xl font-bold mb-2" style={{ fontFamily: "'Fredoka One', cursive" }}>
        Depth: {d.depth}m — Discovery {level + 1}/{DEPTHS.length}
      </p>

      {/* Depth meter */}
      <div className="flex items-center gap-2 mb-4">
        <span className="text-white text-sm" style={{ fontFamily: "'Fredoka One', cursive" }}>Surface</span>
        <div className="flex-1 bg-white/20 rounded-full h-4 overflow-hidden">
          <div className="h-full rounded-full transition-all duration-500"
            style={{ width: `${(level / (DEPTHS.length - 1)) * 100}%`, background: "linear-gradient(90deg, #90e0ef, #023e8a)" }} />
        </div>
        <span className="text-white text-sm" style={{ fontFamily: "'Fredoka One', cursive" }}>Deep</span>
      </div>

      <div className="relative rounded-3xl overflow-hidden border-4 border-white/30 mb-4"
        style={{ height: 280, background: `rgba(2,62,138,${darkness})` }}>
        {/* Bubbles decoration */}
        <div className="absolute top-4 left-6 text-2xl opacity-30">🫧</div>
        <div className="absolute top-8 right-8 text-xl opacity-20">🫧</div>

        {revealed ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center p-4">
            <div className="text-8xl mb-3 animate-bounce">{d.creature}</div>
            <h3 className="text-white text-2xl font-bold mb-2" style={{ fontFamily: "'Fredoka One', cursive" }}>{d.name}</h3>
            <p className="text-cyan-200 text-sm leading-tight" style={{ fontFamily: "'Fredoka One', cursive" }}>{d.fact}</p>
          </div>
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <div className="text-6xl mb-4 opacity-30">❓</div>
            <p className="text-white/60 text-lg" style={{ fontFamily: "'Fredoka One', cursive" }}>Something lurks here...</p>
          </div>
        )}
      </div>

      <button data-testid="btn-dive" onClick={dive}
        className="w-full py-4 rounded-3xl text-white font-bold text-xl shadow-lg active:scale-95 transition-transform"
        style={{ background: "linear-gradient(135deg, #023e8a, #0077b6)", fontFamily: "'Fredoka One', cursive", border: "3px solid rgba(255,255,255,0.3)" }}>
        {!revealed ? "🔭 Dive!" : level + 1 < DEPTHS.length ? "🌊 Go Deeper!" : "🎉 Done!"}
      </button>
    </div>
  );
}
