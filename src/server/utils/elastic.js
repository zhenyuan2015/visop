
var setting = require('../config/setting');
var _ = require('lodash');

var search = exports.elsSearch = exports.elsSearch = function(body){
    return global.elasticClient.search({
        index: setting.elastic.index, body: body
    })
}

var elasticSearch = exports.elasticSearch = exports.elasticSearch = function(body, callback){
  var params = {
    index: setting.elastic.index,
    body: {
      query: {
        match_all: {}
      }
    }
  }
    _.assign(params, body);
    global.elasticClient.search(params, function(err, response){
        // if(err){
        //   console.log('elastic search error:', err);
        // }
        if(callback){
          callback(err, response);
        } 
    })
}