/**
 * Created by achar on 2016/12/2.
 */
'use strict';


var path = require('path');
var compression = require('compression');
var favicon = require('serve-favicon');
var log = require('./log'); // 加载日志
var cookieParser = require('cookie-parser'); // 加密cookie
var validator = require('./validator-config'); //配置参数校验中间件
var bodyParser = require('body-parser');
var express = require('express');
// var ejs = require('ejs');
// var rbac = require('../middleware/rbac');
var jwt = require('express-jwt');
// var tokenManager = require('./token_manager');

//自己定义的全局变量
var setting = require('../config/setting');
// ********************************************************
// Express 设置
// 此功能有环境依赖,使用时注意

module.exports = function(app) {


    // 启动访问链接控制台输出
    app.use(log.log4js.connectLogger(log));

    // view engine setup  设置模板引擎
    app.use(compression()); // 对返回response做gzip压缩,需要放到所有请求开始以前
    app.set('views', path.join(__dirname, "..", 'views'));
    // app.engine('html', ejs.__express);
    // app.set('view engine', 'html');


    //设置请求头  TODO 需要隐藏来源信息
    app.all('*', function(req, res, next) {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "X-Requested-With,x-access-token,Content-Type,device-id,is_kick_off");
        res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,PATCH,OPTIONS");
        res.header("Access-Control-Expose-Headers", "x-access-token, updated-x-access-token,is_kick_off");
        next();
    });

    // //设置token验证
    // require('./config-jwt')(app);


    // 设置session缓存到redis
    // require('./session-set')(app);


    // 网页地址栏出现的图标
    // app.use(favicon(path.join(__dirname, '..', 'public', 'favicon.ico')));


    //设置静态目录放在public文件中
    // app.use(express.static(path.join(__dirname, '..', 'public')));


    //只能解析json格式的中间件，能接受任何body中任何Unicode编码的字符
    app.use(bodyParser.json({ limit: '50mb' }));

    //这个中间件用来解析body中的urlencoded字符， 只支持utf-8的编码的字符。
    app.use(bodyParser.urlencoded({ limit: '50mb', extended: false }));

    //参数校验配置
    app.use(validator());

    app.use(cookieParser());

};