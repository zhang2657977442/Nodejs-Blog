var express = require('express');
var router = express.Router();

router.get("/", function(req, res, next) {
  res.render('index',{});
});

router.get('/regist', function(req, res, next) {
  res.render('regist', {});
})

// 渲染登录页
router.get('/login', function(req, res, next) {
  res.render('login', {});
})

router.get('/admin', function(req, res, next) {
  res.render('admin', {});
})

router.get('/manage', function(req, res, next) {
  res.render('manage', {});
})


module.exports = router;