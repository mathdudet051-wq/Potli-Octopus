import { useState, useMemo } from "react";
import WinScreen from "./WinScreen";
import { useLang } from "@/LangContext";

const WORDS = ["OCEAN","POTLI","CLEAN","EARTH","CORAL"];
const HINTS_EN = ["The great blue sea","Our octopus hero","Keep the ocean clean","Our beautiful planet","Underwater gardens"];
const HINTS_HI = ["महान नीला समुद्र","हमारा ऑक्टोपस हीरो","समुद्र को साफ़ रखो","हमारी सुंदर धरती","पानी के अंदर का बगीचा"];

function shuffle<T>(arr: T[]): T[] { return [...arr].sort(() => Math.random() - 0.5); }

export default function OceanAlphabet() {
  const { lang, gameT } = useLang();
  const gm = gameT.oceanAlphabet as any;
  const [wordIdx, setWordIdx] = useState(0);
  const [typed, setTyped] = useState<string[]>([]);
  const [shake, setShake] = useState(false);
  const [pool, setPool] = useState(() => shuffle(WORDS[0].split("").map((l, i) => ({ l, id: i + Math.random() }))));
  const [available, setAvailable] = useState(pool);
  const [won, setWon] = useState(false);

  const word = WORDS[wordIdx];

  const resetWord = (idx: number) => {
    const w = WORDS[idx];
    const l = shuffle(w.split("").map((ch, i) => ({ l: ch, id: i + Math.random() })));
    setTyped([]); setPool(l); setAvailable(l); setWordIdx(idx);
  };

  const tap = (item: { l: string; id: number }) => {
    const nextTyped = [...typed, item.l];
    setTyped(nextTyped);
    setAvailable((prev) => prev.filter((x) => x.id !== item.id));
    if (nextTyped.join("") === word) {
      setTimeout(() => {
        const nextIdx = wordIdx + 1;
        if (nextIdx >= WORDS.length) setWon(true);
        else resetWord(nextIdx);
      }, 600);
    } else if (nextTyped.some((ch, i) => ch !== word[i])) {
      setShake(true);
      setTimeout(() => {
        setShake(false); setTyped([]);
        const l = shuffle(word.split("").map((ch, i) => ({ l: ch, id: i + Math.random() })));
        setPool(l); setAvailable(l);
      }, 700);
    }
  };

  const reset = () => { setWon(false); resetWord(0); };
  if (won) return <WinScreen message={gm.winMessage} score={gm.winScore(WORDS.length)} onReset={reset} />;

  return (
    <div className="max-w-sm mx-auto text-center">
      <p className="text-white text-xl font-bold mb-1" style={{ fontFamily: "'Fredoka One', cursive" }}>
        {lang === "hi" ? `शब्द ${wordIdx + 1}/${WORDS.length}` : `Word ${wordIdx + 1}/${WORDS.length}`}
      </p>
      <p className="text-cyan-200 text-sm mb-4" style={{ fontFamily: "'Fredoka One', cursive" }}>{gm.instruction}</p>
      <div className="flex gap-2 justify-center mb-4">
        {word.split("").map((ch, i) => (
          <div key={i} className="w-11 h-11 rounded-xl border-4 flex items-center justify-center text-2xl font-bold transition-all"
            style={{
              borderColor: typed[i] ? "#06d6a0" : "rgba(255,255,255,0.4)",
              background: typed[i] === ch ? "#06d6a0" : typed[i] && typed[i] !== ch ? "#e63946" : "rgba(255,255,255,0.1)",
              color: "white", fontFamily: "'Fredoka One', cursive",
              animation: shake ? "shakeX 0.5s ease" : undefined,
            }}>
            {typed[i] || ""}
          </div>
        ))}
      </div>
      <div className="bg-white/10 rounded-2xl px-4 py-2 mb-4 inline-block">
        <span className="text-yellow-300 text-sm font-bold" style={{ fontFamily: "'Fredoka One', cursive" }}>
          {lang === "hi" ? `सुझाव: ${HINTS_HI[wordIdx]}` : `Hint: ${HINTS_EN[wordIdx]}`}
        </span>
      </div>
      <div className="flex flex-wrap gap-3 justify-center">
        {pool.map((item) => {
          const used = !available.find((x) => x.id === item.id);
          return (
            <button key={item.id} onClick={() => !used && tap(item)} disabled={used}
              className="w-12 h-12 rounded-2xl text-2xl font-bold shadow-lg transition-all active:scale-90"
              style={{
                background: used ? "rgba(255,255,255,0.1)" : "linear-gradient(135deg, #f72585, #7209b7)",
                color: used ? "rgba(255,255,255,0.3)" : "white",
                border: used ? "3px solid rgba(255,255,255,0.1)" : "3px solid rgba(255,255,255,0.4)",
                cursor: used ? "default" : "pointer", fontFamily: "'Fredoka One', cursive",
              }}>
              {item.l}
            </button>
          );
        })}
      </div>
      <style>{`
        @keyframes shakeX { 0%,100%{transform:translateX(0)} 20%,60%{transform:translateX(-8px)} 40%,80%{transform:translateX(8px)} }
      `}</style>
    </div>
  );
}
