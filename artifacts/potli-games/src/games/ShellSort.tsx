import { useState, useRef } from "react";
import WinScreen from "./WinScreen";

const COLORS = [
  { id: "red", label: "Red", bg: "#e63946", emoji: "🔴" },
  { id: "blue", label: "Blue", bg: "#1d3557", emoji: "🔵" },
  { id: "yellow", label: "Yellow", bg: "#e9c46a", emoji: "🟡" },
];

const TOTAL = 15;

function makeShells() {
  return Array.from({ length: TOTAL }, (_, i) => ({
    id: i,
    color: COLORS[Math.floor(Math.random() * COLORS.length)],
    sorted: false,
    wrong: false,
  }));
}

export default function ShellSort() {
  const [shells, setShells] = useState(makeShells);
  const [score, setScore] = useState(0);
  const [won, setWon] = useState(false);
  const [dragging, setDragging] = useState<number | null>(null);
  const [feedback, setFeedback] = useState<{ binId: string; ok: boolean } | null>(null);

  const dropOnBin = (binId: string) => {
    if (dragging === null) return;
    const shell = shells.find((s) => s.id === dragging);
    if (!shell) return;
    const correct = shell.color.id === binId;
    setFeedback({ binId, ok: correct });
    if (correct) {
      setScore((s) => s + 1);
      setShells((prev) => {
        const next = prev.map((s) => s.id === dragging ? { ...s, sorted: true } : s);
        if (next.every((s) => s.sorted)) setTimeout(() => setWon(true), 300);
        return next;
      });
    } else {
      setShells((prev) => prev.map((s) => s.id === dragging ? { ...s, wrong: true } : s));
      setTimeout(() => setShells((prev) => prev.map((s) => s.id === dragging ? { ...s, wrong: false } : s)), 600);
    }
    setTimeout(() => setFeedback(null), 600);
    setDragging(null);
  };

  const reset = () => { setShells(makeShells()); setScore(0); setWon(false); setDragging(null); };
  if (won) return <WinScreen message="All shells sorted!" score={`${score}/${TOTAL} sorted!`} onReset={reset} />;

  const unsorted = shells.filter((s) => !s.sorted);

  return (
    <div className="max-w-sm mx-auto text-center">
      <p className="text-white text-xl font-bold mb-2" style={{ fontFamily: "'Fredoka One', cursive" }}>
        Sorted: {score}/{TOTAL}
      </p>
      <p className="text-cyan-200 text-sm mb-3" style={{ fontFamily: "'Fredoka One', cursive" }}>
        Drag shells into the matching colour bucket!
      </p>

      {/* Shells */}
      <div className="flex flex-wrap gap-3 justify-center mb-6 min-h-24 bg-white/10 rounded-2xl p-4">
        {unsorted.map((shell) => (
          <div key={shell.id} data-testid={`shell-${shell.id}`}
            draggable
            onDragStart={() => setDragging(shell.id)}
            onDragEnd={() => setDragging(null)}
            className="text-4xl cursor-grab active:cursor-grabbing select-none transition-transform active:scale-125"
            style={{
              filter: shell.wrong ? "drop-shadow(0 0 8px red)" : "none",
              animation: dragging === shell.id ? "none" : undefined,
            }}>
            🐚
          </div>
        ))}
        {unsorted.length === 0 && <p className="text-white/50 text-sm" style={{ fontFamily: "'Fredoka One', cursive" }}>All sorted! 🎉</p>}
      </div>

      {/* Colour hint for current shell */}
      {dragging !== null && (
        <p className="text-yellow-300 font-bold mb-2" style={{ fontFamily: "'Fredoka One', cursive" }}>
          This shell is {shells.find((s) => s.id === dragging)?.color.label}!
        </p>
      )}

      {/* Bins */}
      <div className="grid grid-cols-3 gap-3">
        {COLORS.map((c) => (
          <div key={c.id} data-testid={`bin-${c.id}`}
            onDragOver={(e) => e.preventDefault()}
            onDrop={() => dropOnBin(c.id)}
            className="py-6 rounded-3xl flex flex-col items-center font-bold text-white transition-all"
            style={{
              background: c.bg,
              border: feedback?.binId === c.id ? "4px solid white" : "4px solid transparent",
              fontFamily: "'Fredoka One', cursive",
              minHeight: 90,
            }}>
            <span className="text-4xl mb-1">{c.emoji}</span>
            <span className="text-sm">{c.label}</span>
            <span className="text-xs mt-1">
              {shells.filter((s) => s.sorted && s.color.id === c.id).length} shells
            </span>
          </div>
        ))}
      </div>

      <p className="text-cyan-200 text-xs mt-3" style={{ fontFamily: "'Fredoka One', cursive" }}>
        Tip: The shell colour shows when you pick it up!
      </p>
    </div>
  );
}
