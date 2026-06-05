import { createContext, useContext, useState, type ReactNode } from "react";

export type Lang = "en" | "hi";

// ── Common UI strings ──────────────────────────────────────────────────────────
const commonEn = {
  tryAgain: "Try Again!",
  start: "Start!",
  playAgain: "Play Again!",
  allGames: "All Games",
  score: "Score",
  time: "Time",
  round: "Round",
  cast: "Cast!",
  shoot: "Shoot!",
  dive: "Dive!",
  swap: "Make the Swap!",
  praise: [
    "Amazing! You saved the sea!",
    "Brilliant! Potli is proud of you!",
    "You're an Eco Hero!",
    "Super job! The ocean thanks you!",
    "Incredible! Keep saving our seas!",
  ],
};
const commonHi = {
  tryAgain: "फिर कोशिश करो!",
  start: "शुरू करो!",
  playAgain: "फिर खेलो!",
  allGames: "सभी खेल",
  score: "अंक",
  time: "समय",
  round: "चक्र",
  cast: "फेंको!",
  shoot: "मारो!",
  dive: "डुबकी लगाओ!",
  swap: "बदलाव करो!",
  praise: [
    "शाबाश! तुमने समुद्र बचाया!",
    "बहुत बढ़िया! पोटली को तुम पर गर्व है!",
    "तुम इको हीरो हो!",
    "बहुत अच्छा! समुद्र तुम्हारा धन्यवाद करता है!",
    "अद्भुत! हमारे समुद्र बचाते रहो!",
  ],
};

// ── Per-game strings ───────────────────────────────────────────────────────────
type GS = {
  instruction: string;
  idle?: string;
  winMessage: string;
  winScore: (n: string | number) => string;
  [k: string]: unknown;
};

