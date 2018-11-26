#!/usr/bin/env node

// 引入依赖模块
var shell = require('shelljs'); // 调用shell来完成文件的操作，也可以使用node-extra模块
var fs = require('fs-extra');
var path = require('path');
var shellCmd = ''; // 存储shell脚本字符串
var shellResult = {} // 存储shell命令，获取返回结果
const replace = require('replace-in-file'); // 用来做替文本字符串替换
var FILE_NAME = path.basename(__filename,'.js'); // 文件的名字
var BASE_PATH = path.resolve(path.join(__dirname, '..')); // 代码所在根目录
var CURRENT_PATH = __dirname; // 当前文件所在目录

exports.beforeAdd = function(data, callback) {
    console.log('beforeAdd,', data);
    addElement(data)
    return callback()
}

exports.beforeUpdate = function(id, data, callback) {
    console.log('beforeUpdate,', data);
    if(data.__fromElement){
      delete data.__fromElement
    }
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

exports.afterAll = function(req){
  console.log('afterAll',req.method)
  if(req.method == "GET"){
    return;
  }
  console.log('req.method:',req.method,'begin git push and sync')
  generateSwagger()
  gitPush()
}

exports.loadAll = function(){
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
      continue;
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
        parameters: routerConfig[key].parameters||{},
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
    var routerConfig = {};
  }

  routerConfig[config.id||'demo'] = { 
    "route": config.route||config.id||'demo', 
    "method": config.methods||'get', 
    "description": config.description||'no description', 
    "authority": config.authority||null, 
    "controller": "api/"+(config.id||'demo'), 
    "action": "do",
    "status": config.status || 0,
    "parameters": config.parameters||null, 
  };
  if(Number(config.status) == 2){
    delete routerConfig[config.id]
  }
  fs.writeFileSync(routerConfigPath, JSON.stringify(routerConfig, null, 4));
 


  console.log('Step 1 -- 生成controller和service文件');

  //2 创建controller文件和service文件
  var sourceFile = path.join(CURRENT_PATH, "apimanage", 'controller.js');
  var targetFile = path.join(BASE_PATH, 'api', config.id+'.js');
  var targetPath = path.dirname(targetFile); 
  // shellCmd = 'mkdir -p '+ targetPath +' && cp -f '+sourceFile+' '+targetFile;
  fs.ensureDirSync(targetPath);
  // shellCmd = 'cp -f '+sourceFile+' '+targetFile;
  fs.copySync(sourceFile, targetFile,{overwrite:true});

  // 生成参数校验
  var paramObj;
  var validateConfig = JSON.stringify(parameters); // controller中的参数校验语句
  if(validateConfig){
    nodereplace(targetFile,'\\[validate\\]',validateConfig);
  }
  
  
  sourceFile = path.join(CURRENT_PATH, "apimanage", 'service.js');
  targetFile =  path.join(BASE_PATH, 'service', config.id+'.js');
  targetPath = path.dirname(targetFile);
  fs.ensureDirSync(targetPath);
  fs.copySync(sourceFile, targetFile,{overwrite:false});
  nodereplace(targetFile,'\\[tableName\\]',config.tableName||'user');
   var targetFileContent = fs.readFileSync(targetFile,'utf-8');
  // var arraytargetFileContent = targetFileContent.trim().split('\n');


  // var arrayRouteConfigParameters = [];

  // //--routeConfigBegin-- do not delete this line, used for visop
  // var routeConfigParameters = {
  //   "key": config.id || config.route || 'demo',
  //   "route": config.route || config.id || 'demo',
  //   "method": config.methods || 'get',
  //   "description": config.description || 'no description',
  //   "authority": config.authority || null,
  //   "controller": "api/" + (config.id || 'demo'),
  //   "action": "do",
  //   "status": config.status || 0,
  //   "parameters": config.parameters || null,
  // };
  // exports.routeConfig = routeConfigParameters;
  // var sign1 = "";
  // var beginIndex = "", endIndex = "";
  // //--routeConfigEnd-- do not delete this line,  used for visop

  // for (var i = 0; i < arraytargetFileContent.length; i++) {
  //   if (arraytargetFileContent[i].trim().indexOf('routeConfigBegin') != -1) {      
  //       sign1 = 1;
  //       beginIndex = i;
  //   }
  //   if (arraytargetFileContent[i].trim().indexOf('routeConfigEnd') == -1) {
  //     sign1 = 2;
  //     endIndex = i;
  //     break;
  //   }

  // }
  // if(sign == 1){
  //     arraytargetFileContent.push(`"//--routeConfigBegin-- do not delete this line, used for visop"\n`);
  //     arraytargetFileContent.push(`exports.routeConfig = routeConfigParameters;\n`)
  //     arraytargetFileContent.push(`"//--routeConfigEnd-- do not delete this line,  used for visop"\n`);
  // }else{
      
  // }

  console.log("11111111111111",targetFileContent)
  if(config.output != null){ // 生成模拟数据
    targetFile = path.join(BASE_PATH, 'mock', config.id+'.json');
    targetPath = path.dirname(targetFile);
    fs.ensureDirSync(targetPath);
    fs.writeFileSync(targetFile, JSON.stringify(config.output, null, 4));
  }

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
    "route": config.route||config.id||'demo', 
    "method": config.methods||'get', 
    "description": config.description||'no description', 
    "authority": config.authority||null, 
    "controller": "api/"+(config.id||'demo'), 
    "action": "do",
    "status": config.status || 0,
    "parameters": config.parameters||null, 
  };
  if(Number(config.status) == 2){
    delete routerConfig[config.id]
  }
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
  if(config.output != null){ // 生成模拟数据
    targetFile = path.join(BASE_PATH, 'mock', config.id+'.json');
    targetPath = path.dirname(targetFile);
    fs.ensureDirSync(targetPath);
    fs.writeFileSync(targetFile, JSON.stringify(config.output, null, 4));
  }
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
    if(fs.existsSync(sourcePath)){
      fs.moveSync(sourcePath, targetPath, {overwrite: true})
    }
    
    sourcePath = path.join(BASE_PATH, 'service',config.id+'.js')
    targetPath = path.join(BASE_PATH, 'service','_' + config.id+'.js')
    if(fs.existsSync(sourcePath)){
      fs.moveSync(sourcePath, targetPath, {overwrite: true})
    }
  
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
    console.log('gitpush')
    shellCmd = `sh ${CURRENT_PATH}/gitpush.sh ${BASE_PATH}`;
    shellResult = shell.exec(shellCmd);
    // if(shellResult.code != 0){
    //   process.exit(shellResult.code)
    // }
  }

