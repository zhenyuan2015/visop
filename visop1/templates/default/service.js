'use strict';

var mysql = require('../utils/mysql')
var returnFactory = require('../utils/returnFactory');
// var [tableName]Dao = require('../dao/[tableName]');  // 需要修改为正确的dao层
var [tableName]Dao = requireDao('[tableName]');  // 需要修改为正确的dao层

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
    return callback(result)
    [tableName]Dao.queryById(params, function(err, rows){
        if(!err){
            result.returnValue = rows;
            return callback(result)
            // return res.json(returnFactory('SUCCESS', rows));
        }else{
            result.err = err;
            result.errCode = 'ERROR';
            return callback(result)
            //  return res.json(returnFactory('ERROR', null, err));
        }
    })
};