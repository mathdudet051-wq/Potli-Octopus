import { useState, useEffect } from "react";
import WinScreen from "./WinScreen";
import { useLang } from "@/LangContext";

const FACTS_EN = [
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
const FACTS_HI = [
  "महासागर पृथ्वी की 71% सतह को ढकते हैं!",
  "हर साल 80 लाख टन प्लास्टिक समुद्र में जाता है!",
  "समुद्री कछुए प्लास्टिक की थैलियों को जेलीफ़िश समझते हैं!",
  "महासागर दुनिया की 50% ऑक्सीजन बनाते हैं!",
  "मूंगे की चट्टानें 25% समुद्री जीवों का घर हैं!",
  "एक प्लास्टिक की थैली समुद्र में 1000 साल तक रह सकती है!",
  "व्हेल और डॉल्फिन मछली पकड़ने के जाल में फँस जाते हैं!",
  "एक बोतल रीसायकल करने से TV 3 घंटे चला सकते हैं!",
  "ग्रेट पैसिफ़िक गार्बेज पैच टेक्सास से दोगुना बड़ा है!",
  "हर साल 10 लाख से ज़्यादा समुद्री पक्षी प्रदूषण से मरते हैं!",
];
const COLORS = ["#f72585","#7209b7","#3a0ca3","#4cc9f0","#06d6a0","#ffd60a","#fb8500","#e63946"];
const GOAL = 10;
type Bubble = { id: number; fact: string; x: number; color: string; size: number; speed: number; y: number };

export default function BubbleFacts() {
  const { lang, gameT } = useLang();
  const gm = gameT.bubbleFacts as any;
  const FACTS = lang === "hi" ? FACTS_HI : FACTS_EN;
  const [bubbles, setBubbles] = useState<Bubble[]>([]);
  const [popped, setPopped] = useState(0);
  const [showing, setShowing] = useState<string | null>(null);
  const [won, setWon] = useState(false);

  useEffect(() => {
    const spawn = () => {
      setBubbles((prev) => {
        if (prev.length >= 6) return prev;
        return [...prev, {
          id: Date.now() + Math.random(),
          fact: FACTS[Math.floor(Math.random() * FACTS.length)],
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
  }, [lang]);

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
    setTimeout(() => setShowing(null), 2500);
    setPopped((prev) => { const next = prev + 1; if (next >= GOAL) setWon(true); return next; });
  };

  const reset = () => { setBubbles([]); setPopped(0); setShowing(null); setWon(false); };
  const popLabel = lang === "hi" ? "फोड़ो!" : "Pop me!";

  if (won) return <WinScreen message={gm.winMessage} score={gm.winScore(GOAL)} onReset={reset} />;

  return (
    <div className="max-w-md mx-auto">
      <p className="text-white text-center text-xl font-bold mb-2" style={{ fontFamily: "'Fredoka One', cursive" }}>
        {gm.instruction} ({popped}/{GOAL})
      </p>
      {showing && (
        <div className="bg-white/90 text-blue-900 rounded-2xl px-4 py-3 mb-3 text-center font-bold shadow-lg"
          style={{ fontFamily: "'Fredoka One', cursive" }}>{showing}</div>
      )}
      <div className="relative w-full rounded-3xl overflow-hidden border-4 border-white/30"
        style={{ height: 360, background: "linear-gradient(180deg, #023e8a, #0077b6)" }}>
        {bubbles.map((b) => (
          <button key={b.id} onClick={() => pop(b)}
            className="absolute rounded-full flex items-center justify-center text-white text-xs font-bold text-center leading-tight p-2 active:scale-125 transition-transform"
            style={{
              left: `${b.x}%`, bottom: `${b.y}%`, width: b.size, height: b.size,
              background: `radial-gradient(circle at 35% 35%, ${b.color}cc, ${b.color})`,
              border: "3px solid rgba(255,255,255,0.5)", transform: "translateX(-50%)",
              fontFamily: "'Fredoka One', cursive", fontSize: b.size > 90 ? 11 : 9,
            }}>
            {popLabel}
          </button>
        ))}
      </div>
    </div>
  );
}
