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
// 人脸融合数据处理
const dataProcessing = require('../faceAPI/tools/dataProcessing');



let logPath = (ctx, method) => {
    log(4, `请求方式 ${method} 请求地址 ${ctx.url} 并返回数据成功！`);
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
    ctx.body = await upload(ctx, async err => {
        let dataMsg = await saveBase64(ctx);
        //dir(dataMsg, 'saveBase64 返回信息！');
        let userId = await userCreate(ctx);
        let upData = await upFiles(dataMsg, userId, true); 
        if (upData == ERRORMSG.FACEERROR.message) {
            log(1, `上传图像中未能找到人脸信息!`);
            ctx.status = 400
        }
        return upData
    });
    logPath(ctx, 'POST');
});


// 上传图像 API 路由接口 --------------------------------------
const upfile = new Router();

upfile.post('/', async ctx => {
    ctx.body = await upload(ctx, async err => {
        let dataMsg = await saveBase64(ctx);
        dir(dataMsg, 'saveBase64 返回信息！');
        let userId = await userCreate(ctx);
        let upData = await upFiles(dataMsg, userId, true); 
        if (upData == ERRORMSG.FACEERROR.message) {
            log(1, `上传图像中未能找到人脸信息!`);
            ctx.status = 400
        }
        return upData
    });

    logPath(ctx, 'POST');
});


// 人脸融合 API 路由接口 --------------------------------------
const mergeface = new Router();
// 请求参数说明：
// userId: 用户数据库的 userId，本意为 WeChatOpenId
// templateId: 模板图片,图像数据库 userId，用户数据库的 _id
// templatePath: 模板图片,图像数据库 path_${No.} 
// file: 上传的文件

mergeface.post('/', async ctx => {
    // post 请求测试
    ctx.body = await upload(ctx, async err => {
        let dataMsg = await saveBase64(ctx);
        dir(dataMsg, 'saveBase64 返回信息！');
        
        let userId = await userCreate(ctx);
        let upData = await upFiles(dataMsg, userId, true);

        if (upData == ERRORMSG.FACEERROR.message) {
            log(1, `上传图像中未能找到人脸信息!`);
            ctx.status = 400
            return upData
        } else {
            let mergeFace = await dataProcessing(ctx, upData);
            if (mergeFace) {
                return mergeFace
            } else {
                ctx.status = 500
                return ERRORMSG.SYSTEMERROR.message
            }
        }
    });

    logPath(ctx, 'POST');
});

// 更换模板图片融合接口 ---------------------------------------
const changeFaceMerge = new Router();

changeFaceMerge.post('/', async ctx => {
    let mergeFace = await dataProcessing(ctx);

    if (mergeFace) {
        ctx.body = mergeFace
    } else {
        ctx.status = 500
        return ERRORMSG.SYSTEMERROR.message
    }
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
