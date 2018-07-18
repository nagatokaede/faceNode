'use strict'

let createFilesNameSuffixNum = require('../setting').createFilesNameSuffixNum;
const log = require('../debug/log').log;
const dir = require('../debug/log').dir;

const Router = require('koa-router');

// 上传文件
const upload = require('../import/upfile').upload;
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
    ctx.body = 'post 端口测试 ok ！'
    logPath(ctx, 'POST');
});


// 上传图像 API 路由接口 --------------------------------------
const upfile = new Router();

upfile.post('/', upload.array('file', 9), async ctx => {
    // 数据库记录信息
    let userId = await userCreate(ctx);
    let upData = await upFiles(ctx, userId); 

    // 返回文件名
    ctx.body = upData

    // 创建文件名后缀数重置
    createFilesNameSuffixNum = 0;

    // debug
    log(4, `userId: ${userId}`);
    dir(ctx.req.body, `用户请求：`);
    logPath(ctx, 'POST');
});


// 人脸融合 API 路由接口 --------------------------------------
const mergeface = new Router();
// 请求参数说明：
// userId: 用户数据库的 userId，本意为 WeChatOpenId
// templateId: 模板图片,图像数据库 userId，用户数据库的 _id
// templatePath: 模板图片,图像数据库 path_${No.} 
// file: 上传的文件

mergeface.post('/', upload.single('file'), async ctx => {
    // 数据库记录信息
    let userId = await userCreate(ctx);
    let upData = await upFiles(ctx, userId);

    // 人脸融合方法
    let mergeFace = await dataProcessing(ctx, upData);

    // 返回文件名
    ctx.body = mergeFace

    // 创建文件名后缀数重置
    createFilesNameSuffixNum = 0;

    log(4, `userId: ${userId}`);
    dir(ctx.req.body, `用户请求：`);
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
router.use('/admin', fileShow.routes(), fileShow.allowedMethods());

module.exports = router
