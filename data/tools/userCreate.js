'use strict'

const log = require('../../debug/log').log;

const UserModel = require('../modules/UserModel');


let dataProcessing = (doc, userId, resolve, reject) => {
    log(4, `doc: ${doc}`);
    if (!doc) {
        log(3, `创建用户！！`);
        // 创建用户
        let createUser = new UserModel({
            userId: userId
        });
        // 保存数据
        createUser.save(err => {
            if (!err) {
                log(3, `用户创建成功！！`);
                resolve(createUser.id);

            } else {
                log(0, `${err}`);
                reject(err);
            }
        });

    } else {
        log(4, `用户已存在！！`);
        // 增加接口调用次数
        doc.userMsg.fois++;
        doc.save(err => {
            if (!err) {
                log(3, `用户数据已更新！！`);
                resolve(doc.id);

            } else {
                log(0, `${err}`);
                reject(err);
            }
        });
    }
}


// 创建用户
let userCreate = ctx => {
    return new Promise((resolve, reject) => {
        // 基本参数
        let userId = ctx.req.body.userId;

        // 查询用户
        UserModel.findOne({
            userId: userId
        }, (err, doc) => {
            if (!err) {
                // 数据库操作
                dataProcessing(doc, userId, resolve, reject);
            } else {
                log(1, `数据查询出错！！`);
                reject(err);
            }
        });          

    });
}


module.exports = userCreate
