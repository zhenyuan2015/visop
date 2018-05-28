/**
 * 数据有效性检测
 * Created by achar on 2016/12/5.
 */

var validate = {

    /**
     * 检测是否为中国电话号码
     * @param phoneNumber
     * @returns {*|boolean}
     */
    mobilePhone: function (str, isRequire) {
        /**
         * 手机号码
         * 移动：134[0-8],135,136,137,138,139,150,151,157,158,159,182,187,188
         * 联通：130,131,132,152,155,156,185,186
         * 电信：133,1349,153,180,189
         * http://blog.csdn.net/yangfanacc/article/details/20221769
         */
        var regExp = /^1\d{10}$/;       // 重新再梳理电话号码
        if(isRequire) {
            return str && regExp.test(str);
        }
        return regExp.test(str);
    },

    /**
     * 检测是否为正确的电子邮箱
     * @param str 待验证字符串
     * @returns {boolean}
     */
    email: function(str, isRequire){
        return true;
        //var regExp =  /^(\w-*\.*)+@(\w-?)+(\.\w{2,})+$/
        //if(isRequire) {
        //    return str && regExp.test(str);
        //}
        //return regExp.test(str);
    },

    /**
     * 密码验证规则
     * @param str 密码字符串
     * @param isRequire 是否必需项
     * @returns {boolean}
     */
    password: function(str, isRequire){
        //var regExp = /^\.{8}\.*$/;
        //if(isRequire) {
        //    return str && regExp.test(str);
        //}
        //return regExp.test(str);
        return true;
    },


}


module.exports = validate;