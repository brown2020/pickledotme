import { Button } from "@/components/ui";
import { Play, RotateCcw, Square } from "lucide-react";

interface GameControlsProps {
  onStart: () => void;
  onPause?: () => void;
  onReset: () => void;
  isPlaying: boolean;
  canPause?: boolean;
}

export function GameControls({
  onStart,
  onReset,
  isPlaying,
  canPause = false,
  onPause,
}: GameControlsProps) {
  return (
    <div className="flex gap-3">
      <Button
        onClick={isPlaying ? (canPause ? onPause : onReset) : onStart}
        variant={isPlaying ? (canPause ? "secondary" : "destructive") : "primary"}
        className="gap-2"
      >
        {isPlaying ? (
          canPause ? (
            <>
              <Square className="w-4 h-4" />
              Pause
            </>
          ) : (
            <>
              <Square className="w-4 h-4" />
              Stop
            </>
          )
        ) : (
          <>
            <Play className="w-4 h-4" />
            Start
          </>
        )}
      </Button>
      <Button onClick={onReset} variant="ghost" className="gap-2">
        <RotateCcw className="w-4 h-4" />
        Reset
      </Button>
    </div>
  );
}
