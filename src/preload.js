const { ipcRenderer, contextBridge } = require('electron');

// contextBridge.exposeInMainWorld('ipcRenderer', ipcRenderer)

contextBridge.exposeInMainWorld('darkMode', {
  toggle: () => ipcRenderer.invoke('dark-mode:toggle'),
  system: () => ipcRenderer.invoke('dark-mode:system')
})