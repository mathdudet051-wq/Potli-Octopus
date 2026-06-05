import { useState } from "react";
import WinScreen from "./WinScreen";
import { useLang } from "@/LangContext";

const FRIENDS = [
  { id: "swifty", emoji: "🐠", nameEn: "Swifty", nameHi: "स्विफ्टी" },
  { id: "tara",   emoji: "🐢", nameEn: "Tara",   nameHi: "तारा" },
  { id: "gloei",  emoji: "🐟", nameEn: "Gloei",  nameHi: "ग्लोई" },
  { id: "tutu",   emoji: "🦀", nameEn: "Tutu",   nameHi: "टुटु" },
  { id: "jiffi",  emoji: "🦑", nameEn: "Jiffi",  nameHi: "जिफ़ी" },
];

export default function EcoGangRescue() {
  const { lang, gameT } = useLang();
  const gm = gameT.ecoGang as any;
  const [freed, setFreed] = useState<string[]>([]);
  const [freeing, setFreeing] = useState<string | null>(null);
  const [won, setWon] = useState(false);

  const free = (id: string) => {
    if (freed.includes(id) || freeing) return;
    setFreeing(id);
    setTimeout(() => {
      setFreed((prev) => {
        const next = [...prev, id];
        if (next.length >= FRIENDS.length) setTimeout(() => setWon(true), 500);
        return next;
      });
      setFreeing(null);
    }, 700);
  };

  const reset = () => { setFreed([]); setFreeing(null); setWon(false); };
  if (won) return <WinScreen message={gm.winMessage} score={gm.winScore(5)} onReset={reset} />;

  return (
    <div className="max-w-md mx-auto text-center">
      <img src="/potli.jpg" alt="Potli" className="w-20 h-20 mx-auto rounded-full border-4 border-yellow-400 object-cover mb-3" />
      <p className="text-white text-xl font-bold mb-1" style={{ fontFamily: "'Fredoka One', cursive" }}>
        {lang === "hi" ? `बचाए: ${freed.length}/${FRIENDS.length}` : `Freed: ${freed.length}/${FRIENDS.length}`}
      </p>
      <p className="text-cyan-200 text-sm mb-6" style={{ fontFamily: "'Fredoka One', cursive" }}>{gm.instruction}</p>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {FRIENDS.map((f) => {
          const isFree = freed.includes(f.id);
          const isFreeing = freeing === f.id;
          return (
            <button key={f.id} data-testid={`friend-${f.id}`} onClick={() => free(f.id)}
              disabled={isFree || !!freeing}
              className="rounded-3xl p-5 flex flex-col items-center gap-2 transition-all duration-300 active:scale-95 border-4"
              style={{
                background: isFree ? "rgba(6,214,160,0.3)" : "rgba(0,0,0,0.4)",
                borderColor: isFree ? "#06d6a0" : "rgba(255,255,255,0.3)",
                cursor: isFree ? "default" : "pointer",
                transform: isFreeing ? "scale(1.2)" : undefined,
              }}>
              <div className="relative">
                <span className="text-6xl">{f.emoji}</span>
                {!isFree && <div className="absolute inset-0 flex items-center justify-center text-4xl opacity-70 pointer-events-none">🕸️</div>}
                {isFreeing && <div className="absolute inset-0 flex items-center justify-center text-3xl animate-ping">💥</div>}
              </div>
              <span className="text-white font-bold text-sm" style={{ fontFamily: "'Fredoka One', cursive" }}>
                {isFree ? gm.saved : (lang === "hi" ? f.nameHi : f.nameEn)}
              </span>
              {isFree && <span className="text-green-300 text-xs" style={{ fontFamily: "'Fredoka One', cursive" }}>{gm.yay}</span>}
            </button>
          );
        })}
      </div>
    </div>
  );
}
