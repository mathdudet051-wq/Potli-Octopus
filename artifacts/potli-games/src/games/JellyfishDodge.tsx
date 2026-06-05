import { useState, useEffect, useRef, useCallback } from "react";
import WinScreen from "./WinScreen";
import { useLang } from "@/LangContext";

const POTLI_W = 50;
const BAG_SIZE = 40;
const TIME = 30;
type Bag = { id: number; x: number; y: number; speed: number };

export default function JellyfishDodge() {
  const { lang, common, gameT } = useLang();
  const gm = gameT.jellyfishDodge as any;
  const containerRef = useRef<HTMLDivElement>(null);
  const [gameW, setGameW] = useState(320);

  useEffect(() => {
    const update = () => {
      if (containerRef.current) setGameW(Math.min(containerRef.current.clientWidth, 380));
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  const GAME_H = Math.round(gameW * 1.1);
  const [potliX, setPotliX] = useState(gameW / 2 - POTLI_W / 2);
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
  const gameWRef = useRef(gameW);
  gameWRef.current = gameW;

  const checkCollision = useCallback((bagList: Bag[]) => {
    return bagList.some((b) => {
      const pL = potliXRef.current, pR = pL + POTLI_W, pT = GAME_H - 80;
      return !(b.x + BAG_SIZE < pL || b.x > pR || b.y + BAG_SIZE < pT || b.y > pT + POTLI_W);
    });
  }, [GAME_H]);

  useEffect(() => {
    if (!started || won || dead) return;
    const tick = (timestamp: number) => {
      const speed = 1 + (TIME - timeLeft) * 0.05;
      setBags((prev) => {
        let next = [...prev];
        if (timestamp - lastSpawn.current > 900) {
          next.push({ id: nextId.current++, x: Math.random() * (gameWRef.current - BAG_SIZE), y: -BAG_SIZE, speed });
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
  }, [started, won, dead, timeLeft, checkCollision, GAME_H]);

  useEffect(() => {
    if (!started || won || dead) return;
    const t = setInterval(() => {
      setTimeLeft((prev) => { if (prev <= 1) { setWon(true); return 0; } return prev - 1; });
    }, 1000);
    return () => clearInterval(t);
  }, [started, won, dead]);

  useEffect(() => {
    if (!started) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") setPotliX((x) => Math.max(0, x - 25));
      if (e.key === "ArrowRight") setPotliX((x) => Math.min(gameWRef.current - POTLI_W, x + 25));
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [started]);

  const reset = () => { setPotliX(gameW / 2); setBags([]); setTimeLeft(TIME); setStarted(false); setWon(false); setDead(false); setSurvived(0); lastSpawn.current = 0; };

  if (won) return <WinScreen message={gm.winMessage} score={gm.winScore(TIME)} onReset={reset} />;

  return (
    <div className="max-w-sm mx-auto text-center" ref={containerRef}>
      <p className="text-white text-xl font-bold mb-2" style={{ fontFamily: "'Fredoka One', cursive" }}>
        {dead ? gm.survived(survived) : `${common.time}: ${timeLeft}s`}
      </p>
      <div className="relative rounded-3xl overflow-hidden border-4 border-white/40 mx-auto"
        style={{ width: "100%", height: GAME_H, background: "linear-gradient(180deg, #0096c7, #023e8a)" }}>
        {bags.map((b) => (
          <div key={b.id} className="absolute text-4xl pointer-events-none" style={{ left: b.x, top: b.y }}>🛍️</div>
        ))}
        <div className="absolute text-4xl" style={{ left: potliX, bottom: 20, transition: "left 0.05s" }}>🐙</div>
        {!started && !dead && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/40">
            <p className="text-white text-lg mb-4 px-4" style={{ fontFamily: "'Fredoka One', cursive" }}>
              {lang === "hi" ? `${TIME} सेकंड तक प्लास्टिक से बचो!` : `Dodge the plastic bags for ${TIME} seconds!`}
            </p>
            <button onClick={() => setStarted(true)} data-testid="start-dodge"
              className="bg-yellow-400 text-blue-900 font-bold py-3 px-8 rounded-full text-xl"
              style={{ fontFamily: "'Fredoka One', cursive" }}>{common.start}</button>
          </div>
        )}
        {dead && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/50">
            <p className="text-white text-2xl mb-4" style={{ fontFamily: "'Fredoka One', cursive" }}>{gm.survived(survived)}</p>
            <button onClick={reset} className="bg-yellow-400 text-blue-900 font-bold py-3 px-8 rounded-full text-xl"
              style={{ fontFamily: "'Fredoka One', cursive" }}>{common.tryAgain}</button>
          </div>
        )}
      </div>
      {started && !dead && (
        <div className="flex gap-4 justify-center mt-4">
          {["◀","▶"].map((arrow, i) => (
            <button key={i} data-testid={i === 0 ? "btn-left" : "btn-right"}
              onPointerDown={() => {
                const move = setInterval(() => setPotliX((x) => i === 0 ? Math.max(0, x - 15) : Math.min(gameWRef.current - POTLI_W, x + 15)), 50);
                window.addEventListener("pointerup", () => clearInterval(move), { once: true });
              }}
              className="py-4 px-10 rounded-full bg-white/20 text-white font-bold text-2xl border-2 border-white/40 active:scale-95">
              {arrow}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
