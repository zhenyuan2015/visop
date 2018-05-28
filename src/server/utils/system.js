/**
 * Created by achar on 2016/12/7.
 */


//文件操作对象
var fs = require('fs');

var system = {

    // ************************
    // 文件操作部分

    // 只读取文件夹，不做递归
    scanJustFolder : function(path){
        var folderList = [];

        var files = fs.readdirSync(path);
        files.forEach(function(item) {

            var tmpPath = path + '/' + item,
                stats = fs.statSync(tmpPath);
            if (stats.isDirectory()) {
                var fileInfo = {
                    "name" : item,
                    "type" : "folder",
                    "size" : stats.size,
                    "date" : stats.mtime
                };
                folderList.push(fileInfo);
            }
        });

        return folderList;
    },

};



module.exports = system;