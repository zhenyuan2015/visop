#!/usr/bin/env node

// 引入依赖模块
var shell = require('shelljs'); // 调用shell来完成文件的操作，也可以使用node-extra模块
var fs = require('fs-extra');
var path = require('path');
var shellCmd = ''; // 存储shell脚本字符串
var shellResult = {} // 存储shell命令，获取返回结果
const replace = require('replace-in-file'); // 用来做替文本字符串替换

var BASE_PATH = path.resolve(path.join(__dirname, '..')); // 代码所在根目录
var CURRENT_PATH = __dirname; // 当前文件所在目录

exports.beforeAdd = function(data, callback) {
    console.log('beforeAdd,', data);
    addElement(data)
    return callback()
}

exports.beforeUpdate = function(id, data, callback) {
    console.log('beforeUpdate,', data);
    updateElement(data)
    return callback()
}

exports.beforeDelete = function(id, data, callback) {
    console.log('beforeDelete,', callback);
    deleteElement(data)
    return callback()
}

exports.beforeAll = function(){
    console.log('beforeAll')
}

exports.afterAdd = function(data, callback) {
  console.log('afterAdd,', data);
  addElement(data)
  return callback()
}

exports.afterUpdate = function(id, data, callback) {
  console.log('afterUpdate,', data);
  // updateElement(data)
  return callback()
}

exports.afterDelete = function(id, data, callback) {
  console.log('afterDelete,', callback);
  // deleteElement(data)
  return callback()
}

exports.afterAll = function(){
  console.log('afterAll')
}

var addElement= function(config){
  console.log('add element with data:',config, ' you can achieve this function with any program language you familiar with');
  // sourceFile = path.join(CURRENT_PATH, 'templates', 'default', 'service.js');
  // targetFile =  path.join(BASE_PATH, 'service', config.id+'.js');
  // targetPath = path.dirname(targetFile);
  // fs.ensureDirSync(targetPath);
  // fs.copySync(sourceFile, targetFile,{overwrite:false});
  // nodereplace(targetFile,'\\[tableName\\]',config.tableName||'user');
}

var updateElement = function(config){
    // shelljs 可以执行shell脚本，以下是基本用法
    // shellCmd = 'cp -f '+sourceFile+' '+targetFile;
    // console.log('create controller file with command:', shellCmd);
    // shellResult = shell.exec(shellCmd);
    // if(shellResult.code != 0){
    //   process.exit(shellResult.code)
    // }
}

var deleteElement = function(config){
  // fs-extra模块可以执行跨操作系统的基本文件操作，以下是基本用法，这里建议用同步方法
  // fs.writeFileSync(routerConfigPath, JSON.stringify(routerConfig, null, 4));
  // var sourcePath = path.join(BASE_PATH, 'api',config.id+'.js')
  // var targetPath = path.join(BASE_PATH, 'api','_' + config.id+'.js')
  // fs.moveSync(sourcePath, targetPath, {overwrite: true})
  // sourcePath = path.join(BASE_PATH, 'service',config.id+'.js')
  // targetPath = path.join(BASE_PATH, 'service','_' + config.id+'.js')
  // fs.moveSync(sourcePath, targetPath, {overwrite: true})
}
  

function nodereplace(file, strfrom, strto){
    var options = {
        files: file,
        from: new RegExp(strfrom,'g'),
        to: strto,
      };
      console.log(options)
    try {
      const changes = replace.sync(options);
      console.log('Modified files:', changes.join(', '));
    }
    catch (error) {
      console.error('Error occurred:', error);
    }
  }