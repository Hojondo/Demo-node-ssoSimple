var express = require('express');
var router = express.Router();
var path = require('path');
var fs = require('fs'); 

/* GET users listing. */
router.get('/', function(req, res, next) {
  var token = req.query.token;
  var ret = {};
  var token_path = path.resolve() + '/token_user.json';
  ret.code = 1;//登录失败
  if(!token) {
    res.json(ret);
    return;
  }
  //如果传递的token与cookie不等也认为是鉴权失败
  // if(token != cookieObj['token']){
  // 	res.json(ret);
  //   return;
  // }
  fs.readFile(token_path, 'utf8', function (err, data) {
	    if (err) throw err;
	    if(!data) data = '{}';
	    data = JSON.parse(data);
        //如果存在标志，则验证通过，未考虑账号为0的情况
        if(data[token]) {
			ret.code = 0;//登录成功
			ret.userid = data[token];
        }
    	res.json(ret);
    });
});
module.exports = router;