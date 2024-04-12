import { create, createStore } from "zustand";
import { TimeTableEntry } from "./entry";
import { DateTime } from "luxon";
import { createJSONStorage, persist } from "zustand/middleware";
import { dualStorage } from "./dualStorage";

export interface DataStoreState {
    entries: TimeTableEntry[];

    addEntry: (entry: TimeTableEntry) => void;
    updateEntry: (entry: TimeTableEntry) => void;
    deleteEntry: (entry: TimeTableEntry) => void;
}

export type DataStore = ReturnType<typeof createDataStore>;

export const createDataStore = (fileHandle?: FileSystemFileHandle) => {
    return createStore<DataStoreState>()(
        persist((set, get) => ({
            entries: [],

            addEntry: (entry) => set({ entries: [...get().entries, entry] }),
            updateEntry: (entry) => set({ entries: [...get().entries.filter(e => e.id !== entry.id), entry] }),
            deleteEntry: (entry) => set({ entries: [...get().entries.filter(e => e.id !== entry.id)] }),
        }), {
            name: "data-storage",
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

export interface AppStore {
    themeMode: "light" | "dark";

    toggleThemeMode: () => void;
}

export const useAppStore = create<AppStore>()(
    persist((set, get) => ({
        themeMode: "dark",
        toggleThemeMode: () => set({ themeMode: get().themeMode === "dark" ? "light" : "dark" }),
    }), {
        name: "app-storage",
        storage: createJSONStorage(() => localStorage)
    })
);