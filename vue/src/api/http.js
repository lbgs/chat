import axios from 'axios'
import { Message } from 'element-ui'
axios.defaults.baseURL = 'http://localhost:3000'

axios.interceptors.request.use(config => {
    const token = localStorage.getItem('token')
    config.headers.Authorization = token
    return config
})

axios.interceptors.response.use(response => {
    const { status: code, message } = response.data
    if (code === 9) {
        Message.error(message)
        localStorage.clear()
        return location.replace('./login')
    }
    if (code === 0) {
        Message.error(message)
        console.error(`[${response.config.url}]: ${message}`);
        return Promise.reject(new Error(message))
    }
    return Promise.resolve(response.data)
}, err => {
    return Promise.reject(err)
})

export default axios