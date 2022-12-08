const { ipcMain } = require('electron/main');
const { menubar } = require('menubar');
const path = require('path');

const width = 960;
const height = 540;

const mb = menubar({
  browserWindow: {
    transparent: true,
    width,
    height,
    alwaysOnTop: true,
    webPreferences: {
      preload: path.join(__dirname, 'src/preload.js'),
    }
  },
  icon: './images/hair-icon.png'
});

mb.on('ready', () => {
  console.log('Menubar app is ready.');
  mb.showWindow();
  mb.window.openDevTools();
});

ipcMain.addListener('video:play', (event, data) => {
  const multiplier = width / data.width;
  mb.window.setSize(width, data.height * multiplier);
});
