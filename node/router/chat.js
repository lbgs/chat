const express = require('express')
const router = express.Router()
// 导入 express-ws
const expressWs = require('express-ws')
expressWs(router)
const jwt = require('jsonwebtoken')
// 导入对应处理函数
const { chatMsg, chatContactList, chatMsgList } = require('../router_handler/chat')

// ws 即时聊天
router.ws('/msg', (ws, req, next) => {
    if (!req.query.token) {
        ws.send(JSON.stringify({ status: 0, message: 'token身份验证失败' }))
        return ws.close()
    }
    const token = req.query.token.split(' ')[1]
    req.auth = jwt.decode(token)
    next()
}, chatMsg)
// 获取联系人列表
router.get('/contactList', chatContactList)
// 获取消息列表
router.get('/msgList', chatMsgList)

module.exports = router