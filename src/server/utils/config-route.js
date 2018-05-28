/**
 * 配置route
 */

var jwt = require('express-jwt');
// var tokenManager = require('./token_manager');
var setting = require('../config/setting');
var routeMap = require('../config/router.json');
// var router = require('express').Router();
var rbac = require('./rbac');
var log = require('./log');                 // 加载日志
var sanitize = require('./sanitize.js');
var checkValidate = require('./checkValidate.js');
var _ = require('lodash')
// var checkLogin = require('./checkLogin').checkLogin; 
var path = require('path')

var jwtOptions = {
        secret: setting.secretToken,
        // credentialsRequired: true,
        getToken: function fromHeaderOrQuerystring (req) {  //自定义获取前端传过来的token方式
            return req.headers['x-access-token'];  //获取前端请求头中的x-access-token字段
        },
        isRevoked: isRevokedCallback
    };

function isRevokedCallback(req, payload, done){
    console.log("1");
}

module.exports = function(router){
    // var router = app.Router;
    //遍历路由配置文件，动态生成route
    _.forOwn(routeMap, function(obj, key){
       var method = obj.method;
       var route = obj.route;
       
       var authority = obj.authority;
       var action = obj.action;
       //根据配置中的权限是否为空来判断是否添加鉴权中间件
       try{
           var controllerPath = path.resolve(path.join('.','api',obj.route))
           console.log(controllerPath)
        var controller = require(controllerPath);
        console.log(route, obj.controller, action);
        router.get('/'+route, sanitize, checkValidate , controller[action]);   
        router.post('/'+route, sanitize, checkValidate ,  controller[action]);   
        // router['post'](route,tokenManager.touchToken, sanitize, controller[action]);  
        // 开发模式下不鉴权
        // if(global.ENV == 'production' || global.ENV == 'test'){
        //     // if(authority && ENV == 'production' ){
        //     if(authority){
        //         //1、检查是否有token；2、检查token是否有效；3、检查是否有权限访问接口
        //         router[method](route, 
        //             tokenManager.validateToken, 
        //             rbac(authority), 
        //             sanitize, controller[action]); 
        //     }else{
        //         router['get'](route,tokenManager.touchToken, sanitize, controller[action]);   
        //         router['post'](route,tokenManager.touchToken, sanitize, controller[action]);   
        //     }
        // }else{
        //     router['get'](route,tokenManager.touchToken, sanitize, controller[action]);   
        //     router['post'](route,tokenManager.touchToken, sanitize, controller[action]);   
        // }
        
       }catch(err){
           log.error('router['+method+
                ']('+route+', authority:'+
                authority+', '+obj.controller+'['+action+']);')
                log.error(err);
       }
        
    })
    // app.use(router);
    return router;
};
