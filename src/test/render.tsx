import { ReactElement } from "react";
import { render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ThemeWrapper from "../components/ThemeWrapper";

/** Render inside the Prismane theme provider and return a user-event session. */
export function renderUI(ui: ReactElement) {
    return {
        user: userEvent.setup(),
        ...render(ui, { wrapper: ThemeWrapper }),
    };
}
