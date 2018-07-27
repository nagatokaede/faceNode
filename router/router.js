'use strict'

const log = require('../debug/log').log;
const dir = require('../debug/log').dir;
const ERRORMSG = require('../debug/responseDebug');

const Router = require('koa-router');

// 上传文件
const upload = require('../import/upfile').upload;
const saveBase64 = require('../import/saveBase64File');
// 数据库
const userCreate = require('../data/tools/userCreate');
const upFiles = require('../data/tools/upFiles');
// 人脸融合
const reqDetectAPI = require('../faceAPI/DetectAPI/reqDetectAPI');
const dataProcessing = require('../faceAPI/tools/dataProcessing');



let logPath = (ctx, method) => {
    log(4, `请求方式 ${method} 请求地址 ${ctx.url} 并返回数据成功！`);
}

let detect = async ctx => { // 人脸识别等一系列操作
        // ------ 存储上传的 base 64 文件 ------
        let dataMsg = await saveBase64(ctx);
        // 返回可能性{ 数据: Obj, 错误: false }
        if (!dataMsg) { // 存储失败
            ctx.status = 500
            return ERRORMSG.SYSTEMERROR.message
        }  

        // ------ 创建用户或更新用户信息 ------
        let userId = await userCreate(ctx);
        // 返回可能性{ 数据: String, 错误: false }
        if (!userId) { // 创建或更新失败
            ctx.status = 500
            return ERRORMSG.SYSTEMERROR.message
        }

        // ------ 请求人脸识别 ------
        let faceRectangle = await reqDetectAPI(dataMsg.path);
        // 返回可能性{ 数据：Obj, 错误1：false, 错误2: faceRectangle.error_message}
        if (!faceRectangle) { // 未能找到人脸信息
            ctx.status = 400
            return ERRORMSG.FACEERROR.message            
        } else if (faceRectangle.error_message) { // 请求人脸识别 API 返回错误
            ctx.status = 500
            return faceRectangle.error_message
        } 

        // ------ 将模板存入数据库 ------
        let upData = await upFiles(dataMsg, userId, faceRectangle, true); 
        if (!upData) { // 存入数据库失败
            ctx.status = 500
            return ERRORMSG.SYSTEMERROR.message
        }
        
        // 以上错误均未发生返回存入数据库信息
        return upData
}

let merge = async (ctx, upData) => { // 人脸融合等一系列操作
    // ------ 请求人脸融合 ------
    let mergeFace = await dataProcessing(ctx, upData);
    if (!mergeFace) { // 人脸融合失败
        ctx.status = 500
        return ERRORMSG.SYSTEMERROR.message
    }

    // 以上错误均未发生返回 {mergeId: String, imgurl: String}
    return mergeFace
}



// 测试用路由端口 ---------------------------------------------
const test = new Router();

test.get('/', async ctx => {
    // get 请求测试
    ctx.body = 'get 端口测试 ok ！'
    logPath(ctx, 'GET');
});
 
test.post('/', async ctx => {
    // post 请求测试
    ctx.body = 'post 端口测试 ok ！'
    logPath(ctx, 'POST');
});


// 上传模板图像 API 路由接口 --------------------------------------
const upfile = new Router();
// 请求参数说明：
// userId: 管理员 userId
// dataBase64: 上传模板文件的 base64 格式文件

upfile.post('/', async ctx => {
    ctx.body = await upload(ctx, async err => {
        return await detect(ctx);
    });
    logPath(ctx, 'POST');
});


// 人脸融合 API 路由接口 --------------------------------------
const mergeface = new Router();
// 请求参数说明：
// userId: 用户数据库的 userId，本意为 WeChatOpenId
// templateId: 模板图片,图像数据库 userId，用户数据库的 _id
// dataBase64: 上传文件的 base64 格式文件

mergeface.post('/', async ctx => {
    // post 请求测试
    ctx.body = await upload(ctx, async err => {
        let upData = await detect(ctx);
        return await merge(ctx, upData)
    });
    logPath(ctx, 'POST');
});


// 更换模板图片融合接口 ---------------------------------------
const changeFaceMerge = new Router();

changeFaceMerge.post('/', async ctx => {
    ctx.body = await upload(ctx, async err => {
        return await merge(ctx)
    });
    logPath(ctx, 'POST');
});


// 文件管理后台接口 -------------------------------------------
const fileShow = new Router();

fileShow.post('/', async ctx => {
    // post 请求测试
    ctx.body = 'post 端口测试 ok ！'
    logPath(ctx, 'POST');
});


// 装载所有路由接口
let router = new Router();
router.use('/test', test.routes(), test.allowedMethods());
router.use('/upfile', upfile.routes(), upfile.allowedMethods());
router.use('/mergeface', mergeface.routes(), mergeface.allowedMethods());
router.use('/changeFaceMerge', changeFaceMerge.routes(), changeFaceMerge.allowedMethods());
router.use('/admin', fileShow.routes(), fileShow.allowedMethods());

module.exports = router
