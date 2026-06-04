import { useState, useMemo } from "react";
import WinScreen from "./WinScreen";

const WORDS = ["OCEAN","POTLI","CLEAN","EARTH","CORAL"];

function shuffle<T>(arr: T[]): T[] {
  return [...arr].sort(() => Math.random() - 0.5);
}

export default function OceanAlphabet() {
  const [wordIdx, setWordIdx] = useState(0);
  const [typed, setTyped] = useState<string[]>([]);
  const [won, setWon] = useState(false);
  const [shake, setShake] = useState(false);

  const word = WORDS[wordIdx];
  const letters = useMemo(() => shuffle(word.split("").map((l, i) => ({ l, id: i + Math.random() }))), [word]);
  const [available, setAvailable] = useState<typeof letters>(letters);
  const [pool, setPool] = useState(letters);

  const resetWord = (idx: number) => {
    const w = WORDS[idx];
    const l = shuffle(w.split("").map((ch, i) => ({ l: ch, id: i + Math.random() })));
    setTyped([]);
    setPool(l);
    setAvailable(l);
    setWordIdx(idx);
  };

  const tap = (item: { l: string; id: number }) => {
    const nextTyped = [...typed, item.l];
    setTyped(nextTyped);
    setAvailable((prev) => prev.filter((x) => x.id !== item.id));

    if (nextTyped.join("") === word) {
      setTimeout(() => {
        const nextIdx = wordIdx + 1;
        if (nextIdx >= WORDS.length) {
          setWon(true);
        } else {
          resetWord(nextIdx);
        }
      }, 600);
    } else if (nextTyped.some((ch, i) => ch !== word[i])) {
      setShake(true);
      setTimeout(() => {
        setShake(false);
        setTyped([]);
        const l = shuffle(word.split("").map((ch, i) => ({ l: ch, id: i + Math.random() })));
        setPool(l);
        setAvailable(l);
      }, 700);
    }
  };

  const reset = () => { setWon(false); resetWord(0); };

  if (won) return <WinScreen message="You spelled all the words!" score={`${WORDS.length} words spelled!`} onReset={reset} />;

  return (
    <div className="max-w-sm mx-auto text-center">
      <p className="text-white text-xl font-bold mb-1" style={{ fontFamily: "'Fredoka One', cursive" }}>
        Word {wordIdx + 1}/{WORDS.length}
      </p>
      <p className="text-cyan-200 text-sm mb-4" style={{ fontFamily: "'Fredoka One', cursive" }}>
        Tap the letters in the right order to spell the word!
      </p>

      {/* Target display */}
      <div className="flex gap-2 justify-center mb-4">
        {word.split("").map((ch, i) => (
          <div key={i} className="w-12 h-12 rounded-xl border-4 flex items-center justify-center text-2xl font-bold transition-all"
            style={{
              borderColor: typed[i] ? "#06d6a0" : "rgba(255,255,255,0.4)",
              background: typed[i] === ch ? "#06d6a0" : typed[i] && typed[i] !== ch ? "#e63946" : "rgba(255,255,255,0.1)",
              color: "white",
              fontFamily: "'Fredoka One', cursive",
              animation: shake ? "shakeX 0.5s ease" : undefined,
            }}>
            {typed[i] || ""}
          </div>
        ))}
      </div>

      {/* Hint */}
      <div className="bg-white/10 rounded-2xl px-4 py-2 mb-4 inline-block">
        <span className="text-yellow-300 text-sm font-bold" style={{ fontFamily: "'Fredoka One', cursive" }}>
          Hint: {wordIdx === 0 ? "The great blue sea" : wordIdx === 1 ? "Our octopus hero" : wordIdx === 2 ? "Keep the ocean clean" : wordIdx === 3 ? "Our beautiful planet" : "Underwater gardens"}
        </span>
      </div>

      {/* Letter buttons */}
      <div className="flex flex-wrap gap-3 justify-center">
        {pool.map((item) => {
          const used = !available.find((x) => x.id === item.id);
          return (
            <button key={item.id} data-testid={`letter-${item.id}`}
              onClick={() => !used && tap(item)}
              disabled={used}
              className="w-14 h-14 rounded-2xl text-3xl font-bold shadow-lg transition-all active:scale-90"
              style={{
                background: used ? "rgba(255,255,255,0.1)" : "linear-gradient(135deg, #f72585, #7209b7)",
                color: used ? "rgba(255,255,255,0.3)" : "white",
                border: used ? "3px solid rgba(255,255,255,0.1)" : "3px solid rgba(255,255,255,0.4)",
                cursor: used ? "default" : "pointer",
                fontFamily: "'Fredoka One', cursive",
              }}>
              {item.l}
            </button>
          );
        })}
      </div>

      <style>{`
        @keyframes shakeX {
          0%,100% { transform: translateX(0); }
          20%,60% { transform: translateX(-8px); }
          40%,80% { transform: translateX(8px); }
        }
      `}</style>
    </div>
  );
}
