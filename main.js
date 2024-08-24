const { app, BrowserWindow } = require('electron');

const createWindow = () => {
    const win = new BrowserWindow({
        width: 200,
        height: 200,
    });

    win.loadURL('https://google.com');
};

app.whenReady().then(() => {
    createWindow();
});
