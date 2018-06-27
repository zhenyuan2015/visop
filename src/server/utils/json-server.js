const jsonServer = require('json-server-visop')
// const server = jsonServer.create()
// const router = jsonServer.router('db.json')
// const middlewares = jsonServer.defaults()

var returnFactory = require('../utils/returnFactory');
// var user_tDao = require('../dao/user_t');  // 需要修改为正确的dao层
// var userDao = requireDao('user');  // 需要修改为正确的dao层
var fs = require('fs-extra');
var path = require('path');
var setting = require('../config/setting');
var processCwd = __dirname; // 脚本 根目录
// var invalidPackage = require('./invalidPackage');
// var router = require('express').Router();

module.exports = function(router, visopHooks){
    // var router = app.Router;
    var codePath = setting.CODE_PATH
    if(!codePath){
        codePath = path.resolve(process.cwd())
    }
    var visopPath = path.join(codePath, 'visop');
    console.log('codePath,',codePath)
    var allFiles = fs.readdirSync(visopPath);
    // var visopHooks = {};
    var tempfile, fullpath;
    console.log('************* begin add json router ***************')
    allFiles.forEach(function(file){
        fullpath = path.join(visopPath, file)
        if(file.startsWith('_') || file.startsWith('.~')){
            return;
        }
        if(file.endsWith(".json") && file != "package.json" && file != "package-lock.json"){
            try {
                console.log('add router for ',file.replace('.json', ''),' ',  fullpath)
                // console.log(jsonServer.router(path.join(codePath, file)))
                router.use("/"+file.replace('.json', ''), jsonServer.router(fullpath))
            }
            catch(e){
                console.log('err:',e," when add router for:",fullpath)
            }
        }
        if(file.endsWith(".js") && file != "package.json" && file != "package-lock.json"){
            try{
                tempfile = file.replace('.js', '') 
                if(allFiles.indexOf(tempfile+'.json')>-1){
                    visopHooks[tempfile] = require(fullpath);
                }
            }
            catch(e){
                console.log(`add hooks for ${fullpath} failed: ${e}`)
            }
        }
    })
    console.log('************* end add json router ***************')
    return {
        router,
        visopHooks
    }
};
function requireUncached(fullpath){
    // var _invalidateRequireCacheForFile = function(filePath){
    //     delete require.cache[path.resolve(filePath)];
    // };
    
    // var requireNoCache =  function(filePath){
    //     _invalidateRequireCacheForFile(filePath);
    //     return require(filePath);
    // };
    // console.log(`delete require.cache[require.resolve(${fullpath})];`)
    delete require.cache[require.resolve(fullpath)];
    return require(fullpath)
}