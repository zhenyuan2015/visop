/**
 * @description 数据过滤中间件
 */

module.exports = function(req, res, next){

    req.check(
      {
        'count': {
          optional: true, 
          isNumeric: {
            options: true,
            errorMessage: '每页显示条数必须是数字'  
          }
        },
        'page': {
          optional: true,
          isNumeric: {
            options: true,
            errorMessage: '页码必须是数字'  
          }
        },
        'endTime': {
          optional: true,
          isNumeric: {
            options: true,
            errorMessage: '结束时间必须是数字'  
          }
        },
        'startTime': {
          optional: true,
          isNumeric: {
            options: true,
            errorMessage: '开始时间必须是数字'  
          }
        }
      }
    );

    var errors = req.validationErrors();
    if (errors) {
        return next(errors[0]);
    }

    next();
}