const gamesEn: Record<string, GS> = {
  trashCollector: {
    instruction: "Tap trash before it sinks!",
    idle: "Click trash floating up from the ocean floor!",
    gameOver: (n: number, goal: number) => n >= goal ? "You did it!" : `You got ${n}! Try for ${goal}!`,
    winMessage: "You cleaned the ocean!",
    winScore: (n) => `${n} pieces collected!`,
  },
  recycleSorter: {
    instruction: "Which bin does this go in?",
    winMessage: "Great sorting!",
    winScore: (n) => `${n} correct!`,
  },
  oceanMemory: {
    instruction: "Match all the sea creatures!",
    winMessage: "All pairs matched!",
    winScore: (n) => `${n} moves!`,
  },
  coralBuilder: {
    instruction: "Tap anywhere to plant corals!",
    growing: "Your garden is growing!",
    winMessage: "Your reef is beautiful!",
    winScore: (n) => `${n} corals planted!`,
  },
  oilCleanup: {
    instruction: "Click all oily tiles to clean the ocean!",
    winMessage: "Ocean cleaned! All rounds done!",
    winScore: (n) => `${n} rounds completed!`,
  },
  bubbleFacts: {
    instruction: "Pop the bubbles to learn ocean facts!",
    winMessage: "You learned all the facts!",
    winScore: (n) => `${n} bubbles popped!`,
  },
  feedFish: {
    instruction: "Tap the food — not the plastic!",
    yummy: "Yummy! 🐟",
    plastic: "That's plastic! 😱",
    winMessage: "All fish are fed!",
    winScore: (n) => `${n} fish fed!`,
  },
  seaweedGarden: {
    instruction: "Tap the sandy bottom to plant seaweed!",
    growing: "Your garden is growing!",
    winMessage: "Your ocean garden is amazing!",
    winScore: (n) => `${n} plants grown!`,
  },
  trashTreasure: {
    instruction: 'Tap "It\'s Trash!" or leave treasure alone!',
    trashBtn: "It's Trash! 🗑️",
    keepBtn: "Keep it! 💎",
    trashGood: "✅ Trash caught!",
    trashBad: "❌ That's treasure!",
    skipGood: "✅ Left the treasure!",
    skipBad: "❌ That was trash!",
    winMessage: "Amazing sorting skills!",
    winScore: (n) => `${n} correct!`,
    doneMsg: (n: number, total: number) => `You scored ${n}/${total}! Try for 12+!`,
  },
  ecoQuiz: {
    instruction: "Answer Yes or No!",
    yes: "👍 Yes!",
    no: "👎 No!",
    winMessage: "Quiz complete! You're an Eco Expert!",
    winScore: (n) => `${n} correct!`,
  },
  jellyfishDodge: {
    instruction: "Dodge the plastic bags!",
    startInfo: (t: number) => `Dodge the plastic bags for ${t} seconds!`,
    survived: (n: number) => `You survived ${n}s!`,
    winMessage: "You dodged all the plastic!",
    winScore: (n) => `Survived ${n} seconds!`,
  },
  shellSort: {
    instruction: "Drag shells into the matching colour bucket!",
    hint: (label: string) => `This shell is ${label}!`,
    tip: "Tip: The shell colour shows when you pick it up!",
    winMessage: "All shells sorted!",
    winScore: (n) => `${n} sorted!`,
  },
  ecoGang: {
    instruction: "Tap Potli's friends to break their plastic nets!",
    winMessage: "All Eco Gang friends saved!",
    winScore: (_n) => "5 friends freed!",
    saved: "✅ Saved!",
    yay: "Yay!",
  },
  plasticFree: {
    instruction: "Tap to swap single-use plastic for an eco-friendly alternative!",
    swapped: "Great swap! Next one coming...",
    swapBtn: "♻️ Make the Swap!",
    ecoChoice: "Eco choice!",
    ecoSwapped: "Eco Swapped! ♻️",
    winMessage: "You're a Plastic Free Hero!",
    winScore: (n) => `${n} swaps made!`,
  },
  deepSea: {
    instruction: "Dive to discover sea creatures!",
    lurks: "Something lurks here...",
    winMessage: "You explored the whole ocean!",
    winScore: (n) => `${n} creatures discovered!`,
    diveBtn: (level: number, total: number) =>
      level === 0 ? "🔭 Dive!" : level + 1 < total ? "🌊 Go Deeper!" : "🎉 Done!",
  },
  bubbleShooter: {
    instruction: "Click a column to aim, then Shoot! Match 3+ same colour to pop!",
    winMessage: "All bubbles cleared!",
    winScore: (n) => `${n} bubbles popped!`,
    next: "Next:",
  },
  oceanAlphabet: {
    instruction: "Tap the letters in the right order to spell the word!",
    winMessage: "You spelled all the words!",
    winScore: (n) => `${n} words spelled!`,
  },
  fishingLitter: {
    instruction: "Fish out the trash! Let the fish swim free.",
    casting: "Fishing...",
    litterCaught: "+1",
    oops: "Oops! Fish swam away!",
    winMessage: "Amazing fisher! Ocean is cleaner!",
    winScore: (n) => `${n} litter caught!`,
    doneMsg: (n: number) => `You caught ${n} litter! Try for 8+!`,
  },
  simonSea: {
    instruction: "Repeat the ocean pattern!",
    watch: "Watch carefully...",
    yourTurn: (step: number, total: number) => `Your turn! Step ${step}/${total}`,
    wrong: "Oh no! Wrong order!",
    winMessage: "You have an amazing memory!",
    winScore: (n) => `${n} steps remembered!`,
    doneMsg: (n: number, best: number) => `You got to ${n} steps! Best: ${Math.max(best, n)}`,
  },
  starfishSort: {
    instruction: "Drag each starfish to the right size zone!",
    winMessage: "Perfect sorting!",
    winScore: (n) => `${n} sorted!`,
  },
  whirlpoolMaze: {
    instruction: "Use buttons or arrow keys to move Potli!",
    winMessage: "You escaped the whirlpool!",
    winScore: (n) => `${n} bonus litter collected!`,
  },
  oceanColoring: {
    instruction: "Pick a colour then tap a region.",
    showPotli: "Show Potli 🐙",
    hidePotli: "Hide Potli",
    reset: "Reset 🎨",
    creative: "This is a creative activity — make it your own!",
    winMessage: "Great artwork!",
    winScore: (_n) => "",
  },
};

