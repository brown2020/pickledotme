import { Button } from "@/components/ui";
import { Play, RotateCcw, Square } from "lucide-react";
import { useSound } from "@/hooks/useSound";

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
  const { playSound } = useSound();
  const primaryAction = isPlaying ? (canPause ? onPause : onReset) : onStart;

  const runAction = (action: (() => void) | undefined) => {
    playSound("click");
    action?.();
  };

  return (
    <div className="flex gap-3">
      <Button
        onClick={() => runAction(primaryAction)}
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
      <Button
        onClick={() => runAction(onReset)}
        variant="ghost"
        className="gap-2"
      >
        <RotateCcw className="w-4 h-4" />
        Reset
      </Button>
    </div>
  );
}
