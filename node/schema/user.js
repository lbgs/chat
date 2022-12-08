// 导入校验模块
const Joi = require('joi')

// 错误提示
const errMsg = {
    "string.empty": "用户名必填",
    "any.required": "用户名必填",
    "string.alphanum": '只能包含a-zA-Z0-9',
    "string.max": '用户名长度不能超过10',
    "string.min": '用户名长度不能小于3',
}

const username = Joi.string().alphanum().min(3).required().messages(errMsg)
const password = Joi.string().alphanum().min(6).required()
const nickname = Joi.string().min(3).required()

const schema = {
    register_schema: {
        body: {
            username,
            password,
            nickname,
        }
    },
    login_schema: {
        body: {
            username,
            password
        }
    }
}

module.exports = schema