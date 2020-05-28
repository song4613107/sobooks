let mysql = require('mysql');

let options = {
    host: "localhost",
    // port: "3306", //可选，默认是3306
    user: "root",
    password: "123456",
    database: "book"
}

//创建与数据库的连接
let con = mysql.createConnection(options);

//建立连接
con.connect((err) => {
    //如果建立连接失败
    if (err) {
        console.log(err);
    } else {
        console.log("数据库连接成功");
    }
})

function sqlQuery(strSql, arr) {
    return new Promise((resolve, reject) => {
        con.query(strSql, arr, (err, results) => {
            if (err) {
                reject(err);
            } else {
                resolve(results);
            }
        })
    })
}

module.exports = sqlQuery;