'use strict'

const log = require('../../debug/log').log;
const dir = require('../../debug/log').dir;
const ERRORMSG = require('../../debug/responseDebug');

const fs = require('fs');

let createFile =  (ctx) => {
    // 创建用户及日期文件夹
    let user = ctx.req.body.userId;
    let date = new Date();
    let dirName = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
    let filePath = `faceNode\\static\\${user}\\`;
    // 创建用户及日期文件夹
    try {
        fs.accessSync(filePath, fs.constants.F_OK);
        log(3, `${user} 用户文件夹已存在！`);
        try {
            fs.accessSync(`${filePath}${dirName}\\`, fs.constants.F_OK);
            log(3, `${user} 日期文件夹已存在！`);
        } catch (err) {
            fs.mkdirSync(`${filePath}${dirName}\\`);
            log(3, `创建日期 ${filePath} 文件夹！`);
        }
    } catch (err) {
        log(3, `创建 ${filePath}${dirName}/ 文件夹！`);
        fs.mkdirSync(filePath);
        fs.mkdirSync(`${filePath}${dirName}\\`);
    }

    return filePath + dirName + '\\'
}

module.exports = createFile