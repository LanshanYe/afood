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
        />
        <van-field
          v-model="temp.password"
          :left-icon="require('../assets/images/ic_psw.png')"
          type="password"
          clearable
          placeholder="请输入密码"
        />
      </van-cell-group>
      <div class="loginbtn">
        <router-link to="forgetPassword">
          <el-button type="text" style="color: #F2643E" size="mini">忘记密码？</el-button>
        </router-link>
      </div>
      <div class="loginning">
        <van-button :loading="loginloading" size="large" class="loginbutton" type="warning" @click="login">登 录</van-button>
      </div>
      <div class="toregister">
        没有账号？ <router-link to="Register"><el-button type="text" style="color: #FD7251">注 册</el-button></router-link>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Login',
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
    login() {
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
      this.loginloading = true
      this.$store.dispatch('LoginByUsername', this.temp).then((re) => {
        if (re.data.status === 'success') {
          this.$notify({
            message: '登录成功',
            duration: 3000,
            background: '#67C23A'
          })
            if (this.$route.query.from) {
                this.$router.push(this.$route.query.from)
            } else {
                this.$router.back()
            }
        }
        this.loginloading = false
      }).catch(() => {
        this.loginloading = false
        return false
      })
    },
    goback() {
      this.$router.back()
    },
      regpassword(p) {
          const reg1 = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,20}$/
          return reg1.test(p)
      }
  }
}
</script>

<style>
</style>
