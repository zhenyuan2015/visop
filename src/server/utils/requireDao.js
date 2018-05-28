
var path = require('path')
// var filename = path.basename(__filename,'.js'); // 文件的名字
// var map = require('./'+filename+'.json');
var mysql = require('../utils/mysql');

var _ = require('lodash');

module.exports = function(daoName){
    var configJson = require(path.join('../dao',daoName+".json"));
    var vaule = null;
    var result = {};
    for(var key in configJson){
        value = configJson[key];  // value 是对象，引用类型

        result[key] = function(){
            var sql = value.sql;// 这里的 sql 对于下面的函数相当于一个常量
            var limit = value.limit;
            return  function(params, connection, cb){
                var arr = [sql];
                if(arguments.length == 2){
                    arr.push(arguments[0]);
                    arr.push(arguments[1]);
                }
                if(arguments.length == 3){
                    arr.push(arguments[0]);
                    arr.push(arguments[1]);
                    arr.push(arguments[2]);
                }
                // console.log(arguments[0]);
                // console.log(arguments);
                // console.log(JSON.parse(arguments));
                // console.log(arr.concat(JSON.parse(arguments)));
                if(limit && Number(limit)>1){
                    mysql.executeSqlAndCount.apply(null,arr); 
                    return;
                }
                // mysql.executeSqlWithParams(sql, params, connection,function(err, results, fields){
                //     cb(err, results, fields);
                // })
                mysql.executeSqlWithParams.apply(null,arr);
            }
        }(); // 注意，执行了一次这个函数
    }
    return result;
}
