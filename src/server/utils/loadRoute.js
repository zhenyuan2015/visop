
// 加载API模块
var express = require('express');
var url = require('url')
// var invalidPackage = require('./invalidPackage')
var setting = require('../config/setting');
var path = require('path')

module.exports = function(app){
    router = express.Router();
    //批量配置路由-z
    router = require('./config-route')(router);

    var visopHooks = {}; // 元素触发的钩子函数，定义在用户代码目录
    var visopPath = ""
    require('./json-server')(router, visopHooks);
    // console.log('visopPath',visopPath)
    app.use((req, res, next) => {
        // 保证在send之后还能继续处理数据，重要
        var resSend = res.send
        res.send = function(){
            resSend.apply(this,arguments);
            next();
        }
        // res.jsonp = res._jsonp
        try{
            // console.log('before............', req.path,req.method)
            var temp = parsePath(req);
            var configName = temp.configName;
            var tableName = temp.tableName;
            if(!visopHooks[configName]){
                return next()
            }
        
            if(tableName != "data"){
                // 只有操作data才触发钩子函数
                return next()
            }

            // if(req.baseUrl.replace('/','') == )


            if(req.method == "POST"){
                // console.log('req.body', req.body, visopHooks[configName]["beforeAdd"])
                if(visopHooks[configName]["beforeAdd"]){
                    visopHooks[configName]["beforeAdd"](req.body, function(err, data){
                        if(err){
                            return next(err)
                        }
                    })
                }
            }
            if(req.method == "PATCH"){
                if(visopHooks[configName]["beforeUpdate"]){
                    visopHooks[configName]["beforeUpdate"](req.params.id, req.body, function(err, data){
                        if(err){
                            return next(err)
                        }
                    })
                }
            }
            if(req.method == "DELETE"){
                if(visopHooks[configName]["beforeDelete"]){
                    visopHooks[configName]["beforeDelete"](req.params.id, req.body, function(err, data){
                        if(err){
                            return next(err)
                        }
                    })
                }
            }
            if(visopHooks[configName]["beforeAll"]){
                visopHooks[configName]["beforeAll"](req, function(err, data){
                    if(err){
                        return next(err)
                    }
                })
            }
 
        }catch(e){
            console.log('error:',e);
        }
        
        return next()
    })

    app.use(router)

    app.use(function(req, res, next){
    //    console.log('after route ...', req)
    //    console.log('after router')
        try{
            // console.log('after............', req.originalUrl)
            // var visopHook = require("")
            // if(!req.visop || !req.visop.configName){
            //     return;
            // }
            var temp = parsePath(req);
            var configName = temp.configName;
            var tableName = temp.tableName;
            
            // if(!visopHooks[configName]){
            //     return next()
            // }
            // console.log('configName is:', temp)
    

            if(temp.tableName != 'data'){
                // 只有操作data才触发钩子函数
                return next()
            }
 
            if(req.method == "POST"){
                // console.log('req.body', req.body, visopHooks[configName]["beforeAdd"])
                if(visopHooks[configName] && visopHooks[configName]["afterAdd"]){
                    visopHooks[configName]["afterAdd"](req.body, function(err, data){
                        if(err){
                            // return next(err)
                        }
                    })
                }
            }
            if(req.method == "PATCH"){
                if(visopHooks[configName] && visopHooks[configName]["afterUpdate"]){
                    visopHooks[configName]["afterUpdate"](req.params.id, req.body, function(err, data){
                        if(err){
                            // return next(err)
                        }
                    })
                }
            }
            if(req.method == "DELETE"){
                if(visopHooks[configName] && visopHooks[configName]["afterDelete"]){
                    visopHooks[configName]["afterDelete"](req.params.id, req.body, function(err, data){
                        if(err){
                            // return next(err)
                        }
                    })
                }
            }
            // if(req.baseUrl.replace('/','') == )
            if(visopHooks[configName] && visopHooks[configName]["afterAll"]){
                visopHooks[configName]["afterAll"](req, function(err, data){
                    if(err){
                        return next(err)
                    }
                })
            }
        }catch(e){
            console.log('error:',e);
        }
        next()
    })
}

function afterRoute(req, res, next){
    
    // return next()
}

// 从url里获取json名称和表名称
function parsePath(req){
    var result = {
        configName:"",
        tableName: ""
    }
    var temp = url.parse(req.originalUrl).pathname;
    temp = temp.split('/')
    if(temp.length>1){
        result.configName = temp[1];
    }
    if(temp.length>2){
        result.tableName = temp[2];
    }
    return result;
}