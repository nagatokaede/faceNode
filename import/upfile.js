'use strict'

let createFilesNameSuffixNum = require('../setting').createFilesNameSuffixNum;

const log = require('../debug/log').log;

const fs = require('fs');
const multer = require('koa-multer');
const inspect = require('util').inspect;


let createFile =  () => {
    // 创建日期文件夹
    let date = new Date();
    let dirName = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
    let filePath = `./faceNode/static/${dirName}/`;
    // 创建日期文件夹
    try {
        fs.accessSync(filePath, fs.constants.F_OK);
        log(3, `${filePath} 文件夹已存在！`);
    } catch (err) {
        log(3, `创建 ${filePath} 文件夹！`);
        fs.mkdirSync(filePath);
    }

    return filePath
};

let createFileName = (file) => {
    // 以点分割成数组，数组的最后一项就是后缀名
    let fileFormat = (file.originalname).split(".");
    let suffix = fileFormat[fileFormat.length - 1].toLowerCase();

    return `${Date.now()}_${createFilesNameSuffixNum++}.${suffix}`

}

// multer 配置
let storage = multer.diskStorage({
    // 文件保存路径
    destination: (req, file, cb) => {
        //console.dir(req.body);
        cb(null, createFile());
    },
    // 修改文件名称
    filename: (req, file, cb) => {
        cb(null, createFileName(file));
    }
})
// 加载配置
let upload = multer({ storage: storage });

exports.upload = upload