'use strict'

const log = require('../../debug/log').log;
const dir = require('../../debug/log').dir;
const strToJson = require('../../tools/typeConversion').strToJson;

const UserModel = require('../modules/UserModel');
const UpFilesInfoModel = require('../modules/UpFilesInfoModel');


// 查询单个图片信息
let UpFilesInfoFindOne = (imgId) => {
    return new Promise((resolve, reject) => {
        UpFilesInfoModel.findOne({'_id': imgId}, (err, docs) => {
            if (err) { // 数据查询失败
                log(1, `数据查询失败：\n${err}`);
                resolve(false);
                
            } else if (!docs) { // imgId 不存在
                log(1, `图像数据查询 imgId: ${imgId} 不存在`);
                resolve(false);
                
            } else { // 查询数据成功
                dir(docs._doc, `数据查询结果`);
                resolve(docs._doc);
            }
        });
    });
}

// 查询用户信息
let UserFindOne = (userId) => {
    return new Promise((resolve, reject) => {
        UserModel.findOne({'userId': userId}, (err, docs) => {
            if (err) { // 数据查询失败
                log(1, `用户查询失败：\n${err}`);
                resolve(false);
                
            } else if (!docs) { // userId 不存在
                log(1, `用户数据查询 userId: ${userId} 不存在`);
                resolve(false);
                
            } else { // 查询数据成功
                dir(docs._doc, `数据查询结果`);
                resolve(docs._doc);
            }
        });
    });
}


exports.UpFilesInfoFindOne = UpFilesInfoFindOne
exports.UserFindOne = UserFindOne