// node -e 'require("./apimanage.js").generateSwagger()'
// https://swagger.io/specification/
var generateSwagger = exports.generateSwagger = function generateSwagger(){
  console.log('begin generate swagger api')
    var filename = FILE_NAME;
    var sourceFile = path.join(CURRENT_PATH, 'helper','api.json')
    var targetFile = path.join(BASE_PATH,'public',filename + '.json')
    var configJsonFile =  path.join(CURRENT_PATH, filename + '.json')
    var apiJson = JSON.parse(fs.readFileSync(sourceFile, 'utf-8'))
    var configJson = JSON.parse(fs.readFileSync(configJsonFile, 'utf-8'))
    apiJson.paths = {}
    for(var i=0;i<configJson.data.length;i++){
      if (Number(configJson.data[i].status) == 2){
          continue;
      }
      apiJson.paths[configJson.data[i].id] = {
        "post": {
            "tags": [
                "user"
            ],
            "summary": configJson.data[i].description,
            "description": configJson.data[i].description,
            "tags": [
              configJson.data[i].service+configJson.data[i].tags
            ],
            // "operationId": "",
            // "produces": [
            //     "application/xml",
            //     "application/json"
            // ],
            "parameters": [],
            "responses": {
              "200": {
                "description": "successful operation",
                "schema": {
                    "type": "object",
                    "example": configJson.data[i].output,
                    // "properties":{
                    //   "content":{
                    //     "example": configJson.data[i].output,
                    //     "type": "object"
                    //   }
                    // }
                },
                // "example": configJson.data[i].output,
                // "content":{
                //   "application/json":{
                //     "example": configJson.data[i].output
                //   }
                // }
            }
            }
        }
      }
      for(var item in configJson.data[i].parameters){
        apiJson.paths[configJson.data[i].id].post.parameters.push({
          "name": item,
          "in": "body",
          "description": configJson.data[i].parameters[item].errorMessage,
          "required": configJson.data[i].parameters[item].notEmpty?true:false,
          "type": "string"
        })
      }

    }
    // nodereplace(targetFile,'\"\{\{apiJSON\}\}\"',apiJson);
    fs.writeFileSync(targetFile, JSON.stringify(apiJson, null, 4));
    console.log('successful generate swagger api')
    // fs.copySync(sourceFile, targetFile,{overwrite:true});
    
  }


  exports.syncRouter = function(req, res, callback){
    gitPull()
    // var routerConfigPath = path.join(BASE_PATH, 'config', 'router.json')
    // console.log('router config file Path', routerConfigPath)
  
    // var routerConfig = require(routerConfigPath);
    // routerConfig[config.id||'demo'] = { 
    //   "route": config.id||'demo', 
    //   "method": config.methods||'get', 
    //   "description": config.description||'no description', 
    //   "authority": config.authority||null, 
    //   "controller": "api/"+(config.id||'demo'), 
    //   "action": "do",
    //   "status": config.status || 0,
    //   "parameters": config.parameters||null, 
    // };
    // if(Number(config.status) == 2){
    //   delete routerConfig[config.id]
    // }
    // fs.writeFileSync(routerConfigPath, JSON.stringify(routerConfig, null, 4));
    // console.log('rouer config before generate', routerConfig);
    // delete routerConfig[routeName];

    console.log('loadAll, warn: this will load all configs from code into json, will recover the json file')
    var routerConfigPath = path.join(BASE_PATH, 'config', 'router.json');
    // console.log('Step 0.1 -- add route router config file Path', routerConfigPath)
    // fs.ensureDirSync(path.join(BASE_PATH, 'config')); // 保证config目录存在，如果没有新建一个
    // // 需要把路由分离出来
    // //1 添加路由配置 ../config/router.json
    // try{
    //   var routerConfig = require(routerConfigPath);
    // }catch(e){
    //   console.log(routerConfigPath, ' route配置文件不存在，创建新的')
    //   var routerConfig = {}
    // }
    var jsonOutput = require(path.join(CURRENT_PATH, 'apimanage.json'))
    // jsonOutput.data = []
    var fileContent = ""
    var temp = -1;
    var routerConfig = {}
    for(var i = 0;i<jsonOutput.data.length;i++){
      routerConfig[jsonOutput.data[i].id] = {
        "route": jsonOutput.data[i].id,
        "method": jsonOutput.data[i].method,
        "description": jsonOutput.data[i].description,
        "authority": jsonOutput.data[i].authority,
        "controller": "api/"+jsonOutput.data[i].id,
        "action": "do",
        "status": jsonOutput.data[i].status,
        "parameters": jsonOutput.data[i].parameters
      }
    }

    // console.log("routerConfig:", routerConfig)
    fs.writeFileSync(routerConfigPath, JSON.stringify(routerConfig, null, 4));
    gitPush()
    // for(var key in routerConfig){
    //   // console.log("item:", routerConfig.data[key]);
    //   try{
    //     fileContent = fs.readFileSync(path.join(BASE_PATH, 'api', key+'.js'), 'utf-8');
    //     var output = require(path.join(BASE_PATH, 'mock', key+'.json'));
    //   }catch(e){
    //     continue
    //   }
      
    //   // console.log('fileContent,', fileContent.trim().split('\r\n')[16].trim())
    //   // return;
    //   temp = -1;
    //   for(var i=0;i<jsonOutput.data.length;i++){
    //     if(jsonOutput.data[i].id == key){
    //       temp = i;
    //       break;
    //     }
    //   }
    //   if(temp > -1){
    //     // 合并新旧
    //     Object.assign(jsonOutput.data[temp],{
    //       id: key,
    //       method: routerConfig[key].method||"get,post",
    //       authority: routerConfig[key].authority||100000,
    //       description: routerConfig[key].description||"待补充",
    //       parameters: JSON.parse(fileContent.trim().split('\r\n')[16].trim()),
    //       output:output
    //     })
    //   }else{
    //     jsonOutput.data.push({
    //       id: key,
    //       method: routerConfig[key].method||"get,post",
    //       authority: routerConfig[key].authority||100000,
    //       description: routerConfig[key].description||"待补充",
    //       parameters: JSON.parse(fileContent.trim().split('\r\n')[16].trim()),
    //       output:output
    //     })
    //   }
  
    // }
    // fs.writeFileSync(path.join(CURRENT_PATH, 'apimanage.json'), JSON.stringify(jsonOutput, null, 4));
  }