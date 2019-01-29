<template>
  <div class="app-container">
    <div class="loginbody">
      <van-icon name="arrow-left" size="20px" class="gobackicon" @click="goback" />
      <div class="logintop">
        <div class="imgbox">
          <img :src="imglogo" class="logos" alt="">
        </div>
        广铁订餐系统
      </div>
      <van-cell-group>
        <van-field
          v-model="temp.phone"
          :left-icon="require('../assets/images/ic_phone.png')"
          clearable
          placeholder="请输入手机号码"
        >
          <van-button slot="button" size="small" style="background-color: #F56C6C;border-radius: 30px;padding: 0 14px;letter-spacing: 1px" type="warning">发送验证码</van-button>
        </van-field>
        <van-field
          v-model="temp.code"
          :left-icon="require('../assets/images/ic_code.png')"
          type="password"
          clearable
          placeholder="请输入验证码"
        />
        <van-field
          v-model="temp.password"
          :left-icon="require('../assets/images/ic_psw.png')"
          type="password"
          clearable
          placeholder="请输入密码（6-20位的数字加字母的组合）"
        />
        <van-field
          v-model="temp.password2"
          :left-icon="require('../assets/images/ic_confirm_psw.png')"
          type="password"
          clearable
          placeholder="请输入确认密码"
        />
      </van-cell-group>
      <div class="toregister">
        已有账号?<router-link to="Login"><el-button type="text" style="color: #FD7251">去登录</el-button></router-link>
      </div>
      <div class="loginning">
        <van-button :loading="loginloading" size="large" class="loginbutton" type="warning" @click="register">注 册</van-button>
      </div>
      <div class="bottomtip">
        <p class="bottomtip1">点击注册即表示同意</p>
        <p class="bottomtip2">《广铁订餐系统使用须知》</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Register',
  data() {
    return {
      temp: {
        phone: '',
        password: ''
      },
      imgbg: require('../assets/images/loginbg.png'),
      imglogo: require('../assets/images/logo.png'),
      loginloading: false,
      usernameerr: false,
      passworderr: false
    }
  },
  methods: {
    register() {
      if (this.temp.phone === '') {
        this.$notify({
          message: '请输入电话号码',
          duration: 3000,
          background: '#F56C6C'
        })
        return false
      }
      if (this.temp.password === '') {
        this.$notify({
          message: '请输入密码',
          duration: 3000,
          background: '#F56C6C'
        })
        return false
      } else {
          if (!this.regpassword(this.temp.password)) {
              this.$notify({
                  message: '请输入正确格式的密码（6-20位的数字加字母的组合）',
                  duration: 3000,
                  background: '#F56C6C'
              })
              return false
          }
      }
      if (this.temp.password !== this.temp.password2) {
          this.$notify({
              message: '两次输入的密码不一致',
              duration: 3000,
              background: '#F56C6C'
          })
          return false
      }
      this.loginloading = true
      this.$r.post('http://hcdc.ydxxtech.com/api/register', this.temp).then(re => {
        if (re.data.status === 'success') {
          this.$notify({
            message: '注册成功',
            duration: 3000,
            background: '#67C23A'
          })
        }
        this.loginloading = false
      }).catch(() => {
        this.loginloading = false
        return false
      })
    },
      regpassword(p) {
          const reg1 = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,20}$/
          return reg1.test(p)
      },
    goback() {
      this.$router.back()
    }
  }
}
</script>

<style>
    .bottomtip{
        text-align: center;
        margin-top: 10px;
        line-height: 30px;
        font-size: 14px;
    }
    .bottomtip1{
        color: #969696;

    }
    .bottomtip2{
        color: #F2643E;
        font-weight: 600;
    }
</style>
