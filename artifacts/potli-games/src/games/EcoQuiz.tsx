import { useState } from "react";
import WinScreen from "./WinScreen";
import { useLang } from "@/LangContext";

const QUESTIONS_EN = [
  "Should we throw plastic in the ocean?",
  "Does a turtle mistake plastic bags for jellyfish?",
  "Is recycling good for the Earth?",
  "Should we use single-use plastic bags every day?",
  "Do oceans produce oxygen for us to breathe?",
  "Is it OK to leave trash on the beach?",
  "Can we help sea creatures by picking up litter?",
  "Does plastic in the ocean hurt fish?",
];
const QUESTIONS_HI = [
  "क्या हम समुद्र में प्लास्टिक फेंकना चाहिए?",
  "क्या कछुए प्लास्टिक की थैलियों को जेलीफ़िश समझते हैं?",
  "क्या रीसायकल करना पृथ्वी के लिए अच्छा है?",
  "क्या हम रोज़ एकल-उपयोग प्लास्टिक की थैलियाँ इस्तेमाल करनी चाहिए?",
  "क्या महासागर हमारे लिए ऑक्सीजन बनाते हैं?",
  "क्या समुद्र तट पर कचरा छोड़ना ठीक है?",
  "क्या कचरा उठाकर हम समुद्री जीवों की मदद कर सकते हैं?",
  "क्या समुद्र में प्लास्टिक मछलियों को नुकसान पहुँचाता है?",
];
const CORRECT = [false, true, true, false, true, false, true, true];

export default function EcoQuiz() {
  const { lang, gameT } = useLang();
  const gm = gameT.ecoQuiz as any;
  const QUESTIONS = lang === "hi" ? QUESTIONS_HI : QUESTIONS_EN;
  const [current, setCurrent] = useState(0);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState<"correct" | "wrong" | null>(null);
  const [won, setWon] = useState(false);

  const answer = (choice: boolean) => {
    if (feedback) return;
    const isCorrect = choice === CORRECT[current];
    setFeedback(isCorrect ? "correct" : "wrong");
    if (isCorrect) setScore((s) => s + 1);
    setTimeout(() => {
      setFeedback(null);
      if (current + 1 >= QUESTIONS.length) setWon(true);
      else setCurrent((c) => c + 1);
    }, 1000);
  };

  const reset = () => { setCurrent(0); setScore(0); setFeedback(null); setWon(false); };
  if (won) return <WinScreen message={gm.winMessage} score={gm.winScore(`${score}/${QUESTIONS.length}`)} onReset={reset} />;

  return (
    <div className="max-w-md mx-auto text-center">
      <p className="text-white text-lg mb-1" style={{ fontFamily: "'Fredoka One', cursive" }}>
        {lang === "hi" ? `प्रश्न ${current + 1} / ${QUESTIONS.length}` : `Question ${current + 1} of ${QUESTIONS.length}`}
      </p>
      <img src="/potli.jpg" alt="Potli" className="w-20 h-20 mx-auto rounded-full border-4 border-yellow-400 object-cover mb-4" />
      <div className="bg-white/20 backdrop-blur rounded-3xl p-6 mb-6 relative min-h-24 flex items-center justify-center">
        <p className="text-white text-2xl font-bold leading-tight" style={{ fontFamily: "'Fredoka One', cursive" }}>
          {QUESTIONS[current]}
        </p>
        {feedback && (
          <div className="absolute inset-0 flex items-center justify-center rounded-3xl text-5xl"
            style={{ background: feedback === "correct" ? "rgba(0,200,0,0.4)" : "rgba(255,0,0,0.4)" }}>
            {feedback === "correct" ? "✅" : "❌"}
          </div>
        )}
      </div>
      <div className="flex gap-4">
        <button data-testid="btn-yes" onClick={() => answer(true)}
          className="flex-1 py-6 rounded-3xl font-bold text-2xl shadow-lg active:scale-95 transition-transform text-white"
          style={{ background: "linear-gradient(135deg, #06d6a0, #028090)", fontFamily: "'Fredoka One', cursive" }}>
          {gm.yes}
        </button>
        <button data-testid="btn-no" onClick={() => answer(false)}
          className="flex-1 py-6 rounded-3xl font-bold text-2xl shadow-lg active:scale-95 transition-transform text-white"
          style={{ background: "linear-gradient(135deg, #e63946, #c1121f)", fontFamily: "'Fredoka One', cursive" }}>
          {gm.no}
        </button>
      </div>
      <p className="text-yellow-300 mt-4 text-lg font-bold" style={{ fontFamily: "'Fredoka One', cursive" }}>
        {lang === "hi" ? `अंक: ${score} ⭐` : `Score: ${score} ⭐`}
      </p>
    </div>
  );
}
