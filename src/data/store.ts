import { create } from "zustand";
import { TimeTableEntry } from "./entry";
import { DateTime } from "luxon";
import { createJSONStorage, persist } from "zustand/middleware";

interface AppStore {
    themeMode: "light" | "dark";
    entries: TimeTableEntry[];

    toggleThemeMode: () => void;
    addEntry: (entry: TimeTableEntry) => void;
}

export const useAppStore = create<AppStore>()(
    persist((set, get) => ({
        themeMode: "dark",
        entries: [],
        addEntry: (entry) => set({ entries: [...get().entries, entry] }),
        toggleThemeMode: () => set({ themeMode: get().themeMode === "dark" ? "light" : "dark"})
    }), {
        name: "app-storage",
        storage: createJSONStorage(() => localStorage, {
            reviver: (_, value: any) => {
                if (value) { // parse any valid date to a DateTime object
                    const d = DateTime.fromISO(value);
                    if (d.isValid) return d;
                }
                return value;
            }
        })
    }));