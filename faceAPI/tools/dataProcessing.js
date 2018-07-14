'use strict'

let faceInfo = require('../../setting').faceInfo;
const log = require('../../debug/log').log;


const UpFilesInfoFindOne = require('../../data/tools/dataFindOne').UpFilesInfoFindOne;
const reqMergeFaceAPI = require('../mergeFaceAPI/reqMergeFaceAPI');

// 人脸融合请求
let dataProcessing = async (ctx, upData) => {
    // 请求模板数据预处理
    let templateId = ctx.req.body.templateId;
    let templatePath = ctx.req.body.templatePath;
    log(4, `templateId: ${templateId} \ntemplatePath: ${templatePath}`);
    // 查询数据
    let template = await UpFilesInfoFindOne(templateId, templatePath);
    log(4, `template typeof: ${typeof template}`);
    console.dir(template);
    // 模板数据处理
    let template_base64 = template.base64;

    let template_fr = template.detectAPI.faces[0].face_rectangle;
    log(4, `人脸框数据：${template_fr}`);
    console.dir(template_fr);
    let template_rectangle = `${template_fr.top}, ${template_fr.left}, 
                                ${template_fr.width}, ${template_fr.height}`;

    // 用户图像数据处理
    let merge = upData.upFileInfo.filesPath.path_0;

    let merge_base64 = merge.base64;

    let merge_fr = merge.detectAPI.faces[0].face_rectangle;
    let merge_rectangle = `${merge_fr.top}, ${merge_fr.left}, 
                            ${merge_fr.width},${merge_fr.height}`;

    // 调用人脸融合
    return await reqMergeFaceAPI(template_base64, template_rectangle, merge_base64, merge_rectangle);
}

module.exports = dataProcessing
