import { LucideIcon } from "lucide-react";
import {
  Apple,
  Banana,
  Cherry,
  Heart,
  Star,
  Sun,
  Moon,
  Cloud,
  Flower2,
  Leaf,
  Sparkles,
  Crown,
  Trophy,
  Medal,
  Target,
  Gamepad2,
  Bird,
  Fish,
  Bug,
  Gift,
  Rocket,
  Zap,
  Music,
  Phone,
} from "lucide-react";

export interface Card {
  id: number;
  icon: LucideIcon;
  isFlipped: boolean;
  isMatched: boolean;
}

export const ALL_ICONS = [
  Apple,
  Banana,
  Cherry,
  Heart,
  Star,
  Sun,
  Moon,
  Cloud,
  Flower2,
  Leaf,
  Sparkles,
  Crown,
  Trophy,
  Medal,
  Target,
  Gamepad2,
  Bird,
  Fish,
  Bug,
  Gift,
  Rocket,
  Zap,
  Music,
  Phone,
];
