/**
 * Created by achar on 2016/12/6.
 */
var log4js = require("log4js");

// 读取log4js配置
var log4js_config = require("./log4js.json");

// 加载配置文件
log4js.configure(log4js_config);

// 使用console格式输出文件系统
var log = log4js.getLogger('console');

// 对外暴露log4js实例
log.log4js = log4js;

//log.trace('Trace info: log.trace(message)');
//log.debug('Debug info: log.debug(message)');
//log.info('Info info: log.info(message)');
//log.warn('Warn info: log.warn(message)');
//
//log.error('Error info: log.error(message)');
//log.error('log-dir is : \'./logs/log_test/\'');
//console.log("Console info: console.log(message), 不要使用!");

module.exports = log;