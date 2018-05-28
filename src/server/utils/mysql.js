var async = require('async');
var _ = require('lodash')
var moment = require('moment');
var mysql = require('mysql');
// https://github.com/mysqljs/mysql
// 执行sql
var executeSql = exports.executeSql = exports.executeSqlWithParams = function( sql, params, connection, callback){
  if(arguments.length == 2){
    callback = params;
    params = [];
  }
  if(arguments.length == 3){
    callback = connection;
    connection = null;
  }

  var insertFlag = false;  // 标识是否insert语句
  var updateFlag = false;  // 标识是否update语句

  if(!sql){
    return callback("sql undefined");
  }

  // sql = sql.toLowerCase().trim();
  // 判断是否是insert语句
  if(sql.match(/^insert/i)){
      insertFlag = true;
  }else if(sql.match(/^update/i)){
      updateFlag = true;
  }

  if(insertFlag){
    if(params && _.isPlainObject(params)){ // insert语句的参数是对象
      if(!params.createdate){
        params.createdate = moment().format('YYYY-MM-DD');
      }
      if(!params.createtime){
        params.createtime = moment().format('HH:mm:ss');
      }    
      if(!params.savedate){
        params.savedate = moment().format('YYYY-MM-DD');
      }   
      if(!params.savetime){
        params.savetime = moment().format('HH:mm:ss');
      }     
    }
  }

  if(updateFlag){
    if(params && _.isArray(params) && params[0] && _.isObject(params[0])){ // update语句的参数是数组 
      if(!params[0].savedate){
        params[0].savedate = moment().format('YYYY-MM-DD');
      }   
      if(!params[0].savetime){
        params[0].savetime = moment().format('HH:mm:ss');
      }     
    }
  }

if(connection){
  // 如果入参包含连接，则不重新获取
  _exec(connection)
}else{
  // 否则则从连接池重新获取 一个连接
  global.pool.getConnection(function(err, con) {
  if(err || !con){
    return callback(err, null);
  }
  _exec(con);
  });
}

  function _exec(con){
        // Use the connection
        // console.log('begin execute sql:', sql);
        var sqlUse = mysql.format(sql, params);
        console.log('execute sql:',sqlUse.substr(0, 300)); // 限制打印的长度
        con.query(sql,params, function(err, rows, fields) {
        // And done with the connection.
        // console.log('end execute sql:', sql);
        // 释放连接
        if(!connection){
          con.release();
        }
        callback(err, rows, fields);
      });

  }
}

// 在一个connection里执行sql语句
var executeSqlInConnection =  exports.executeSqlInConnection = function(sql, params, connection, callback){
    var sqlUse = mysql.format(sql, params);
    console.log('execute sql:',sqlUse);
    connection.query(sql, params, function(err, rows, fields) {
        // And done with the connection.
        // todo 异常处理
        callback(err, rows, fields)
        // console.log('end execute sql:', sql);
      });
}

// 执行一个sql语句并返回查询总数
var executeSqlAndCount = exports.executeSqlAndCount = function(sql, params,connection, callback){
  if(arguments.length == 2){
    callback = params;
    params = [];
  }

  if(arguments.length == 3){
    callback = connection;
    connection = null;
  }

    var result = {
      total: 0,
      rows:[]
    }
    var inConnection = false; // 是否在一个链接内，如果在，则最后不需要释放链接
    if(connection){
      inConnection = true;
    }

    // SELECT SQL_CALC_FOUND_ROWS 忽略LIMITLIMIT
    sql = sql.trim().replace(/^SELECT/i, "SELECT SQL_CALC_FOUND_ROWS ");

    async.waterfall([
      function(cb){  // 获取链接
        if(inConnection){
          return cb(null)
        }
        // 从连接池中获取一个连接
        global.pool.getConnection(function(err, con) {

          if(err){
            return cb(err, null);
          }
          connection = con;
          cb();
        })
      },
      function(cb){  // 执行sql语句
        executeSqlInConnection(sql, params, connection, function(err, rows, fields) {
          // And done with the connection.
          // todo 异常处理
          if(err){
            return cb(err);
          }
          // 将每个语句执行的结果记录在result数组里
          // result.push({err:err, rows:rows, fields:fields});
          result.rows = rows;
          cb(null);
        });
      },
      function(cb){
        executeSqlInConnection("SELECT FOUND_ROWS() AS total", params, connection, function(err, rows, fields) {
          // And done with the connection.
          // todo 异常处理
          if(err){
            return cb(err);
          }
          // 将每个语句执行的结果记录在result数组里
          // result.push({err:err, rows:rows, fields:fields});
          result.total = rows[0].total;
          cb(null);
        });
      }
    ],function(err){
      if(!inConnection && connection){ // 如果是自己过去的链接则需要 释放，从外面传过来的则不能释放
        connection.release();
      }
      callback(err, result.rows, result.total);
    })
}

