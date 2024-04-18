import { Moon, Sun } from "@phosphor-icons/react";
import { ActionButton, Flex, Header, Image, SegmentedField, Text, Tooltip, fr, usePrismaneTheme, useThemeModeValue } from "@prismane/core";
import { useAppStore } from "../data/stores";
import { set } from "idb-keyval";
import logo from "../../public/icon.png";

interface HeaderBarProps {
    /** Show the data switch (assumes data store was initialized) */
    dataSwitch?: boolean,
};

export default function HeaderBar({ dataSwitch }: HeaderBarProps) {
    const toggleThemeModeStore = useAppStore(s => s.toggleThemeMode);
    const { toggleThemeMode, theme } = usePrismaneTheme();

    const dataSource = useAppStore().dataSource;
    const setDataSource = useAppStore().setDataSource;

    const toggle = () => {
        toggleThemeMode();
        toggleThemeModeStore();
    };

    return (
        <Header
            bg={useThemeModeValue(["primary", 200, 0.5], ["primary", 900, 0.3])}
            p={fr(2)} gap={fr(4)}
            justify="end" align="center"
        >
            <Flex direction="row" gap={fr(4)} align="center" mr="auto">
                <Image src={logo} h={fr(16)} fit="contain" />
                <Text as="h1" mr="auto">Time tracker</Text>
            </Flex>
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