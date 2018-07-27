'use strict'

const server = require('../../setting').server;

const log = require('../../debug/log').log;
const dir = require('../../debug/log').dir;

const UpFilesInfoFindOne = require('../../data/tools/dataFindOne').UpFilesInfoFindOne;
const reqMergeFaceAPI = require('../mergeFaceAPI/reqMergeFaceAPI');

const fs = require('fs');


let urlFun = (urlStr, flag = 1, templateId = 0) => {
    // 处理数据中的图像地址
    let url_list;

    if (flag) {
        // 网络 url
        url_list = urlStr.split('\\'); // Win 版本
        //url_list = urlStr.split('/'); // Linux 版本
        return 'http://' + server.hostname + ':' + server.post + '/' + url_list[2] + '/' + url_list[3] + '/' + url_list[4]
    } 

    // 本地 path
    url_list = urlStr.split('.');
    if (templateId) { // 更换模板合成图像
        return url_list[0] + `_merge_${templateId}.` + url_list[1]
    } 

    // 合成图片
    return url_list[0] + '_merge.' + url_list[1]
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
    if (!template) { // 查询模板数据失败
        log(1, `查询模板数据失败`);
        return false
    }
    
    // 模板数据处理
    let template_url = urlFun(template.upFileInfo.filePath);
    let template_rectangle = faceRectangleFun(template.upFileInfo.faceRectangle);


    // 用户图像数据处理
    let merge = upData;
    let mergeId,MergeImagePath;
    if (merge) {
        // 合成图像
        log(4, '合成图像被调用');
        mergeId = merge._id
        MergeImagePath = urlFun(merge.upFileInfo.filePath, 0);
    } else {
        // 更换模板
        log(4, '更换模板被调用');
        mergeId = ctx.request.body.userId;

        merge = await UpFilesInfoFindOne(mergeId);
        if (!merge) { // 查询合成图像数据失败
            log(1, `查询合成图像数据失败`);
            return false
        }

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
    if (!MergeData) { // 人脸融合失败
        resolve(false);
    } 

    log(4, `存储融合后图片路径: ${MergeImagePath}`);
    dir(MergeData, 'merge face res obj!');

    return new Promise((resolve, reject) => {
        // 将返回的 base64 数据转为 Buffer 
        let bufferdata = new Buffer(MergeData.result, 'base64');
        fs.writeFile(MergeImagePath, bufferdata, err => { // 写入图像
            if (err) { // 存储融合后保存图片失败！
                log(0, `存储融合后保存图片失败！ ${err}`);
                resolve(false);
            } 

            // 保存图像并返回 {mergeId: String, imgurl: String}
            resolve({
                "mergeId": mergeId,
                "imgurl": urlFun(MergeImagePath)
            });
        });
    });
}

module.exports = dataProcessing
