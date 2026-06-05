import { useState, useCallback } from "react";
import WinScreen from "./WinScreen";
import { useLang } from "@/LangContext";

const GRID = 6;
const ROUNDS = 3;

function makeGrid() {
  return Array.from({ length: GRID * GRID }, (_, i) => ({
    id: i, dirty: Math.random() < 0.45, cleaned: false,
  }));
}

export default function OilCleanup() {
  const { lang, common, gameT } = useLang();
  const gm = gameT.oilCleanup as any;
  const [tiles, setTiles] = useState(makeGrid);
  const [round, setRound] = useState(1);
  const [won, setWon] = useState(false);

  const clean = useCallback((id: number) => {
    setTiles((prev) => {
      const next = prev.map((t) => t.id === id && t.dirty && !t.cleaned ? { ...t, cleaned: true } : t);
      const allClean = next.every((t) => !t.dirty || t.cleaned);
      if (allClean) {
        if (round >= ROUNDS) setWon(true);
        else setTimeout(() => { setRound((r) => r + 1); setTiles(makeGrid()); }, 600);
      }
      return next;
    });
  }, [round]);

  const reset = () => { setTiles(makeGrid()); setRound(1); setWon(false); };
  if (won) return <WinScreen message={gm.winMessage} score={gm.winScore(ROUNDS)} onReset={reset} />;

  const dirty = tiles.filter((t) => t.dirty && !t.cleaned).length;
  const dirtyLabel = lang === "hi" ? `गंदी टाइलें: ${dirty}` : `Dirty tiles: ${dirty}`;

  return (
    <div className="max-w-md mx-auto text-center">
      <p className="text-white text-xl font-bold mb-1" style={{ fontFamily: "'Fredoka One', cursive" }}>
        {common.round} {round}/{ROUNDS} — {dirtyLabel}
      </p>
      <p className="text-cyan-200 mb-4 text-sm" style={{ fontFamily: "'Fredoka One', cursive" }}>{gm.instruction}</p>
      <div className="grid gap-2 mx-auto" style={{ gridTemplateColumns: `repeat(${GRID}, 1fr)`, maxWidth: 360 }}>
        {tiles.map((t) => (
          <button key={t.id} data-testid={`tile-${t.id}`} onClick={() => clean(t.id)}
            disabled={t.cleaned || !t.dirty}
            className="aspect-square rounded-xl border-2 transition-all duration-300 active:scale-90"
            style={{
              background: t.cleaned ? "linear-gradient(135deg, #90e0ef, #48cae4)" : t.dirty ? "linear-gradient(135deg, #2d2d2d, #4a3c00)" : "linear-gradient(135deg, #0096c7, #00b4d8)",
              borderColor: t.cleaned ? "#06d6a0" : t.dirty ? "#6b4c00" : "#023e8a",
              cursor: t.dirty && !t.cleaned ? "pointer" : "default",
            }}>
            {t.dirty && !t.cleaned ? "🛢️" : t.cleaned ? "💧" : "🌊"}
          </button>
        ))}
      </div>
    </div>
  );
}
