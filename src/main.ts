import { ipcMain } from 'electron';
import { menubar } from 'menubar';

const width = 960;
const height = 540;


const mb = menubar({
  // TODO: Output this file
  index: process.env.VITE_DEV_SERVER_URL || `file://${__dirname}/../index.html`,
  browserWindow: {
    transparent: true,
    width,
    height,
    alwaysOnTop: true,
    webPreferences: {
      preload: __dirname + '/preload.js',
    }
  },
  icon: './images/hair-icon.png'
});

mb.on('ready', () => {
  console.log('Menubar app is ready.');
  mb.showWindow();
  // @ts-expect-error
  mb.window?.openDevTools();
});

ipcMain.addListener('video:play', (event, data) => {
  const multiplier = width / data.width;
  mb.window?.setSize(width, data.height * multiplier);
});

export {}
