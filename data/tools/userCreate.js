'use strict'

const log = require('../../debug/log').log;

const UserModel = require('../modules/UserModel');


let dataProcessing = (doc, userId, resolve, reject) => {
    if (doc) { // doc 查询用户数据不为空
        log(4, `用户已存在！！`);
        doc.userMsg.fois++; // 增加接口调用次数
        doc.save(err => { // 保存用户数据
            if (err) {
                log(0, `用户数据更新失败！ ${err}`);
                resolve(false);
            }

            log(3, `用户数据更新！！`);
            resolve(doc.id);
        });
    }

    log(3, `创建用户！！`);
    let createUser = new UserModel({ // 创建用户
        userId: userId
    });

    createUser.save(err => { // 保存数据
        if (err) { // 用户创建失败！
            log(1, `用户创建失败！ ${err}`);
            resolve(false);
        }

        log(3, `用户创建成功！！`);
        resolve(createUser.id);
    });
}


// 创建用户
let userCreate = ctx => {
    return new Promise((resolve, reject) => {
        // 基本参数
        let userId = ctx.req.body.userId;
        log(4, `创建/查询用户Id：${userId}`);

        // 查询用户
        UserModel.findOne({
            userId: userId
        }, (err, doc) => {
            if (err) { // 查询用户出错！！
                log(1, `查询用户出错！！ ${err}`);
                resolve(false);
            }

            // 数据库操作
            dataProcessing(doc, userId, resolve, reject);
        });          

    });
}


module.exports = userCreate
