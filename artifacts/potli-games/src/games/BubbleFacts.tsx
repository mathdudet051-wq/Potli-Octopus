import { useState, useEffect } from "react";
import WinScreen from "./WinScreen";

const FACTS = [
  "Oceans cover 71% of Earth's surface!",
  "8 million tons of plastic enter the ocean each year!",
  "Sea turtles mistake plastic bags for jellyfish!",
  "Oceans produce 50% of the world's oxygen!",
  "Coral reefs are home to 25% of all marine life!",
  "A single plastic bag can last 1,000 years in the ocean!",
  "Whales and dolphins can get tangled in fishing nets!",
  "Recycling one bottle saves energy to power a TV for 3 hours!",
  "The Great Pacific Garbage Patch is twice the size of Texas!",
  "Over 1 million seabirds die from ocean pollution each year!",
];

const COLORS = ["#f72585","#7209b7","#3a0ca3","#4cc9f0","#06d6a0","#ffd60a","#fb8500","#e63946"];

type Bubble = { id: number; fact: string; x: number; color: string; size: number; speed: number; y: number };

const GOAL = 10;

export default function BubbleFacts() {
  const [bubbles, setBubbles] = useState<Bubble[]>([]);
  const [popped, setPopped] = useState(0);
  const [showing, setShowing] = useState<string | null>(null);
  const [won, setWon] = useState(false);

  useEffect(() => {
    const spawn = () => {
      setBubbles((prev) => {
        if (prev.length >= 6) return prev;
        const fact = FACTS[Math.floor(Math.random() * FACTS.length)];
        return [...prev, {
          id: Date.now() + Math.random(),
          fact,
          x: 5 + Math.random() * 80,
          color: COLORS[Math.floor(Math.random() * COLORS.length)],
          size: 70 + Math.random() * 40,
          speed: 0.5 + Math.random() * 0.5,
          y: 100,
        }];
      });
    };
    const interval = setInterval(spawn, 1200);
    spawn();
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (won) return;
    const frame = setInterval(() => {
      setBubbles((prev) => prev.map((b) => ({ ...b, y: b.y - b.speed })).filter((b) => b.y > -15));
    }, 50);
    return () => clearInterval(frame);
  }, [won]);

  const pop = (b: Bubble) => {
    setBubbles((prev) => prev.filter((x) => x.id !== b.id));
    setShowing(b.fact);
    setTimeout(() => setShowing(null), 2000);
    setPopped((prev) => {
      const next = prev + 1;
      if (next >= GOAL) setWon(true);
      return next;
    });
  };

  const reset = () => { setBubbles([]); setPopped(0); setShowing(null); setWon(false); };
  if (won) return <WinScreen message="You learned all the facts!" score={`${GOAL} bubbles popped!`} onReset={reset} />;

  return (
    <div className="max-w-md mx-auto">
      <p className="text-white text-center text-xl font-bold mb-2" style={{ fontFamily: "'Fredoka One', cursive" }}>
        Pop {GOAL} bubbles! ({popped}/{GOAL})
      </p>

      {showing && (
        <div className="bg-white/90 text-blue-900 rounded-2xl px-4 py-3 mb-3 text-center font-bold shadow-lg"
          style={{ fontFamily: "'Fredoka One', cursive" }}>
          {showing}
        </div>
      )}

      <div className="relative w-full rounded-3xl overflow-hidden border-4 border-white/30"
        style={{ height: 380, background: "linear-gradient(180deg, #023e8a, #0077b6)" }}>
        {bubbles.map((b) => (
          <button
            key={b.id}
            data-testid={`bubble-${b.id}`}
            onClick={() => pop(b)}
            className="absolute rounded-full flex items-center justify-center text-white text-xs font-bold text-center leading-tight p-2 active:scale-125 transition-transform"
            style={{
              left: `${b.x}%`,
              bottom: `${b.y}%`,
              width: b.size,
              height: b.size,
              background: `radial-gradient(circle at 35% 35%, ${b.color}cc, ${b.color})`,
              border: "3px solid rgba(255,255,255,0.5)",
              transform: "translateX(-50%)",
              fontFamily: "'Fredoka One', cursive",
              fontSize: b.size > 90 ? 11 : 9,
            }}
          >
            Pop me!
          </button>
        ))}
      </div>
    </div>
  );
}
