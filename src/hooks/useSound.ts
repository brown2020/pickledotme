"use client";

import { useCallback, useEffect, useRef } from "react";
import { useSettingsStore } from "@/stores/settingsStore";

type SoundEffect =
  | "click"
  | "success"
  | "error"
  | "levelUp"
  | "gameOver"
  | "match"
  | "flip";

interface SoundConfig {
  frequency: number;
  duration: number;
  type: OscillatorType;
  volume?: number;
}

const SOUND_CONFIGS: Record<SoundEffect, SoundConfig> = {
  click: { frequency: 800, duration: 50, type: "sine", volume: 0.3 },
  success: { frequency: 523, duration: 150, type: "sine", volume: 0.4 },
  error: { frequency: 200, duration: 200, type: "sawtooth", volume: 0.3 },
  levelUp: { frequency: 659, duration: 200, type: "sine", volume: 0.5 },
  gameOver: { frequency: 150, duration: 500, type: "triangle", volume: 0.4 },
  match: { frequency: 440, duration: 100, type: "sine", volume: 0.4 },
  flip: { frequency: 600, duration: 30, type: "sine", volume: 0.2 },
};

// Success sound is a chord
const SUCCESS_CHORD = [523.25, 659.25, 783.99]; // C5, E5, G5

export function useSound() {
  const audioContextRef = useRef<AudioContext | null>(null);
  const isMutedRef = useRef(false);
  const isSoundEnabled = useSettingsStore((s) => s.isSoundEnabled);

  // Initialize AudioContext on first user interaction
  const initAudio = useCallback(() => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext })
          .webkitAudioContext)();
    }
    return audioContextRef.current;
  }, []);

  const playTone = useCallback(
    (config: SoundConfig) => {
      if (!isSoundEnabled || isMutedRef.current) return;

      try {
        const ctx = initAudio();
        if (ctx.state === "suspended") {
          ctx.resume();
        }

        const oscillator = ctx.createOscillator();
        const gainNode = ctx.createGain();

        oscillator.type = config.type;
        oscillator.frequency.setValueAtTime(config.frequency, ctx.currentTime);

        gainNode.gain.setValueAtTime(config.volume ?? 0.3, ctx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(
          0.001,
          ctx.currentTime + config.duration / 1000
        );

        oscillator.connect(gainNode);
        gainNode.connect(ctx.destination);

        oscillator.start(ctx.currentTime);
        oscillator.stop(ctx.currentTime + config.duration / 1000);
      } catch {
        // Audio not available, fail silently
      }
    },
    [initAudio, isSoundEnabled]
  );

  const playSound = useCallback(
    (sound: SoundEffect) => {
      if (sound === "success") {
        // Play a chord for success
        SUCCESS_CHORD.forEach((freq, i) => {
          setTimeout(() => {
            playTone({ ...SOUND_CONFIGS.success, frequency: freq });
          }, i * 50);
        });
      } else if (sound === "levelUp") {
        // Play ascending notes for level up
        [523, 659, 784, 1047].forEach((freq, i) => {
          setTimeout(() => {
            playTone({
              ...SOUND_CONFIGS.levelUp,
              frequency: freq,
              duration: 100,
            });
          }, i * 80);
        });
      } else {
        playTone(SOUND_CONFIGS[sound]);
      }
    },
    [playTone]
  );

  const toggleMute = useCallback(() => {
    isMutedRef.current = !isMutedRef.current;
    return isMutedRef.current;
  }, []);

  const setMuted = useCallback((muted: boolean) => {
    isMutedRef.current = muted;
  }, []);

  // Cleanup
  useEffect(() => {
    return () => {
      audioContextRef.current?.close();
    };
  }, []);

  return {
    playSound,
    toggleMute,
    setMuted,
    isMuted: () => isMutedRef.current,
  };
}
