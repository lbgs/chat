const express = require('express')
const router = express.Router()

// 导入解析 formdata 格式表单数据包
const multer = require('multer')
// 导入处理路径的核心模块
const path = require('path')

// 创建 multer 的实例对象,通过 dest 属性指定文件的存放路径
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, '../uploads'))
    },
    filename: function (req, file, cb) {
        const suffix = file.originalname.split('.').pop().toLowerCase();
        cb(null, `${file.fieldname}${Date.now()}.${suffix}`)
    }
})
const upload = multer({ storage })

// 导入对应处理函数
const { register, login } = require('../router_handler/sign')
// 导入对应校验函数
const expressJoi = require('@escook/express-joi')
const { register_schema, login_schema } = require('../schema/sign')

// 注册新用户
router.post('/register', upload.single('avatar'), expressJoi(register_schema), register)
// 登录
router.post('/login', expressJoi(login_schema), login)

module.exports = router