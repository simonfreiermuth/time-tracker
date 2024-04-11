import { StateStorage } from "zustand/middleware";

export const dualStorage = (fileHandle?: FileSystemFileHandle): StateStorage => ({
    getItem: async (name) => {
        if (fileHandle) {
            try {
                console.debug("try to reload data from disk");
                const file = await fileHandle.getFile();
                return await file.text();
            } catch (e) {
                console.error("failed to reload data from disk", e);
            }
            console.debug("load local storage data");
            return localStorage.getItem(name);
        }
        return localStorage.getItem(name);
    },
    setItem: async (name, value) => {
        if (fileHandle) {
            console.debug("persist store in file");
            const outStream = await fileHandle.createWritable();
            await outStream.write(value);
            await outStream.close();
        }
        localStorage.setItem(name, value);
    },
    removeItem: async (name) => {
        if (fileHandle) {
            const outStream = await fileHandle.createWritable();
            await outStream.write("");
            await outStream.close();
        }
        localStorage.removeItem(name);
    },
});