'use strict';

// var mysql = require('../utils/mysql')
var returnFactory = require('../utils/returnFactory');
// var userDao = require('../dao/user');  // 需要修改为正确的dao层
// var userDao = requireDao('user');  // 需要修改为正确的dao层

var visibleTool = require('../generator/deleteRouteM');
var getAllRoutes = require('./getAllRoutes').getAllRoutes;
exports.do = function(req, res, callback) {
    // var userName = req.param("name")||"";
    // var tel =  req.param("tel")||""; //'"+userName+"','"+tel+"'

    var params = [1];
    var result = {
        errCode:'SUCCESS',
        returnValue: req.body,
        err: null,
        message:null
    }
    visibleTool(req.body.config);
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