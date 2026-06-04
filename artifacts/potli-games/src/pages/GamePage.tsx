import { useParams, Link } from "wouter";
import { GAMES } from "@/games";

export default function GamePage() {
  const { id } = useParams<{ id: string }>();
  const game = GAMES.find((g) => g.id === id);

  if (!game) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4"
        style={{ background: "linear-gradient(180deg, #0077b6, #00b4d8)" }}>
        <p className="text-white text-2xl font-bold" style={{ fontFamily: "'Fredoka One', cursive" }}>
          Game not found!
        </p>
        <Link href="/">
          <button className="bg-white text-blue-800 font-bold py-3 px-8 rounded-full text-lg shadow-lg"
            style={{ fontFamily: "'Fredoka One', cursive" }}>
            Back to Games
          </button>
        </Link>
      </div>
    );
  }

  const GameComponent = game.component;

  return (
    <div
      className="min-h-screen"
      style={{ background: "linear-gradient(180deg, #0077b6 0%, #00b4d8 50%, #90e0ef 100%)" }}
    >
      <div className="sticky top-0 z-50 flex items-center gap-3 px-4 py-3"
        style={{ background: "rgba(0,60,100,0.85)", backdropFilter: "blur(10px)" }}>
        <Link href="/">
          <button
            data-testid="back-to-games"
            className="flex items-center gap-2 text-white font-bold py-2 px-4 rounded-full text-sm transition-transform active:scale-95"
            style={{
              background: "rgba(255,255,255,0.2)",
              border: "2px solid rgba(255,255,255,0.4)",
              fontFamily: "'Fredoka One', cursive",
            }}
          >
            ← Games
          </button>
        </Link>
        <span className="text-2xl">{game.emoji}</span>
        <h1 className="text-white font-bold text-lg" style={{ fontFamily: "'Fredoka One', cursive" }}>
          {game.name}
        </h1>
      </div>
      <div className="p-4">
        <GameComponent />
      </div>
    </div>
  );
}
