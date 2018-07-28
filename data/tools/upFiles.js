'use strict'

const log = require('../../debug/log').log;
const dir = require('../../debug/log').dir;
const ERRORMSG = require('../../debug/responseDebug');

const UpFilesInfoModel = require('../modules/UpFilesInfoModel');

// 保存上传文件信息
let upFiles = async (data, userId, faceRectangle, flag = false) => {
    // 基本参数
    let files;
    if (flag) { // base64 
        files = data;
    } else { // 传统
        files = data.req.files[0];
    }

    dir(files, `图像基本信息`);

    return new Promise((resolve, reject) => {
        // 创建数据信息
        let createInfo = new UpFilesInfoModel({
            userId: userId, 
            upFileInfo: {
                fileName: files.filename, 
                filePath: files.path, 
                fileType: files.mimetype, 
                faceRectangle: faceRectangle.face_rectangle
            }
        });

        // 保存数据
        createInfo.save(err => {
            if (err) { 
                log(0, `存入上传图像信息失败！ ${err}`); 
                resolve(false);
                
            } else {
                log(3, `上传图像信息保存成功！！`);
                resolve(createInfo);
            }
        });
    });
} 

module.exports = upFiles