const gamesHi: Record<string, GS> = {
  trashCollector: {
    instruction: "डूबने से पहले कचरा पकड़ो!",
    idle: "समुद्र के तल से ऊपर आते कचरे को पकड़ो!",
    gameOver: (n: number, goal: number) => n >= goal ? "कर दिया!" : `${n} अंक! ${goal} के लिए कोशिश करो!`,
    winMessage: "तुमने समुद्र साफ़ किया!",
    winScore: (n) => `${n} टुकड़े इकट्ठे किए!`,
  },
  recycleSorter: {
    instruction: "इसे किस डिब्बे में डालेंगे?",
    winMessage: "बहुत अच्छे से छाँटा!",
    winScore: (n) => `${n} सही!`,
  },
  oceanMemory: {
    instruction: "समुद्री जीवों के जोड़े मिलाओ!",
    winMessage: "सभी जोड़े मिल गए!",
    winScore: (n) => `${n} चालें!`,
  },
  coralBuilder: {
    instruction: "मूंगा लगाने के लिए कहीं भी दबाओ!",
    growing: "तुम्हारा बगीचा बढ़ रहा है!",
    winMessage: "तुम्हारी चट्टान बहुत सुंदर है!",
    winScore: (n) => `${n} मूंगे लगाए!`,
  },
  oilCleanup: {
    instruction: "तेल वाली टाइलें साफ़ करने के लिए क्लिक करो!",
    winMessage: "समुद्र साफ़ हो गया! सब चक्र पूरे!",
    winScore: (n) => `${n} चक्र पूरे!`,
  },
  bubbleFacts: {
    instruction: "समुद्री तथ्य जानने के लिए बुलबुले फोड़ो!",
    winMessage: "तुमने सभी तथ्य सीख लिए!",
    winScore: (n) => `${n} बुलबुले फोड़े!`,
  },
  feedFish: {
    instruction: "असली खाना दबाओ — प्लास्टिक नहीं!",
    yummy: "स्वादिष्ट! 🐟",
    plastic: "यह प्लास्टिक है! 😱",
    winMessage: "सभी मछलियाँ खुश!",
    winScore: (n) => `${n} मछलियाँ खिलाई!`,
  },
  seaweedGarden: {
    instruction: "रेतीली तली दबाओ और शैवाल लगाओ!",
    growing: "तुम्हारा बगीचा बढ़ रहा है!",
    winMessage: "समुद्री बगीचा बहुत सुंदर है!",
    winScore: (n) => `${n} पौधे उगाए!`,
  },
  trashTreasure: {
    instruction: '"यह कचरा है!" दबाओ या खज़ाना छोड़ दो!',
    trashBtn: "यह कचरा है! 🗑️",
    keepBtn: "रखो! 💎",
    trashGood: "✅ कचरा पकड़ा!",
    trashBad: "❌ वह खज़ाना था!",
    skipGood: "✅ खज़ाना छोड़ दिया!",
    skipBad: "❌ वह कचरा था!",
    winMessage: "शानदार! कचरा पहचान लिया!",
    winScore: (n) => `${n} सही!`,
    doneMsg: (n: number, total: number) => `${n}/${total} अंक! 12+ के लिए कोशिश करो!`,
  },
  ecoQuiz: {
    instruction: "हाँ या नहीं में जवाब दो!",
    yes: "👍 हाँ!",
    no: "👎 नहीं!",
    winMessage: "प्रश्नोत्तरी पूरी! तुम इको विशेषज्ञ हो!",
    winScore: (n) => `${n} सही!`,
  },
  jellyfishDodge: {
    instruction: "प्लास्टिक की थैलियों से बचो!",
    startInfo: (t: number) => `${t} सेकंड तक प्लास्टिक से बचो!`,
    survived: (n: number) => `${n} सेकंड बचे!`,
    winMessage: "तुमने सारे प्लास्टिक से बचाया!",
    winScore: (n) => `${n} सेकंड बचे!`,
  },
  shellSort: {
    instruction: "सीपें खींचो और सही रंग की बाल्टी में डालो!",
    hint: (label: string) => `यह सीप ${label} रंग की है!`,
    tip: "सुझाव: उठाने पर सीप का रंग दिखेगा!",
    winMessage: "सभी सीपें छँट गईं!",
    winScore: (n) => `${n} छाँटे!`,
  },
  ecoGang: {
    instruction: "पोटली के दोस्तों को प्लास्टिक जाल से छुड़ाने के लिए दबाओ!",
    winMessage: "सभी इको दोस्त बच गए!",
    winScore: (_n) => "5 दोस्त आज़ाद!",
    saved: "✅ बचाया!",
    yay: "वाह!",
  },
  plasticFree: {
    instruction: "एकल-उपयोग प्लास्टिक को इको विकल्प से बदलने के लिए दबाओ!",
    swapped: "शानदार! अगला आ रहा है...",
    swapBtn: "♻️ बदलाव करो!",
    ecoChoice: "इको विकल्प!",
    ecoSwapped: "इको बदलाव! ♻️",
    winMessage: "तुम प्लास्टिक मुक्त हीरो हो!",
    winScore: (n) => `${n} बदलाव किए!`,
  },
  deepSea: {
    instruction: "समुद्री जीव खोजने के लिए डुबकी लगाओ!",
    lurks: "कुछ यहाँ छुपा है...",
    winMessage: "तुमने पूरा समुद्र देखा!",
    winScore: (n) => `${n} जीव खोजे!`,
    diveBtn: (level: number, total: number) =>
      level === 0 ? "🔭 डुबकी लगाओ!" : level + 1 < total ? "🌊 और गहरे जाओ!" : "🎉 हो गया!",
  },
  bubbleShooter: {
    instruction: "कॉलम चुनो, फिर मारो! एक ही रंग के 3+ मिलाओ!",
    winMessage: "सभी बुलबुले साफ़!",
    winScore: (n) => `${n} बुलबुले फोड़े!`,
    next: "अगला:",
  },
  oceanAlphabet: {
    instruction: "अक्षरों को सही क्रम में दबाओ और शब्द बनाओ!",
    winMessage: "सभी शब्द सही लिखे!",
    winScore: (n) => `${n} शब्द लिखे!`,
  },
  fishingLitter: {
    instruction: "कचरा निकालो! मछलियों को जाने दो।",
    casting: "मछली पकड़ रहे हैं...",
    litterCaught: "+1",
    oops: "ओह! मछली निकल गई!",
    winMessage: "शाबाश! समुद्र साफ़!",
    winScore: (n) => `${n} कचरा पकड़ा!`,
    doneMsg: (n: number) => `${n} कचरा पकड़ा! 8+ के लिए कोशिश करो!`,
  },
  simonSea: {
    instruction: "समुद्री पैटर्न दोहराओ!",
    watch: "ध्यान से देखो...",
    yourTurn: (step: number, total: number) => `तुम्हारी बारी! कदम ${step}/${total}`,
    wrong: "ओह! गलत क्रम!",
    winMessage: "तुम्हारी याददाश्त कमाल की है!",
    winScore: (n) => `${n} कदम याद रखे!`,
    doneMsg: (n: number, best: number) => `${n} कदम तक पहुँचे! सबसे अच्छा: ${Math.max(best, n)}`,
  },
  starfishSort: {
    instruction: "हर स्टारफ़िश को सही आकार वाले क्षेत्र में खींचो!",
    winMessage: "सभी स्टारफ़िश छँट गईं!",
    winScore: (n) => `${n} छाँटे!`,
  },
  whirlpoolMaze: {
    instruction: "बटन या तीर बटन से पोटली को चलाओ!",
    winMessage: "भँवर से निकल गए!",
    winScore: (n) => `${n} बोनस कचरा पकड़ा!`,
  },
  oceanColoring: {
    instruction: "रंग चुनो फिर क्षेत्र दबाओ।",
    showPotli: "पोटली दिखाओ 🐙",
    hidePotli: "पोटली छुपाओ",
    reset: "रीसेट 🎨",
    creative: "यह रचनात्मक गतिविधि है — मनमाने रंगो!",
    winMessage: "शानदार कलाकृति!",
    winScore: (_n) => "",
  },
};

