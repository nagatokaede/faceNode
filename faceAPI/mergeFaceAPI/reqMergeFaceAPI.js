'use strict'

let faceInfo = require('../../setting').faceInfo;
const log = require('../../debug/log').log;
const strToJson = require('../../tools/typeConversion').strToJson;

const querystring = require('querystring')
const https = require('https');


let reqMergeFaceAPI = (template_url, template_rectangle, merge_url, merge_rectangle) => {
    // 设置 face++ 接口用户信息
    let faceInfoObj = new Object;
    faceInfoObj.api_key = faceInfo.api_key;
    faceInfoObj.api_secret = faceInfo.api_secret;
    faceInfoObj.merge_rate = faceInfo.merge_rate;

    // 模板图片
    faceInfoObj.template_url = template_url;
    // 模板人脸位置
    faceInfoObj.template_rectangle = template_rectangle;

    // 用户图片
    faceInfoObj.merge_url = merge_url;
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
                log(4, `响应主体 +1`);
                data += chunk;
            });

            res.on('end', () => {
                log(4, '响应中已无数据。');
                let resData = strToJson(data);
                if (resData.error_message) {
                    log(1, `人脸融合请求发生错误: ${resData.error_message}`);
                    resolve(false);
                }

                log(3, `人脸融合请求成功！`);
                resolve(resData);
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
