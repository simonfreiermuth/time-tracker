import { create } from "zustand";
import { TimeTableEntry } from "./entry";
import { DateTime } from "luxon";

interface AppStore {
    entries: TimeTableEntry[];
    addEntry: (entry: TimeTableEntry) => void;
}

export const useAppStore = create<AppStore>((set) => ({
    entries: [
        { id: "1", start: DateTime.local(2024, 4, 1, 8), end: DateTime.local(2024, 4, 1, 12), project: "TSapp" },
        { id: "2", start: DateTime.local(2024, 4, 1, 13), end: DateTime.local(2024, 4, 1, 18) },
        { id: "3", start: DateTime.local(2024, 4, 2, 8), end: DateTime.local(2024, 4, 2, 11) },
    ],
    addEntry: (entry) => set(({ entries }) => ({ entries: [...entries, entry] })),
}))