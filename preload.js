const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('pomodoro', {
    test: () => ipcRenderer.send('test'),
});
