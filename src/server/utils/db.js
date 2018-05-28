/*
封装的增删改查方法
*/
function Action (Model){
    this.model = Model;
}
//建表
Action.prototype.create = function (doc,callback){
    this.model.create(doc, function (error) {
        if(error) return callback(error);
        var docs = Array.prototype.slice.call(arguments, 1);
        return callback(null,docs);
    });
};
//更新数据
Action.prototype.update = function( conditions, update ,options, callback) {
        this.model.update(conditions, update, options, function (error,doc) {
            if(callback) callback(error,doc);
        });
};
module.exports = Action;
