const express = require("express");
var model = require('../model/db.js');
var formidable = require('formidable');
var crypto = require('crypto');
var router = express.Router();


router.post('/regist', function (req, res, next) {
  var form = new formidable.IncomingForm();
  form.parse(req, function (err, fields, files) {
    var md5 = crypto.createHash('md5');
      var username = fields.username;
      var password = md5.update(fields.password+"zsj").digest('hex');
    
    model.connect(function (db) {
      db.collection("users").find({ "username": username }).toArray(function (err, result) {
        if (result.length > 0) {
          res.send("0");
        }
        else {
          db.collection("users").insertOne({"username": username, "password" : password}, function (err, result) {
            if (err) {
              res.send("-1");
            } else {
              res.send("1");//注册成功
            }
          })
        }
      })

    })
  })
})

router.post('/login', function (req, res, next) {
  var form = new formidable.IncomingForm();
  form.parse(req, function (err, fields, files) {
    var md5 = crypto.createHash('md5');
    var username = fields.username;
    var password = md5.update(fields.password+"zsj").digest('hex');
  
    model.connect(function (db) {
      db.collection('users').find({"username": username, "password" : password}).toArray(function (err, result) {// doc 查询结果
        if (err || result.length <= 0) {
          res.send("-1");
        } else {
          res.send("1");  //登陆成功
        }
      })
    })
  })
})

module.exports = router;