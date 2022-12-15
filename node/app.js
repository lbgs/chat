// 导入 express 模块
const express = require('express')
const app = express()
// 导入校验模块
const Joi = require('joi')
// 导入跨域模块
var cors = require('cors')
app.use(cors())
// 全局配置文件
const config = require('./config/config')
// 表单解析
app.use(express.urlencoded({ extended: false }))
// json 解析
app.use(express.json())
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
// 托管静态资源文件
app.use('/uploads', express.static('./uploads'))
// 使用 .unless({path:[/^\/api\//]}) 指定哪些接口不需要进行 Token 的身份验证
const { expressjwt } = require('express-jwt')
const unless = { path: [/^\/sign\//, /^\/chat\/msg\//] }
app.use(expressjwt({ secret: config.jwtSecretKey, algorithms: ["HS256"] }).unless(unless))
// 导入 ws 模块
require('express-ws')(app)


// 导入 sign 路由
const signRouter = require('./router/sign')
app.use('/sign', signRouter)
// 导入用户路由
const userRouter = require('./router/user')
app.use('/user', userRouter)
// 导入聊天路由
const chatRouter = require('./router/chat')
app.use('/chat', chatRouter)



// 错误中间件
app.use(function (err, req, res, next) {
    // 数据验证失败
    if (err instanceof Joi.ValidationError) return res.cc(err)
    // token 身份验证失败
    if (err.name === 'UnauthorizedError') return res.cc('token身份认证失败', 9)
    // 未知错误
    res.cc(err)
})

app.listen(3000, () => {
    console.log(`服务器启动成功：地址: http://localhost:3000`);
})
