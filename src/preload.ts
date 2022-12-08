import { ipcRenderer, contextBridge } from 'electron';
import { IpcRenderer } from 'electron/renderer';

declare global {
  interface Window {
    ipcRenderer: IpcRenderer
  }
}

contextBridge.exposeInMainWorld('ipcRenderer', ipcRenderer)

export {}
