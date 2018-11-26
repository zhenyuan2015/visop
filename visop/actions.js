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
    gitPull()
}

exports.afterAdd = function(data, callback) {
  console.log('afterAdd,', data);
  // addElement(data)
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

exports.afterAll = function(req){
  console.log('afterAll',req.method)
  if(req.method == "GET"){
    return;
  }
  console.log('req.method:',req.method,'begin git push and sync')
  // syncPages1()
  gitPush()
}

exports.syncgit = function(){
  shellCmd = `sh ${CURRENT_PATH}/gitpush.sh ${BASE_PATH}`;
  shellResult = shell.exec(shellCmd);
}

exports.restart = function(req, res, callback){
  callback()
  setTimeout(function(){
    if(process.platform == 'win32'){
      console.log('win32 restart')
      shellCmd = `visop start -f -p ${BASE_PATH} -P `+process.env.PORT;
      shellResult = shell.exec(shellCmd);
    }else{
      // console.log('linux restart,', data)
      shellCmd = `pm2 restart ${process.env.name}`;
      shellResult = shell.exec(shellCmd);
    }
  },1000)
}
exports.restartapp = function (req, res, callback) {
  callback()
  setTimeout(function () {
    if (process.platform == 'win32') {
      console.log('win32 restart')
      shellCmd = `visop start -f -p ${BASE_PATH} -P ` + process.env.PORT;
      shellResult = shell.exec(shellCmd);
    } else {
      // console.log('linux restart,', data)
      shellCmd = `pm2 restart ` + process.env.name.replace('visop', '');
      shellResult = shell.exec(shellCmd);
    }
  }, 1000)
}
exports.syncgitAndRestart = function(req, res, callback){
  if(req && req.body && req.body.__doexecute){
    callback()
  }

  if(req && req.body){
    console.log('1111111111111111:', req.body)
  }
  
  // console.log('222222222222222:', req)
  exports.syncgit(req, res, callback);
  setTimeout(function(){
    if(process.platform == 'win32'){
      console.log('win32 restart')
      shellCmd = `visop start -f -p ${BASE_PATH} -P `+process.env.PORT;
      shellResult = shell.exec(shellCmd);
    }else{
      // console.log('linux restart,', data)
      shellCmd = `pm2 restart `+process.env.name.replace('visop','');
      shellResult = shell.exec(shellCmd);
    }
  },1000)
  if(res){
    res.json({msg: "success"})
  }
  
}

var addElement= function(config){
  if(config.__fromElement){
    // 复制逻辑
    copyElement(config)
    return;
  }
  // nodereplace(targetFile,'\\[tableName\\]',config.tableName||'user');
  // syncPages()
  
}

function copyElement(config){
  // console.log('copy element with data:',config, ' you can achieve this function with any program language you familiar with');
  // var sourceFile = path.join(BASE_PATH, 'pages','elements', config.__fromElement.id+'.ui');
  // var targetFile = path.join(BASE_PATH, 'pages','elements', config.id+'.ui');
  // targetPath = path.dirname(targetFile);
  // fs.ensureDirSync(targetPath);
  // fs.copySync(sourceFile, targetFile,{overwrite:false});
}
var updateElement = addElement
// var updateElement = function(config){
  
//     // shelljs 可以执行shell脚本，以下是基本用法
//     // shellCmd = 'cp -f '+sourceFile+' '+targetFile;
//     // console.log('create controller file with command:', shellCmd);
//     // shellResult = shell.exec(shellCmd);
//     // if(shellResult.code != 0){
//     //   process.exit(shellResult.code)
//     // }
//     // syncPages()
// }

var deleteElement = function(config){
  // fs-extra模块可以执行跨操作系统的基本文件操作，以下是基本用法，这里建议用同步方法
  // fs.writeFileSync(routerConfigPath, JSON.stringify(routerConfig, null, 4));
  // var sourcePath = path.join(BASE_PATH, 'api',config.id+'.js')
  // var targetPath = path.join(BASE_PATH, 'api','_' + config.id+'.js')
  // fs.moveSync(sourcePath, targetPath, {overwrite: true})
  // sourcePath = path.join(BASE_PATH, 'service',config.id+'.js')
  // targetPath = path.join(BASE_PATH, 'service','_' + config.id+'.js')
  // fs.moveSync(sourcePath, targetPath, {overwrite: true})
  // syncPages()
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


exports.loadAll = function(req, res, callback){
  if(callback) callback()
  console.log('loadAll, warn: this will load all configs from code into json, will recover the json file')
  var routerConfigPath = path.join(BASE_PATH, 'config', 'router.json');
  console.log('Step 0.1 -- add route router config file Path', routerConfigPath)
  fs.ensureDirSync(path.join(BASE_PATH, 'config')); // 保证config目录存在，如果没有新建一个
  // 需要把路由分离出来
  //1 添加路由配置 ../config/router.json
  try{
    var routerConfig = require(routerConfigPath);
  }catch(e){
    console.log(routerConfigPath, ' route配置文件不存在，创建新的')
    var routerConfig = {}
  }
  var jsonOutput = require(path.join(CURRENT_PATH, 'apimanage.json'))
  // jsonOutput.data = []
  var fileContent = ""
  var temp = -1;
  for(var key in routerConfig){
    // console.log("item:", routerConfig.data[key]);
    try{
      fileContent = fs.readFileSync(path.join(BASE_PATH, 'api', key+'.js'), 'utf-8');
      var output = require(path.join(BASE_PATH, 'mock', key+'.json'));
    }catch(e){
      continue
    }
    
    // console.log('fileContent,', fileContent.trim().split('\r\n')[16].trim())
    // return;
    temp = -1;
    for(var i=0;i<jsonOutput.data.length;i++){
      if(jsonOutput.data[i].id == key){
        temp = i;
        break;
      }
    }
    if(temp > -1){
      // 合并新旧
      Object.assign(jsonOutput.data[temp],{
        id: key,
        route: routerConfig[key].route||"",
        method: routerConfig[key].method||"get,post",
        authority: routerConfig[key].authority||100000,
        description: routerConfig[key].description||"待补充",
        parameters:  routerConfig[key].parameters||{},
        output:output
      })
    }else{
      jsonOutput.data.push({
        id: key,
        route: routerConfig[key].route||"",
        method: routerConfig[key].method||"get,post",
        authority: routerConfig[key].authority||100000,
        description: routerConfig[key].description||"待补充",
        parameters: routerConfig[key].parameters||{},
        output:output
      })
    }

  }
  fs.writeFileSync(path.join(CURRENT_PATH, 'apimanage.json'), JSON.stringify(jsonOutput, null, 4));
}