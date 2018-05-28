var _ = require('lodash');
// var logger = require('../../lib/logger.lib');
// var usersService = require('../services/users.service');

var log = require(global.ROOT_PATH + "/utils/log"); // 获取日志

// log.debug("加载权限管理模块!");


/**
 * 验证用户权限
 * @param {[Number]} authorities
 */
module.exports = function (authority){
  return function (req, res, next) {
    log.debug("鉴权开始");
    var role = req.user.role;   //权限id集合
    var pass = false;  //是否允许通过鉴权
    if(role&&_.isArray(role)){
      role.forEach(function(userAuthority){

        //判断是否超级管理员 或者 用户组权限码匹配路由权限码
        if(userAuthority === 10000 || authority === userAuthority
          ||authority == 200000){
            pass = true;
            return;
          };

        // 判断是否拥有整个模块的权限  
        if(userAuthority%100 == 0 && (authority/100==userAuthority/100)){
            pass = true;
            return;
        }  
      })
    }

    if(pass) {
      log.debug("鉴权通过");
      return next();
    }else{
      return res.status(401).json({
        error: {
          code: 'NO_AUTHORITY',
          message: '没有权限'
        }
      });
    }
  };
};