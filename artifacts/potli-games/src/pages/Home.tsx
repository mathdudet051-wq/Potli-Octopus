import { Link } from "wouter";
import { GAMES } from "@/games";
import { useState, useEffect } from "react";
import { useLang } from "@/LangContext";

function Bubble({ style }: { style: React.CSSProperties }) {
  return (
    <div
      className="absolute rounded-full border-2 border-white/30 bg-white/10 animate-bubble"
      style={style}
    />
  );
}

function useInstallPrompt() {
  const [prompt, setPrompt] = useState<any>(null);
  const [installed, setInstalled] = useState(false);

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      setPrompt(e);
    };
    window.addEventListener("beforeinstallprompt", handler);
    window.addEventListener("appinstalled", () => { setInstalled(true); setPrompt(null); });
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const install = async () => {
    if (!prompt) return;
    prompt.prompt();
    const { outcome } = await prompt.userChoice;
    if (outcome === "accepted") setInstalled(true);
    setPrompt(null);
  };

  return { canInstall: !!prompt, install, installed };
}

export default function Home() {
  const { lang, setLang, t } = useLang();
  const { canInstall, install, installed } = useInstallPrompt();

  const [bubbles] = useState(() =>
    Array.from({ length: 18 }, (_, i) => ({
      id: i,
      width: 20 + Math.random() * 60,
      left: Math.random() * 100,
      duration: 6 + Math.random() * 10,
      delay: Math.random() * 8,
    }))
  );

  const installLabel = lang === "hi" ? "📲 ऐप डाउनलोड करो!" : "📲 Install App!";
  const installedLabel = lang === "hi" ? "✅ इंस्टॉल हो गया!" : "✅ Installed!";

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

      <div className="relative z-10 px-4 pb-32 pt-8 max-w-6xl mx-auto">
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
            {t.title}
          </h1>
          <p
            className="text-xl text-cyan-100 mt-3 max-w-xl mx-auto"
            style={{ fontFamily: "'Fredoka One', cursive" }}
          >
            {t.subtitle}
          </p>

          {/* ── Install button — only shown when browser supports one-click install ── */}
          {(canInstall || installed) && (
            <div className="mt-5 flex flex-col items-center">
              {installed ? (
                <div
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-green-400/30 border-2 border-green-300 text-green-200 font-bold text-lg"
                  style={{ fontFamily: "'Fredoka One', cursive" }}
                >
                  {installedLabel}
                </div>
              ) : (
                <button
                  onClick={install}
                  className="inline-flex items-center gap-2 px-8 py-4 rounded-full text-blue-900 font-bold text-xl shadow-xl active:scale-95 transition-transform animate-pulse-soft"
                  style={{
                    background: "linear-gradient(135deg, #ffd60a, #fb8500)",
                    fontFamily: "'Fredoka One', cursive",
                    boxShadow: "0 6px 0 #b05e00, 0 0 30px rgba(251,133,0,0.5)",
                  }}
                >
                  {installLabel}
                </button>
              )}
            </div>
          )}
        </div>

        {/* Games Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {GAMES.map((game) => {
            const gt = t.games[game.id as keyof typeof t.games];
            return (
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
                    {gt?.name ?? game.name}
                  </h3>
                  <p className="text-xs text-blue-600 mb-3 leading-snug">
                    {gt?.description ?? game.description}
                  </p>
                  <button
                    className="w-full py-2 px-3 rounded-2xl text-white font-bold text-sm transition-transform active:scale-95"
                    style={{
                      background: "linear-gradient(135deg, #f72585, #7209b7)",
                      fontFamily: "'Fredoka One', cursive",
                      boxShadow: "0 4px 0px #a00060",
                    }}
                  >
                    {t.play}
                  </button>
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Privacy policy link */}
      <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-20">
        <a
          href="/privacy"
          style={{ fontFamily: "'Fredoka One', cursive" }}
          className="text-white/60 text-xs hover:text-white/90 transition-colors underline underline-offset-2"
        >
          Privacy Policy
        </a>
      </div>

      {/* Language toggle — fixed at bottom centre above the sand */}
      <div className="fixed bottom-5 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1 bg-white/20 backdrop-blur border-2 border-white/40 rounded-full px-1 py-1 shadow-lg">
        <button
          onClick={() => setLang("en")}
          className="px-4 py-1.5 rounded-full font-bold text-sm transition-all"
          style={{
            fontFamily: "'Fredoka One', cursive",
            background: lang === "en" ? "white" : "transparent",
            color: lang === "en" ? "#023e8a" : "white",
          }}
        >
          🇬🇧 EN
        </button>
        <button
          onClick={() => setLang("hi")}
          className="px-4 py-1.5 rounded-full font-bold text-sm transition-all"
          style={{
            fontFamily: "'Fredoka One', cursive",
            background: lang === "hi" ? "white" : "transparent",
            color: lang === "hi" ? "#023e8a" : "white",
          }}
        >
          🇮🇳 हिंदी
        </button>
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
        @keyframes pulseSoft {
          0%, 100% { transform: scale(1); box-shadow: 0 6px 0 #b05e00, 0 0 30px rgba(251,133,0,0.5); }
          50% { transform: scale(1.04); box-shadow: 0 6px 0 #b05e00, 0 0 50px rgba(251,133,0,0.8); }
        }
        .animate-bob { animation: bob 3s ease-in-out infinite; }
        .animate-wiggle { animation: wiggle 2s ease-in-out infinite; }
        .animate-pulse-soft { animation: pulseSoft 2s ease-in-out infinite; }
        .animate-bubble {}
      `}</style>
    </div>
  );
}
