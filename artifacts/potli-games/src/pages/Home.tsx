import { Link } from "wouter";
import { GAMES } from "@/games";
import { useEffect, useState } from "react";

function Bubble({ style }: { style: React.CSSProperties }) {
  return (
    <div
      className="absolute rounded-full border-2 border-white/30 bg-white/10 animate-bubble"
      style={style}
    />
  );
}

export default function Home() {
  const [bubbles] = useState(() =>
    Array.from({ length: 18 }, (_, i) => ({
      id: i,
      width: 20 + Math.random() * 60,
      left: Math.random() * 100,
      duration: 6 + Math.random() * 10,
      delay: Math.random() * 8,
    }))
  );

  return (
    <div
      className="min-h-screen relative overflow-hidden"
      style={{
        background: "linear-gradient(180deg, #0077b6 0%, #00b4d8 40%, #90e0ef 100%)",
      }}
    >
      {/* Animated bubbles */}
      {bubbles.map((b) => (
        <Bubble
          key={b.id}
          style={{
            width: b.width,
            height: b.width,
            left: `${b.left}%`,
            bottom: "-80px",
            animation: `floatUp ${b.duration}s ${b.delay}s infinite ease-in`,
          }}
        />
      ))}

      {/* Sandy bottom */}
      <div
        className="fixed bottom-0 left-0 right-0 h-16 z-10"
        style={{
          background: "linear-gradient(180deg, transparent, #f4a261 60%, #e76f51)",
          borderRadius: "60% 60% 0 0 / 20px",
        }}
      />

      <div className="relative z-10 px-4 pb-24 pt-8 max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <img
            src="/potli.jpg"
            alt="Potli the Octopus"
            className="w-36 h-36 mx-auto rounded-full object-cover shadow-2xl border-4 border-white mb-4 animate-bob"
          />
          <h1
            className="text-5xl md:text-6xl font-bold text-white drop-shadow-lg leading-tight"
            style={{ fontFamily: "'Fredoka One', cursive", textShadow: "3px 3px 0px #005f8a" }}
          >
            Potli's Ocean Adventure!
          </h1>
          <p
            className="text-xl text-cyan-100 mt-3 max-w-xl mx-auto"
            style={{ fontFamily: "'Fredoka One', cursive" }}
          >
            Help Potli save the sea! Play fun games and become an Eco Hero!
          </p>
        </div>

        {/* Games Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {GAMES.map((game) => (
            <Link key={game.id} href={`/game/${game.id}`}>
              <div
                data-testid={`game-card-${game.id}`}
                className="bg-white/90 backdrop-blur rounded-3xl p-4 cursor-pointer hover:scale-105 hover:bg-white transition-all duration-200 shadow-lg hover:shadow-2xl border-4 border-white/60 hover:border-yellow-300 flex flex-col items-center text-center"
              >
                <div className="text-5xl mb-2 animate-wiggle">{game.emoji}</div>
                <h3
                  className="text-base font-bold text-blue-900 leading-tight mb-1"
                  style={{ fontFamily: "'Fredoka One', cursive" }}
                >
                  {game.name}
                </h3>
                <p className="text-xs text-blue-600 mb-3 leading-snug">{game.description}</p>
                <button
                  className="w-full py-2 px-3 rounded-2xl text-white font-bold text-sm transition-transform active:scale-95"
                  style={{
                    background: "linear-gradient(135deg, #f72585, #7209b7)",
                    fontFamily: "'Fredoka One', cursive",
                    boxShadow: "0 4px 0px #a00060",
                  }}
                >
                  Play!
                </button>
              </div>
            </Link>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes floatUp {
          0% { transform: translateY(0) scale(1); opacity: 0.6; }
          50% { opacity: 0.4; }
          100% { transform: translateY(-110vh) scale(1.3); opacity: 0; }
        }
        @keyframes bob {
          0%, 100% { transform: translateY(0px) rotate(-2deg); }
          50% { transform: translateY(-12px) rotate(2deg); }
        }
        @keyframes wiggle {
          0%, 100% { transform: rotate(-5deg); }
          50% { transform: rotate(5deg); }
        }
        .animate-bob { animation: bob 3s ease-in-out infinite; }
        .animate-wiggle { animation: wiggle 2s ease-in-out infinite; }
        .animate-bubble {}
      `}</style>
    </div>
  );
}
