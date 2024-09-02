const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('pomodoro', {
    getUserConfig: () => ipcRenderer.invoke('get-user-config'),
    updateUserConfig: (newConfig) =>
        ipcRenderer.invoke('update-user-config', newConfig),
    toggleTimer: () => ipcRenderer.invoke('toggle-timer'),
    getTime: () => ipcRenderer.invoke('get-time'),
    onUpdateTime: (callback) =>
        ipcRenderer.on('update-time', (_event, time) => callback(time)),
    onUpdateTimer: (callback) =>
        ipcRenderer.on('update-timer', (_event, count, time) =>
            callback(count, time)
        ),
    resetTimer: () => ipcRenderer.invoke('reset-timer'),
    onPlaySound: (callback) =>
        ipcRenderer.on('play-audio', (_event, clip) => callback(clip)),
    quitApp: () => ipcRenderer.send('quit-app'),
    minimizeApp: () => ipcRenderer.send('minimize-app'),
});