const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const timer = require('./src/Timer');

const createMainWindow = () => {
    const mainWin = new BrowserWindow({
        width: 900,
        height: 400,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
        },
        frame: false,
        resizable: false,
    });

    mainWin.loadURL('http://localhost:3000');
    // win.loadFile(path.join(__dirname, 'build', 'index.html'));

    // Disable reload with Ctrl + R
    mainWin.webContents.on('before-input-event', (event, input) => {
        if (input.control && input.key.toLowerCase() === 'r') {
            event.preventDefault();
        }
    });

    return mainWin;
};

// Hidden window to use HTML5 audio player.
const createAudioWindow = () => {
    const audioWin = new BrowserWindow({
        width: 300,
        height: 200,
        show: false,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
        },
    });

    audioWin.loadFile(path.join(__dirname, 'src', 'audio.html'));

    return audioWin;
};

app.whenReady().then(() => {
    const mainWin = createMainWindow();
    const audioWin = createAudioWindow();

    // load user prefs

    // TODO: move ipc handlers into own file
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

    ipcMain.on('play-audio', (clip) => {
        const filePath = path.join(__dirname, 'src/audio', clip);
        audioWin.webContents.send('play-audio', filePath);
    });

    ipcMain.on('quit-app', () => {
        if (mainWin) mainWin.close();
        if (audioWin) audioWin.close();
        app.quit();
    });
});

// TODO: when closing main window => also close audio window

app.on('window-all-closed', () => {
    app.quit();
    // if (process.platform !== 'darwin') app.quit()
});
