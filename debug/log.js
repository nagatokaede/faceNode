'use strict'

const chalk = require('chalk');

let setting = {
    ERROR: {
        log: '错误', 
        status: 0, 
        start: true, 
        style: {
            color: 'red',
            background: '',
            Modifiers: ''
        }
    }, 
    WARNING: {
        log: '警告', 
        status: 1, 
        start: true, 
        style: {
            color: 'yellow',
            background: '',
            Modifiers: ''
        }
    }, 
    NOTICE: {
        log: '注意', 
        status: 2, 
        start: true, 
        style: {
            color: 'gray ',
            background: '',
            Modifiers: ''
        }
    }, 
    INFO: {
        log: '信息', 
        status: 3, 
        start: true, 
        style: {
            color: 'magenta',
            background: '',
            Modifiers: ''
        }
    }, 
    DEBUG: {
        log: '调试', 
        status: 4, 
        start: true, 
        style: {
            color: 'blue',
            background: '',
            Modifiers: ''
        }
    }
}

let log = (level, msg) => {
    switch (level) {
        case 0:
            if (setting.ERROR.start) {
                console.log(chalk`{${setting.ERROR.style.color} ${msg}}`);
            }
            break;
        case 1:
            if (setting.WARNING.start) {
                console.log(chalk`{${setting.WARNING.style.color} ${msg}}`);
            }
            break;
        case 2:
            if (setting.NOTICE.start) {
                console.log(chalk`{${setting.NOTICE.style.color} ${msg}}`);
            }
            break;
        case 3:
            if (setting.INFO.start) {
                console.log(chalk`{${setting.INFO.style.color} ${msg}}`);
            }
            break;
        case 4:
            if (setting.DEBUG.start) {
                console.log(chalk`{${setting.DEBUG.style.color} ${msg}}`);
            }
            break;
        default:
            log(msg);
    }
}

let dir = (obj, msg = "") => {
    if (true) {
        console.log(chalk`{${setting.INFO.style.color} ${msg}}`);
        console.dir(obj);
    }
}

exports.log = log
exports.dir = dir
