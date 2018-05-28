var crypto = require('crypto')

var createHash= exports.createHash = function(text) {
  return crypto.createHash('md5').update(text).digest('hex');
};
