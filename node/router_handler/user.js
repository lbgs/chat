
// 导入数据库
const db = require('../config/db/index')
module.exports = {
    // 个人信息
    getUserInfo(req, res) {
        const origin = `${req.protocol}://${req.headers.host}`
        const sql = 'select id,username,nickname,avatar from users where id=?'
        db.query(sql, req.auth.id, (err, result) => {
            if (err) return res.cc(err)
            result = result.map(t => ({ ...t, avatar: `${origin}${t.avatar}` }))
            res.send({
                status: 1,
                message: '获取成功',
                data: !result || result[0]
            })
        })
    }
}