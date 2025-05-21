import { app } from "electron";
import { createWindow, Windows } from "./modules/windows";
import './modules/ipc'
app.whenReady().then(() => {
    createWindow();
})

app.on('window-all-closed', () => {
    app.exit();
})

export function sendToRenderer(name: string, data: any) {
    Windows.MAIN_WINDOW?.webContents?.send(name, data);
}