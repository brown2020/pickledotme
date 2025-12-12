import { create } from "zustand";
import { persist } from "zustand/middleware";

type SettingsState = {
  isSoundEnabled: boolean;
  setIsSoundEnabled: (isSoundEnabled: boolean) => void;
  toggleSound: () => void;
};

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      isSoundEnabled: true,
      setIsSoundEnabled: (isSoundEnabled) => set({ isSoundEnabled }),
      toggleSound: () =>
        set((state) => ({ isSoundEnabled: !state.isSoundEnabled })),
    }),
    {
      name: "pickle-settings",
      version: 1,
      partialize: (state) => ({ isSoundEnabled: state.isSoundEnabled }),
    }
  )
);
