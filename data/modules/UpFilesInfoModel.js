'use strict'

const log = require('../../debug/log').log;

const mongoose = require('mongoose');

require('../conn_mongo');


/*
 * userId: 创建 user 时 MongoDB 自动创建的 id，关联 user
 * upFileInfo: {
 *     upFileDate: 上传文件的日期, 
 *     filesNum: 上传文件数量
 *     filesPath: 文件保存路径
 * }
 */

let filesPathFun = () => {
    let path = {
        fileInfo: {
            fieldname: String,
            originalname: String,
            encoding: String,
            mimetype: String,
            destination: String,
            filename: String,
            path: String,
            size: Number
        }, 
        detectAPI: Object, 
        base64: String
    }

    let filesPath = new Object;

    for (let i = 0; i < 9; i++){
        filesPath[`path_${i}`] = path;
    }

    return filesPath
}

let filesPath = filesPathFun();

// 将 mongoose.Schema 赋值给一个变量来定义一个数据约束
let upFileInfoSchema = mongoose.Schema({
    userId: String, 
    upFileInfo: {
        upFileDate: {
            type: Date, 
            default: new Date()
        }, 
        filesNum: Number, 
        filesPath: filesPath 
    }
});

// mongoose.model(modelName, schema)
// model 就是数据库中的集合 collection 
let UpFilesInfoModel = mongoose.model("upFilesInfo", upFileInfoSchema);

module.exports = UpFilesInfoModel
