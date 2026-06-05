import { useState } from "react";
import WinScreen from "./WinScreen";
import { useLang } from "@/LangContext";

const SWAPS = [
  { bad: { emoji: "🥤", en: "Plastic Bottle", hi: "प्लास्टिक बोतल" }, good: { emoji: "🫗", en: "Reusable Bottle", hi: "पुन:उपयोगी बोतल" } },
  { bad: { emoji: "🛍️", en: "Plastic Bag",    hi: "प्लास्टिक थैली"  }, good: { emoji: "👜", en: "Tote Bag",        hi: "कपड़े की थैली" } },
  { bad: { emoji: "🥄", en: "Plastic Straw",  hi: "प्लास्टिक स्ट्रॉ"}, good: { emoji: "🎋", en: "Bamboo Straw",    hi: "बाँस का स्ट्रॉ" } },
  { bad: { emoji: "🍽️", en: "Plastic Plate",  hi: "प्लास्टिक प्लेट" }, good: { emoji: "🪵", en: "Bamboo Plate",    hi: "बाँस की प्लेट" } },
  { bad: { emoji: "🧴", en: "Plastic Soap",   hi: "प्लास्टिक साबुन" }, good: { emoji: "🧼", en: "Soap Bar",        hi: "साबुन बार" } },
  { bad: { emoji: "🥡", en: "Takeaway Box",   hi: "टेकअवे बॉक्स"   }, good: { emoji: "🍱", en: "Lunchbox",        hi: "लंचबॉक्स" } },
];

export default function PlasticFreeHero() {
  const { lang, gameT } = useLang();
  const gm = gameT.plasticFree as any;
  const [current, setCurrent] = useState(0);
  const [swapped, setSwapped] = useState(false);
  const [won, setWon] = useState(false);

  const doSwap = () => {
    if (swapped) return;
    setSwapped(true);
    setTimeout(() => {
      const next = current + 1;
      if (next >= SWAPS.length) setWon(true);
      else { setCurrent(next); setSwapped(false); }
    }, 800);
  };

  const reset = () => { setCurrent(0); setSwapped(false); setWon(false); };
  if (won) return <WinScreen message={gm.winMessage} score={gm.winScore(SWAPS.length)} onReset={reset} />;

  const s = SWAPS[current];
  const label = (item: { en: string; hi: string }) => lang === "hi" ? item.hi : item.en;

  return (
    <div className="max-w-sm mx-auto text-center">
      <p className="text-white text-xl font-bold mb-1" style={{ fontFamily: "'Fredoka One', cursive" }}>
        {lang === "hi" ? `बदलाव ${current + 1} / ${SWAPS.length}` : `Swap ${current + 1} of ${SWAPS.length}`}
      </p>
      <p className="text-cyan-200 text-sm mb-4" style={{ fontFamily: "'Fredoka One', cursive" }}>{gm.instruction}</p>
      <div className="flex items-center justify-center gap-4 mb-6">
        <div className="flex flex-col items-center bg-red-500/30 rounded-3xl p-5 border-4 border-red-400 flex-1">
          <span className="text-7xl mb-2">{swapped ? s.good.emoji : s.bad.emoji}</span>
          <span className="text-white font-bold text-sm" style={{ fontFamily: "'Fredoka One', cursive" }}>
            {swapped ? label(s.good) : label(s.bad)}
          </span>
          {swapped && <span className="text-green-300 text-xs mt-1" style={{ fontFamily: "'Fredoka One', cursive" }}>{gm.ecoSwapped}</span>}
        </div>
        <div className="text-4xl">{swapped ? "✅" : "➡️"}</div>
        <div className="flex flex-col items-center bg-green-500/30 rounded-3xl p-5 border-4 border-green-400 flex-1">
          <span className="text-7xl mb-2" style={{ opacity: swapped ? 1 : 0.3 }}>{s.good.emoji}</span>
          <span className="text-white font-bold text-sm" style={{ fontFamily: "'Fredoka One', cursive", opacity: swapped ? 1 : 0.5 }}>
            {label(s.good)}
          </span>
          {!swapped && <span className="text-cyan-300 text-xs mt-1" style={{ fontFamily: "'Fredoka One', cursive" }}>{gm.ecoChoice}</span>}
        </div>
      </div>
      {!swapped ? (
        <button data-testid="btn-swap" onClick={doSwap}
          className="w-full py-5 rounded-3xl text-white font-bold text-2xl shadow-lg active:scale-95 transition-transform"
          style={{ background: "linear-gradient(135deg, #06d6a0, #028090)", fontFamily: "'Fredoka One', cursive" }}>
          {gm.swapBtn}
        </button>
      ) : (
        <div className="py-5 rounded-3xl bg-green-500/30 border-2 border-green-400 text-green-300 font-bold text-xl"
          style={{ fontFamily: "'Fredoka One', cursive" }}>{gm.swapped}</div>
      )}
      <div className="flex gap-1 justify-center mt-4">
        {SWAPS.map((_, i) => (
          <div key={i} className="w-4 h-4 rounded-full border-2 border-white/50"
            style={{ background: i < current ? "#06d6a0" : i === current ? "#ffd60a" : "rgba(255,255,255,0.2)" }} />
        ))}
      </div>
    </div>
  );
}
