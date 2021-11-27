<template>
  <div class="login-container">
    <div class="login_box">
      <!--头像区域-->
      <div class="avatar_box">
        <img src="../assets/logo.png" alt="">
      </div>
      <!--表单区域-->
      <el-form class="login_form" :model="loginForm" :rules="loginrules" ref="loginformRef">
        <!--用户名-->
        <el-form-item prop="username">
          <el-input prefix-icon="el-icon-user" placeholder="请输入用户名" v-model="loginForm.username"></el-input>
        </el-form-item>
        <!--密码-->
        <el-form-item prop="password">
          <el-input prefix-icon="el-icon-lock" placeholder="请输入密码" v-model="loginForm.password" type="password"></el-input>
        </el-form-item>
        <!--按钮区域-->
        <el-form-item class="btn">
          <el-button type="primary" @click="login">登录</el-button>
          <el-button type="info" @click="resetLoginForm">重置密码</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Login',
  data(){
    return{
      loginForm:{
        username: 'admin',
        password: '123456'
      },
      //表单验证规则
      loginrules:{
        //规则的名字 要与上面的数据的名字一致
        username:[
          { required: true, message: '请输入活动名称', trigger: 'blur' },
          { min: 5, max: 12, message: '长度在 6 到 12 个字符', trigger: 'blur' }
        ],
        password:[
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 12, message: '长度在 6 到 12 个字符', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    resetLoginForm(){
      this.$refs.loginformRef.resetFields()
    },
    login(){
      this.$refs.loginformRef.validate(async result =>{
        if(!result){
          return;
        }
        // this.$http.post('login',this.loginForm).then(success=>{
        //   console.log(success)
        // }).catch(error=>{
        //   console.log(error)
        // })
        const {data} = await this.$http.post('login',this.loginForm)
        if(data.meta.status !== 200){
          this.$message.error("登录失败！")
        }else{
          this.$message.success("登录成功！")
          window.sessionStorage.setItem("token",data.data.token)
          this.$router.push("/home")
        }
      })
    }
  }
}
</script>

<style scoped>
.login-container{
  background-color: #2b4b6b;
  height: 100%;
}

.login_box {
  width: 450px;
  height: 450px;
  background-color: #fff;
  border-radius: 3px;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
}

.avatar_box {
  height: 100px;
  width: 100px;
  border: 1px solid #eee;
  border-radius: 50%;
  padding: 10px;
  box-shadow: 0 0 0 3px #ddd;
  position: absolute;
  left: 50%;
  transform: translate(-50%,-50%);
  background-color: #fff;
}

img {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background-color: #eee;
}
.btn{
  display: flex;
  justify-content: flex-end;
}

.login_form{
  position: absolute;
  bottom: 0;
  width: 100%;
  padding: 20px;
  box-sizing: border-box;
}
</style>
