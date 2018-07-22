'use strict'

const log = require('../../debug/log').log;

const mongoose = require('mongoose');

require('../conn_mongo');


/*
 * userId: 创建 user 时 MongoDB 自动创建的 id，关联 user
 * upFileInfo: {
 *     upFileDate: 上传文件的日期, 
 *     fileName: 文件名
 *     filePath: 文件保存路径
 *     fileType: 文件类型
 *     faceRectangle: { 识别人脸框
 *          "width": 140,
 *          "top": 89,
 *          "left": 104,
 *          "height": 141
 *     }
 * }
 */

// 将 mongoose.Schema 赋值给一个变量来定义一个数据约束
let upFileInfoSchema = mongoose.Schema({
    userId: String, 
    upFileInfo: {
        upFileDate: {
            type: Date, 
            default: new Date()
        }, 
        fileName: String, 
        filePath: String, 
        fileType: String, 
        faceRectangle: Object, 
    }
});

// mongoose.model(modelName, schema)
// model 就是数据库中的集合 collection 
let UpFilesInfoModel = mongoose.model("upFilesInfo", upFileInfoSchema);

module.exports = UpFilesInfoModel
