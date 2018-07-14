'use strict'

module.exports = {
    USERERROR: {
        log: '用户验证错误', 
        cold: 400, 
        message: {
            cold: 400, 
            msg: '用户验证错误'
        } 
    }, 
    FILETYPEERROR: {
        log: '上传内容不是图像', 
        cold: 400, 
        message: {
            cold: 400, 
            msg: '上传内容不是图像'
        } 
    }, 
    SIZEERROR: {
        log: '上传图像大于 2M', 
        cold: 400, 
        message: {
            cold: 400, 
            msg: '上传图像大于 2M'
        } 
    }, 
    NUMBERERROR: {
        log: '图像上传超过 9 张', 
        cold: 400, 
        message: {
            cold: 400, 
            msg: '图像上传超过 9 张'
        } 
    }, 

    FINDERROR: {
        log: '未能找到该 ID 下的模板图像', 
        cold: 400, 
        message: {
            cold: 400, 
            msg: '未能找到该 ID 下的模板图像'
        } 
    }, 
    FACEERROR: {
        log: '未能检测到人脸', 
        cold: 400, 
        message: {
            cold: 400, 
            msg: '未能检测到人脸'
        } 
    }, 
    SYSTEMERROR: {
        log: '系统内部错误', 
        cold: 500, 
        message: {
            cold: 500, 
            msg: '系统内部错误'
        } 
    }
}
