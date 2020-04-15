var express = require('express');
var router = express.Router();
var request = require('request');

/* GET home page. */
router.get('/', function (req, res, next) {
  var token = req.query.token;
  var userid = null;
  //如果本站已经存在凭证，便不需要去passport鉴权
  if (req.session.user) {
    res.render('index', {
      title: '子产品-B-' + req.session.user,
      user: req.session.user
    });
    return;
  }
  //如果没有本站信息，又没有token，便去passport登录鉴权
  if (!token) {
    res.redirect('http://localhost:3000?from=localhost:3002');
    return;
  }
  //存在token的情况下，去passport主站检查该token对应用户是否存在，
  //存在并返回对应userid
  request(
    'http://127.0.0.1:3000/check_token?token=' + token + '&t=' + new Date().getTime(),
    function (error, response, data) {
      if (!error && response.statusCode == 200) {
        data = JSON.parse(data);
        if (data.code == 0) {
          //这里userid需要通过一种算法由passport获取，
          //这里图方便直接操作token
          //因为token很容易伪造，所以需要去主战验证token的有效性，
          //一般通过webservers 这里验证就简单验证即可......
          userid = data.userid;
          //有问题就继续登录
          if (!userid) {
            res.redirect('http://localhost:3000?from=localhost:3002');
            return;
          }
          //取得userid后，系统便认为有权限去数据库根据用户id获取用户信息
          //根据userid操作数据库流程省略......
          // req.session.user = userid;
          res.render('index', {
            title: '子产品-B-' + userid,
            user: userid
          });
          return;
        } else {
          //验证失败，跳转
          res.redirect('http://localhost:3000?from=localhost:3002');
        }
      } else {
        res.redirect('http://localhost:3000?from=localhost:3002');
        return;
      }
    });
});
module.exports = router;