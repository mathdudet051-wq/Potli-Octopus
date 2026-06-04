import { useState, useCallback } from "react";
import WinScreen from "./WinScreen";

const BUTTONS = [
  { id: 0, emoji: "🌊", label: "Wave", color: "#1d3557", glow: "#4cc9f0" },
  { id: 1, emoji: "🐠", label: "Fish", color: "#e63946", glow: "#ff6b6b" },
  { id: 2, emoji: "🌿", label: "Seaweed", color: "#2d6a4f", glow: "#06d6a0" },
  { id: 3, emoji: "⭐", label: "Star", color: "#c68400", glow: "#ffd60a" },
];

type Phase = "idle" | "showing" | "input" | "wrong" | "won";

export default function SimonSaysSea() {
  const [sequence, setSequence] = useState<number[]>([]);
  const [playerIdx, setPlayerIdx] = useState(0);
  const [phase, setPhase] = useState<Phase>("idle");
  const [active, setActive] = useState<number | null>(null);
  const [best, setBest] = useState(0);

  const showSequence = useCallback((seq: number[]) => {
    setPhase("showing");
    setPlayerIdx(0);
    let i = 0;
    const show = () => {
      if (i >= seq.length) {
        setTimeout(() => setPhase("input"), 500);
        return;
      }
      setActive(seq[i]);
      setTimeout(() => { setActive(null); i++; setTimeout(show, 400); }, 600);
    };
    setTimeout(show, 600);
  }, []);

  const start = () => {
    const first = [Math.floor(Math.random() * 4)];
    setSequence(first);
    setBest(0);
    showSequence(first);
  };

  const press = (id: number) => {
    if (phase !== "input") return;
    setActive(id);
    setTimeout(() => setActive(null), 200);

    if (id !== sequence[playerIdx]) {
      setPhase("wrong");
      setBest((b) => Math.max(b, sequence.length - 1));
      return;
    }
    const nextIdx = playerIdx + 1;
    if (nextIdx >= sequence.length) {
      if (sequence.length >= 8) { setPhase("won"); return; }
      const next = [...sequence, Math.floor(Math.random() * 4)];
      setSequence(next);
      setTimeout(() => showSequence(next), 600);
    } else {
      setPlayerIdx(nextIdx);
    }
  };

  const reset = () => { setSequence([]); setPlayerIdx(0); setPhase("idle"); setActive(null); };
  if (phase === "won") return <WinScreen message="You have an amazing memory!" score={`${sequence.length} steps remembered!`} onReset={reset} />;

  return (
    <div className="max-w-sm mx-auto text-center">
      <p className="text-white text-xl font-bold mb-1" style={{ fontFamily: "'Fredoka One', cursive" }}>
        {phase === "idle" ? "Simon Says Sea!" :
          phase === "showing" ? "Watch carefully..." :
          phase === "input" ? `Your turn! Step ${playerIdx + 1}/${sequence.length}` :
          phase === "wrong" ? "Oh no! Wrong order!" : ""}
      </p>
      {best > 0 && <p className="text-yellow-300 text-sm mb-2" style={{ fontFamily: "'Fredoka One', cursive" }}>Best: {best} steps</p>}

      <div className="grid grid-cols-2 gap-4 mb-6 mt-4">
        {BUTTONS.map((btn) => (
          <button key={btn.id} data-testid={`simon-${btn.id}`}
            onClick={() => press(btn.id)}
            disabled={phase !== "input"}
            className="py-8 rounded-3xl flex flex-col items-center gap-2 font-bold text-white text-xl transition-all active:scale-95"
            style={{
              background: btn.color,
              boxShadow: active === btn.id ? `0 0 30px ${btn.glow}, 0 0 60px ${btn.glow}` : "0 6px 0px rgba(0,0,0,0.3)",
              transform: active === btn.id ? "scale(1.08)" : "scale(1)",
              border: `4px solid ${active === btn.id ? btn.glow : "rgba(255,255,255,0.2)"}`,
              opacity: phase === "input" ? 1 : 0.7,
              fontFamily: "'Fredoka One', cursive",
            }}>
            <span className="text-5xl">{btn.emoji}</span>
            <span>{btn.label}</span>
          </button>
        ))}
      </div>

      {phase === "idle" && (
        <button data-testid="start-simon" onClick={start}
          className="w-full py-4 rounded-3xl text-blue-900 font-bold text-2xl shadow-lg"
          style={{ background: "linear-gradient(135deg, #ffd60a, #fb8500)", fontFamily: "'Fredoka One', cursive" }}>
          Start Game!
        </button>
      )}

      {phase === "wrong" && (
        <div>
          <p className="text-white text-lg mb-3" style={{ fontFamily: "'Fredoka One', cursive" }}>
            You got to {sequence.length - 1} steps! Best: {Math.max(best, sequence.length - 1)}
          </p>
          <button onClick={reset} className="bg-yellow-400 text-blue-900 font-bold py-3 px-8 rounded-full text-xl"
            style={{ fontFamily: "'Fredoka One', cursive" }}>
            Try Again!
          </button>
        </div>
      )}
    </div>
  );
}
