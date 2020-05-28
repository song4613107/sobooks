var express = require('express');
var path = require('path');
let sqlQuery = require('./mysql');
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

//设置静态目录
app.use(express.static(path.join(__dirname, 'public')));


app.get('/', async (req, res) => {
  let page = 1;
  let strSql = "select id,bookname,bookimg,author,category from book limit ?,4";
  let arr = [(page - 1) * 4];
  let result = await sqlQuery(strSql, arr);

  //获取总页数
  let strSql2 = "SELECT count(id) as num FROM book ";
  let result2 = await sqlQuery(strSql2);
  let pageAll;
  if (result2[0].num % 4 != 0) {
    pageAll = parseInt(result2[0].num / 4) + 1;
  } else {
    pageAll = result2[0].num / 4;
  }

  //设置分页的起始点
  let startPage = (page - 4) < 1 ? 1 : (page - 4);
  let endPage = (page + 5) > pageAll ? pageAll : page + 5;
  // console.log("startPage:" + startPage);
  // console.log("endPage:" + endPage);

  let options = {
    books: Array.from(result),
    categorys: await getCategory(),
    pageAll,
    page,
    startPage,
    endPage,
  }
  res.render('index.ejs', options)
})

app.get('/page/:pid', async (req, res) => {
  let page = parseInt(req.params.pid);
  let strSql = "select id,bookname,bookimg,author,category from book limit ?,4";
  let arr = [(page - 1) * 4];
  let result = await sqlQuery(strSql, arr);

  //获取总页数
  let strSql2 = "SELECT count(id) as num FROM book ";
  let result2 = await sqlQuery(strSql2);
  let pageAll;
  if (result2[0].num % 4 != 0) {
    pageAll = parseInt(result2[0].num / 4) + 1;
  } else {
    pageAll = result2[0].num / 4;
  }

  //设置分页的起始点
  let startPage = (page - 4) < 1 ? 1 : (page - 4);
  let endPage = (page + 5) > pageAll ? pageAll : page + 5;
  // console.log("startPage:" + startPage);
  // console.log("endPage:" + endPage);

  let options = {
    books: Array.from(result),
    categorys: await getCategory(),
    pageAll,
    page,
    startPage,
    endPage,
  }
  res.render('index.ejs', options)
})

app.get('/books/:bookid', async (req, res) => {
  let strSql = "select * from book where id = ?";
  let bookid = req.params.bookid;
  let result = await sqlQuery(strSql, [bookid]);
  let options = {
    book: result[0],
    categorys: await getCategory()
  }
  // console.log(result);
  res.render('bookinfo.ejs', options)
})

async function getCategory() {
  //获取所有分类
  let sqlStr = "select * from category";
  let result = await sqlQuery(sqlStr);
  return Array.from(result);
}

//设置分类页面的路由
// app.get('/category/:categoryid', async (req, res) => {
//   let strSql = "SELECT id,bookname,bookimg,author,category FROM book WHERE category in (SELECT category FROM category WHERE id = ?)"
//   let arr = req.params.categoryid;
//   let result = await sqlQuery(strSql, arr);
//   let options = {
//     books: Array.from(result),
//     categorys: await getCategory()
//   }
//   res.render('bookindex.ejs', options)
// })

app.get('/search/:searchkey/page/:pid', async (req, res) => {
  let searchKey = req.params.searchkey;
  let page = parseInt(req.params.pid);
  let strSql = "SELECT id,bookname,bookimg,author,category FROM book where bookname like '%" + searchKey + "%' or author like '%" + searchKey + "%' limit ?,4"
  let arr = [(page - 1) * 4];
  let result = await sqlQuery(strSql, arr);

  //获取总页数
  let strSql2 = "SELECT count(id) as num FROM book where bookname like '%" + searchKey + "%' or author like '%" + searchKey + "%'";
  let result2 = await sqlQuery(strSql2);
  let pageAll;
  if (result2[0].num % 4 != 0) {
    pageAll = parseInt(result2[0].num / 4) + 1;
  } else {
    pageAll = result2[0].num / 4;
  }

  //设置分页的起始点
  let startPage = (page - 4) < 1 ? 1 : (page - 4);
  let endPage = (page + 5) > pageAll ? pageAll : page + 5;

  let options = {
    books: Array.from(result),
    categorys: await getCategory(),
    pageAll,
    page,
    startPage,
    endPage,
    searchKey
  }
  res.render('search.ejs', options)
})

app.get('/category/:cid/page/:pid', async (req, res) => {
  let page = parseInt(req.params.pid);
  let strSql = "SELECT id,bookname,bookimg,author,category FROM book WHERE category in (SELECT category FROM category WHERE id = ?) limit ?,4";
  let cid = req.params.cid;
  let arr = [cid, (page - 1) * 4];
  let result = await sqlQuery(strSql, arr);

  //获取总页数
  let strSql2 = "SELECT count(id) as num FROM book WHERE category in (SELECT category FROM category WHERE id = ?)";
  let result2 = await sqlQuery(strSql2, arr);
  let pageAll;
  if (result2[0].num % 4 != 0) {
    pageAll = parseInt(result2[0].num / 4) + 1;
  } else {
    pageAll = result2[0].num / 4;
  }

  //设置分页的起始点
  let startPage = (page - 4) < 1 ? 1 : (page - 4);
  let endPage = (page + 5) > pageAll ? pageAll : page + 5;

  console.log("page:" + page);
  console.log("pageAll:" + pageAll);

  let options = {
    books: Array.from(result),
    categorys: await getCategory(),
    pageAll,
    page,
    cid,
    startPage,
    endPage
  }
  res.render('bookindex.ejs', options)
})

module.exports = app;
