import { create } from "zustand";
import { TimeTableEntry } from "./entry";
import { DateTime } from "luxon";
import { createJSONStorage, persist } from "zustand/middleware";

interface AppStore {
    entries: TimeTableEntry[];
    addEntry: (entry: TimeTableEntry) => void;
}

const debugData = [
    { id: "1", start: DateTime.local(2024, 4, 10, 8), end: DateTime.local(2024, 4, 10, 12), project: "TSapp" },
    { id: "2", start: DateTime.local(2024, 4, 10, 13), end: DateTime.local(2024, 4, 10, 18) },
    { id: "3", start: DateTime.local(2024, 4, 11, 8), end: DateTime.local(2024, 4, 11, 11) },
];

export const useAppStore = create<AppStore>()(
    persist((set, get) => ({
        entries: [],
        addEntry: (entry) => set({ entries: [...get().entries, entry] }),
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