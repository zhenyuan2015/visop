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

var addElement= function(config){
  if(config.__fromElement){
    // 复制逻辑
    copyElement(config)
    return;
  }

  console.log('add element with data:',config, ' you can achieve this function with any program language you familiar with');
  // 初始化信息
  var processCwd = BASE_PATH; // 脚本 根目录
  var currentPath = CURRENT_PATH; // npm 根目录
  var parameters = config.parameters || {}
  console.log('Step 0 -- output Path：', CURRENT_PATH, ' base path:', BASE_PATH);

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

  routerConfig[config.id||'demo'] = { 
    "route": config.id||'demo', 
    "method": config.methods||'get', 
    "description": config.description||'no description', 
    "authority": config.authority||null, 
    "controller": "api/"+(config.id||'demo'), 
    "action": "do",
    "parameters": config.parameters||null, 
  };
  fs.writeFileSync(routerConfigPath, JSON.stringify(routerConfig, null, 4));

  console.log('Step 1 -- 生成controller和service文件');

  //2 创建controller文件和service文件
  var sourceFile = path.join(CURRENT_PATH, config.id, 'controller.js');
  var targetFile = path.join(BASE_PATH, 'api', config.id+'.js');
  var targetPath = path.dirname(targetFile); 
  // shellCmd = 'mkdir -p '+ targetPath +' && cp -f '+sourceFile+' '+targetFile;
  fs.ensureDirSync(targetPath);
  // shellCmd = 'cp -f '+sourceFile+' '+targetFile;
  fs.copySync(sourceFile, targetFile,{overwrite:true});

  // 生成参数校验
  var paramObj;
  var validateConfig = JSON.stringify(parameters); // controller中的参数校验语句
 
  nodereplace(targetFile,'\\[validate\\]',validateConfig);
  
  sourceFile = path.join(CURRENT_PATH, config.id, 'service.js');
  targetFile =  path.join(BASE_PATH, 'service', config.id+'.js');
  targetPath = path.dirname(targetFile);
  fs.ensureDirSync(targetPath);
  fs.copySync(sourceFile, targetFile,{overwrite:false});
  nodereplace(targetFile,'\\[tableName\\]',config.tableName||'user');

  console.log('generate protocol end');
}

function copyElement(config){
  console.log('copy element with data:',config, ' you can achieve this function with any program language you familiar with');
  // 初始化信息
  var processCwd = BASE_PATH; // 脚本 根目录
  var currentPath = CURRENT_PATH; // npm 根目录
  var parameters = config.parameters || {}
  console.log('Step 0 -- output Path：', CURRENT_PATH, ' base path:', BASE_PATH);

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

  routerConfig[config.id||'demo'] = { 
    "route": config.id||'demo', 
    "method": config.methods||'get', 
    "description": config.description||'no description', 
    "authority": config.authority||null, 
    "controller": "api/"+(config.id||'demo'), 
    "action": "do",
    "parameters": config.parameters||null, 
  };
  fs.writeFileSync(routerConfigPath, JSON.stringify(routerConfig, null, 4));

  console.log('Step 1 -- 生成controller和service文件');

  //2 创建controller文件和service文件
  var sourceFile = path.join(BASE_PATH, 'api', config.__fromElement.id+'.js');
  var targetFile = path.join(BASE_PATH, 'api', config.id+'.js');
  var targetPath = path.dirname(targetFile); 
  // shellCmd = 'mkdir -p '+ targetPath +' && cp -f '+sourceFile+' '+targetFile;
  fs.ensureDirSync(targetPath);
  // shellCmd = 'cp -f '+sourceFile+' '+targetFile;
  fs.copySync(sourceFile, targetFile,{overwrite:true});

  // 生成参数校验
  var paramObj;
  var validateConfig = JSON.stringify(parameters); // controller中的参数校验语句
 
  nodereplace(targetFile,'\\[validate\\]',validateConfig);
  
  sourceFile = path.join(BASE_PATH, 'service', config.__fromElement.id+'.js');
  targetFile =  path.join(BASE_PATH, 'service', config.id+'.js');
  targetPath = path.dirname(targetFile);
  fs.ensureDirSync(targetPath);
  fs.copySync(sourceFile, targetFile,{overwrite:false});
  nodereplace(targetFile,'\\[tableName\\]',config.tableName||'user');

  console.log('generate protocol end');
}


var updateElement = addElement;

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
    var processCwd = BASE_PATH; // 脚本 根目录
    var currentPath = CURRENT_PATH; // npm 根目录
    console.log('current Path', CURRENT_PATH)
    var routerConfigPath = path.join(BASE_PATH, 'config', 'router.json')
    console.log('router config file Path', routerConfigPath)
  
    var routerConfig = require(routerConfigPath);
    // console.log('rouer config before generate', routerConfig);
    delete routerConfig[routeName];
  
    // console.log('rouer config after generate', routerConfig)
    fs.writeFileSync(routerConfigPath, JSON.stringify(routerConfig, null, 4));
    var sourcePath = path.join(BASE_PATH, 'api',config.id+'.js')
    var targetPath = path.join(BASE_PATH, 'api','_' + config.id+'.js')
    fs.moveSync(sourcePath, targetPath, {overwrite: true})
    sourcePath = path.join(BASE_PATH, 'service',config.id+'.js')
    targetPath = path.join(BASE_PATH, 'service','_' + config.id+'.js')
    fs.moveSync(sourcePath, targetPath, {overwrite: true})
  
    console.log('delete route '+routeName+' success');
  }
  