// ── Home-page / UI translations ────────────────────────────────────────────────
export const uiTranslations = {
  en: {
    title: "Potli's Ocean Adventure!",
    subtitle: "Help Potli save the sea! Play fun games and become an Eco Hero!",
    play: "Play!",
    backToGames: "← Games",
    games: {
      "trash-collector":   { name: "Trash Collector",      description: "Catch ocean trash before it sinks!" },
      "recycle-sorter":    { name: "Recycle Sorter",        description: "Sort items into the right bins!" },
      "ocean-memory":      { name: "Ocean Memory",          description: "Match the sea creature pairs!" },
      "coral-builder":     { name: "Coral Reef Builder",    description: "Plant 20 corals to save the reef!" },
      "oil-cleanup":       { name: "Oil Spill Cleanup",     description: "Click to clean the oily ocean tiles!" },
      "bubble-facts":      { name: "Bubble Pop Facts",      description: "Pop bubbles to learn ocean facts!" },
      "feed-fish":         { name: "Feed the Fish",         description: "Give fish real food, not plastic!" },
      "seaweed-garden":    { name: "Seaweed Garden",        description: "Grow a beautiful underwater garden!" },
      "trash-treasure":    { name: "Trash vs Treasure",     description: "Click trash fast — not the treasure!" },
      "eco-quiz":          { name: "Eco Quiz",              description: "Test your ocean-saving knowledge!" },
      "jellyfish-dodge":   { name: "Jellyfish Dodge",       description: "Help Potli dodge the plastic bags!" },
      "shell-sort":        { name: "Shell Color Sort",      description: "Sort colourful shells into buckets!" },
      "eco-gang":          { name: "Eco Gang Rescue",       description: "Free Potli's friends from plastic nets!" },
      "plastic-free":      { name: "Plastic Free Hero",     description: "Swap single-use items for eco ones!" },
      "deep-sea":          { name: "Deep Sea Explorer",     description: "Dive deep and discover sea creatures!" },
      "bubble-shooter":    { name: "Bubble Shooter",        description: "Shoot bubbles to clear the board!" },
      "ocean-alphabet":    { name: "Ocean Alphabet",        description: "Tap letters to spell ocean words!" },
      "fishing-litter":    { name: "Fishing for Litter",    description: "Fish out trash from the water!" },
      "simon-sea":         { name: "Simon Says Sea",        description: "Repeat the ocean pattern sequence!" },
      "starfish-sort":     { name: "Starfish Sorter",       description: "Sort starfish by size into zones!" },
      "whirlpool-maze":    { name: "Whirlpool Maze",        description: "Guide Potli through the underwater maze!" },
      "ocean-coloring":    { name: "Ocean Coloring",        description: "Colour your own ocean scene!" },
    },
  },
  hi: {
    title: "पोटली का समुद्री रोमांच!",
    subtitle: "पोटली को समुद्र बचाने में मदद करो! खेलो और बनो इको हीरो!",
    play: "खेलो!",
    backToGames: "← खेल",
    games: {
      "trash-collector":   { name: "कचरा उठाओ",            description: "समुद्र का कचरा डूबने से पहले पकड़ो!" },
      "recycle-sorter":    { name: "रीसायकल करो",           description: "चीज़ें सही डिब्बे में डालो!" },
      "ocean-memory":      { name: "समुद्री याददाश्त",       description: "समुद्री जीव के जोड़े मिलाओ!" },
      "coral-builder":     { name: "मूंगे की चट्टान",        description: "20 मूंगे लगाओ और चट्टान बचाओ!" },
      "oil-cleanup":       { name: "तेल साफ़ करो",            description: "तेल वाली टाइलें साफ़ करो!" },
      "bubble-facts":      { name: "बुलबुला तथ्य",           description: "बुलबुले फोड़ो और तथ्य जानो!" },
      "feed-fish":         { name: "मछली को खिलाओ",         description: "असली खाना दो, प्लास्टिक नहीं!" },
      "seaweed-garden":    { name: "शैवाल बगीचा",            description: "एक सुंदर पानी के अंदर का बगीचा उगाओ!" },
      "trash-treasure":    { name: "कचरा या खज़ाना",         description: "कचरा पहचानो — खज़ाना नहीं!" },
      "eco-quiz":          { name: "इको प्रश्नोत्तरी",        description: "समुद्र बचाने का ज्ञान परखो!" },
      "jellyfish-dodge":   { name: "प्लास्टिक से बचो",       description: "पोटली को प्लास्टिक से बचाओ!" },
      "shell-sort":        { name: "सीप छाँटो",              description: "रंगीन सीपें सही बाल्टी में डालो!" },
      "eco-gang":          { name: "इको दोस्त बचाओ",         description: "पोटली के दोस्तों को जाल से छुड़ाओ!" },
      "plastic-free":      { name: "प्लास्टिक मुक्त हीरो",   description: "इको चीज़ें अपनाओ!" },
      "deep-sea":          { name: "गहरे समुद्र की खोज",     description: "गहरे में जाओ और जीव खोजो!" },
      "bubble-shooter":    { name: "बुलबुला शूटर",           description: "बुलबुले मारो और बोर्ड साफ़ करो!" },
      "ocean-alphabet":    { name: "समुद्री वर्णमाला",        description: "अक्षर दबाओ और शब्द बनाओ!" },
      "fishing-litter":    { name: "कचरा मछुआरा",            description: "पानी से कचरा निकालो!" },
      "simon-sea":         { name: "साइमन कहता है",          description: "समुद्री क्रम दोहराओ!" },
      "starfish-sort":     { name: "स्टारफ़िश छाँटो",         description: "आकार के अनुसार स्टारफ़िश लगाओ!" },
      "whirlpool-maze":    { name: "भँवर भूलभुलैया",          description: "पोटली को भूलभुलैया से निकालो!" },
      "ocean-coloring":    { name: "समुद्र रंगो",             description: "अपना समुद्री चित्र रंगो!" },
    },
  },
} as const;

// ── Context ────────────────────────────────────────────────────────────────────
type UIT = typeof uiTranslations.en;

interface LangContextType {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: UIT;
  common: typeof commonEn;
  gameT: Record<string, GS>;
}

const LangContext = createContext<LangContextType>({
  lang: "en",
  setLang: () => {},
  t: uiTranslations.en,
  common: commonEn,
  gameT: gamesEn,
});

export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>("en");
  return (
    <LangContext.Provider value={{
      lang,
      setLang,
      t: uiTranslations[lang],
      common: lang === "hi" ? commonHi : commonEn,
      gameT: lang === "hi" ? gamesHi : gamesEn,
    }}>
      {children}
    </LangContext.Provider>
  );
}

export function useLang() {
  return useContext(LangContext);
}
