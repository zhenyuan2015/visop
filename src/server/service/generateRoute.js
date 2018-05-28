'use strict';

// var mysql = require('../utils/mysql')
var returnFactory = require('../utils/returnFactory');
// var user_tDao = require('../dao/user_t');  // 需要修改为正确的dao层
// var userDao = requireDao('user');  // 需要修改为正确的dao层

var visibleTool = require('../generator/generateRouteM')
var getAllRoutes = require('./getAllRoutes').getAllRoutes;
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
    var sample= {
        "tableName":"user",
        "route":"aaaaatest",
        "description":"增加路由",
        "methods":"GET,POST",
        "authority":"100000",
        "path": "D:\\yty\\ytycloud",
        "parameters":
          {
            "config": {
              "notEmpty": true,
              "errorMessage": "config不能为空"
            }
          }
    };

    var config = req.body.config;
    config.tableName = 'user';
    config.path = "D:\\yty\\ytycloud";
    visibleTool(config);
    getAllRoutes(function(err, arr){
        if(err){
            result.err = err;
            result.errCode = 'ERROR';
            return callback(result)
        }
        result.returnValue = arr;
        return callback(result)
    })
    
    
    // userDao.queryById(params, function(err, rows){
    //     if(!err){
    //         result.returnValue = rows;
    //         return callback(result)
    //         // return res.json(returnFactory('SUCCESS', rows));
    //     }else{
    //         result.err = err;
    //         result.errCode = 'ERROR';
    //         return callback(result)
    //         //  return res.json(returnFactory('ERROR', null, err));
    //     }
    // })
};