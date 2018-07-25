'use strict'

const server = require('../../setting').server;

const log = require('../../debug/log').log;
const dir = require('../../debug/log').dir;

const UpFilesInfoFindOne = require('../../data/tools/dataFindOne').UpFilesInfoFindOne;
const reqMergeFaceAPI = require('../mergeFaceAPI/reqMergeFaceAPI');

const fs = require('fs');


let urlFun = (urlStr, flag = 1, templateId = 0) => {
    // 处理数据中的图像地址
    let url_list,url;

    if (flag) {
        // 网络 url
        url_list = urlStr.split('\\');
        url = 'http://' + server.hostname + ':' + server.post + '/' + url_list[2] + '/' + url_list[3] + '/' + url_list[4]
    } else {
        // 本地 path
        if (templateId) {
            // 更换模板
            url_list = urlStr.split('.');
            url = url_list[0] + `_merge_${templateId}.` + url_list[1]
        } else {
            // 合成图片
            url_list = urlStr.split('.');
            url = url_list[0] + '_merge.' + url_list[1]
        }
    } 
    log(4, `urlFun: ${url}`);
    return url  
}

let faceRectangleFun = fr => {
    // 处理数据中的人脸框信息
    let faceRectangle = `${fr.top}, ${fr.left}, ${fr.width}, ${fr.height}`; 
    return faceRectangle
}

// 人脸融合请求
let dataProcessing = async (ctx, upData = 0) => {
    // 请求模板数据预处理
    let templateId = ctx.request.body.templateId || ctx.req.body.templateId;

    // 查询数据
    let template = await UpFilesInfoFindOne(templateId);
    
    // 模板数据处理
    let template_url = urlFun(template.upFileInfo.filePath);
    let template_rectangle = faceRectangleFun(template.upFileInfo.faceRectangle);


    // 用户图像数据处理
    let merge = upData;
    let mergeId,MergeImagePath;
    if (upData) {
        // 合成图像
        log(4, '合成图像被调用');
        mergeId = merge._id
        MergeImagePath = urlFun(merge.upFileInfo.filePath, 0);
    } else {
        // 更换模板
        log(4, '跟换模板被调用');
        mergeId = ctx.request.body.userId;
        merge = await UpFilesInfoFindOne(mergeId);
        MergeImagePath = urlFun(merge.upFileInfo.filePath, 0, templateId);
    }

    let merge_url = urlFun(merge.upFileInfo.filePath);
    let merge_rectangle = faceRectangleFun(merge.upFileInfo.faceRectangle);


    // 调用人脸融合
    log(4, `template_url: ${template_url}, 
            \ntemplate_rectangle: ${template_rectangle}, 
            \nmerge_url: ${merge_url}, 
            \nmerge_rectangle: ${merge_rectangle}`);
    let MergeData = await reqMergeFaceAPI(template_url, template_rectangle, merge_url, merge_rectangle);
    log(4, `存储融合后图片路径: ${MergeImagePath}`);
    log(4, `base64 data: \n${MergeData.result}`);
    dir(MergeData, 'merge face res obj!');

    let bufferdata = new Buffer(MergeData.result, 'base64');

    return new Promise((resolve, reject) => {
        fs.writeFile(MergeImagePath, bufferdata, err => {
            if (err) {
                log(0, `存储融合后图片失败！ ${err}`);
                resolve(false);
            } else {
                resolve({
                    "mergeId": mergeId,
                    "imgurl": urlFun(MergeImagePath)
                });
            }
        });
    });
}

module.exports = dataProcessing
