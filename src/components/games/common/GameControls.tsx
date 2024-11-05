// src/components/games/common/GameControls.tsx
interface GameControlsProps {
  onStart: () => void;
  onPause?: () => void;
  onReset: () => void;
  isPlaying: boolean;
  canPause?: boolean;
}

export function GameControls({
  onStart,
  onPause,
  onReset,
  isPlaying,
  canPause = false,
}: GameControlsProps) {
  return (
    <div className="flex gap-4">
      <button
        onClick={isPlaying ? (canPause ? onPause : onReset) : onStart}
        className={`px-6 py-2 rounded-lg font-semibold transition-colors ${
          isPlaying
            ? canPause
              ? "bg-yellow-500 hover:bg-yellow-600 text-white"
              : "bg-red-500 hover:bg-red-600 text-white"
            : "bg-green-500 hover:bg-green-600 text-white"
        }`}
      >
        {isPlaying ? (canPause ? "Pause" : "Stop") : "Start"}
      </button>
      <button
        onClick={onReset}
        className="px-6 py-2 rounded-lg font-semibold bg-gray-200 hover:bg-gray-300 transition-colors"
      >
        Reset
      </button>
    </div>
  );
}
