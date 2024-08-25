const { ipcMain } = require('electron');

class Timer {
    constructor() {
        this.timer = null;
        this.time = 5;
        this.count = 0;
        this.options = {
            workTime: 5,
            shortBreak: 3,
            longBreak: 7,
        };
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
        this.count = 0;
        this.time = this.options.workTime;

        return this.time;
    }
}

module.exports = new Timer();
