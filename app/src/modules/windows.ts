import { app, BrowserWindow } from "electron";
import path from "path";

export const Windows: {
    MAIN_WINDOW: Electron.BrowserWindow | null
} = {
    MAIN_WINDOW: null
}

export function createWindow() {
    let win = new BrowserWindow({
        title: "Connection Monitor",
        webPreferences: {
            nodeIntegration: true,
            preload: path.resolve(app.getAppPath(), "preload.js")
        }
    })

    win.setMenuBarVisibility(false);

    if(app.isPackaged) {
        win.loadFile("index.html");
    } else {
        win.loadURL("http://localhost:3001");
        win.webContents.openDevTools({mode:'detach'});
    }

    Windows.MAIN_WINDOW = win;
}