import { createContext, useContext } from "react";
import { useStore } from "zustand";
import { DataStore, DataStoreState } from "./stores";

export const StoreContext = createContext<DataStore | undefined>(undefined);

/** Read from the data store of the currently selected data source. */
export function useDataStore<T>(selector: (state: DataStoreState) => T): T {
    const store = useContext(StoreContext);
    if (!store) throw new Error("Missing StoreContext.Provider in the tree");
    return useStore(store, selector);
}
