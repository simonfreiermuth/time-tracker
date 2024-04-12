import { Moon, Sun, Timer } from "@phosphor-icons/react";
import { ActionButton, Header, Text, fr, usePrismaneColor, usePrismaneTheme, useThemeModeValue } from "@prismane/core";
import { useAppStore } from "../data/stores";

export default function HeaderBar() {
    const toggleThemeModeStore = useAppStore(s => s.toggleThemeMode);
    const { toggleThemeMode, theme } = usePrismaneTheme();
    const { getColor } = usePrismaneColor();

    const toggle = () => {
        toggleThemeMode();
        toggleThemeModeStore();
    }

    return (
        <Header
            bg={useThemeModeValue(["primary", 200, 0.5], ["primary", 900, 0.3])}
            p={fr(4)}
            justify="between" align="center"
        >
            <Text as="h1" >Time tracker <Timer size={32} weight="fill" color={getColor("primary")} /> </Text>
            <ActionButton
                onClick={toggle}
                size="md"
                icon={theme.mode === "light" ? <Moon /> : <Sun />}
            />
        </Header>
    )
}