import { ipcMain, app } from 'electron';
import path from 'path';

const __dirname = import.meta.dirname;

function setupIPCHandlers(mainWin, audioWin, timer) {
    ipcMain.handle('get-user-config', () => {
        return timer.getUserConfig();
    });

    ipcMain.handle('update-user-config', (_event, newConfig) => {
        return timer.updateUserConfig(newConfig);
    });

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
        const time = timer.reset();
        mainWin.webContents.send('update-timer', 0, time);
        mainWin.webContents.send('update-time', time);
    });

    ipcMain.on('play-audio', (clip) => {
        const filePath = path.join(__dirname, 'audio', clip);
        audioWin.webContents.send('play-audio', filePath);
    });

    ipcMain.on('quit-app', () => {
        if (mainWin) mainWin.close();
        if (audioWin) audioWin.close();
        app.quit();
    });

    ipcMain.on('minimize-app', () => {
        if (mainWin) mainWin.hide();
    });

    ipcMain.on('show-win', () => {
        if (mainWin && !mainWin.isDestroyed()) {
            mainWin.show();
        } else {
            console.log('Main window is not available');
        }
    });
}

export { setupIPCHandlers };
