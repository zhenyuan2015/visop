'use strict';
// console.log('ddddddddd,',process.env.CODE_PATH);
var path = require('path');
var fse = require('fs-extra');
var express = require('express');
var shell = require('shelljs')
// var m = require('./api/diagnosticRecord/service');
// var doc = {
//     birthday:'1488811074459',
//     createdAt: '567199560000'
// }
// console.log(m.getReportData(doc));
// console.log('111111111111111')

/*实例化express对象*/
var app = express();
//定义全局环境变量
// 在此之前，应该在开发环境的电脑上配置export NODE_ENV=product
global.ENV = app.get("env");
// 初始化测试数据
// if(ENV == 'test'){
//   require('./initTest');
// }
global.requireDao = require('./utils/requireDao'); // 全局引用dao的函数

// var ejs = require('ejs');

var setting = require('./config/setting'); // 自己定义的全局变量
setting.CODE_PATH = process.env.CODE_PATH; // 配置文件所在根目录

// var mysql = require('mysql');
// mysql._format = mysql.format;
// mysql.format = function(){
//     console.log('format...............',arguments)
//   var results = mysql._format.apply(this, arguments);
//   console.log('execute sql:', results);
//   return results;
//     // return mysql.format;
// }

// global.pool  = mysql.createPool(setting.mysql);
// pool.on('enqueue', function (abc) {
//   console.log('Waiting for available connection slot', abc);
// });
// pool.on('connection', function (connection) {
// //   connection.query('SET SESSION auto_increment_increment=1')
// });
// pool.on('acquire', function (connection) {
//   console.log('Connection %d acquired', connection.threadId);
// });
// pool.on('release', function (connection) {
//   console.log('Connection %d release', connection.threadId);
// });

// 链接elasticsearch
// https://github.com/elastic/elasticsearch-js


var logDir1 = path.join(__dirname, 'logs','log_date');
// console.log('logDir1:', logDir1);
fse.ensureDirSync(logDir1)

var logDir2 = path.join(__dirname, 'logs','log_file');
// console.log('logDir2:', logDir2);
fse.ensureDirSync(logDir2)

// console.log('file upload url:' + setting.file_url);
var log = require('./utils/log'); // 日志系统

var system = require('./utils/system'); // 系统操作库
// var pagination = require('mongoose-pagination'); //分页-z

// *****************************************************
// 全局变量定义
// 在./config/setting.js中定义


// *****************************************************
// 日志系统初始化
// log.debug("日志系统启动!");

//实例化redis客户端,配置token时需要用到-z
// global.redisClient = require('./utils/redis').redisClient;

// ********************************************************
// Express 设置

// if (global.ENV == 'production') {
//     console.log('正式环境模式');
// } else if (ENV == 'test') {
//     console.log('测试环境模式');
// } else {
//     console.log('开发环境模式');
// }


// 扫描model目录
// console.log('1111111111111111111111111111',path.join(__dirname , 'models') )
// var model_list = require('./models/schema.json');
// log.debug("目录列表 ", model_list);
// for(var i=0;i<model_list.length;i++){
//     require('./models/'+ model_list[i]+'.js');
// }


// global.ENV = 'production';
require('./utils/express')(app);
// var env = app.get('env');

//设置静态目录放在public文件中
app.use(express.static(path.join(__dirname, '..', 'front','dist')));

// 覆盖req.param
app.use(function(req, res, next){
    req.param = function param(name, defaultValue) {
        var params = this.params || {};
        var body = this.body || {};
        var query = this.query || {};

        var args = arguments.length === 1
            ? 'name'
            : 'name, default';
        // deprecate('req.param(' + args + '): Use req.params, req.body, or req.query instead');

        if (null != params[name] && params.hasOwnProperty(name)) return params[name];
        if (null != body[name]) return body[name];
        if (null != query[name]) return query[name];

        return defaultValue;
    };
    return next();
})

// ********************************************************
// 加载API模块
var router = express.Router();
//批量配置路由-z
router = require('./utils/config-route')(router);

var visopHooks = {}; // 元素触发的钩子函数，定义在用户代码目录
require('./utils/json-server')(router, visopHooks);


app.use((req, res, next) => {
    console.log('before............', req.path,req.method)
    // var visopHook = require("")
    var configName = req.path.split("/")[1];
    if(!visopHooks[configName]){
        return next()
    }

    if(req.method == "POST"){
        // console.log('req.body', req.body, visopHooks[configName]["beforeAdd"])
        visopHooks[configName]["beforeAdd"](req.body, function(err, data){
            if(err){
                return next(err)
            }
        })
    }
    if(req.method == "PATCH"){
        visopHooks[configName]["beforeUpdate"](req.params.id, req.body, function(err, data){
            if(err){
                return next(err)
            }
        })
    }
    if(req.method == "DELETE"){
        visopHooks[configName]["beforeDelete"](req.params.id, req.body, function(err, data){
            if(err){
                return next(err)
            }
        })
    }
    // if(req.baseUrl.replace('/','') == )

    return next()
  })

app.use(router)


// // 加载API目录
// for (var i = 0; i < route_list.length; i++) {
//    var routePath =  path.join(global.API_PATH, route_list[i].name, route_list[i].name + ".router");
//    var route = require(routePath);
//    var apiRoot = ['', 'api', route_list[i].name].join('/');
//    app.use(apiRoot ,route);
//    log.debug("Load API Root: " , apiRoot , " PATH:",  routePath);
// }
// app.use('/api/user', require(__dirname+'\\server\\api\\user\\route'));
// ********************************************************
// 页面模块

// 加载server目录 server目录是公开目录，没有token验证
// var app_list = ['logreg'];
// for(var i=0;i<app_list.length;i++){
//     var app_route = require('./server/'+app_list[i]+'/route');
//     app.use("/",app_route)
// }

// 仅加载一个演示页面,空白页面
// app.get("/", function(req, res) {
//     res.render("index.html", {});
// });



// *********************************************************
// database 数据库设置

// 实例化数据库访问
// global.db = require('./utils/mongodb')(setting.database);

// console.log('加密测试---------------: ', require('./utils/encrypt').createHash('123456'));

var message = require('./utils/returnFactory');
//错误处理-z
app.use(function(err, req, res, next) {
    if (err.name === 'UnauthorizedError') {
        res.status(401).send('invalid token...');
    }
    if (err.name === 'ParamValidateError') {
        res.status(200).json(message('PARAM_ERROR', null, err));
    }
    log.error(err);
    // res.status(200).json(message('ERROR', null, err));
});

function handleExit(){
    // 释放mysql连接池
    if(global.pool){
        global.pool.end(function(err) {
            process.exit(err ? 1 : 0);
        });
    }
}

var cleanup = require('./utils/cleanup').Cleanup(handleExit)


module.exports = app;
// app.listen(8029,function(err){
//     console.log('listen on 8029');
// });