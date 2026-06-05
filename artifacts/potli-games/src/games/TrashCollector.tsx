import { useState, useEffect, useCallback, useRef } from "react";
import WinScreen from "./WinScreen";
import { useLang } from "@/LangContext";

const TRASH = ["🗑️","🥤","🛍️","🧴","🔩","🥡","🪣","🧃"];
const GOAL = 15;
const TIME = 30;

type TrashItem = { id: number; emoji: string; x: number; speed: number; y: number };

export default function TrashCollector() {
  const { lang, common, gameT } = useLang();
  const gm = gameT.trashCollector as any;
  const [items, setItems] = useState<TrashItem[]>([]);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(TIME);
  const [started, setStarted] = useState(false);
  const [won, setWon] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const nextId = useRef(0);
  const frameRef = useRef<number>(0);
  const lastSpawn = useRef(0);

  const spawnItem = useCallback(() => ({
    id: nextId.current++,
    emoji: TRASH[Math.floor(Math.random() * TRASH.length)],
    x: 5 + Math.random() * 85,
    speed: 0.2 + Math.random() * 0.4,
    y: 100,
  }), []);

  const tick = useCallback((timestamp: number) => {
    setItems((prev) => {
      let spawned = [...prev];
      if (timestamp - lastSpawn.current > 800) { spawned.push(spawnItem()); lastSpawn.current = timestamp; }
      return spawned.map((i) => ({ ...i, y: i.y - i.speed })).filter((i) => i.y > -10);
    });
    frameRef.current = requestAnimationFrame(tick);
  }, [spawnItem]);

  useEffect(() => {
    if (!started || won || gameOver) return;
    frameRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frameRef.current);
  }, [started, won, gameOver, tick]);

  useEffect(() => {
    if (!started || won || gameOver) return;
    const t = setInterval(() => {
      setTimeLeft((prev) => { if (prev <= 1) { setGameOver(true); return 0; } return prev - 1; });
    }, 1000);
    return () => clearInterval(t);
  }, [started, won, gameOver]);

  const clickItem = (id: number) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
    setScore((prev) => { const next = prev + 1; if (next >= GOAL) setWon(true); return next; });
  };

  const reset = () => { setItems([]); setScore(0); setTimeLeft(TIME); setStarted(false); setWon(false); setGameOver(false); };

  if (won) return <WinScreen message={gm.winMessage} score={gm.winScore(score)} onReset={reset} />;

  const gameOverMsg = lang === "hi"
    ? (score >= GOAL ? "कर दिया!" : `${score} अंक! ${GOAL} के लिए कोशिश करो!`)
    : (score >= GOAL ? "You did it!" : `You got ${score}! Try for ${GOAL}!`);

  return (
    <div className="max-w-lg mx-auto">
      <div className="text-center mb-4">
        <div className="flex justify-around text-white font-bold text-xl mb-4" style={{ fontFamily: "'Fredoka One', cursive" }}>
          <span>{common.score}: {score}/{GOAL}</span>
          <span>{common.time}: {timeLeft}s</span>
        </div>
        {!started && (
          <button data-testid="start-trash" onClick={() => setStarted(true)}
            className="bg-yellow-400 text-blue-900 font-bold py-4 px-10 rounded-full text-2xl shadow-lg active:scale-95 transition-transform"
            style={{ fontFamily: "'Fredoka One', cursive" }}>
            {common.start}
          </button>
        )}
        {gameOver && !won && (
          <div className="text-center">
            <p className="text-white text-2xl mb-4" style={{ fontFamily: "'Fredoka One', cursive" }}>{gameOverMsg}</p>
            <button onClick={reset} className="bg-yellow-400 text-blue-900 font-bold py-3 px-8 rounded-full text-xl shadow-lg"
              style={{ fontFamily: "'Fredoka One', cursive" }}>{common.tryAgain}</button>
          </div>
        )}
      </div>
      <div data-testid="game-area" className="relative w-full rounded-3xl overflow-hidden border-4 border-white/40"
        style={{ height: 380, background: "linear-gradient(180deg, #0096c7 0%, #0077b6 60%, #023e8a 100%)" }}>
        {items.map((item) => (
          <button key={item.id} data-testid={`trash-${item.id}`} onClick={() => clickItem(item.id)}
            className="absolute text-4xl cursor-pointer hover:scale-125 transition-transform active:scale-150 select-none"
            style={{ left: `${item.x}%`, bottom: `${item.y}%`, transform: "translateX(-50%)" }}>
            {item.emoji}
          </button>
        ))}
        {!started && (
          <div className="absolute inset-0 flex items-center justify-center">
            <p className="text-white/60 text-xl font-bold text-center px-8" style={{ fontFamily: "'Fredoka One', cursive" }}>
              {gm.idle}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
