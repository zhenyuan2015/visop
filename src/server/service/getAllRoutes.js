'use strict';

// var mysql = require('../utils/mysql')
var returnFactory = require('../utils/returnFactory');
// var user_tDao = require('../dao/user_t');  // 需要修改为正确的dao层
// var userDao = requireDao('user');  // 需要修改为正确的dao层
var fs = require('fs-extra');
var path = require('path');
var processCwd = __dirname; // 脚本 根目录
exports.do = function(req, res, callback) {
    // var userName = req.param("name")||"";
    // var tel =  req.param("tel")||""; //'"+userName+"','"+tel+"'

    var params = [1];
    var result = {
        errCode:'SUCCESS',
        returnValue: null,
        err: null,
        message:null
    }
    // console.log('-----------', path.join(processCwd))
    getAllRoutes(function(err, arr){
        if(err){
            result.err = err;
            result.errCode = 'ERROR';
            return callback(result)
        }
        result.returnValue = arr;
        return callback(result)
    })
};

var getAllRoutes = exports.getAllRoutes = function(cb){
    var allRoutes = fs.readJson(path.join(processCwd,'..','config','router.json'), function(err, json){
        if(err){
            return cb(err)
        }
        var i = 0;
        var arr = []
        var temp = {};
        for(var key in json){
            // temp[key] = json[key];
            if(json[key].parameters){
                json[key].parameters = JSON.stringify(json[key].parameters);
            }
            arr.push(json[key])
        }
        // result.returnValue = arr;
        return cb(null, arr)
    })
}