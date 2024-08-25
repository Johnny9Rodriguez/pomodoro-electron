const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('pomodoro', {
    toggleTimer: () => ipcRenderer.invoke('toggle-timer'),
    getTime: () => ipcRenderer.invoke('get-time'),
    onUpdateTime: (callback) =>
        ipcRenderer.on('update-time', (_event, time) => callback(time)),
    onUpdateTimer: (callback) =>
        ipcRenderer.on('update-timer', (_event, count, time) => callback(count, time)),
    onPlaySound: (callback) =>
        ipcRenderer.on('play-audio', (_event, clip) => callback(clip)),
    quitApp: () => ipcRenderer.send('quit-app'),
});
