import { app, BrowserWindow, ipcMain } from 'electron';
import path from 'path';
import Store from 'electron-store';
import Timer from './src/Timer.js';
import { setupTray } from './src/setupTray.js';
import { setupIPCHandlers } from './src/setupIpcHandlers.js';

const __dirname = import.meta.dirname;

const store = new Store();

const createMainWindow = () => {
    const mainWin = new BrowserWindow({
        width: 226,
        height: 306,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            devTools: false,
        },
        frame: false,
        resizable: false,
        icon: path.join(__dirname, 'src/images', 'icon-256.ico'),
    });

    // mainWin.loadURL('http://localhost:3000');
    const indexPath = path.join(__dirname, 'build', 'index.html');
    mainWin.loadFile(indexPath);

    // Disable reload with Ctrl + R
    mainWin.webContents.on('before-input-event', (event, input) => {
        if (input.control && input.key.toLowerCase() === 'r') {
            event.preventDefault();
        }
    });

    // Enforce fixed dimensions on resize
    mainWin.on('resize', () => {
        mainWin.setSize(226, 306);
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

const loadUserConfig = () => {
    const defaultConfig = {
        workTime: 25 * 60,
        shortBreak: 5 * 60,
        longBreak: 25 * 60,
    };

    return store.get('userConfig', defaultConfig);
};

app.whenReady().then(() => {
    const mainWin = createMainWindow();
    const audioWin = createAudioWindow();

    const userConfig = loadUserConfig();
    const timer = new Timer(userConfig, store);

    setupTray();

    setupIPCHandlers(mainWin, audioWin, timer);
});

app.on('window-all-closed', () => {
    app.quit();
    // if (process.platform !== 'darwin') app.quit()
});
