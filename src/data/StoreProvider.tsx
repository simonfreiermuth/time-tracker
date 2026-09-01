import { PropsWithChildren, ReactNode, useEffect, useState } from "react";
import { DataStore, createDataStore, useAppStore } from "./stores";
import { StoreContext } from "./useDataStore";
import { ActionButton, Alert, Box, Card, Center, Divider, fr, useThemeModeValue, useToast } from "@prismane/core";
import HeaderBar from "../components/HeaderBar";
import { FileDashedIcon, FileIcon, FileTextIcon } from "@phosphor-icons/react";
import { get, set } from "idb-keyval";

/**
 * Ask for a data source on first launch and provide the matching data store.
 * The store is a function itself, so it always has to be set via an updater.
 */
export default function DataStoreProvider(props: PropsWithChildren) {
    const background = useThemeModeValue(["base", 50], ["base", 900]);
    const toast = useToast();

    const dataSource = useAppStore(s => s.dataSource);
    const setDataSource = useAppStore(s => s.setDataSource);

    const [store, setStore] = useState<DataStore>();

    const notify = (variant: "success" | "error", message: ReactNode) =>
        toast({ element: <Alert variant={variant}>{message}</Alert> });

    // reopen the previously chosen data source (on mount and on data source change)
    useEffect(() => {
        if (!dataSource) return;
        (async () => {
            if (dataSource === "localStorage") {
                setStore(() => createDataStore());
                return true;
            }
            // use indexDB directly to avoid serialization by localStorage or Zustand (when wrapping indexDB)
            const fh = await get<FileSystemFileHandle>("filehandle");
            if (!fh) return false; // no handle stored yet, let the user pick a file
            setStore(() => createDataStore(fh));
            return true;
        })()
            .then(reopened => reopened && notify("success", "Reloaded data"))
            .catch(() => notify("error", "Could not automatically reload data"));
        // eslint-disable-next-line react-hooks/exhaustive-deps -- toast is a new function on every render
    }, [dataSource]);

    const requireSecureContext = (what: string) => {
        if (window.isSecureContext) return true;
        notify("error", `Can not access ${what} in an insecure context`);
        return false;
    };

    const openFile = async () => {
        if (!requireSecureContext("files")) return;
        try {
            const [fh] = await window.showOpenFilePicker();
            await set("filehandle", fh);
            setDataSource("file");
            setStore(() => createDataStore(fh));
        } catch (e) {
            notify("error", "Something went wrong while loading local data");
            console.error(e);
        }
    };

    const createFile = async () => {
        if (!requireSecureContext("the file system")) return;
        try {
            const fs = await window.showDirectoryPicker({ mode: "readwrite" });
            const fh = await fs.getFileHandle(
                `data-${crypto.randomUUID()}.json`,
                { create: true }
            );
            await set("filehandle", fh);
            setDataSource("file");
            setStore(() => createDataStore(fh));
        } catch (e) {
            notify("error", "Something went wrong while creating a new file");
            console.error(e);
        }
    };

    const useLocalStorage = async () => {
        await set("filehandle", undefined);
        setDataSource("localStorage");
        setStore(() => createDataStore());
    };

    if (store) return (
        <StoreContext.Provider value={store}>
            {props.children}
        </StoreContext.Provider>
    );

    return (
        <Box mih="100vh" bg={background}>
            <HeaderBar />
            <Center h="100%">
                <Card h={fr(30)} align="center" direction="row" p={fr(4)} gap={fr(4)} m={fr(16)}>
                    <ActionButton
                        size="lg"
                        icon={<FileTextIcon size={32} />}
                        onClick={openFile}
                        sx={{ flexDirection: "column" }}
                    >
                        Open existing file
                    </ActionButton>
                    <ActionButton
                        size="lg"
                        icon={<FileIcon size={32} />}
                        onClick={createFile}
                        sx={{ flexDirection: "column" }}
                    >
                        Create new file
                    </ActionButton>
                    <Divider orientation="vertical" />
                    <ActionButton
                        size="lg"
                        icon={<FileDashedIcon size={32} />}
                        onClick={useLocalStorage}
                        sx={{ flexDirection: "column" }}
                    >
                        Use local storage
                    </ActionButton>
                </Card>
            </Center>
        </Box>
    );
}
