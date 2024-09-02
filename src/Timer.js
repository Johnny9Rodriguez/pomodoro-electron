import { ipcMain } from 'electron';

class Timer {
    constructor(config, store) {
        this.timer = null;
        this.time = config.workTime;
        this.count = 0;
        this.store = store;
        this.options = {
            workTime: config.workTime,
            shortBreak: config.shortBreak,
            longBreak: config.longBreak,
        };
    }

    getUserConfig() {
        return this.options;
    }

    async updateUserConfig(newConfig) {
        this.options = newConfig;

        // Reset timer.
        clearInterval(this.timer);
        this.timer = null;
        this.count = 0;
        this.time = this.options.workTime;

        // Update view.
        ipcMain.emit('update-timer', this.count, this.time);

        try {
            await this.store.set('userConfig', newConfig);
            return true;
        } catch (error) {
            console.error('Error saving config:', error);
            return false;
        }
    }

    getTime() {
        return this.time;
    }

    startTimer() {
        if (this.count % 2 === 0) {
            ipcMain.emit('play-audio', 'work.wav');
        } else {
            ipcMain.emit('play-audio', 'break.wav');
        }
        this.timer = setInterval(() => {
            this.time -= 1;
            this.checkTime();
            ipcMain.emit('update-time', this.time);
        }, 1000);
    }

    stopTimer() {
        ipcMain.emit('play-audio', 'pause.wav');
        clearInterval(this.timer);
        this.timer = null;
    }

    toggleTimer() {
        if (!this.timer) {
            this.startTimer();
            return true;
        } else {
            this.stopTimer();
            return false;
        }
    }

    checkTime() {
        if (this.time === 0) {
            clearInterval(this.timer);
            this.timer = null;

            const clip = this.count === 6 ? 'alarmLong.wav' : 'alarmShort.wav';
            ipcMain.emit('play-audio', clip);

            this.count = (this.count + 1) % 8;
            this.setTime();

            ipcMain.emit('update-timer', this.count, this.time);
        }
    }

    setTime() {
        if (this.count === 7) {
            this.time = this.options.longBreak;
        } else if (this.count % 2 === 0) {
            this.time = this.options.workTime;
        } else {
            this.time = this.options.shortBreak;
        }
    }

    reset() {
        ipcMain.emit('play-audio', 'reset.wav');
        clearInterval(this.timer);
        this.timer = null;

        this.count = 0;
        this.time = this.options.workTime;

        return this.time;
    }
}

export default Timer;
