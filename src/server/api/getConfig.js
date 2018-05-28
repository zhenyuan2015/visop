'use strict';
var path = require('path')

var mysql = require('../utils/mysql')
var returnFactory = require('../utils/returnFactory');

var controllerName = path.basename(__filename,'.js'); // controller的名字
var service = require('../service/'+controllerName);

exports.do = function(req, res, next) {

    // req.validate('id', '必须指定id').notEmpty();
    // https://www.npmjs.com/package/express-validator
    // https://github.com/chriso/validator.js
    
    req.check(
      {"config":{"notEmpty":true,"errorMessage":"config不能为空"}}
    );

    var errors = req.validationErrors();
    if (errors) {
        return next(errors[0]);
    }

  service.do(req, res, function(v){
    return res.json(returnFactory(v.errCode, v.returnValue, v.err, v.message, v.total));
  })
};