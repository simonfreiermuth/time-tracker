import { create, createStore } from "zustand";
import { TimeTableEntry } from "./entry";
import { Project } from "./project";
import { DateTime } from "luxon";
import { createJSONStorage, persist } from "zustand/middleware";
import { dualStorage } from "./dualStorage";

export interface DataStoreState {
    entries: TimeTableEntry[];
    projects: Project[];

    addEntry: (entry: TimeTableEntry) => void;
    updateEntry: (entry: TimeTableEntry) => void;
    deleteEntry: (entry: TimeTableEntry) => void;
    setExported: (entries: TimeTableEntry[], exported: boolean) => void;

    addProject: (project: Project) => void;
    updateProject: (project: Project) => void;
    deleteProject: (project: Project) => void;
}

export type DataStore = ReturnType<typeof createDataStore>;

export const createDataStore = (fileHandle?: FileSystemFileHandle) => {
    return createStore<DataStoreState>()(
        persist((set, get) => ({
            entries: [],
            projects: [],

            addEntry: (entry) => set({ entries: [...get().entries, entry] }),
            updateEntry: (entry) => set({ entries: [...get().entries.filter(e => e.id !== entry.id), entry] }),
            deleteEntry: (entry) => set({ entries: [...get().entries.filter(e => e.id !== entry.id)] }),
            setExported: (entries, exported) => {
                const ids = new Set(entries.map(e => e.id));
                set({ entries: get().entries.map(e => ids.has(e.id) ? { ...e, exported: exported } : e) });
            },

            addProject: (project) => set({ projects: [...get().projects, project] }),
            updateProject: (project) => set({ projects: get().projects.map(p => p.id === project.id ? project : p) }),
            deleteProject: (project) => set({ projects: get().projects.filter(p => p.id !== project.id) }),
        }), {
            name: "data-storage",
            storage: createJSONStorage(() => dualStorage(fileHandle), {
                reviver: (key, value) => {
                    // only entry timestamps are dates — other strings must stay strings
                    if ((key === "start" || key === "end") && typeof value === "string") {
                        const d = DateTime.fromISO(value);
                        if (d.isValid) return d;
                    }
                    return value;
                }
            })
        })
    );
};

export type DataSource = "localStorage" | "file";

export interface AppStore {
    themeMode: "light" | "dark";
    dataSource?: DataSource;

    toggleThemeMode: () => void;
    setDataSource: (source: DataSource) => void;
}

export const useAppStore = create<AppStore>()(
    persist((set, get) => ({
        themeMode: "dark",
        dataSource: undefined,

        toggleThemeMode: () => set({ themeMode: get().themeMode === "dark" ? "light" : "dark" }),
        setDataSource: (src) => set({ dataSource: src }),
    }), {
        name: "app-storage",
        storage: createJSONStorage(() => localStorage)
    })
);