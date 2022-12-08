// 引入 mysql 模块  
const mysql = require('mysql')
// 创建数据库链接对象
const db = mysql.createPool({
    host: '127.0.0.1',
    user: 'root',
    password: '123456',
    database: 'node_chat'
})

module.exports = db