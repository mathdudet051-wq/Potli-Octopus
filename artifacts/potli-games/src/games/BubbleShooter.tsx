import { useState, useCallback } from "react";
import WinScreen from "./WinScreen";
import { useLang } from "@/LangContext";

const COLORS = ["#f72585","#4cc9f0","#ffd60a","#06d6a0"];
const COLS = 8;
const ROWS = 5;
const CELL = 38;

type BubbleCell = { color: string } | null;

function makeGrid(): BubbleCell[][] {
  return Array.from({ length: ROWS }, () =>
    Array.from({ length: COLS }, () => ({ color: COLORS[Math.floor(Math.random() * COLORS.length)] }))
  );
}

function findMatches(grid: BubbleCell[][], r: number, c: number, color: string): [number, number][] {
  const visited = new Set<string>();
  const matches: [number, number][] = [];
  const queue: [number, number][] = [[r, c]];
  while (queue.length) {
    const [cr, cc] = queue.pop()!;
    const key = `${cr},${cc}`;
    if (visited.has(key)) continue;
    visited.add(key);
    if (cr < 0 || cr >= grid.length || cc < 0 || cc >= COLS) continue;
    if (!grid[cr][cc] || grid[cr][cc]?.color !== color) continue;
    matches.push([cr, cc]);
    queue.push([cr - 1, cc], [cr + 1, cc], [cr, cc - 1], [cr, cc + 1]);
  }
  return matches;
}

export default function BubbleShooter() {
  const { lang, gameT } = useLang();
  const gm = gameT.bubbleShooter as any;
  const [grid, setGrid] = useState<BubbleCell[][]>(makeGrid);
  const [shootColor, setShootColor] = useState(COLORS[Math.floor(Math.random() * COLORS.length)]);
  const [nextColor, setNextColor] = useState(COLORS[Math.floor(Math.random() * COLORS.length)]);
  const [score, setScore] = useState(0);
  const [won, setWon] = useState(false);
  const [col, setCol] = useState(3);
  const [feedback, setFeedback] = useState<string | null>(null);

  const shoot = useCallback((targetCol: number) => {
    setGrid((prev) => {
      const g = prev.map((row) => [...row]);
      let row = g.length - 1;
      for (let r = 0; r < g.length; r++) {
        if (!g[r][targetCol]) { row = r; break; }
      }
      g[row][targetCol] = { color: shootColor };
      const matches = findMatches(g, row, targetCol, shootColor);
      if (matches.length >= 3) {
        setScore((s) => s + matches.length);
        setFeedback(`+${matches.length}`);
        setTimeout(() => setFeedback(null), 700);
        matches.forEach(([mr, mc]) => { g[mr][mc] = null; });
      }
      if (g.every((row) => row.every((c) => !c))) setTimeout(() => setWon(true), 300);
      return g;
    });
    setShootColor(nextColor);
    setNextColor(COLORS[Math.floor(Math.random() * COLORS.length)]);
  }, [shootColor, nextColor]);

  const reset = () => { setGrid(makeGrid()); setScore(0); setWon(false); setShootColor(COLORS[0]); setNextColor(COLORS[1]); };
  if (won) return <WinScreen message={gm.winMessage} score={gm.winScore(score)} onReset={reset} />;

  return (
    <div className="max-w-xs mx-auto text-center">
      <div className="flex justify-between items-center mb-2 px-1">
        <p className="text-white text-xl font-bold" style={{ fontFamily: "'Fredoka One', cursive" }}>
          {lang === "hi" ? `अंक: ${score}` : `Score: ${score}`}
        </p>
        <div className="flex items-center gap-2">
          <span className="text-white text-sm" style={{ fontFamily: "'Fredoka One', cursive" }}>{gm.next}</span>
          <div className="w-7 h-7 rounded-full border-2 border-white" style={{ background: nextColor }} />
        </div>
      </div>
      {feedback && (
        <p className="text-yellow-300 text-2xl font-bold mb-1 animate-bounce" style={{ fontFamily: "'Fredoka One', cursive" }}>{feedback}!</p>
      )}
      <div className="inline-block rounded-3xl overflow-hidden border-4 border-white/30 mb-3 w-full"
        style={{ background: "rgba(0,40,100,0.8)" }}>
        {grid.map((row, r) => (
          <div key={r} className="flex">
            {row.map((cell, c) => (
              <div key={c} className="flex items-center justify-center"
                style={{ width: CELL, height: CELL, flex: 1 }}>
                {cell && (
                  <div className="rounded-full border-2 border-white/40"
                    style={{ width: 30, height: 30, background: cell.color, boxShadow: `0 0 8px ${cell.color}` }} />
                )}
              </div>
            ))}
          </div>
        ))}
      </div>
      {/* Column selectors */}
      <div className="flex mb-3 w-full">
        {Array.from({ length: COLS }, (_, c) => (
          <button key={c} data-testid={`col-${c}`} onClick={() => { setCol(c); shoot(c); }}
            className="flex-1 flex items-center justify-center rounded-full transition-all active:scale-90"
            style={{ height: 32, background: col === c ? "rgba(255,255,255,0.3)" : "rgba(255,255,255,0.1)", border: "2px solid rgba(255,255,255,0.3)" }}>
            {col === c && <div className="w-5 h-5 rounded-full border-2 border-white" style={{ background: shootColor }} />}
          </button>
        ))}
      </div>
      <div className="flex items-center justify-center gap-4">
        <div className="w-14 h-14 rounded-full border-4 border-white shadow-lg"
          style={{ background: shootColor, boxShadow: `0 0 20px ${shootColor}` }} />
        <button onClick={() => shoot(col)} data-testid="btn-shoot"
          className="py-3 px-7 rounded-3xl text-blue-900 font-bold text-xl shadow-lg active:scale-95 transition-transform"
          style={{ background: "linear-gradient(135deg, #ffd60a, #fb8500)", fontFamily: "'Fredoka One', cursive" }}>
          {lang === "hi" ? "मारो!" : "Shoot!"}
        </button>
      </div>
      <p className="text-cyan-200 text-xs mt-2" style={{ fontFamily: "'Fredoka One', cursive" }}>{gm.instruction}</p>
    </div>
  );
}
