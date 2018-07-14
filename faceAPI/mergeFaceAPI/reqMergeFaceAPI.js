'use strict'

let faceInfo = require('../../setting').faceInfo;
const log = require('../../debug/log').log;
const strToJson = require('../../tools/typeConversion').strToJson;

const querystring = require('querystring')
const https = require('https');


let reqMergeFaceAPI = (template_base64, template_rectangle, merge_base64, merge_rectangle) => {
    // 设置 face++ 接口用户信息
    let faceInfoObj = new Object;
    faceInfoObj.api_key = faceInfo.api_key;
    faceInfoObj.api_secret = faceInfo.api_secret;
    faceInfoObj.merge_rate = faceInfo.merge_rate;

    // 模板图片
    faceInfoObj.template_base64 = template_base64;
    // 模板人脸位置
    faceInfoObj.template_rectangle = template_rectangle;

    // 用户图片
    faceInfoObj.merge_base64 = merge_base64;
    // 用户人脸位置
    faceInfoObj.merge_rectangle = merge_rectangle;

    return new Promise((resolve, reject) => {

        // 拼接请求参数
        let postData = querystring.stringify(faceInfoObj);

        // 设置请求头
        const options = {
            hostname: 'api-cn.faceplusplus.com', // 目标域名
            port: 443, // http 默认 80 端口， https 默认 443 端口
            path: '/imagepp/v1/mergeface', // 信息发往的路径
            method: 'POST', 
            headers: {
                'Content-type': 'application/x-www-form-urlencoded', 
                'COntent-Length': Buffer.byteLength(postData)
            }
        };

        // 回调函数返回信息并调用处理方法
        const req = https.request(options, (res) => {
            let data = '';
            log(4, `状态码：\nres.statusCode`);
            log(4, `请求头：\nres.headers`);
            res.setEncoding('utf8');
            res.on('data', (chunk) => {
                log(4, `响应主体: ${chunk}`);
                data += chunk;
            });

            res.on('end', () => {
                log(4, '响应中已无数据。');
                resolve(strToJson(data));
            });
        });

        req.on('error', (e) => {
            console.error(`请求遇到问题: ${e.message}`);
            reject(e);
        });

        // 写入数据到请求主体
        req.write(postData);

        req.end();
    });
}

module.exports = reqMergeFaceAPI
