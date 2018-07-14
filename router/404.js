'use strict'

// 404 页面返回信息

const log = require('../debug/log').log;


module.exports = () => {
    return async (ctx, next) => {

        log(1, `404 page ${ctx.url} not found!`);

        ctx.status = 404;

        switch (ctx.accepts('html', 'json')) {
            case 'html':
                ctx.type = 'html';
                ctx.body = '<h2>404 Page Not Found<h2>';
                break;
            case 'json':
                ctx.body = {
                    message: '404 Page Not Found'
                };
                break;
            default:
                ctx.type = 'text';
                ctx.body = '404 Page Not Found';
        }

        await next();
    }
}
