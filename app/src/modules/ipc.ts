import { app, ipcMain } from "electron";
import ConnectionMonitor from "./monitor";
import { clipboard } from "electron";

ipcMain.handle('getConnectionList', async () => {
    return await ConnectionMonitor.getConnectionList();
})

ipcMain.handle('getProcessInfoByPID', async (l, pid: string) => {
    return await ConnectionMonitor.getProcessInfoByPID(pid);
})

ipcMain.handle("copy", async (l, str: string) => {
    clipboard.writeText(str);
})