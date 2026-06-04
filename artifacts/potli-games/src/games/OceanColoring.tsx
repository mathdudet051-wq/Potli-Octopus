import { useState } from "react";

const PALETTE = ["#0077b6","#00b4d8","#06d6a0","#f72585","#ffd60a","#fb8500","#e63946","#7209b7","#ffffff","#023e8a"];

type Region = {
  id: string;
  d: string;
  label: string;
  default: string;
};

const REGIONS: Region[] = [
  { id: "sky", d: "M0,0 H300 V80 Q150,110 0,80 Z", label: "Sky", default: "#90e0ef" },
  { id: "sun", d: "M230,15 m-20,0 a20,20 0 1,0 40,0 a20,20 0 1,0 -40,0", label: "Sun", default: "#ffd60a" },
  { id: "sea", d: "M0,80 Q150,110 300,80 V220 H0 Z", label: "Sea", default: "#0077b6" },
  { id: "sand", d: "M0,210 H300 V250 H0 Z", label: "Sand", default: "#f4a261" },
  { id: "fish1body", d: "M80,140 Q110,125 130,140 Q110,155 80,140 Z", label: "Fish 1", default: "#f72585" },
  { id: "fish1tail", d: "M78,140 L60,128 L60,152 Z", label: "Fish Tail", default: "#e63946" },
  { id: "fish2body", d: "M180,160 Q210,145 230,160 Q210,175 180,160 Z", label: "Fish 2", default: "#06d6a0" },
  { id: "fish2tail", d: "M178,160 L160,148 L160,172 Z", label: "Fish 2 Tail", default: "#028090" },
  { id: "coral1", d: "M50,215 L55,195 L60,215 M55,205 L50,200 M55,205 L60,200", label: "Coral 1", default: "#f72585" },
  { id: "coral2", d: "M240,215 L245,190 L250,215 M245,200 L238,193 M245,200 L252,193", label: "Coral 2", default: "#e63946" },
  { id: "wave1", d: "M0,100 Q50,88 100,100 Q150,112 200,100 Q250,88 300,100 L300,110 Q250,98 200,110 Q150,122 100,110 Q50,98 0,110 Z", label: "Wave", default: "#caf0f8" },
  { id: "bubble1", d: "M140,130 m-8,0 a8,8 0 1,0 16,0 a8,8 0 1,0 -16,0", label: "Bubble 1", default: "#caf0f8" },
  { id: "bubble2", d: "M170,120 m-5,0 a5,5 0 1,0 10,0 a5,5 0 1,0 -10,0", label: "Bubble 2", default: "#caf0f8" },
  { id: "seaweed", d: "M120,215 Q115,200 120,190 Q125,180 120,170 Q115,160 120,150", label: "Seaweed", default: "#06d6a0" },
];

export default function OceanColoring() {
  const [colors, setColors] = useState<Record<string, string>>(() =>
    Object.fromEntries(REGIONS.map((r) => [r.id, r.default]))
  );
  const [selected, setSelected] = useState(PALETTE[3]);
  const [showPotli, setShowPotli] = useState(false);

  const fill = (id: string) => {
    setColors((prev) => ({ ...prev, [id]: selected }));
  };

  const reset = () => setColors(Object.fromEntries(REGIONS.map((r) => [r.id, r.default])));

  return (
    <div className="max-w-sm mx-auto text-center">
      <p className="text-white text-xl font-bold mb-2" style={{ fontFamily: "'Fredoka One', cursive" }}>
        Colour your ocean! Pick a colour then tap a region.
      </p>

      {/* Palette */}
      <div className="flex gap-2 justify-center flex-wrap mb-4">
        {PALETTE.map((c) => (
          <button key={c} onClick={() => setSelected(c)}
            data-testid={`color-${c}`}
            className="w-9 h-9 rounded-full border-4 transition-all"
            style={{
              background: c,
              borderColor: selected === c ? "white" : "rgba(255,255,255,0.3)",
              transform: selected === c ? "scale(1.3)" : "scale(1)",
              boxShadow: selected === c ? `0 0 12px ${c}` : "none",
            }}
          />
        ))}
      </div>

      {/* SVG Canvas */}
      <div className="relative rounded-3xl overflow-hidden border-4 border-white/40 mx-auto mb-4"
        style={{ background: "#caf0f8", maxWidth: 300 }}>
        <svg viewBox="0 0 300 250" width="100%" style={{ display: "block" }}>
          {REGIONS.map((r) => (
            <path key={r.id} d={r.d} fill={colors[r.id]}
              onClick={() => fill(r.id)}
              data-testid={`region-${r.id}`}
              style={{ cursor: "pointer", stroke: "rgba(0,0,0,0.15)", strokeWidth: 1.5 }}
            />
          ))}
          {/* Fish eyes */}
          <circle cx="122" cy="138" r="3" fill="#000" />
          <circle cx="222" cy="158" r="3" fill="#000" />
        </svg>

        {showPotli && (
          <img src="/potli.jpg" alt="Potli"
            className="absolute bottom-4 right-4 w-16 h-16 rounded-full border-4 border-yellow-400 object-cover shadow-xl" />
        )}
      </div>

      <div className="flex gap-3 justify-center">
        <button onClick={() => setShowPotli((p) => !p)} data-testid="btn-potli"
          className="py-3 px-5 rounded-2xl text-white font-bold text-sm active:scale-95 transition-transform border-2 border-white/40"
          style={{ background: "rgba(255,255,255,0.2)", fontFamily: "'Fredoka One', cursive" }}>
          {showPotli ? "Hide Potli" : "Show Potli"} 🐙
        </button>
        <button onClick={reset} data-testid="btn-reset-colors"
          className="py-3 px-5 rounded-2xl text-white font-bold text-sm active:scale-95 transition-transform border-2 border-white/40"
          style={{ background: "rgba(255,255,255,0.2)", fontFamily: "'Fredoka One', cursive" }}>
          Reset 🎨
        </button>
      </div>

      <p className="text-cyan-200 text-xs mt-3" style={{ fontFamily: "'Fredoka One', cursive" }}>
        This is a creative activity — make it your own!
      </p>
    </div>
  );
}
