declare global {
    interface Window {
        app: {
            send(channel: string, ...args: any[]): void;
            receive(channel: string, callback: (event: Electron.IpcRendererEvent, ...args: any[]) => void): () => void;
            invoke(channel: string, ...args: any[]): Promise<any>;
            clearAllListeners(): void;
        };
    }
}
export { };