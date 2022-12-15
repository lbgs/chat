const express = require('express')
const router = express.Router()

// 导入对应处理函数
const { getUserInfo } = require('../router_handler/user')

// 获取个人信息
router.get('/userinfo', getUserInfo)

module.exports = router