import { ReactNode } from "react";
import { PRISMANE_COLORS, PrismaneProvider, Toaster } from "@prismane/core";
import { createTheme } from "@prismane/core/themes";
import { useAppStore } from "../data/stores";

/** Apply the Prismane theme in the mode selected in the app store. */
export default function ThemeWrapper({ children }: { children: ReactNode }) {
    const mode = useAppStore(s => s.themeMode);
    const theme = createTheme({
        mode: mode,
        colors: {
            primary: { ...PRISMANE_COLORS.teal },
        },
        fontFamily: "Inter",
    });

    return (
        <PrismaneProvider theme={theme}>
            <Toaster>
                {children}
            </Toaster>
        </PrismaneProvider>
    );
}
