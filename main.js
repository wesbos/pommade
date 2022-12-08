const { ipcMain } = require('electron');
const { menubar } = require('menubar');

const mb = menubar({
	browserWindow: {
		transparent: true,
    width: 1920 / 2,
		height:  1080 / 2,
    alwaysOnTop: true
	 },
   icon: './images/hair-icon.png'
});

mb.on('ready', () => {
	console.log('Menubar app is ready.');
  mb.showWindow();
  // mb.window.openDevTools();
});
