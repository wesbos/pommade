import { ipcMain, nativeTheme } from 'electron';
import { menubar } from 'menubar';

const width = 960;
const height = 540;

let image = '';

const createWindow = () => {
  ipcMain.handle('dark-mode:toggle', () => {
    if (nativeTheme.shouldUseDarkColors) {
      nativeTheme.themeSource = 'light';
      image = './images/hair-white-icon.png';
    } else {
      nativeTheme.themeSource = 'dark'
      image = './images/hair-icon.png';
    }
    return nativeTheme.shouldUseDarkColors
  })

  ipcMain.handle('dark-mode:system', () => {
    nativeTheme.themeSource = 'system'
  })
}

const mb = menubar({
  index: `file://${__dirname}/../index.html`,
  browserWindow: {
    transparent: true,
    width,
    height,
    alwaysOnTop: true,
    webPreferences: {
      preload: __dirname + '/preload.js',
    }
  },
  icon: image
});

mb.on('ready', () => {
  console.log('Menubar app is ready.');
  createWindow()
  mb.showWindow();
  // @ts-expect-error
  mb.window?.openDevTools();
});

ipcMain.addListener('video:play', (event, data) => {
  const multiplier = width / data.width;
  mb.window?.setSize(width, data.height * multiplier);
});

export {}
