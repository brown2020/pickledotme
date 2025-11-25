import { Card } from "@/types/matching-game";
import { cn } from "@/lib/cn";

interface MatchingCardProps {
  card: Card;
  onClick: () => void;
  disabled: boolean;
}

export function MatchingCard({ card, onClick, disabled }: MatchingCardProps) {
  const Icon = card.icon;

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "relative h-20 md:h-24 rounded-xl transition-all transform duration-300",
        "flex items-center justify-center shadow-md",
        "disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2",
        card.isMatched
          ? "bg-emerald-500 scale-95 shadow-emerald-500/30"
          : card.isFlipped
          ? "bg-blue-500 scale-95 shadow-blue-500/30"
          : "bg-slate-200 hover:bg-slate-300 hover:scale-105"
      )}
    >
      <div
        className={cn(
          "transition-all duration-300",
          card.isFlipped || card.isMatched
            ? "scale-100 opacity-100"
            : "scale-0 opacity-0"
        )}
      >
        {(card.isFlipped || card.isMatched) && (
          <Icon className="w-8 h-8 text-white drop-shadow-sm" />
        )}
      </div>

      {/* Card back pattern */}
      {!card.isFlipped && !card.isMatched && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-10 h-10 rounded-lg bg-slate-300/50 flex items-center justify-center text-2xl">
            🥒
          </div>
        </div>
      )}
    </button>
  );
}
