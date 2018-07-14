'use strict'

const log = require('../../debug/log').log;

const UpFilesInfoModel = require('../modules/UpFilesInfoModel');

const reqDetectAPI = require('../../faceAPI/DetectAPI/reqDetectAPI');

const fs = require('fs');

let readFile = path => {
    return new Promise((resolve, reject) => {
        fs.readFile(path, (err, data) => {
            if (err) {
                log(1, `读取文件数据失败：\n${err}`);
                reject(err);
            } else {
                let dataToString = new Buffer(data).toString('base64');
                resolve(dataToString);
            }
        });
    });
}


// 保存上传文件信息
let upFiles = async (ctx, userId) => {
    // 基本参数
    let files = ctx.req.files;

    let filesPath = new Object;
    for (let i = 0; i < files.length; i++) {
        filesPath[`path_${i}`] = new Object;
        filesPath[`path_${i}`]['fileInfo'] = files[i];
        filesPath[`path_${i}`]['base64'] = await readFile(files[i].path);
        // 调用 face++ 人脸识别 API 
        filesPath[`path_${i}`]['detectAPI'] = await reqDetectAPI(files[i].path);
    }

    return new Promise((resolve, reject) => {
        // 创建数据信息
        let createInfo = new UpFilesInfoModel({
            userId: userId, 
            upFileInfo: {
                filesNum: files.length, 
                filesPath: filesPath
            }
        });

        // 保存数据
        createInfo.save(err => {
            if (!err) {
                log(3, `数据信息保存成功！！`);
                resolve(createInfo);
            } else {
                log(0, `./data/tools/upFiles${err}`); 
                reject(err);
            }
        });

    });
} 


module.exports = upFiles
