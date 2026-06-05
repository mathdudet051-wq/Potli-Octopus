import { useState } from "react";
import WinScreen from "./WinScreen";
import { useLang } from "@/LangContext";

const DEPTHS = [
  { depth: 10,    creature: "🐠", nameEn: "Clownfish",      nameHi: "क्लाउनफ़िश",     factEn: "Clownfish live in sea anemones and help clean them!", factHi: "क्लाउनफ़िश समुद्री एनीमोन में रहती है और उसे साफ़ रखती है!" },
  { depth: 50,    creature: "🐢", nameEn: "Sea Turtle",     nameHi: "समुद्री कछुआ",   factEn: "Sea turtles can hold their breath for up to 7 hours!", factHi: "समुद्री कछुए 7 घंटे तक साँस रोक सकते हैं!" },
  { depth: 100,   creature: "🦑", nameEn: "Squid",          nameHi: "स्क्विड",         factEn: "Squids can change colour in milliseconds to camouflage!", factHi: "स्क्विड मिलीसेकंड में रंग बदल सकता है!" },
  { depth: 200,   creature: "🐬", nameEn: "Dolphin",        nameHi: "डॉल्फिन",         factEn: "Dolphins sleep with one eye open to watch for danger!", factHi: "डॉल्फिन एक आँख खोलकर सोती है!" },
  { depth: 500,   creature: "🦈", nameEn: "Shark",          nameHi: "शार्क",            factEn: "Sharks have been on Earth for over 400 million years!", factHi: "शार्क 40 करोड़ साल से पृथ्वी पर हैं!" },
  { depth: 1000,  creature: "🦑", nameEn: "Giant Squid",    nameHi: "विशाल स्क्विड",   factEn: "Giant squids can grow up to 13 metres long!", factHi: "विशाल स्क्विड 13 मीटर तक लंबा हो सकता है!" },
  { depth: 3000,  creature: "🐙", nameEn: "Deep Octopus",   nameHi: "गहरा ऑक्टोपस",   factEn: "Deep sea octopuses can glow in the dark!", factHi: "गहरे समुद्री ऑक्टोपस अंधेरे में चमकते हैं!" },
  { depth: 10000, creature: "🐡", nameEn: "Hadal Snailfish", nameHi: "हैडल स्नेलफ़िश", factEn: "The deepest fish lives 8km underwater in total darkness!", factHi: "सबसे गहरी मछली 8 किमी नीचे अँधेरे में रहती है!" },
];

export default function DeepSeaExplorer() {
  const { lang, gameT } = useLang();
  const gm = gameT.deepSea as any;
  const [level, setLevel] = useState(0);
  const [won, setWon] = useState(false);
  const [revealed, setRevealed] = useState(false);

  const dive = () => {
    if (!revealed) { setRevealed(true); return; }
    const next = level + 1;
    if (next >= DEPTHS.length) { setWon(true); return; }
    setLevel(next); setRevealed(false);
  };

  const reset = () => { setLevel(0); setWon(false); setRevealed(false); };
  if (won) return <WinScreen message={gm.winMessage} score={gm.winScore(DEPTHS.length)} onReset={reset} />;

  const d = DEPTHS[level];
  const darkness = Math.min(0.9, level * 0.1 + 0.1);

  return (
    <div className="max-w-sm mx-auto text-center">
      <p className="text-white text-xl font-bold mb-2" style={{ fontFamily: "'Fredoka One', cursive" }}>
        {lang === "hi" ? `गहराई: ${d.depth}मी — खोज ${level + 1}/${DEPTHS.length}` : `Depth: ${d.depth}m — Discovery ${level + 1}/${DEPTHS.length}`}
      </p>
      <div className="flex items-center gap-2 mb-4">
        <span className="text-white text-sm" style={{ fontFamily: "'Fredoka One', cursive" }}>{lang === "hi" ? "सतह" : "Surface"}</span>
        <div className="flex-1 bg-white/20 rounded-full h-4 overflow-hidden">
          <div className="h-full rounded-full transition-all duration-500"
            style={{ width: `${(level / (DEPTHS.length - 1)) * 100}%`, background: "linear-gradient(90deg, #90e0ef, #023e8a)" }} />
        </div>
        <span className="text-white text-sm" style={{ fontFamily: "'Fredoka One', cursive" }}>{lang === "hi" ? "गहरा" : "Deep"}</span>
      </div>
      <div className="relative rounded-3xl overflow-hidden border-4 border-white/30 mb-4"
        style={{ height: 260, background: `rgba(2,62,138,${darkness})` }}>
        <div className="absolute top-4 left-6 text-2xl opacity-30">🫧</div>
        <div className="absolute top-8 right-8 text-xl opacity-20">🫧</div>
        {revealed ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center p-4">
            <div className="text-8xl mb-3 animate-bounce">{d.creature}</div>
            <h3 className="text-white text-2xl font-bold mb-2" style={{ fontFamily: "'Fredoka One', cursive" }}>
              {lang === "hi" ? d.nameHi : d.nameEn}
            </h3>
            <p className="text-cyan-200 text-sm leading-tight" style={{ fontFamily: "'Fredoka One', cursive" }}>
              {lang === "hi" ? d.factHi : d.factEn}
            </p>
          </div>
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <div className="text-6xl mb-4 opacity-30">❓</div>
            <p className="text-white/60 text-lg" style={{ fontFamily: "'Fredoka One', cursive" }}>{gm.lurks}</p>
          </div>
        )}
      </div>
      <button data-testid="btn-dive" onClick={dive}
        className="w-full py-4 rounded-3xl text-white font-bold text-xl shadow-lg active:scale-95 transition-transform"
        style={{ background: "linear-gradient(135deg, #023e8a, #0077b6)", fontFamily: "'Fredoka One', cursive", border: "3px solid rgba(255,255,255,0.3)" }}>
        {gm.diveBtn(level, DEPTHS.length)}
      </button>
    </div>
  );
}
