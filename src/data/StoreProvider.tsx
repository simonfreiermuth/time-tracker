import { createContext, useContext, useRef, useState } from "react";
import { DataStoreState, DataStore, createDataStore } from "./stores";
import { useStore } from "zustand";
import { ActionButton, Alert, Box, Button, Card, Center, Divider, Flex, fr, useThemeModeValue, useToast } from "@prismane/core";
import HeaderBar from "../components/HeaderBar";
import { File, FileDashed, FileText } from "@phosphor-icons/react";

const StoreContext = createContext<DataStore | undefined>(undefined);

export function useDataStore<T>(selector: (state: DataStoreState) => T): T {
    const store = useContext(StoreContext);
    if (!store) throw new Error('Missing StoreContext.Provider in the tree')
    return useStore(store, selector)
}

export default function DataStoreProvider(props: React.PropsWithChildren) {
    const background = useThemeModeValue(["base", 50], ["base", 900]);
    const toast = useToast();
    const [storageReady, setStorageReady] = useState(false);

    const storeRef = useRef<DataStore>();


    const openFile = async () => {
        if (!window.isSecureContext) toast({ element: <Alert variant="error" >Can not access files in unsecure context</Alert> });
        try {
            const [fh] = await window.showOpenFilePicker();
            storeRef.current = createDataStore(fh);
            setStorageReady(true);
        } catch (e) {
            toast({ element: <Alert variant="error">Something went wrong while loading local data</Alert> })
            console.error(e);
        }
    };

    const createFile = async () => {
        if (!window.isSecureContext) toast({ element: <Alert variant="error" >Can not access file system in unsecure context</Alert> });
        try {
            const fs = await window.showDirectoryPicker({ mode: "readwrite" });
            const fh = await fs.getFileHandle(
                `data-${crypto.randomUUID()}.json`,
                { create: true }
            );
            storeRef.current = createDataStore(fh);
            setStorageReady(true);
        } catch (e) {
            toast({ element: <Alert variant="error">Something went wrong while creating new file</Alert> })
            console.error(e);
        }
    };

    const useLocalStorage = () => {
        storeRef.current = createDataStore();
        setStorageReady(true);
    };

    return (<>
        {storageReady
            ? <StoreContext.Provider value={storeRef.current} >
                {props.children}
            </StoreContext.Provider >
            : <Box mih="100vh" bg={background}>
                <HeaderBar />
                <Center h="100%" >
                    <Card h={fr(30)} align="center" direction="row" p={fr(4)} gap={fr(4)} m={fr(16)}>
                        <ActionButton
                            size="lg"
                            icon={<FileText size={32} />}
                            onClick={openFile}
                            sx={{ flexDirection: "column" }}
                        >
                            Open existing file
                        </ActionButton>
                        <ActionButton
                            size="lg"
                            icon={<File size={32} />}
                            onClick={createFile}
                            sx={{ flexDirection: "column" }}
                        >
                            Create new file
                        </ActionButton>
                        <Divider orientation="vertical" />
                        <ActionButton
                            size="lg"
                            icon={<FileDashed size={32} />}
                            onClick={useLocalStorage}
                            sx={{ flexDirection: "column" }}
                        >
                            Use local storage
                        </ActionButton>
                    </Card>
                </Center>
            </Box>
        }
    </>)
}