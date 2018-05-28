var setting = require('../config/setting');
var async = require('async');
var log = require('./log'); // 日志系统
var getToken = require('./token_manager').getToken;
var _ = require('lodash');
// 根据白名单检查是否登陆，鉴权使用前的临时方案
exports.checkLogin = function(req, res, next) {
    // res.header('updated-x-access-token', req.headers['x-access-token']);
    if(!setting.needAuth){
        return next()
    }
    var whiteList = setting.whiteList;
    // console.log('req', req)
    var search =  null;
    for(var i=0;i<whiteList.length;i++){
        search = new RegExp('^'+whiteList[i],'i');
        if(req.url.replace(/^\//,'').match(search)){
            return next(); // 如果在白名单则不需要进行鉴权
        }
    }
    // 不在白名单接口中
    if(req.user){
        return next();
    }
    // 不是登录用户则报错
    return res.sendStatus(401);
}