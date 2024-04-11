import { createContext, useContext, useMemo, useRef, useState } from "react";
import { AppState, AppStore, createAppStore } from "./store";
import { useStore } from "zustand";
import { Button } from "@prismane/core";

const StoreContext = createContext<AppStore | undefined>(undefined);

export function useStoreContext<T>(selector: (state: AppState) => T): T {
    const store = useContext(StoreContext);
    if (!store) throw new Error('Missing StoreContext.Provider in the tree')
    return useStore(store, selector)
}

export default function StoreProvider(props: React.PropsWithChildren) {
    const [fileHandle, setFileHandle] = useState<FileSystemFileHandle | undefined>(undefined);

    const storeRef = useRef<AppStore>();

    const openFile = async () => {
        if (!window.isSecureContext) return;
        try {
            const [fh] = await window.showOpenFilePicker();
            setFileHandle(fh);
            storeRef.current = createAppStore(fh);
        } catch (e) {
            console.error(e);
        }
    };

    return (<>
        {fileHandle
            ? <StoreContext.Provider value={storeRef.current} >
                {props.children}
            </StoreContext.Provider >
            : <Button onClick={openFile}>Open existing file</Button >
        }
    </>)
}