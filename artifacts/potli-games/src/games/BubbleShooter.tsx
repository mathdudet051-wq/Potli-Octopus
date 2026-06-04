import { useState, useCallback, useRef } from "react";
import WinScreen from "./WinScreen";

const COLS = 8;
const ROWS = 5;
const COLORS = ["#f72585","#4cc9f0","#ffd60a","#06d6a0"];
const CELL = 40;

type BubbleCell = { color: string } | null;

function makeGrid(): BubbleCell[][] {
  return Array.from({ length: ROWS }, () =>
    Array.from({ length: COLS }, () => ({
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
    }))
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
      if (row < 0) return prev;
      g[row][targetCol] = { color: shootColor };
      const matches = findMatches(g, row, targetCol, shootColor);
      if (matches.length >= 3) {
        setScore((s) => s + matches.length);
        setFeedback(`+${matches.length} pop!`);
        setTimeout(() => setFeedback(null), 700);
        matches.forEach(([mr, mc]) => { g[mr][mc] = null; });
      }
      const allEmpty = g.every((row) => row.every((c) => !c));
      if (allEmpty) setTimeout(() => setWon(true), 300);
      return g;
    });
    setShootColor(nextColor);
    setNextColor(COLORS[Math.floor(Math.random() * COLORS.length)]);
  }, [shootColor, nextColor]);

  const reset = () => { setGrid(makeGrid()); setScore(0); setWon(false); setShootColor(COLORS[0]); setNextColor(COLORS[1]); };
  if (won) return <WinScreen message="All bubbles cleared!" score={`${score} bubbles popped!`} onReset={reset} />;

  return (
    <div className="max-w-sm mx-auto text-center">
      <div className="flex justify-between items-center mb-2 px-2">
        <p className="text-white text-xl font-bold" style={{ fontFamily: "'Fredoka One', cursive" }}>
          Score: {score}
        </p>
        <div className="flex items-center gap-2">
          <span className="text-white text-sm" style={{ fontFamily: "'Fredoka One', cursive" }}>Next:</span>
          <div className="w-8 h-8 rounded-full border-3 border-white" style={{ background: nextColor }} />
        </div>
      </div>

      {feedback && (
        <p className="text-yellow-300 text-2xl font-bold mb-1 animate-bounce" style={{ fontFamily: "'Fredoka One', cursive" }}>{feedback}</p>
      )}

      {/* Grid */}
      <div className="inline-block rounded-3xl overflow-hidden border-4 border-white/30 mb-4"
        style={{ background: "rgba(0,40,100,0.8)" }}>
        {grid.map((row, r) => (
          <div key={r} className="flex">
            {row.map((cell, c) => (
              <div key={c} className="flex items-center justify-center"
                style={{ width: CELL, height: CELL }}>
                {cell && (
                  <div className="rounded-full border-3 border-white/40"
                    style={{ width: 34, height: 34, background: cell.color, boxShadow: `0 0 8px ${cell.color}` }} />
                )}
              </div>
            ))}
          </div>
        ))}
      </div>

      {/* Shooter aim indicator */}
      <div className="flex gap-1 justify-center mb-3">
        {Array.from({ length: COLS }, (_, c) => (
          <button key={c} data-testid={`col-${c}`} onClick={() => { setCol(c); shoot(c); }}
            className="flex items-center justify-center rounded-full transition-all active:scale-90"
            style={{ width: CELL, height: 36, background: col === c ? "rgba(255,255,255,0.3)" : "rgba(255,255,255,0.1)", border: "2px solid rgba(255,255,255,0.3)" }}>
            {col === c && <div className="w-6 h-6 rounded-full border-2 border-white" style={{ background: shootColor }} />}
          </button>
        ))}
      </div>

      <div className="flex items-center justify-center gap-4">
        <div className="w-16 h-16 rounded-full border-4 border-white shadow-lg flex items-center justify-center"
          style={{ background: shootColor, boxShadow: `0 0 20px ${shootColor}` }} />
        <button onClick={() => shoot(col)} data-testid="btn-shoot"
          className="py-3 px-8 rounded-3xl text-blue-900 font-bold text-xl shadow-lg active:scale-95 transition-transform"
          style={{ background: "linear-gradient(135deg, #ffd60a, #fb8500)", fontFamily: "'Fredoka One', cursive" }}>
          Shoot!
        </button>
      </div>
      <p className="text-cyan-200 text-xs mt-2" style={{ fontFamily: "'Fredoka One', cursive" }}>
        Click a column to aim, then Shoot! Match 3+ same colour to pop!
      </p>
    </div>
  );
}
