import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('app', {
    send(channel: string, ...args: any[]) {
        ipcRenderer.send(channel, ...args);
    },
    receive(channel: string, callback: (event: Electron.IpcRendererEvent, ...args: any[]) => void) {
        const listener = (event: Electron.IpcRendererEvent, ...args: any[]) => callback(event, ...args);
        ipcRenderer.on(channel, listener);
        return () => ipcRenderer.removeListener(channel, listener);
    },
    invoke(channel: string, ...args: any[]) {
        return ipcRenderer.invoke(channel, ...args);
    },
    clearAllListeners() {
        ipcRenderer.removeAllListeners();
    }
});