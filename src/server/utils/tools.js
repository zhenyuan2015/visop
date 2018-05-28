/**
 * Created by achar on 2016/12/2.
 */

// var moment = require('moment');

// var toolBox = function() {
//     /*
//      *创建UUID的方法
//      */
//     function createUUID(){
//         var dg = new Date(1582, 10, 15, 0, 0, 0, 0);
//         var dc = new Date();
//         var t = dc.getTime() - dg.getTime();
//         var tl = getIntegerBits(t,0,31);
//         var tm = getIntegerBits(t,32,47);
//         var thv = getIntegerBits(t,48,59) + '1'; // version 1, security version is 2
//         var csar = getIntegerBits(rand(4095),0,7);
//         var csl = getIntegerBits(rand(4095),0,7);

//         var n = getIntegerBits(rand(8191),0,7) +
//             getIntegerBits(rand(8191),8,15) +
//             getIntegerBits(rand(8191),0,7) +
//             getIntegerBits(rand(8191),8,15) +
//             getIntegerBits(rand(8191),0,15); // this last number is two octets long
//         return tl + tm  + thv  + csar + csl + n;
//     };
// }

// module.export = toolBox;
var fs = require('fs')
//获取当前的UTC时间戳
exports.getCurUtcTimestamp = function(){
    var value = Date.now() + (new Date().getTimezoneOffset()*60*1000);
    return value;
};


// 获取json文件
exports.getJsonFromFile = function(jsonPath){
    return JSON.parse(fs.readFileSync(jsonPath, 'utf8')); 
} 

 