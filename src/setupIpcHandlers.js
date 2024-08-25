const { ipcMain } = require('electron');
const timer = require('./Timer');
const path = require('path');

function setupIPCHandlers(mainWin, audioWin) {
    ipcMain.handle('get-time', () => {
        return timer.getTime();
    });

    ipcMain.handle('toggle-timer', () => {
        return timer.toggleTimer();
    });

    ipcMain.on('update-timer', (count, time) => {
        mainWin.webContents.send('update-timer', count, time);
    });

    ipcMain.on('update-time', (time) => {
        mainWin.webContents.send('update-time', time);
    });

    ipcMain.handle('reset-timer', () => {
        timer.stopTimer();
        const time = timer.reset();
        mainWin.webContents.send('update-timer', 0, time);
        mainWin.webContents.send('update-time', time);
    })

    ipcMain.on('play-audio', (clip) => {
        const filePath = path.join(__dirname, 'audio', clip);
        audioWin.webContents.send('play-audio', filePath);
    });

    ipcMain.on('quit-app', () => {
        if (mainWin) mainWin.close();
        if (audioWin) audioWin.close();
    });

    ipcMain.on('minimize-app', () => {
        if (mainWin) mainWin.hide();
    });

    ipcMain.on('show-win', () => {
        if (mainWin) mainWin.show();
    });
}

module.exports = { setupIPCHandlers };
