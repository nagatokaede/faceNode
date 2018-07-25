'use strict'

const log = require('../../debug/log').log;
const dir = require('../../debug/log').dir;
const ERRORMSG = require('../../debug/responseDebug');

const UpFilesInfoModel = require('../modules/UpFilesInfoModel');

const reqDetectAPI = require('../../faceAPI/DetectAPI/reqDetectAPI');


// 保存上传文件信息
let upFiles = async (data, userId, flag = false) => {
    // 基本参数
    let files;
    if (flag) {
        files = data;
    } else {
        files = data.req.files[0];
    }

    dir(files, `图像基本信息`);


    // 调用 face++ 人脸识别 API 
    let faceRectangle = await reqDetectAPI(files.path);

    return new Promise((resolve, reject) => {
        // 当返回到人脸信息数据后方才保存数据
        if (faceRectangle) {
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
                if (!err) {
                    log(3, `数据信息保存成功！！`);
                    resolve(createInfo);
                } else {
                    log(0, `./data/tools/upFiles ${err}`); 
                    reject(err);
                }
            });
        } else {
            resolve(ERRORMSG.FACEERROR.message);
        }

    });
} 

module.exports = upFiles
