var express = require('express');
var router = express.Router();
var request = require('request');

/* GET home page. */
router.get('/', function (req, res, next) {
    var token = req.query.code;
    var userid = null;
    // //如果本站已经存在凭证，便不需要去passport鉴权
    // if (req.session.user) {
    //     res.render('index', {
    //         title: '子产品-A-' + req.session.user,
    //         user: req.session.user
    //     });
    //     return;
    // }
    //如果没有本站信息，又没有token，便去passport登录鉴权
    if (!token) {
        res.redirect('https://github.corp.ebay.com/login/oauth/authorize?client_id=ebcba31599e69f404d17');
        return;
    }
    //存在token的情况下，去passport主站检查该token对应用户是否存在，
    //存在并返回对应userid
    const client_id = 'ebcba31599e69f404d17';
    const client_secret = '3a4db51c6d1790116babdea564454bc433770a67';
    request.post
        ({
            url: `https://github.corp.ebay.com/login/oauth/access_token?code=${token}&client_id=${client_id}&client_secret=${client_secret}`, headers: {
                'Accept': 'application/json'
            }
        },
            function (error, response, data) {
                if (!error && response.statusCode == 200) {
                    data = JSON.parse(data);
                    if (data.access_token) {
                        // res.send('登陆成功')
                        request({ url: 'https://github.corp.ebay.com/api/v3/user', headers: { 'Authorization': `token ${data.access_token}` } }, function (err, ress, dataa) {
                            // res.send(dataa);
                            dataa = JSON.parse(dataa);
                            res.render('index', {
                                title: '子产品-A' + dataa.login,
                                user: dataa.login,
                                content: JSON.stringify(dataa),
                                avatar: dataa.avatar_url
                            });
                        })
                        return;
                    } else {
                        //验证失败，跳转
                        //   res.redirect('http://localhost:3000?from=localhost:3001');
                    }
                } else {
                    // res.redirect('http://localhost:3000?from=localhost:3001');
                    return;
                }
            });
});
module.exports = router;