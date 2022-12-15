<template>
  <div class="login-box">
    <div class="fom-full-box ">
      <el-form :model="logonForm" ref="logonForm" class="form-box">
        <el-form-item prop="username" :rules="{ required: true, message: '请输入用户名', trigger: 'blur' }">
          <el-input v-model="logonForm.username" placeholder="用户名"></el-input>
        </el-form-item>
        <el-form-item prop="password" :rules="{ required: true, message: '请输入密码', trigger: 'blur' }">
          <el-input v-model="logonForm.password" placeholder="密码" show-password></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" class="btn-submit" @click="submitForm('logonForm')" :loading="isClick">登录
          </el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script>
export default {
  name: "Login",
  data() {
    return {
      logonForm: {},
      isClick: false,
    };
  },
  mounted() {
    window.addEventListener("keydown", this.keyEnter);
  },
  destroyed() {
    window.removeEventListener("keydown", this.keyEnter, false);
  },
  methods: {
    keyEnter(e) {
      e.key === "Enter" && this.submitForm("logonForm");
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (!valid) {
          return console.log("error submit!!");
        }
        this.isClick = true;
        this.$axios
          .post("/sign/login", this.logonForm)
          .then((res) => {
            this.isClick = false;
            this.$message.success(res.message);
            localStorage.setItem("token", res.token);
            this.$router.push("/");
          })
          .catch(() => {
            this.isClick = false;
          });
      });
    },
  },
};
</script>
<style lang="scss" scoped>
.login-box {
  background-color: darkslategrey;
  min-height: 100vh;
}
.fom-full-box {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
}
.form-box {
  background-color: #fff;
  border-radius: 20px;
  width: 300px;
  padding: 30px 30px 10px;
  .btn-submit {
    width: 100%;
  }
}
</style>