const express = require('express');
const app = express();
const path = require("path");

const bodyParser = require('body-parser');
// 添加 body-parser 中间件
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const MongoClient = require('mongodb').MongoClient;
const DB_CONN_STR = 'mongodb://localhost:27017/movies';
let ObjectID = require('mongodb').ObjectID;  

//指定静态文件目录
app.use(express.static(path.join(__dirname, '../client/public')));

//请求index.html
app.get('/', (req, res) => {
    res.sendFile('index.html', {
        root: '../client/public'
    });
});

//请求数据库中的所有电影
app.get('/movies', (err, res) => {
    let selectData = (db, callback) => {
        let collection = db.collection('col');
        collection.find().toArray((err, result) => {
            if (err) {
                console.log('error:' + err);
            }
            callback(result);
        })
    }

    MongoClient.connect(DB_CONN_STR, function (err, db) {
        selectData(db, function (result) {
            //把数据返回给前端
            res.status(200),
                res.json(result)
        });
    });
});

// 按照_id来请求电影数据
app.get('/movies/:id', function (req, res) {
    let id = req.params.id;
    let selectData = (db, callback) => {
        let collection = db.collection('col');
        let whereStr = { "_id": ObjectID(id)};
        collection.find(whereStr).toArray((err, result) => {
            if (err) {
                console.log('error:' + err);
            }
            callback(result);
        })
    }
    MongoClient.connect(DB_CONN_STR, function (err, db) {
        selectData(db, function (result) {
            //把数据返回给前端
            res.status(200),
                res.json(result)
        });
    });
});

//删除电影
app.post('/moviesDelete/:id', (req, res) => {
    var delData = function (db, callback) {
        let collection = db.collection('col');
        let id = req.params.id;
        let whereStr = { "_id": ObjectID(id) };
        collection.remove(whereStr, function (err, result) {
            if (err) {
                console.log('Error:' + err);
                return;
            }
            callback(result);
        });
    }

    MongoClient.connect(DB_CONN_STR, function (err, db) {
        delData(db, function (result) {
            res.status(200),
                res.json(result)
        });
    });
});

//添加电影
app.post('/addMovie', (req, res) => {
    let insertData = function (db, callback) {
        let collection = db.collection('col');

        let imgUrl = req.body.imgUrl;
        let movieName = req.body.movieName;
        let movieDate = req.body.movieDate;
        let data = [{
            "imgUrl": imgUrl,
            "movieName": movieName,
            "movieDate": movieDate
        }];
        collection.insert(data, function (err, result) {
            if (err) {
                console.log('Error:' + err);
                return;
            }
            callback(result);
        });
    }

    MongoClient.connect(DB_CONN_STR, function (err, db) {
        insertData(db, function (result) {
            res.status(200),
                res.json(result)
        });
    });
});


//监听端口
app.listen(3000, function () {
    console.log('listening on port 3000!');
});