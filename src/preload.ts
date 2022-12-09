import { ipcRenderer, contextBridge } from 'electron';
import { IpcRenderer } from 'electron/renderer';

declare global {
  interface Window {
    ipcRenderer: IpcRenderer
  }
}

contextBridge.exposeInMainWorld('darkMode', {
  toggle: () => ipcRenderer.invoke('dark-mode:toggle'),
  system: () => ipcRenderer.invoke('dark-mode:system')
})

export {}