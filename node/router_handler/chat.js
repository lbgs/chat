const db = require("../config/db")

let chatWsList = []

const timeToString = time => {
    return new Date(time).toLocaleString('chinese', { hour12: false }).replace(/\//g, '-')
}

module.exports = {
    // 即时聊天
    chatMsg(ws, req) {
        // 判断是否存在，存在则删除
        const isUser = chatWsList.findIndex(item => item.userid == req.auth.id)
        if (isUser > -1) {
            chatWsList[isUser].ws.close(4043, '错误')
            chatWsList.splice(isUser, 1)
        }
        chatWsList.push({ userid: req.auth.id, ws })
        // 使用 on 方法监听事件
        // message 事件表示从另一段（服务端）传入的数据
        // ws.close(4040, '自定义错误')
        ws.on('open', e => {
            console.log('连接打开', e);
        })
        ws.on('message', function (data) {
            const { receive_id, message } = JSON.parse(data)
            const msgObj = {
                sender_id: req.auth.id,
                receive_id: receive_id,
                message,
                add_time: new Date()
            }
            // console.log(chatWs);
            const sql = `insert into chats set ?`
            db.query(sql, msgObj, (err, result) => {
                if (err) return ws.close(4040, '数据库错误');
                chatWsList.forEach(t => {
                    if (receive_id == t.userid) {
                        t.ws.send(JSON.stringify({
                            id: result.insertId,
                            sender_id: req.auth.id,
                            receive_id: t.userid,
                            message
                        }), e => {
                            console.log('发送回调：');
                            console.log(e);
                        })
                    }
                });
            })
        })
        ws.on('close', function (code, reason) {
            console.log('连接关闭', code, reason);
            // chatWsList.splice(chatWsList.findIndex(t => t.userid == req.auth.id))
        })
        ws.on('error', e => {
            console.log('连接错误：', e);
        })
    },
    chatContactList(req, res) {
        const origin = `${req.protocol}://${req.headers.host}`
        // 查询用户列表
        const sql = `select id,username,nickname,avatar from users where id<>?`
        db.query(sql, req.auth.id, (err, result) => {
            if (err) return res.cc(err)
            result = result.map(t => ({ ...t, avatar: `${origin}${t.avatar}` }))
            res.send({
                status: 1,
                msg: '获取成功',
                data: result
            })
        })
    },
    chatMsgList(req, res) {
        const pageSize = Number(req.query.pageSize) || 5
        const pageIndex = ((Number(req.query.pageIndex) || 1) - 1) * pageSize
        const sqlPage = `order by add_time desc limit ${pageSize} offset ${pageIndex}`
        const where = `where (sender_id=? and receive_id=?) or (sender_id=? and receive_id=?)`
        const sql = `select id,sender_id,receive_id,message,add_time from chats ${where} ${sqlPage}`
        db.query(sql, [req.auth.id, req.query.userid, req.query.userid, req.auth.id], (err, result) => {
            if (err) return res.cc(err)
            result = result.map(t => ({ ...t, add_time: timeToString(t.add_time) }))
            res.send({
                status: 1,
                message: '获取成功',
                pageIndex,
                pageSize,
                data: result.reverse()
            })
        })
    }
}