'use strict'

module.exports = {
    USERERROR: {
        log: '用户验证错误', 
        code: 400, 
        message: {
            code: 400, 
            msg: '用户验证错误'
        } 
    }, 
    FILETYPEERROR: {
        log: '不支持的上传文件类型', 
        code: 400, 
        message: {
            code: 400, 
            msg: '不支持的上传文件类型'
        } 
    }, 
    SIZEERROR: {
        log: '上传图像大于 2M', 
        code: 400, 
        message: {
            code: 400, 
            msg: '上传图像大于 2M'
        } 
    }, 
    NUMBERERROR: {
        log: '图像上传超过 2 张', 
        code: 400, 
        message: {
            code: 400, 
            msg: '图像上传超过 2 张'
        } 
    }, 

    FINDERROR: {
        log: '未能找到该 ID 下的模板图像', 
        code: 400, 
        message: {
            code: 400, 
            msg: '未能找到该 ID 下的模板图像'
        } 
    }, 
    FACEERROR: {
        log: '未能检测到人脸', 
        code: 400, 
        message: {
            code: 400, 
            msg: '未能检测到人脸'
        } 
    }, 
    SYSTEMERROR: {
        log: '系统内部错误', 
        code: 500, 
        message: {
            code: 500, 
            msg: '系统内部错误'
        } 
    }
}
