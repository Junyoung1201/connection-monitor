import { ipcMain } from "electron";
import ConnectionMonitor from "./monitor";

ipcMain.handle('getConnectionList', async () => {
    return await ConnectionMonitor.getConnectionList();
})

ipcMain.handle('getProcessInfoByPID', async (l, pid: string) => {
    return await ConnectionMonitor.getProcessInfoByPID(pid);
})