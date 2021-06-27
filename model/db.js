var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/project";
dbName = "project";
//连接数据库
function connect(callback) {
    MongoClient.connect(url,{ useUnifiedTopology: true }, function (err, db) {
        if (err) {
            console.log('数据库连接错误');
        }
        else {
            var dbase = db.db(dbName);
            callback && callback(dbase);
        }
    });
}

//计数 
function getAllCount(collectionName,callback){
    connect(function (db){
    db.collection(collectionName).countDocuments({}).then(function(count) {
        callback(count);
    });
})
}



module.exports = {
    connect,
    getAllCount
}