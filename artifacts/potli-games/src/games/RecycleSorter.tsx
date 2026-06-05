import { useState } from "react";
import WinScreen from "./WinScreen";
import { useLang } from "@/LangContext";

const ITEMS = [
  { emoji: "🍌", labelEn: "Banana Peel",     labelHi: "केले का छिलका",    bin: "green" },
  { emoji: "🥤", labelEn: "Plastic Bottle",  labelHi: "प्लास्टिक बोतल",   bin: "blue" },
  { emoji: "📰", labelEn: "Newspaper",        labelHi: "अख़बार",            bin: "blue" },
  { emoji: "🫙", labelEn: "Glass Jar",        labelHi: "काँच का जार",      bin: "yellow" },
  { emoji: "🍎", labelEn: "Apple Core",       labelHi: "सेब का गुठली",     bin: "green" },
  { emoji: "📦", labelEn: "Cardboard Box",    labelHi: "गत्ते का डिब्बा",  bin: "blue" },
  { emoji: "🫙", labelEn: "Metal Can",        labelHi: "धातु का डिब्बा",   bin: "yellow" },
  { emoji: "🌿", labelEn: "Leaves",           labelHi: "पत्तियाँ",         bin: "green" },
  { emoji: "🧴", labelEn: "Shampoo Bottle",   labelHi: "शैम्पू की बोतल",  bin: "blue" },
  { emoji: "🍷", labelEn: "Glass Bottle",     labelHi: "काँच की बोतल",    bin: "yellow" },
];

const BINS = [
  { id: "green",  labelEn: "Organic",       labelHi: "जैविक",        emoji: "🟢", color: "#2d6a4f" },
  { id: "blue",   labelEn: "Plastic/Paper", labelHi: "प्लास्टिक/काग़ज़", emoji: "🔵", color: "#1d3557" },
  { id: "yellow", labelEn: "Glass/Metal",   labelHi: "काँच/धातु",    emoji: "🟡", color: "#e9c46a" },
];

export default function RecycleSorter() {
  const { lang, common, gameT } = useLang();
  const gm = gameT.recycleSorter as any;
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
      if (current + 1 >= ITEMS.length) setWon(true);
      else setCurrent((c) => c + 1);
    }, 900);
  };

  const reset = () => { setCurrent(0); setCorrect(0); setFeedback(null); setWon(false); };

  if (won) return <WinScreen message={gm.winMessage} score={gm.winScore(`${correct}/${ITEMS.length}`)} onReset={reset} />;

  return (
    <div className="max-w-md mx-auto text-center">
      <p className="text-white text-lg mb-1" style={{ fontFamily: "'Fredoka One', cursive" }}>
        {lang === "hi" ? `चीज़ ${current + 1} / ${ITEMS.length}` : `Item ${current + 1} of ${ITEMS.length}`}
      </p>
      <div className="bg-white/20 rounded-3xl p-8 mb-6 relative" style={{ minHeight: 140 }}>
        <div className="text-8xl mb-2">{item.emoji}</div>
        <p className="text-white text-2xl font-bold" style={{ fontFamily: "'Fredoka One', cursive" }}>
          {lang === "hi" ? item.labelHi : item.labelEn}
        </p>
        {feedback && (
          <div className="absolute inset-0 flex items-center justify-center rounded-3xl text-6xl"
            style={{ background: feedback === "correct" ? "rgba(0,200,0,0.4)" : "rgba(255,0,0,0.4)" }}>
            {feedback === "correct" ? "✅" : "❌"}
          </div>
        )}
      </div>
      <p className="text-white mb-3" style={{ fontFamily: "'Fredoka One', cursive" }}>{gm.instruction}</p>
      <div className="grid grid-cols-3 gap-3">
        {BINS.map((bin) => (
          <button key={bin.id} data-testid={`bin-${bin.id}`} onClick={() => guess(bin.id)}
            className="py-4 rounded-3xl text-white font-bold text-sm shadow-lg active:scale-95 transition-transform"
            style={{ background: bin.color, fontFamily: "'Fredoka One', cursive" }}>
            <div className="text-3xl mb-1">{bin.emoji}</div>
            {lang === "hi" ? bin.labelHi : bin.labelEn}
          </button>
        ))}
      </div>
      <p className="text-yellow-300 mt-4 text-lg" style={{ fontFamily: "'Fredoka One', cursive" }}>
        {common.score}: {correct}
      </p>
    </div>
  );
}
