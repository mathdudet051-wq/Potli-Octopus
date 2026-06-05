import { Link } from "wouter";
import { useState } from "react";
import { useLang } from "@/LangContext";

type Props = {
  message: string;
  score?: string;
  onReset: () => void;
};

export default function WinScreen({ message, score, onReset }: Props) {
  const { common } = useLang();
  const [confetti] = useState(() =>
    Array.from({ length: 30 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      color: ["#f72585","#7209b7","#3a0ca3","#4cc9f0","#ffd60a","#06d6a0"][Math.floor(Math.random() * 6)],
      size: 8 + Math.random() * 12,
      duration: 1.5 + Math.random() * 2,
      delay: Math.random() * 0.5,
    }))
  );
  const [praise] = useState(() => common.praise[Math.floor(Math.random() * common.praise.length)]);

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center overflow-hidden"
      style={{ background: "linear-gradient(135deg, #023e8a, #0077b6, #0096c7)" }}>
      {confetti.map((c) => (
        <div key={c.id} className="absolute pointer-events-none"
          style={{
            left: `${c.x}%`, top: "-20px",
            width: c.size, height: c.size,
            background: c.color, borderRadius: "3px",
            animation: `confettiFall ${c.duration}s ${c.delay}s ease-in infinite`,
          }}
        />
      ))}
      <div className="relative z-10 text-center px-6 max-w-sm w-full">
        <div className="text-7xl mb-3 animate-bounce">🎉</div>
        <img src="/potli.jpg" alt="Potli" className="w-24 h-24 mx-auto rounded-full border-4 border-yellow-400 shadow-xl mb-3 object-cover" />
        <h2 className="text-3xl font-bold text-yellow-300 mb-2" style={{ fontFamily: "'Fredoka One', cursive", textShadow: "2px 2px 0 #000" }}>
          {praise}
        </h2>
        <p className="text-white text-xl mb-1" style={{ fontFamily: "'Fredoka One', cursive" }}>{message}</p>
        {score && <p className="text-yellow-300 text-2xl font-bold mb-5" style={{ fontFamily: "'Fredoka One', cursive" }}>{score}</p>}
        <div className="flex flex-col gap-3">
          <button onClick={onReset}
            className="py-3 px-8 rounded-full text-blue-900 font-bold text-xl shadow-lg active:scale-95 transition-transform"
            style={{ background: "linear-gradient(135deg, #ffd60a, #fb8500)", fontFamily: "'Fredoka One', cursive" }}>
            {common.playAgain}
          </button>
          <Link href="/">
            <button className="py-3 px-8 rounded-full text-white font-bold text-xl shadow-lg active:scale-95 transition-transform w-full"
              style={{ background: "rgba(255,255,255,0.2)", border: "2px solid white", fontFamily: "'Fredoka One', cursive" }}>
              {common.allGames}
            </button>
          </Link>
        </div>
      </div>
      <style>{`
        @keyframes confettiFall {
          0% { transform: translateY(-20px) rotate(0deg); opacity: 1; }
          100% { transform: translateY(100vh) rotate(720deg); opacity: 0.3; }
        }
      `}</style>
    </div>
  );
}
