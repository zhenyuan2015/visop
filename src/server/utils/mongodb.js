/**
 * Created by achar on 2016/12/2.
 */
'use strict';

// 引入mongo模块
var mongoose = require('mongoose');
mongoose.Promise = global.Promise;
var async = require('async');
var log = require(global.ROOT_PATH + "/utils/log"); // 获取日志

//设置全局变量db,传入url,连接数据库
var mongodb= function(options) {

    if(!options || !options.host || !options.port || !options.database){
        log.error("数据库参数配置不正确!");
        log.debug("数据库参数为:");
        log.debug(JSON.stringify(options));
        throw ("数据库参数配置不正确!");
    }

    //设置项目数据库在mongo地址和数据库名
    if(options.password.length > 0){
        var uri = 'mongodb://'+ options.username + ':' + options.password +'@' + options.host + ':' + options.port+'/' + options.database;
        console.log(uri)
    }else{
        var uri = 'mongodb://' + options.host + ':' + options.port+'/' + options.database;
    }
    
    console.log('数据库:'+uri);
    var db = mongoose.connect(uri,function(err){
        if(!err){
            log.info("mongodb is connected");
        }else{
            log.error("数据库链接失败!");
            throw err;
        }
    });

    //连接成功时
    mongoose.connection.on('connected', function(){
        console.log('Connection success!');

        // if(global.ENV == "test"){
        //     mongoose.connection.db.collections(function(err, collections) {
        //         async.each(collections, function(collection, cb) {
        //         if (collection.collectionName.indexOf('system') === 0) {
        //             return cb()
        //         }
        //         collection.remove(cb)
        //         }, function(err){
        //             console.log('！！！！！！！清空数据库');
        //         })
        //     })
        // }
    });

    //连接失败时
    mongoose.connection.on('error', function(err){
        console.log('Connection error: ' + err);
    });

    //断开连接时
    mongoose.connection.on('disconnected', function(){
        console.log('Connection disconnected');
    });

    return db;

}


module.exports  = mongodb;
