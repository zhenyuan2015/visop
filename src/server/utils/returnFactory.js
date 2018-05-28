var errCodeMap = require("../config/errorCode").errCodeMap;

module.exports = function(code, data, err, customMessage, total) {

    var result = {
        code: errCodeMap[code].code, //错误码
        message: errCodeMap[code].content,
        result: data,
        err: err
    };
    if (customMessage) {
        result.message = customMessage;
    }
    if(total>=0){
        result.total = total;
    }
    if(result.err){
        result.err._message = result.err.message;
    }
    return result;
};

//输入
//status.createReturn(status.SUCCESS,{id:1});

// 输出
//{ message: {code: 1, content: "成功"}， data: {id:1}};