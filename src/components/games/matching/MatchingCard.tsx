import { Card } from "@/types/matching-game";

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
      className={`
        relative h-24 rounded-lg transition-all transform duration-300
        ${
          card.isMatched
            ? "bg-green-500"
            : card.isFlipped
            ? "bg-blue-500"
            : "bg-gray-200 hover:bg-gray-300"
        }
        disabled:cursor-not-allowed
        ${card.isFlipped || card.isMatched ? "scale-95" : ""}
        flex items-center justify-center
      `}
    >
      <div
        className={`
          transition-all duration-300
          ${
            card.isFlipped || card.isMatched
              ? "scale-100 opacity-100"
              : "scale-0 opacity-0"
          }
        `}
      >
        {(card.isFlipped || card.isMatched) && (
          <Icon className="w-8 h-8 text-white" />
        )}
      </div>
    </button>
  );
}
