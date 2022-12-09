import { BrowserWindow, ipcMain, nativeTheme, app } from 'electron';
import { Menubar, menubar } from 'menubar';

const width = 960;
const height = 540;

const index = process.env.VITE_DEV_SERVER_URL || `file://${__dirname}/../index.html`;
const icons = {
  dark: `./images/hair-white-icon.png`,
  light: `./images/hair-icon.png`,
}

const browserWindow = {
  transparent: true,
  width,
  height,
  alwaysOnTop: false,
  webPreferences: {
    preload: `${__dirname}/preload.js`,
  }
}


function start(): BrowserWindow | Menubar {
  if (process.env.DETACHED) {
    const win = new BrowserWindow({
      ...browserWindow,
      transparent: false
    })
    win.loadURL(index);
    return win;
  }
  else {
    const mb = menubar({
      index,
      browserWindow,
      icon: nativeTheme.shouldUseDarkColors ? icons.dark : icons.light,
    });
    mb.on('ready', () => {
      mb.showWindow();
      mb.window?.webContents.openDevTools();
    });
    return mb;
  }
}

let windowOrMenubar: BrowserWindow | Menubar | undefined;
let window: BrowserWindow | undefined;

app.on('ready', () => {
  windowOrMenubar = start();
  window = windowOrMenubar instanceof BrowserWindow ? windowOrMenubar : windowOrMenubar.window;
  window?.webContents.openDevTools();
});


// Event Listeners
ipcMain.addListener('video:play', (event, data) => {
  const multiplier = width / data.width;
  window?.setSize(width, data.height * multiplier);
});

// dark mode
nativeTheme.addListener('updated', () => {
  if (windowOrMenubar instanceof Menubar) {
    windowOrMenubar.tray.setImage(nativeTheme.shouldUseDarkColors ? icons.dark : icons.light);
  }
});

export {}
