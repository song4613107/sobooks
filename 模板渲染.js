let mysql = require('mysql');
let express = require('express');
let sqlQuery = require('./mysql');

let app = express();

//使用模板来渲染页面
let ejs = require('ejs');
//将模板引擎与express应用相关联
app.set('views', "views");      //设置视图的对应目录
app.set("view engine", "ejs")    //设置默认的模板引擎
app.engine('ejs', ejs.__express)  //定义模板引擎


app.get('/', async (req, res) => {
    //数据库book表里前28的book获取出来
    // let strSql = "select id,bookname,bookimg,author,category from book limit 0,28";
    // let result = await sqlQuery(strSql);
    // console.log(result);
    // let resJson = JSON.stringify(Array.from(result));
    // res.send(resJson)

    //插入变量
    let options = {
        title: "mybooks首页",
        articleTitle: "<h1>文章标题</h1>"
    }
    res.render('index.ejs', options);
})

app.get('/tj', async (req, res) => {
    // let strSql = "select id,bookname,bookimg,author,category from book where category = '东方玄幻'";
    // let result = await sqlQuery(strSql);
    // res.json(Array.from(result));
    let options = {
        "username": "小明",
        "gender": "男"
    }
    res.render('condition.ejs', options);
})

app.get('/xh', async (req, res) => {
    //循环
    let stars = ["蔡徐坤", "周杰伦", "郭敬明", "吴亦凡"];
    let options = {
        stars
    }
    res.render('circulation.ejs', options);
})

app.get('/books/:bookid', async (req, res) => {
    let strSql = "select * from book where id = ?";
    let bookid = req.params.bookid;
    let result = await sqlQuery(strSql, [bookid]);
    res.json(Array.from(result));
})

module.exports = app;