"use client";

import { Volume2, VolumeX } from "lucide-react";
import { useSettingsStore } from "@/stores/settingsStore";

export function HeaderSoundToggle() {
  const isSoundEnabled = useSettingsStore((s) => s.isSoundEnabled);
  const toggleSound = useSettingsStore((s) => s.toggleSound);

  return (
    <button
      onClick={toggleSound}
      className="p-2 rounded-xl text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
      aria-label="Toggle sound"
    >
      {isSoundEnabled ? (
        <Volume2 className="w-5 h-5" />
      ) : (
        <VolumeX className="w-5 h-5" />
      )}
    </button>
  );
}
