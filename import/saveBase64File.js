'use strict'

const log = require('../debug/log').log;
const dir = require('../debug/log').dir;

const fs = require('fs');

const createFile = require('./tools/createFile');

let saveFun = (ctx) => {
    // 处理上传文件 base64 数据
    let basefile = ctx.req.body.dataBase64;
    let base64Data = basefile.replace(/^data:image\/\w+;base64,/, "");
    // 创建文件夹
    let filesPath = createFile(ctx);
    log(3, `日期文件夹返回情况：${filesPath}`);
    
    // 存储为图像
    let bufferdata = new Buffer(base64Data, 'base64');
    let filename = Date.now() + '.jpg'
    let imgPath = `${filesPath}${filename}`

    return new Promise((resolve, reject) => {
        fs.writeFile(imgPath, bufferdata, err => {
            if (err) {
                log(0, `存储 base64 图片失败！ ${err}`);
                resolve(false);
            } 
            
            resolve({
                "filename": filename, 
                "path": imgPath,
                "mimetype": "image/jpeg"
            });
        });
    });
}

module.exports = saveFun