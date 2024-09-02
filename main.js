const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const fs = require('fs');
const Timer = require('./src/Timer');
const { setupTray } = require('./src/setupTray');
const { setupIPCHandlers } = require('./src/setupIpcHandlers');

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
    });

    // mainWin.loadURL('http://localhost:3000');
    mainWin.loadFile(path.join(__dirname, 'build', 'index.html'));

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
    const filePath = path.join(__dirname, 'src', 'userData', 'userConfig.json');

    // Check if file exists.
    if (!fs.existsSync(filePath)) {
        const defaultConfig = {
            workTime: 25 * 60,
            shortBreak: 5 * 60,
            longBreak: 25 * 60,
        };

        fs.writeFileSync(
            filePath,
            JSON.stringify(defaultConfig, null, 2),
            'utf-8'
        );
        return defaultConfig;
    }

    // If file already exists.
    const data = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(data);
};

app.whenReady().then(() => {
    const mainWin = createMainWindow();
    const audioWin = createAudioWindow();

    const userConfig = loadUserConfig();
    const timer = new Timer(userConfig);

    setupTray();

    setupIPCHandlers(mainWin, audioWin, timer);
});

app.on('window-all-closed', () => {
    app.quit();
    // if (process.platform !== 'darwin') app.quit()
});
