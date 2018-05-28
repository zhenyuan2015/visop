/**
 * @description 数据过滤中间件
 */

module.exports = function(req, res, next){

    if(req.query.startTime){
        req.query.startTime = Number(req.query.startTime);
    }

    if(req.query.endTime){
        req.query.endTime = Number(req.query.endTime);
    }

    // if(req.query.birthday){
    //     req.query.birthday = Number(req.query.birthday);
    // }

    if(req.query.page){
        req.query.page = Number(req.query.page);
    }

    if(req.query.count){
        req.query.count = Number(req.query.count);
    }else{
        req.query.count = DEFAULT_PAGE_COUNT;
    }

    // 设置默认分页
    if(!req.param("pagesize")){
        req.body.pagesize = DEFAULT_PAGE_COUNT;
    }

    if(!req.param("pagenumber")){
        req.body.pagenumber = 1;
    }

    // d_id

    if(req.param("d_id") && !req.param("yid")){
        if(!req.body){
           req.body = {}
        }
        if(!req.query){
            req.query = {}
        }
        req.body.yid = req.param("d_id");
        req.query.yid = req.param("d_id");
    }

    if(!req.param("d_id") && req.param("yid")){
        
        if(!req.body){
            req.body = {}
        }
        if(!req.query){
            req.query = {}
        }
        req.body.d_id = req.param("yid");
        req.query.d_id = req.param("yid");
    }
    // console.log('req.query:', req.query)
    // console.log('req.body:', req.body)
    // console.log('req.param:', req.param('d_id'))
    next();
}