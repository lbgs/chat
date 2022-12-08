// 导入 express 模块
const express = require('express')
const app = express()
// 导入校验模块
const Joi = require('joi')
// 导入 express-ws
const expressWs = require('express-ws')
expressWs(app)

// 表单解析
app.use(express.urlencoded({ extended: false }))
// 响应数据函数中间件
app.use((req, res, next) => {
    res.cc = function (err, status = 0) {
        res.send({
            status,
            message: err instanceof Error ? err.message : err
        })
    }
    next()
})
// 导入用户路由
const userRouter = require('./router/user')
app.use('/user', userRouter)


// 错误中间件
app.use(function (err, req, res, next) {
    // 数据验证失败
    if (err instanceof Joi.ValidationError) return res.cc(err)
    // token 身份验证失败
    if (err.name === 'UnauthorizedError') return res.cc('token身份认证失败')
    // 未知错误
    res.cc(err)
})

app.listen(3000, () => {
    console.log(`服务器启动成功：地址: http://localhost:3000`);
})
