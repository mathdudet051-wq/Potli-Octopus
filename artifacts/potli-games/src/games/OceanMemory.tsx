import { useState, useEffect } from "react";
import WinScreen from "./WinScreen";
import { useLang } from "@/LangContext";

const CREATURES = ["🐠","🐙","🦀","🐳","🦑","🐬","🦈","🌊"];

type Card = { id: number; emoji: string; flipped: boolean; matched: boolean };

function shuffle<T>(arr: T[]): T[] {
  return [...arr].sort(() => Math.random() - 0.5);
}

export default function OceanMemory() {
  const { lang, gameT } = useLang();
  const gm = gameT.oceanMemory as any;
  const [cards, setCards] = useState<Card[]>([]);
  const [selected, setSelected] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [won, setWon] = useState(false);

  const init = () => {
    setCards(shuffle([...CREATURES, ...CREATURES]).map((emoji, i) => ({ id: i, emoji, flipped: false, matched: false })));
    setSelected([]); setMoves(0); setWon(false);
  };
  useEffect(() => { init(); }, []);

  useEffect(() => {
    if (selected.length === 2) {
      const [a, b] = selected;
      setMoves((m) => m + 1);
      if (cards[a].emoji === cards[b].emoji) {
        setCards((prev) => prev.map((c, i) => i === a || i === b ? { ...c, matched: true } : c));
        setSelected([]);
      } else {
        setTimeout(() => {
          setCards((prev) => prev.map((c, i) => i === a || i === b ? { ...c, flipped: false } : c));
          setSelected([]);
        }, 900);
      }
    }
  }, [selected]);

  useEffect(() => { if (cards.length > 0 && cards.every((c) => c.matched)) setWon(true); }, [cards]);

  const flip = (idx: number) => {
    if (selected.length === 2 || cards[idx].flipped || cards[idx].matched) return;
    setCards((prev) => prev.map((c, i) => i === idx ? { ...c, flipped: true } : c));
    setSelected((prev) => [...prev, idx]);
  };

  const movesLabel = lang === "hi" ? `चालें: ${moves} — ${gm.instruction}` : `Moves: ${moves} — ${gm.instruction}`;

  if (won) return <WinScreen message={gm.winMessage} score={gm.winScore(moves)} onReset={init} />;

  return (
    <div className="max-w-sm mx-auto">
      <p className="text-white text-center mb-4 text-lg" style={{ fontFamily: "'Fredoka One', cursive" }}>
        {movesLabel}
      </p>
      <div className="grid grid-cols-4 gap-2 sm:gap-3">
        {cards.map((card, idx) => (
          <button key={card.id} data-testid={`card-${card.id}`} onClick={() => flip(idx)}
            className="aspect-square rounded-2xl text-3xl sm:text-4xl flex items-center justify-center shadow-lg transition-all duration-200 active:scale-95"
            style={{
              background: card.flipped || card.matched ? "white" : "linear-gradient(135deg, #023e8a, #0096c7)",
              border: card.matched ? "3px solid #06d6a0" : "3px solid rgba(255,255,255,0.2)",
            }}>
            {(card.flipped || card.matched) ? card.emoji : "🌊"}
          </button>
        ))}
      </div>
    </div>
  );
}
