import { Moon, Sun } from "@phosphor-icons/react";
import { ActionButton, Header, Switch, Text, fr, usePrismaneTheme, useThemeModeValue } from "@prismane/core";

export default function HeaderBar() {
    const { toggleThemeMode, theme } = usePrismaneTheme();

    return (
        <Header
            bg={useThemeModeValue(["primary", 200, 0.5], ["primary", 900, 0.3])}
            p={fr(4)}
            justify="between" align="center"
        >
            <Text as="h1">Time tracker</Text>
            <ActionButton
                onClick={toggleThemeMode}
                size="md"
                icon={theme.mode === "light" ? <Moon /> : <Sun />}
            />
        </Header>
    )
}