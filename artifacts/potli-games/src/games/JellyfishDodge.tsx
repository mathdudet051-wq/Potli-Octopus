import { useState, useEffect, useRef, useCallback } from "react";
import WinScreen from "./WinScreen";

const GAME_W = 340;
const GAME_H = 400;
const POTLI_W = 50;
const BAG_SIZE = 40;
const TIME = 30;

type Bag = { id: number; x: number; y: number; speed: number };

export default function JellyfishDodge() {
  const [potliX, setPotliX] = useState(GAME_W / 2 - POTLI_W / 2);
  const [bags, setBags] = useState<Bag[]>([]);
  const [timeLeft, setTimeLeft] = useState(TIME);
  const [started, setStarted] = useState(false);
  const [won, setWon] = useState(false);
  const [dead, setDead] = useState(false);
  const [survived, setSurvived] = useState(0);
  const frameRef = useRef<number>(0);
  const nextId = useRef(0);
  const lastSpawn = useRef(0);
  const potliXRef = useRef(potliX);
  potliXRef.current = potliX;

  const checkCollision = useCallback((bagList: Bag[]) => {
    return bagList.some((b) => {
      const potliLeft = potliXRef.current;
      const potliRight = potliLeft + POTLI_W;
      const potliTop = GAME_H - 80;
      const bagRight = b.x + BAG_SIZE;
      const bagBottom = b.y + BAG_SIZE;
      return !(bagRight < potliLeft || b.x > potliRight || bagBottom < potliTop || b.y > potliTop + POTLI_W);
    });
  }, []);

  useEffect(() => {
    if (!started || won || dead) return;
    let ts = 0;
    const tick = (timestamp: number) => {
      if (!ts) ts = timestamp;
      const speed = 1 + (TIME - timeLeft) * 0.05;
      setBags((prev) => {
        let next = [...prev];
        if (timestamp - lastSpawn.current > 900) {
          next.push({ id: nextId.current++, x: Math.random() * (GAME_W - BAG_SIZE), y: -BAG_SIZE, speed });
          lastSpawn.current = timestamp;
        }
        next = next.map((b) => ({ ...b, y: b.y + b.speed })).filter((b) => b.y < GAME_H + BAG_SIZE);
        if (checkCollision(next)) { setDead(true); setSurvived(TIME - timeLeft); return []; }
        return next;
      });
      frameRef.current = requestAnimationFrame(tick);
    };
    frameRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frameRef.current);
  }, [started, won, dead, timeLeft, checkCollision]);

  useEffect(() => {
    if (!started || won || dead) return;
    const t = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) { setWon(true); return 0; }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(t);
  }, [started, won, dead]);

  useEffect(() => {
    if (!started) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") setPotliX((x) => Math.max(0, x - 25));
      if (e.key === "ArrowRight") setPotliX((x) => Math.min(GAME_W - POTLI_W, x + 25));
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [started]);

  const reset = () => { setPotliX(GAME_W / 2); setBags([]); setTimeLeft(TIME); setStarted(false); setWon(false); setDead(false); setSurvived(0); lastSpawn.current = 0; };

  if (won) return <WinScreen message="You dodged all the plastic!" score={`Survived ${TIME} seconds!`} onReset={reset} />;

  return (
    <div className="max-w-sm mx-auto text-center">
      <p className="text-white text-xl font-bold mb-2" style={{ fontFamily: "'Fredoka One', cursive" }}>
        {dead ? `You survived ${survived}s!` : `Time: ${timeLeft}s`}
      </p>

      <div className="relative rounded-3xl overflow-hidden border-4 border-white/40 mx-auto"
        style={{ width: GAME_W, height: GAME_H, background: "linear-gradient(180deg, #0096c7, #023e8a)" }}>
        {bags.map((b) => (
          <div key={b.id} className="absolute text-4xl pointer-events-none" style={{ left: b.x, top: b.y }}>🛍️</div>
        ))}
        <div className="absolute text-4xl" style={{ left: potliX, bottom: 20, transition: "left 0.05s" }}>🐙</div>

        {!started && !dead && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/40">
            <p className="text-white text-lg mb-4 px-4" style={{ fontFamily: "'Fredoka One', cursive" }}>
              Dodge the plastic bags for {TIME} seconds!
            </p>
            <button onClick={() => setStarted(true)} data-testid="start-dodge"
              className="bg-yellow-400 text-blue-900 font-bold py-3 px-8 rounded-full text-xl"
              style={{ fontFamily: "'Fredoka One', cursive" }}>
              Start!
            </button>
          </div>
        )}
        {dead && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/50">
            <p className="text-white text-2xl mb-4" style={{ fontFamily: "'Fredoka One', cursive" }}>You survived {survived}s!</p>
            <button onClick={reset} className="bg-yellow-400 text-blue-900 font-bold py-3 px-8 rounded-full text-xl"
              style={{ fontFamily: "'Fredoka One', cursive" }}>Try Again!</button>
          </div>
        )}
      </div>

      {started && !dead && (
        <div className="flex gap-4 justify-center mt-4">
          <button data-testid="btn-left" onPointerDown={() => {
            const move = setInterval(() => setPotliX((x) => Math.max(0, x - 15)), 50);
            const stop = () => clearInterval(move);
            window.addEventListener("pointerup", stop, { once: true });
          }}
            className="py-4 px-8 rounded-full bg-white/20 text-white font-bold text-2xl border-2 border-white/40 active:scale-95">
            ◀
          </button>
          <button data-testid="btn-right" onPointerDown={() => {
            const move = setInterval(() => setPotliX((x) => Math.min(GAME_W - POTLI_W, x + 15)), 50);
            const stop = () => clearInterval(move);
            window.addEventListener("pointerup", stop, { once: true });
          }}
            className="py-4 px-8 rounded-full bg-white/20 text-white font-bold text-2xl border-2 border-white/40 active:scale-95">
            ▶
          </button>
        </div>
      )}
    </div>
  );
}
