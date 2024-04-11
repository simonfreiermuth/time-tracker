import { createStore } from "zustand";
import { TimeTableEntry } from "./entry";
import { DateTime } from "luxon";
import { createJSONStorage, persist } from "zustand/middleware";
import { dualStorage } from "./dualStorage";

export interface AppState {
    themeMode: "light" | "dark";
    entries: TimeTableEntry[];

    toggleThemeMode: () => void;
    addEntry: (entry: TimeTableEntry) => void;
    updateEntry: (entry: TimeTableEntry) => void;
    deleteEntry: (entry: TimeTableEntry) => void;
}

export type AppStore = ReturnType<typeof createAppStore>;

export const createAppStore = (fileHandle?: FileSystemFileHandle) => {
    return createStore<AppState>()(
        persist((set, get) => ({
            themeMode: "dark",
            entries: [],

            toggleThemeMode: () => set({ themeMode: get().themeMode === "dark" ? "light" : "dark" }),
            addEntry: (entry) => set({ entries: [...get().entries, entry] }),
            updateEntry: (entry) => set({ entries: [...get().entries.filter(e => e.id !== entry.id), entry] }),
            deleteEntry: (entry) => set({ entries: [...get().entries.filter(e => e.id !== entry.id)] }),
        }), {
            name: "app-storage",
            storage: createJSONStorage(() => dualStorage(fileHandle), {
                reviver: (_, value: any) => {
                    if (value) { // parse any valid date to a DateTime object
                        const d = DateTime.fromISO(value);
                        if (d.isValid) return d;
                    }
                    return value;
                }
            })
        })
    );
};