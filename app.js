//引入express框架
const express = require("express");
var path = require('path');
var ueditor      = require('ueditor');
var indexRouter = require('./routes/index');
var bodyParser   = require('body-parser');
var usersRouter = require('./routes/users');
var articleRouter = require('./routes/article');
//创建网站服务器

const app = express();

app.use(bodyParser.json());

app.use(express.static("./public"));
// view engine setup 视图
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use("/libs/ueditor/ue", ueditor(path.join(__dirname, 'public'), function (req, res, next) {

  // ueditor 客户发起上传图片请求
  if (req.query.action === 'uploadimage') {
      var foo = req.ueditor;

      var imgname = req.ueditor.filename;

      var img_url = '/upload';
      res.ue_up(img_url); //你只要输入要保存的地址 。保存操作交给ueditor来做
  }

  //  客户端发起图片列表请求
  else if (req.query.action === 'listimage') {
      var dir_url = '/upload';
      res.ue_list(dir_url);  // 客户端会列出 dir_url 目录下的所有图片
  }

  // 客户端发起其它请求
  else {

      res.setHeader('Content-Type', 'application/json');
      res.redirect('/libs/ueditor/nodejs/config.json')
  }

}));



app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/article', articleRouter);
//监听端口
app.listen(8080);
console.log("网站服务器启动成功");
