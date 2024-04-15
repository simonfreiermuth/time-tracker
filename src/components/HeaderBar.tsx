import { Moon, Sun, Timer } from "@phosphor-icons/react";
import { ActionButton, Header, SegmentedField, Text, Tooltip, fr, usePrismaneColor, usePrismaneTheme, useThemeModeValue } from "@prismane/core";
import { useAppStore } from "../data/stores";
import { set } from "idb-keyval";

interface HeaderBarProps {
    /** Show the data switch (assumes data store was initialized) */
    dataSwitch?: boolean,
};

export default function HeaderBar({ dataSwitch }: HeaderBarProps) {
    const toggleThemeModeStore = useAppStore(s => s.toggleThemeMode);
    const { toggleThemeMode, theme } = usePrismaneTheme();
    const { getColor } = usePrismaneColor();

    const dataSource = useAppStore().dataSource;
    const setDataSource = useAppStore().setDataSource;

    const toggle = () => {
        toggleThemeMode();
        toggleThemeModeStore();
    };

    return (
        <Header
            bg={useThemeModeValue(["primary", 200, 0.5], ["primary", 900, 0.3])}
            p={fr(4)} gap={fr(2)}
            justify="end" align="center"
        >
            <Text as="h1" mr="auto" >Time tracker <Timer size={32} weight="fill" color={getColor("primary")} /> </Text>
            {dataSwitch && <Tooltip
                position="bottom-end" size="md" color="primary"
                label="Store data in a local file or browsers localStorage" >
                <SegmentedField
                    value={dataSource}
                    onChange={async (e: any) => {
                        setDataSource(e.target.value);
                        await set("filehandle", undefined); // TODO generally handle this in less random places
                    }}
                    options={[
                        { element: "localStorage", value: "localStorage" },
                        { element: "file", value: "file" }
                    ]}
                />
            </Tooltip>}
            <ActionButton
                onClick={toggle}
                size="md"
                icon={theme.mode === "light" ? <Moon /> : <Sun />}
            />
        </Header>
    )
}