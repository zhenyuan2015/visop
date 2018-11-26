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
    console.log('beforeAdd:', data);
    addElement(data)
    return callback()
}

exports.beforeUpdate = function(id, data, callback) {
    console.log('beforeUpdate,', data);
    // updateElement(data)
    return callback()
}

exports.beforeDelete = function(id, data, callback) {
    console.log('beforeDelete,', callback);
    deleteElement(data)
    return callback()
}

exports.beforeAll = function(){
    console.log('beforeAll')
    gitPull()
}

exports.afterAdd = function(){

}

exports.afterAll = function(req,callback){
  
  console.log('afterAll',req.method)
  if(req.method == "GET"){
    return;
  }
  if(req.method == "POST"){
    gitPush()
    callback();
    setTimeout(function(){
      restart()
    },1000)
  }
}



var addElement= function(config){
  console.log('add element with data:',config, ' you can achieve this function with any program language you familiar with');
  
  var sourceFile, targetFile
  if(config.__fromElement){
    // __fromElement 执行复制的操作
    sourceFile = path.join(CURRENT_PATH, config.__fromElement.id+'.js');
    targetFile =  path.join(CURRENT_PATH,  config.id+'.js');
    fs.copySync(sourceFile, targetFile, {overwrite:false});
    sourceFile = path.join(CURRENT_PATH, config.__fromElement.id+'.json');
    targetFile =  path.join(CURRENT_PATH,  config.id+'.json');
    fs.copySync(sourceFile, targetFile,{overwrite:false});
    sourceFile = path.join(CURRENT_PATH, config.__fromElement.id);
    targetFile =  path.join(CURRENT_PATH,  config.id);
    fs.copySync(sourceFile, targetFile,{overwrite:false});
    console.log('copy element end');
    return;
  }
  sourceFile = path.join(CURRENT_PATH, 'index', 'elements.js');
  targetFile =  path.join(CURRENT_PATH,  config.id+'.js');
  fs.copySync(sourceFile, targetFile, {overwrite:false});
  sourceFile = path.join(CURRENT_PATH, 'index', 'elements.json');
  targetFile =  path.join(CURRENT_PATH,  config.id+'.json');
  fs.copySync(sourceFile, targetFile,{overwrite:false});
  sourceFile = path.join(CURRENT_PATH, 'index', 'elements');
  targetFile =  path.join(CURRENT_PATH,  config.id);
  fs.copySync(sourceFile, targetFile,{overwrite:false});
  console.log('add element end');
}

var updateElement = function(config){
    console.log('update element with data:',config, ' you can achieve this function with any program language you familiar with');
    var sourceFile, targetFile
    sourceFile = path.join(CURRENT_PATH, 'index', 'elements.js');
    targetFile =  path.join(CURRENT_PATH,  config.id+'.js');
    fs.copySync(sourceFile, targetFile,{overwrite:false});
    sourceFile = path.join(CURRENT_PATH, 'index', 'elements.json');
    targetFile =  path.join(CURRENT_PATH,  config.id+'.json');
    fs.copySync(sourceFile, targetFile,{overwrite:false});
    sourceFile = path.join(CURRENT_PATH, 'index', 'elements');
    targetFile =  path.join(CURRENT_PATH,  config.id);
    fs.copySync(sourceFile, targetFile,{overwrite:false});
    console.log('update element end');
};

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


var deleteElement = function(config){
      // 初始化信息
      var routeName = config.id;
      fs.moveSync(path.join(CURRENT_PATH,  config.id+".js"), path.join(CURRENT_PATH,  "_"+ config.id+".js"), {overwrite: true})
      fs.moveSync(path.join(CURRENT_PATH,  config.id+".json"), path.join(CURRENT_PATH,  "_"+ config.id+".json"), {overwrite: true})
      fs.moveSync(path.join(CURRENT_PATH,  config.id), path.join(CURRENT_PATH,  "_"+ config.id), {overwrite: true})
      console.log('delete route '+routeName+' success');
  }
  
  
  function gitPull(){
    shellCmd = `sh ${CURRENT_PATH}/gitpull.sh ${BASE_PATH}`;
    shellResult = shell.exec(shellCmd);
    // if(shellResult.code != 0){
    //   process.exit(shellResult.code)
    // }
  }

  function gitPush(){
    shellCmd = `sh ${CURRENT_PATH}/gitpush.sh ${BASE_PATH}`;
    shellResult = shell.exec(shellCmd);
    // if(shellResult.code != 0){
    //   process.exit(shellResult.code)
    // }
  }

 var restart = exports.restart = function(data){
    if(process.platform == 'win32'){
      console.log('win32 restart')
      shellCmd = `visop start -f -c ${BASE_PATH} -P `+process.env.PORT;
      shellResult = shell.exec(shellCmd);
    }else{
      console.log('linux restart,', data)
      shellCmd = `pm2 restart ${process.env.name}`;
      shellResult = shell.exec(shellCmd);
    }
  }
  