import { Tray, Menu, ipcMain } from 'electron';
import path from 'path';

const __dirname = import.meta.dirname;

let tray = null;

function setupTray() {
    const iconPath = path.join(__dirname, 'images', 'icon-32.ico');
    tray = new Tray(iconPath);
    tray.setToolTip('Pomodoro Timer');

    const contextMenu = Menu.buildFromTemplate([
        {
            label: 'Quit',
            click: () => {
                ipcMain.emit('quit-app');
            },
        },
    ]);

    tray.setContextMenu(contextMenu);

    tray.on('click', () => {
        ipcMain.emit('show-win');
    });

    // tray.on('right-click', () => {
    //     tray.popUpContextMenu(contextMenu);
    // });
}

export { setupTray };
