const express = require("express");
var model = require('../model/db.js');
var formidable = require('formidable');
var moment = require('moment');
var router = express.Router();

//写文章
router.post('/doRecording', function (req, res, next) {
    var form = new formidable.IncomingForm();
    form.parse(req, function (err, fields) {
        model.getAllCount("article", function (count) {
            var allCount = count.toString();
        var date = moment(new Date()).format('YYYY-MM-DD HH:mm:ss');
        var str = fields.content
        var reg = /<img.*?>/;
        var imgstr = str.match(reg);
        //写入数据库
        model.connect(function (db) {
            db.collection("article").insertOne({
                "ID": parseInt(allCount) + 1,
                "topic": fields.topic,
                "publisher": fields.publisher,
                "classify": fields.classify,
                "content": fields.content,
                "date": date,
                "thumbsUp": 0,
                "visitNum": 0,
                "imgstr":imgstr
            }, function (err, result) {
                if (err) {
                    res.send("-1");
                    return;
                }
                res.send("1");
            })
        })
    })
})
})
//获取文章
router.post('/getArticle', function (req, res, next) {
    var page = req.query.page;
    model.connect(function (db) {
        db.collection('article').find().limit(9).skip(9*page).sort({"date":-1}).toArray(function(err, result) {
            var obj = { "allResult": result };
            res.json(obj);
        })
    })
})
//获得总页数
router.post('/getAllAmount', function (req, res, next) {
        model.getAllCount("article", function (count) {
            res.send(count.toString());
        });
})
//删除文章
router.post('/delArticle', function (req, res, next) {
    var form = new formidable.IncomingForm();
    form.parse(req, function (err, fields, files) {
        var ID = parseInt(fields.ID);
        model.connect(function (db) {
            db.collection('article').deleteMany({ "ID": ID }), function (err, results) {
                if (err) {
                    console.log("删除文章错误:" + err);
                    return
                }
                res.send("1");
            }
        })

    })
})
//修改文章
router.post('/updateArticle', function (req, res, next) {
    var form = new formidable.IncomingForm();
    form.parse(req, function (err, fields, files) {
        var ID = parseInt(fields.ID);
        model.connect(function (db) {
            db.collection('article').find({ "ID": ID }).toArray(function (err, results) {
                if (err) {
                    console.log("修改文章错误:" + err);
                    return
                }
                res.send(results[0]);
            }
        )})

    })
})
router.post('/update', function (req, res, next) {
    var form = new formidable.IncomingForm();
    form.parse(req, function (err, fields) {
        var date = moment(new Date()).format('YYYY-MM-DD HH:mm:ss');
        var str = fields.content
        var reg = /<img.*?>/;
        var imgstr = str.match(reg).input;
        //写入数据库
        id= parseInt(fields.ID);
        model.connect(function (db) {
            db.collection("article").updateOne({
                "ID": id
            },
                {$set:{"topic": fields.topic,
                "publisher": fields.publisher,
                "classify": fields.classify,
                "content": fields.content,
                "date": date,
                "thumbsUp": 0,
                "visitNum": 0,
                "imgstr":imgstr
            }}, function (err, result) {
                if (err) {
                    res.send("-1");
                    return;
                }
             res.send("1");
            })
        })
  
})
})
//显示文章
router.get('/showArticle',function (req, res, next){
    if(req.query.ID == undefined){
        res.send("没有此文章");
        return;
    }
    var aId = parseInt(req.query.ID);
    model.connect(function (db) {
        db.collection('article').find({"ID":aId}).toArray(function (err, result) {// doc 查询结果
            if(err){
                console.log(err);
            }
            else{
            res.render("article",{
                "allResult" : result[0]
            });
        }
        })
      })
})

//浏览数
router.get('/addVisitorNum', function (req, res, result) {
    var aId = parseInt(req.query.ID);
    model.connect(function (db) {
        db.collection('article').find({"ID":aId}).toArray(function (err, result) {// doc 查询结果
            if(err){
                console.log(err);
            }
            var visitNum = result[0].visitNum;
            db.collection('article').updateOne({"ID":aId},{$set:{"visitNum":visitNum+1}},function (err,results) {
                if(err){
                    console.log("游览数据错误:"+err);
                    return
                }
                res.send("1");
            });
        })
      })
    
});

//点赞数
router.get('/addThumbsUp', function (req, res, result) {
    var aId = parseInt(req.query.ID);
    model.connect(function (db) {
        db.collection('article').find({"ID":aId}).toArray(function (err, result) {// doc 查询结果
            if(err){
                console.log(err);
            }
            var thumbsUp = result[0].thumbsUp;
            db.collection('article').updateOne({"ID":aId},{$set:{"thumbsUp":thumbsUp+1}},function (err,results) {
                if(err){
                    console.log("点赞数据错误:"+err);
                    return
                }
                res.send("1");
            });
        })
      })
    
});
//分类文章

router.get('/classfiyPage' ,function(req,res,next){
    var classify =req.query.classify;
    res.render("base",{classify});
})


router.get('/getClassify', function (req, res, next) {
    var classify =req.query.classify;
    model.connect(function (db) {
        db.collection('article').find({"classify":classify}).sort({"date":-1}).toArray(function (err, result) {// doc 查询结果
            if(err){
                console.log(err);
            }
            else{
                res.send({
                "allResult" : result
            });
        }
        })
      })

})
module.exports = router;