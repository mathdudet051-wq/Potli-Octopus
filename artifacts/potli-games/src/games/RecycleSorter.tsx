import { useState } from "react";
import WinScreen from "./WinScreen";

const ITEMS = [
  { emoji: "🍌", label: "Banana Peel", bin: "green" },
  { emoji: "🥤", label: "Plastic Bottle", bin: "blue" },
  { emoji: "📰", label: "Newspaper", bin: "blue" },
  { emoji: "🫙", label: "Glass Jar", bin: "yellow" },
  { emoji: "🍎", label: "Apple Core", bin: "green" },
  { emoji: "📦", label: "Cardboard Box", bin: "blue" },
  { emoji: "🫙", label: "Metal Can", bin: "yellow" },
  { emoji: "🌿", label: "Leaves", bin: "green" },
  { emoji: "🧴", label: "Shampoo Bottle", bin: "blue" },
  { emoji: "🍷", label: "Glass Bottle", bin: "yellow" },
];

const BINS = [
  { id: "green", label: "Organic", emoji: "🟢", color: "#2d6a4f" },
  { id: "blue", label: "Plastic/Paper", emoji: "🔵", color: "#1d3557" },
  { id: "yellow", label: "Glass/Metal", emoji: "🟡", color: "#e9c46a" },
];

export default function RecycleSorter() {
  const [current, setCurrent] = useState(0);
  const [correct, setCorrect] = useState(0);
  const [feedback, setFeedback] = useState<"correct" | "wrong" | null>(null);
  const [won, setWon] = useState(false);

  const item = ITEMS[current];

  const guess = (binId: string) => {
    if (feedback) return;
    const isCorrect = binId === item.bin;
    setFeedback(isCorrect ? "correct" : "wrong");
    if (isCorrect) setCorrect((c) => c + 1);
    setTimeout(() => {
      setFeedback(null);
      if (current + 1 >= ITEMS.length) {
        setWon(true);
      } else {
        setCurrent((c) => c + 1);
      }
    }, 900);
  };

  const reset = () => { setCurrent(0); setCorrect(0); setFeedback(null); setWon(false); };

  if (won) return <WinScreen message="Great sorting!" score={`${correct}/${ITEMS.length} correct!`} onReset={reset} />;

  return (
    <div className="max-w-md mx-auto text-center">
      <p className="text-white text-lg mb-1" style={{ fontFamily: "'Fredoka One', cursive" }}>
        Item {current + 1} of {ITEMS.length}
      </p>
      <div className="bg-white/20 rounded-3xl p-8 mb-6 relative" style={{ minHeight: 140 }}>
        <div className="text-8xl mb-2">{item.emoji}</div>
        <p className="text-white text-2xl font-bold" style={{ fontFamily: "'Fredoka One', cursive" }}>{item.label}</p>
        {feedback && (
          <div className="absolute inset-0 flex items-center justify-center rounded-3xl text-6xl"
            style={{ background: feedback === "correct" ? "rgba(0,200,0,0.4)" : "rgba(255,0,0,0.4)" }}>
            {feedback === "correct" ? "✅" : "❌"}
          </div>
        )}
      </div>
      <p className="text-white mb-3" style={{ fontFamily: "'Fredoka One', cursive" }}>Which bin does this go in?</p>
      <div className="grid grid-cols-3 gap-3">
        {BINS.map((bin) => (
          <button key={bin.id} data-testid={`bin-${bin.id}`} onClick={() => guess(bin.id)}
            className="py-4 rounded-3xl text-white font-bold text-sm shadow-lg active:scale-95 transition-transform"
            style={{ background: bin.color, fontFamily: "'Fredoka One', cursive" }}>
            <div className="text-3xl mb-1">{bin.emoji}</div>
            {bin.label}
          </button>
        ))}
      </div>
      <p className="text-yellow-300 mt-4 text-lg" style={{ fontFamily: "'Fredoka One', cursive" }}>
        Score: {correct} correct
      </p>
    </div>
  );
}
