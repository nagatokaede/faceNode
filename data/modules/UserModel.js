'use strict'

const log = require('../../debug/log').log;

const mongoose = require('mongoose');

/*
 * userId: 用户的 WeChatOpenId
 * userCreatedDate: 用户创建日期
 * userMsg: {
 *     fois: 接口总调用次数, 
 * }
 */

// 将 mongoose.Schema 赋值给一个变量来定义一个数据约束
let userSchema = mongoose.Schema({
    userId: String, 
    userCreatedDate: {
        type: Date, 
        default: new Date()
    }, 
    userMsg: {
        fois: {
            type: Number, 
            default: 1
        }
    }
});

// mongoose.model(modelName, schema)
// model 就是数据库中的集合 collection 
let UserModel = mongoose.model("user", userSchema);

module.exports = UserModel
