
// 导入数据库
const db = require('../config/db/index')
// 导入加密模块
const bcrypt = require('bcrypt')
// 导入jwt
const jwt = require('jsonwebtoken')
// 全局配置文件
const config = require('../config/config')

module.exports = {
    // 注册新用户
    register(req, res) {
        // 判断是否提交头像
        console.log(req.file);
        if (!req.file || req.file?.fieldname !== 'avatar') {
            return res.cc('请选择头像')
        }
        const userInfo = {
            ...req.body,
            password: bcrypt.hashSync(req.body.password, 10),
            avatar: `/uploads/${req.file.filename}`,
            add_time: new Date()
        }
        // 查询用户名重复
        const sql = `select username from users where username=?`
        db.query(sql, userInfo.username, (err, result) => {
            if (err) return res.cc(err)
            if (result.length > 0) return res.cc(`用户名 ${result.username} 被占用`)
            // 添加用户到数据库
            const sql = `insert into users set ?`
            db.query(sql, userInfo, (err, result) => {
                if (err) return res.cc(err)
                if (result.affectedRows !== 1) return res.cc('注册失败')
                res.cc('注册成功', 1)
            })
        })
    },
    // 登陆
    login(req, res) {
        // 接受用户请求数据
        const userInfo = req.body
        // 定义 SQL 语句
        const sql = `select id,username,nickname,password,add_time from users where username=?`
        db.query(sql, userInfo.username, (err, result) => {
            // 执行 SQL 语句错误 
            if (err) return res.cc(err)
            // 根据用户名查询用户是否存在
            if (result.length !== 1) return res.cc(`登录失败，用户名或密码不正确！`)
            // TODO: 判断请求数据密码和数据库密码进行对比
            const compareResult = bcrypt.compareSync(userInfo.password, result[0].password)
            // 对比结果为 false ，则证明用户输入的密码错误
            if (!compareResult) return res.cc(`登录失败，用户名或密码不正确！`)
            // TODO: 登录成功，生成 Token 字符串并返回客户端
            // 过滤敏感信息
            const user = { ...result[0], password: null }
            const tokenStr = jwt.sign(user, config.jwtSecretKey, { expiresIn: config.expiresIn })
            // 将生成的 token 响应给客户端
            res.send({
                status: 1,
                message: '登录成功',
                token: `Bearer ${tokenStr}`
            })

        })
    },
}