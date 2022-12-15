import Vue from 'vue'
import {
    Button,
    Input,
    Form,
    FormItem,
    Message,
    MessageBox
} from 'element-ui'

Vue.use(Button)
Vue.use(Input)
Vue.use(Form)
Vue.use(FormItem)

Vue.prototype.$confirm = MessageBox.confirm;
Vue.prototype.$message = Message;