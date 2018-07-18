'use strict'

const log = require('../debug/log').log;
const setting = require('../setting').server;

const koa = require('koa');
const Path = require('path');
const Static = require('koa-static');
const bodyParser = require('koa-bodyparser');
const cors = require('koa-cors');


const router = require('../router/router');
const page404 = require('../router/404');

const app = new koa();

// 添加 ajax 跨域解决中间件
app.use(cors());

// 静态资源目录对于相对入口文件server.js的路径
const staticPath = ['../testfile', '../static'];
app.use(Static(
    Path.join(__dirname, staticPath[0])
));
app.use(Static(
    Path.join(__dirname, staticPath[1])
));

// 加载 koa-bodyparser 中间件，处理 POST 提交信息
app.use(bodyParser());

// 加载路由中间件
app.use(router.routes()).use(router.allowedMethods());

// 加载 404 中间件
app.use(page404());


app.listen(setting.post, setting.hostname, () => {
    log(3, `koa start address: ${setting.hostname}:${setting.post}`);
});

module.exports = app
