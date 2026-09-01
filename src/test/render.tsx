import { ReactElement } from "react";
import { render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ThemeWrapper from "../components/ThemeWrapper";
import { DataStoreState, createDataStore } from "../data/stores";
import { StoreContext } from "../data/useDataStore";

/**
 * Render inside the Prismane theme and a fresh (localStorage backed) data store.
 * Returns a user-event session and the store, so tests can seed and assert state.
 */
export function renderUI(ui: ReactElement, seed?: Partial<DataStoreState>) {
    const store = createDataStore();
    if (seed) store.setState(seed);

    return {
        user: userEvent.setup(),
        store,
        ...render(ui, {
            wrapper: ({ children }) => (
                <ThemeWrapper>
                    <StoreContext.Provider value={store}>{children}</StoreContext.Provider>
                </ThemeWrapper>
            ),
        }),
    };
}
