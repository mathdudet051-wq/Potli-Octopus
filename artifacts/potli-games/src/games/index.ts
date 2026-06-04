import TrashCollector from "./TrashCollector";
import RecycleSorter from "./RecycleSorter";
import OceanMemory from "./OceanMemory";
import CoralBuilder from "./CoralBuilder";
import OilCleanup from "./OilCleanup";
import BubbleFacts from "./BubbleFacts";
import FeedTheFish from "./FeedTheFish";
import SeaweedGarden from "./SeaweedGarden";
import TrashTreasure from "./TrashTreasure";
import EcoQuiz from "./EcoQuiz";
import JellyfishDodge from "./JellyfishDodge";
import ShellSort from "./ShellSort";
import EcoGangRescue from "./EcoGangRescue";
import PlasticFreeHero from "./PlasticFreeHero";
import DeepSeaExplorer from "./DeepSeaExplorer";
import BubbleShooter from "./BubbleShooter";
import OceanAlphabet from "./OceanAlphabet";
import FishingLitter from "./FishingLitter";
import SimonSaysSea from "./SimonSaysSea";
import StarfishSorter from "./StarfishSorter";
import WhirlpoolMaze from "./WhirlpoolMaze";
import OceanColoring from "./OceanColoring";

export type Game = {
  id: string;
  name: string;
  emoji: string;
  description: string;
  component: React.ComponentType;
};

import type React from "react";

export const GAMES: Game[] = [
  { id: "trash-collector", name: "Trash Collector", emoji: "🗑️", description: "Catch ocean trash before it sinks!", component: TrashCollector },
  { id: "recycle-sorter", name: "Recycle Sorter", emoji: "♻️", description: "Sort items into the right bins!", component: RecycleSorter },
  { id: "ocean-memory", name: "Ocean Memory", emoji: "🃏", description: "Match the sea creature pairs!", component: OceanMemory },
  { id: "coral-builder", name: "Coral Reef Builder", emoji: "🪸", description: "Plant 20 corals to save the reef!", component: CoralBuilder },
  { id: "oil-cleanup", name: "Oil Spill Cleanup", emoji: "🛢️", description: "Click to clean the oily ocean tiles!", component: OilCleanup },
  { id: "bubble-facts", name: "Bubble Pop Facts", emoji: "🫧", description: "Pop bubbles to learn ocean facts!", component: BubbleFacts },
  { id: "feed-fish", name: "Feed the Fish", emoji: "🐟", description: "Give fish real food, not plastic!", component: FeedTheFish },
  { id: "seaweed-garden", name: "Seaweed Garden", emoji: "🌿", description: "Grow a beautiful underwater garden!", component: SeaweedGarden },
  { id: "trash-treasure", name: "Trash vs Treasure", emoji: "💎", description: "Click trash fast — not the treasure!", component: TrashTreasure },
  { id: "eco-quiz", name: "Eco Quiz", emoji: "🧠", description: "Test your ocean-saving knowledge!", component: EcoQuiz },
  { id: "jellyfish-dodge", name: "Jellyfish Dodge", emoji: "🎐", description: "Help Potli dodge the plastic bags!", component: JellyfishDodge },
  { id: "shell-sort", name: "Shell Color Sort", emoji: "🐚", description: "Sort colourful shells into buckets!", component: ShellSort },
  { id: "eco-gang", name: "Eco Gang Rescue", emoji: "🦀", description: "Free Potli's friends from plastic nets!", component: EcoGangRescue },
  { id: "plastic-free", name: "Plastic Free Hero", emoji: "🌍", description: "Swap single-use items for eco ones!", component: PlasticFreeHero },
  { id: "deep-sea", name: "Deep Sea Explorer", emoji: "🔭", description: "Dive deep and discover sea creatures!", component: DeepSeaExplorer },
  { id: "bubble-shooter", name: "Bubble Shooter", emoji: "🎯", description: "Shoot bubbles to clear the board!", component: BubbleShooter },
  { id: "ocean-alphabet", name: "Ocean Alphabet", emoji: "🔤", description: "Tap letters to spell ocean words!", component: OceanAlphabet },
  { id: "fishing-litter", name: "Fishing for Litter", emoji: "🎣", description: "Fish out trash from the water!", component: FishingLitter },
  { id: "simon-sea", name: "Simon Says Sea", emoji: "🌊", description: "Repeat the ocean pattern sequence!", component: SimonSaysSea },
  { id: "starfish-sort", name: "Starfish Sorter", emoji: "⭐", description: "Sort starfish by size into zones!", component: StarfishSorter },
  { id: "whirlpool-maze", name: "Whirlpool Maze", emoji: "🌀", description: "Guide Potli through the underwater maze!", component: WhirlpoolMaze },
  { id: "ocean-coloring", name: "Ocean Coloring", emoji: "🎨", description: "Colour your own ocean scene!", component: OceanColoring },
];
