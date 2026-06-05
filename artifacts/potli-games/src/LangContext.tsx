import { createContext, useContext, useState, type ReactNode } from "react";

export type Lang = "en" | "hi";

export const translations = {
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

type Translations = typeof translations.en;

interface LangContextType {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: Translations;
}

const LangContext = createContext<LangContextType>({
  lang: "en",
  setLang: () => {},
  t: translations.en,
});

export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>("en");
  return (
    <LangContext.Provider value={{ lang, setLang, t: translations[lang] }}>
      {children}
    </LangContext.Provider>
  );
}

export function useLang() {
  return useContext(LangContext);
}