// 执行多条sql语句，在同一个连接里,sqlArray = [{sql:'',params:[]},{sql:'',params:[]}]
var executeMultiSql = exports.executeMultiSql = function(sqlArray, callback){
  // 从连接池中获取一个连接
  global.pool.getConnection(function(err, connection) {

    if(err){
      // 如果connection存在则需要释放
      if(connection){
        connection.release();
      }
      return callback(err, null);
    }
    connection.beginTransaction(function(err){
      if(err){
        connection.release();
        return callback(err);
      }
      var result = [];
      var sql = null;
      var params = [];
      // 循环执行sql语句
      async.eachOfSeries(sqlArray, function(value, index, cb){
        sql = value.sql;
        params = value.params;
        // Use the connection
        // console.log('begin execute sql ',index,':', sql);
        connection.query(sql, params, function(err, rows, fields) {
          // And done with the connection.

          // todo 异常处理
          if(err){
            return cb(err, result);
          }
          // 将每个语句执行的结果记录在result数组里
          // result.push({err:err, rows:rows, fields:fields});
          result.push(rows);
          // console.log('end execute sql ',index,':', sql);
          cb()
        });
      }, function(err){
        // 如果任何一个语句出现错误则回滚，返回错误
        if(err){
          connection.rollback(function() {
            connection.release();
            return callback(err, result);
          })
          return;
        }
        // 否则则提交
        connection.commit(function(err){
          // 提交错误则回滚
          if (err) {
            return connection.rollback(function() {
              connection.release();
              return callback(err, result);
            });
            console.log(err)
          }
          // 返回一个数组
          connection.release();
          return callback(null, result);
        })
      })
    })
  });
}

var executeSqlWithParams = exports.executeSqlWithParams1 = function(sql, params, callback){
  global.pool.getConnection(function(err, connection) {
    if(err){
      return callback(err, null);
    }
    // Use the connection
    connection.query(sql, params, function(err, rows, fields) {
      // And done with the connection.

      // todo 异常处理

      callback(err, rows, fields);

      // 释放连接
      connection.release();

      // Don't use the connection here, it has been returned to the pool.
    });
  });
}

// 转义字符串
var escape = exports.escape = function(str){
  return global.pool.escape(str);
}


// console.log('example:', mysql.format('select ? ?',[1,[1,2]] ))

// 转义字符串
var format = exports.format = mysql.format;


// 获取连接
var getConnection = exports.getConnection = function(callback){
  global.pool.getConnection(function(err, connection){
    if(callback) callback(err, connection);
  })
}

// 获取连接
var beginTransaction = exports.beginTransaction = function(callback){
  global.pool.getConnection(function(err, connection){
    if(err) return callback(err, connection);
    connection.beginTransaction(function(err){
      callback(err, connection);
    })
  })
}

var endTransaction = exports.endTransaction = function(connection, callback){
  if(!connection) return callback();
  connection.commit(function(err){
    if(err) {
      connection.rollback(function() {
            connection.release();
            callback(err)
          });
    }else{
      connection.release();
      callback()
    }
  })
}

var rollback = exports.rollback = function(connection, callback){
  if(!connection) return callback();
  connection.rollback(function() {
        connection.release();
        callback()
      });
}
