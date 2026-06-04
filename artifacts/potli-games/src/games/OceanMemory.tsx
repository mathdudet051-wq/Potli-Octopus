import { useState, useEffect } from "react";
import WinScreen from "./WinScreen";

const CREATURES = ["🐠","🐙","🦀","🐳","🦑","🐬","🦈","🌊"];

type Card = { id: number; emoji: string; flipped: boolean; matched: boolean };

function shuffle<T>(arr: T[]): T[] {
  return [...arr].sort(() => Math.random() - 0.5);
}

export default function OceanMemory() {
  const [cards, setCards] = useState<Card[]>([]);
  const [selected, setSelected] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [won, setWon] = useState(false);

  const init = () => {
    const deck = shuffle([...CREATURES, ...CREATURES]).map((emoji, i) => ({
      id: i, emoji, flipped: false, matched: false,
    }));
    setCards(deck);
    setSelected([]);
    setMoves(0);
    setWon(false);
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

  useEffect(() => {
    if (cards.length > 0 && cards.every((c) => c.matched)) setWon(true);
  }, [cards]);

  const flip = (idx: number) => {
    if (selected.length === 2) return;
    if (cards[idx].flipped || cards[idx].matched) return;
    setCards((prev) => prev.map((c, i) => i === idx ? { ...c, flipped: true } : c));
    setSelected((prev) => [...prev, idx]);
  };

  if (won) return <WinScreen message="All pairs matched!" score={`${moves} moves!`} onReset={init} />;

  return (
    <div className="max-w-sm mx-auto">
      <p className="text-white text-center mb-4 text-lg" style={{ fontFamily: "'Fredoka One', cursive" }}>
        Moves: {moves} — Match all the sea creatures!
      </p>
      <div className="grid grid-cols-4 gap-3">
        {cards.map((card, idx) => (
          <button key={card.id} data-testid={`card-${card.id}`} onClick={() => flip(idx)}
            className="aspect-square rounded-2xl text-4xl flex items-center justify-center shadow-lg transition-all duration-200 active:scale-95"
            style={{
              background: card.flipped || card.matched ? "white" : "linear-gradient(135deg, #023e8a, #0096c7)",
              border: card.matched ? "3px solid #06d6a0" : "3px solid white/20",
              transform: card.flipped || card.matched ? "rotateY(0deg)" : "rotateY(180deg)",
            }}>
            {(card.flipped || card.matched) ? card.emoji : "🌊"}
          </button>
        ))}
      </div>
    </div>
  );
}
