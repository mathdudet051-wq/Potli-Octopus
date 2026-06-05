import { useState } from "react";
import WinScreen from "./WinScreen";
import { useLang } from "@/LangContext";

const SIZES = [
  { id: "tiny",   labelEn: "Tiny",   labelHi: "बहुत छोटा", emoji: "✨", size: 24 },
  { id: "small",  labelEn: "Small",  labelHi: "छोटा",      emoji: "⭐", size: 32 },
  { id: "medium", labelEn: "Medium", labelHi: "मध्यम",     emoji: "🌟", size: 44 },
  { id: "large",  labelEn: "Large",  labelHi: "बड़ा",       emoji: "💫", size: 56 },
];
const TOTAL = 12;

function makeSF() {
  return Array.from({ length: TOTAL }, (_, i) => ({
    id: i, size: SIZES[Math.floor(Math.random() * SIZES.length)], sorted: false,
  }));
}

export default function StarfishSorter() {
  const { lang, gameT } = useLang();
  const gm = gameT.starfishSort as any;
  const [starfish, setStarfish] = useState(makeSF);
  const [dragging, setDragging] = useState<number | null>(null);
  const [correct, setCorrect] = useState(0);
  const [feedback, setFeedback] = useState<{ zone: string; ok: boolean } | null>(null);
  const [won, setWon] = useState(false);

  const drop = (zoneId: string) => {
    if (dragging === null) return;
    const sf = starfish.find((s) => s.id === dragging);
    if (!sf || sf.sorted) return;
    const ok = sf.size.id === zoneId;
    setFeedback({ zone: zoneId, ok });
    if (ok) {
      setCorrect((c) => c + 1);
      setStarfish((prev) => {
        const next = prev.map((s) => s.id === dragging ? { ...s, sorted: true } : s);
        if (next.every((s) => s.sorted)) setTimeout(() => setWon(true), 400);
        return next;
      });
    }
    setTimeout(() => setFeedback(null), 600);
    setDragging(null);
  };

  const reset = () => { setStarfish(makeSF()); setDragging(null); setCorrect(0); setFeedback(null); setWon(false); };
  if (won) return <WinScreen message={gm.winMessage} score={gm.winScore(`${correct}/${TOTAL}`)} onReset={reset} />;
  const unsorted = starfish.filter((s) => !s.sorted);

  return (
    <div className="max-w-sm mx-auto text-center">
      <p className="text-white text-xl font-bold mb-1" style={{ fontFamily: "'Fredoka One', cursive" }}>
        {lang === "hi" ? `छाँटे: ${correct}/${TOTAL}` : `Sorted: ${correct}/${TOTAL}`}
      </p>
      <p className="text-cyan-200 text-sm mb-3" style={{ fontFamily: "'Fredoka One', cursive" }}>{gm.instruction}</p>
      <div className="flex flex-wrap gap-3 justify-center mb-4 bg-white/10 rounded-2xl p-4 min-h-20">
        {unsorted.map((sf) => (
          <div key={sf.id} draggable onDragStart={() => setDragging(sf.id)} onDragEnd={() => setDragging(null)}
            className="cursor-grab active:cursor-grabbing select-none transition-transform hover:scale-125"
            style={{ fontSize: sf.size.size }}>
            ⭐
          </div>
        ))}
        {unsorted.length === 0 && (
          <p className="text-white/50 self-center" style={{ fontFamily: "'Fredoka One', cursive" }}>
            {lang === "hi" ? "सब छँट गया!" : "All sorted!"}
          </p>
        )}
      </div>
      <div className="grid grid-cols-2 gap-3">
        {SIZES.map((sz) => (
          <div key={sz.id} data-testid={`zone-${sz.id}`}
            onDragOver={(e) => e.preventDefault()} onDrop={() => drop(sz.id)}
            className="rounded-3xl p-4 border-4 flex flex-col items-center min-h-24 transition-all"
            style={{
              background: "rgba(255,255,255,0.1)",
              borderColor: feedback?.zone === sz.id ? (feedback.ok ? "#06d6a0" : "#e63946") : "rgba(255,255,255,0.3)",
            }}>
            <span className="text-white font-bold text-sm mb-1" style={{ fontFamily: "'Fredoka One', cursive" }}>
              {lang === "hi" ? sz.labelHi : sz.labelEn}
            </span>
            <span style={{ fontSize: sz.size }}>{sz.emoji}</span>
            <span className="text-yellow-300 text-xs mt-1" style={{ fontFamily: "'Fredoka One', cursive" }}>
              {starfish.filter((s) => s.sorted && s.size.id === sz.id).length}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
