'use strict'

const log = require('../../debug/log').log;
const dir = require('../../debug/log').dir;
const strToJson = require('../../tools/typeConversion').strToJson;

const UserModel = require('../modules/UserModel');
const UpFilesInfoModel = require('../modules/UpFilesInfoModel');


// 查询单个图片信息
let UpFilesInfoFindOne = (imgId, path) => {
    return new Promise((resolve, reject) => {
        UpFilesInfoModel.findOne({'_id': imgId}, (err, docs) => {
            if (err) {
                log(1, `数据查询失败：\n${err}`);
                reject(err);
            } else {
                if (docs) {
                    log(4, `图片数据库查询结果类型 ${typeof docs}`);
                    dir(docs._doc, `数据查询结果`);
                    resolve(docs._doc);
                } else {
                    log(2, `图像数据查询 userId: ${userId} 不存在`);
                    reject(`image data not find  userId: ${userId}`);
                }
            }
        });
    });
}

// 查询用户信息
let UserFindOne = (userId) => {
    return new Promise((resolve, reject) => {
        UserModel.findOne({'userId': userId}, (err, docs) => {
            if (err) {
                log(1, `数据查询失败：\n${err}`);
                reject(err);
            } else {
                if (docs) {
                    resolve(docs);
                } else {
                    log(2, `用户数据查询 userId: ${userId} 不存在`);
                    reject(`user data not find  userId: ${userId}`);
                }
            }
        });
    });
}


exports.UpFilesInfoFindOne = UpFilesInfoFindOne
exports.UserFindOne = UserFindOne
