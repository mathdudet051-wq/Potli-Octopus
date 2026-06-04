import { useState, useEffect, useCallback } from "react";
import WinScreen from "./WinScreen";

const COLS = 8;
const ROWS = 8;
const CELL = 42;

const WALLS: [number, number, number, number][] = [
  [0,1,0,2],[0,2,0,3],[0,3,1,3],[1,3,2,3],[2,3,2,4],[2,4,3,4],[3,4,3,5],[3,5,4,5],
  [1,0,1,1],[1,1,2,1],[2,1,2,2],[3,2,4,2],[4,2,4,3],[4,3,5,3],[5,3,5,4],[5,4,6,4],
  [6,4,6,5],[6,5,6,6],[6,6,7,6],[4,0,4,1],[5,1,5,2],[6,2,7,2],[0,5,1,5],[1,5,1,6],
  [1,6,2,6],[2,6,2,7],[3,6,3,7],[4,6,4,7],[5,6,5,7],
];

function wallsSet() {
  const s = new Set<string>();
  WALLS.forEach(([r1,c1,r2,c2]) => { s.add(`${r1},${c1}-${r2},${c2}`); s.add(`${r2},${c2}-${r1},${c1}`); });
  return s;
}
const WS = wallsSet();

function hasWall(r1: number, c1: number, r2: number, c2: number) {
  return WS.has(`${r1},${c1}-${r2},${c2}`);
}

const TRASH_POS = [[2,2],[4,5],[6,1],[1,7],[5,0]];

export default function WhirlpoolMaze() {
  const [pos, setPos] = useState([0, 0]);
  const [collected, setCollected] = useState<string[]>([]);
  const [won, setWon] = useState(false);

  const move = useCallback((dr: number, dc: number) => {
    setPos(([r, c]) => {
      const nr = r + dr;
      const nc = c + dc;
      if (nr < 0 || nr >= ROWS || nc < 0 || nc >= COLS) return [r, c];
      if (hasWall(r, c, nr, nc)) return [r, c];
      const key = `${nr},${nc}`;
      if (TRASH_POS.some(([tr, tc]) => `${tr},${tc}` === key)) {
        setCollected((prev) => prev.includes(key) ? prev : [...prev, key]);
      }
      if (nr === ROWS - 1 && nc === COLS - 1) setTimeout(() => setWon(true), 200);
      return [nr, nc];
    });
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowUp") move(-1, 0);
      if (e.key === "ArrowDown") move(1, 0);
      if (e.key === "ArrowLeft") move(0, -1);
      if (e.key === "ArrowRight") move(0, 1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [move]);

  const reset = () => { setPos([0, 0]); setCollected([]); setWon(false); };
  if (won) return <WinScreen message="You escaped the whirlpool!" score={`${collected.length}/${TRASH_POS.length} bonus litter collected!`} onReset={reset} />;

  return (
    <div className="max-w-sm mx-auto text-center">
      <p className="text-white text-xl font-bold mb-1" style={{ fontFamily: "'Fredoka One', cursive" }}>
        Reach the exit! Litter: {collected.length}/{TRASH_POS.length}
      </p>
      <p className="text-cyan-200 text-xs mb-3" style={{ fontFamily: "'Fredoka One', cursive" }}>
        Use arrow keys or buttons below to move Potli!
      </p>

      <div className="overflow-auto">
        <div className="inline-block rounded-2xl overflow-hidden border-4 border-white/40"
          style={{ background: "rgba(0,60,120,0.8)" }}>
          {Array.from({ length: ROWS }, (_, r) => (
            <div key={r} className="flex">
              {Array.from({ length: COLS }, (_, c) => {
                const isPlayer = pos[0] === r && pos[1] === c;
                const isExit = r === ROWS - 1 && c === COLS - 1;
                const key = `${r},${c}`;
                const isTrash = TRASH_POS.some(([tr, tc]) => tr === r && tc === c);
                const isCollected = collected.includes(key);
                return (
                  <div key={c} className="flex items-center justify-center relative"
                    style={{
                      width: CELL, height: CELL,
                      borderRight: hasWall(r, c, r, c + 1) ? "3px solid rgba(255,255,255,0.4)" : "1px solid rgba(255,255,255,0.05)",
                      borderBottom: hasWall(r, c, r + 1, c) ? "3px solid rgba(255,255,255,0.4)" : "1px solid rgba(255,255,255,0.05)",
                      background: isExit ? "rgba(6,214,160,0.3)" : isPlayer ? "rgba(255,255,0,0.1)" : "transparent",
                    }}>
                    {isPlayer ? <span className="text-2xl">🐙</span>
                      : isExit ? <span className="text-2xl">🚪</span>
                      : isTrash && !isCollected ? <span className="text-lg">🗑️</span>
                      : isCollected ? <span className="text-sm opacity-50">✅</span>
                      : null}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2 max-w-36 mx-auto mt-4">
        <div />
        <button onClick={() => move(-1, 0)} data-testid="btn-up"
          className="py-3 rounded-2xl bg-white/20 text-white font-bold text-xl border-2 border-white/30 active:scale-90">▲</button>
        <div />
        <button onClick={() => move(0, -1)} data-testid="btn-left"
          className="py-3 rounded-2xl bg-white/20 text-white font-bold text-xl border-2 border-white/30 active:scale-90">◀</button>
        <button onClick={() => move(1, 0)} data-testid="btn-down"
          className="py-3 rounded-2xl bg-white/20 text-white font-bold text-xl border-2 border-white/30 active:scale-90">▼</button>
        <button onClick={() => move(0, 1)} data-testid="btn-right"
          className="py-3 rounded-2xl bg-white/20 text-white font-bold text-xl border-2 border-white/30 active:scale-90">▶</button>
      </div>
    </div>
  );
}
