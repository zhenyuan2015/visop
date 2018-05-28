var _ = require('lodash');
var validator = require('validator');
var expressValidator = require('express-validator');

/**
 * 自定义验证
 */
module.exports = function() {
    return expressValidator({
        errorFormatter: function(param, message, value) {
            return {
                name: 'ParamValidateError',
                param: param,
                message: message,
                value: value
            };
        },
        customSanitizers: {
            toNumber: function(value) {
                var newValue = Number(value);
                return newValue;
            },
        },
        customValidators: {
            // 验证手机号
            isTel: function(value){
                // return /^(13[0-9]|14[5|7]|15[0|1|2|3|5|6|7|8|9]|16[6]|17[7]|18[0|1|2|3|5|6|7|8|9])\d{8}$/.test(value); 
                return /^[1]\d{10}$/.test(value);
            },
            isDate: function(value){
                // console.log(new Date(value).toString());判断是否是有效的日期。
                if(new Date(value).toString() == "Invalid Date"){
                    return false;
                }
                return /^\d{4}(-)\d{2}(-)\d{2}$/.test(value); 
            },
            isDateTime: function(value){ 
                // console.log(new Date(value).toString());判断是否是有效的日期。
                if(new Date(value).toString() == "Invalid Date"){
                    return false;
                }
                return /^\d{4}(-)\d{2}(-)\d{2}( )\d{2}(:)\d{2}(:)\d{2}$/.test(value); 
            },
            isDid: function(value){ return /^\d{1,20}$/.test(value); },
            isPassword: function(value){ 
                // return /^[\da-zA-Z]{6,16}$/.test(value); 
                return /^.{6,16}$/.test(value); 
            },
            isPhone: function(value){ return /^1\d{10}$/.test(value); },
            isString: function(value) { return _.isString(value) },
            isEmail: function(value) { return /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/.test(value) },
            isNumber: function(value) { 
                return  !_.isNaN(Number(value)) 
            },
            isObject: function(value) { return _.isObject(value) },
            isArray: function(value) { 
                var flag = _.isString(value);
                if(flag){
                    return _.isArray(JSON.parse(value))
                }else{
                    return _.isArray(value)
                }
            },
            inArray: function(param) {
                var argumentsArray = [].slice.apply(arguments);
                var validatorName = argumentsArray[1];

                return _.every(param, function(item) {
                    var validatorOptions = _.tail(argumentsArray);
                    validatorOptions.unshift(item);

                    switch (validatorOptions[1]) {
                        case 'isString':
                            return _.isString(item);
                            break;
                        case 'isEmail':
                            return /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/.test(value);
                            break;
                        case 'isNumber':
                            return _.isNumber(item);
                            break;
                        case 'isObject':
                            return _.isObject(item);
                            break;
                        case 'isArray':
                            return _.isArray(item);
                            break;
                        case 'isBoolean':
                            switch (typeof value) {
                                case 'string':
                                    return value === 'true' || value === 'false';
                                    break;
                                case 'boolean':
                                    return value === true || value === false;
                                    break;
                                default:
                                    return false;
                            }
                            break;
                        default:
                            return validator[validatorName].apply(this, validatorOptions);
                    }
                });
            },
            isBoolean: function(value) {
                switch (typeof value) {
                    case 'string':
                        return value === 'true' || value === 'false';
                        break;
                    case 'boolean':
                        return value === true || value === false;
                        break;
                    default:
                        return false;
                }
            },
            custom: function(value, callback) {
                if (typeof value !== 'undefined') {
                    return callback(value);
                } else {
                    return false;
                }
            },
            isObjectIdArray: function(value) {
                if (value == null) return true;
                if (!_.isArray(value)) return false;
                for (var i = 0; i < value.length; i++) {
                    if (!validator.isMongoId(value[i])) {
                        return false;
                    }
                }
                if (i >= value.length) {
                    return true;
                }
            },
            isObjectIdArrayStr: function(value) {
                return _.every(value, function(v) {
                    validator.isMongoId(v);
                });
            },
        }
    });
};