const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('pomodoro', {
    toggleTimer: () => ipcRenderer.invoke('toggle-timer'),
    getTime: () => ipcRenderer.invoke('get-time'),
    onUpdateTime: (callback) =>
        ipcRenderer.on('update-time', (_event, time) => callback(time)),
    onUpdateTimer: (callback) =>
        ipcRenderer.on('update-timer', (_event, count) => callback(count)),
    onPlaySound: (callback) =>
        ipcRenderer.on('play-audio', (_event, clip) => callback(clip)),
});
