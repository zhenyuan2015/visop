
var status = {
    //接口返回状态
    SUCCESS : {code:1,content:"成功"},
    ERROR : {code:0,content:"错误"},
    PARAM_IS_LOSE : { code: 100, content: "参数不完整"},
    NOT_FOUND_USER: { code: 101, content: "用户未注册"},
    WRONG_LOGIN: { code: 102, content: "用户名或密码不正确"},

    //文件上传返回状态
    LIMIT_FILE_SIZE : {code: 1001, content:"文件过大，上传失败！"},
    LIMIT_FILE_COUNT :  {code: 1002, content:"文件数量过多，上传失败！"},

    //权限管理错误码
    DUPLICATE_KEY: {code: 11000, content:'权限组名字已经存在'},

    createReturn : function(status,data){
        return {message : status,data : data};
    }
};
module.exports = status;

//输入
//status.createReturn(status.SUCCESS,{id:1});

// 输出
//{ message: {code: 1, content: "成功"}， data: {id:1}};
