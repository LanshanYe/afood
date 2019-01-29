<template>
  <div class="app-container">
    <div style="height: 40px">
      <van-nav-bar
        class="navheader borderbottom"
        :title="title"
        :left-arrow="true"
        @click-left="onClickLeft"
      />
    </div>
    <van-cell-group>
      <van-field
        v-model="temp.phone"
        clearable
        label="手机号码"
        placeholder="请输入手机号码"
      />
      <van-field
        v-model="temp.code"
        clearable
        label="验证码"
        placeholder="请输入验证码"
      >
        <el-button slot="button" type="text" size="mini" style="color: #ff976a">获取验证码</el-button>
      </van-field>
    </van-cell-group>
    <div class="positionbtn">
      <van-button type="warning" size="large" style="background-color: #FD7251;border-radius: 30px;" @click="nextto">下一步</van-button>
    </div>
    <van-popup v-model="popupshow1" :overlay="false" class="popup" position="right">
      <div>
        <div style="text-align: center;position: relative;padding: 6px">
          <van-icon name="arrow-left" size="20px" style="position: absolute;left: 6px" @click="closepop" />
          设置新密码
        </div>
        <van-cell-group>
          <van-field
            v-model="temp.password"
            required
            clearable
            type="password"
            label="新密码"
            placeholder="（6-20位的数字加字母的组合）"
          />

          <van-field
            v-model="password2"
            type="password"
            label="确认密码"
            clearable
            placeholder="请再次输入密码"
            required
          />
        </van-cell-group>
        <div class="positionbtn">
          <van-button type="warning" style="background-color: #FD7251;border-radius: 30px" size="large" @click="edit">确 定</van-button>
        </div>
      </div>
    </van-popup>
  </div>
</template>

<script>
export default {
  name: 'News',
  data() {
    return {
      isLoading: false,
      popupshow1: false,
      shownewsinfo: false,
      infos: {},
      submit: {},
      temp: {
        phone: '',
        code: '',
          password: '',
          is_upda: '0'
      },
        userinfo: {},
      title: '忘记密码',
        password2: '',
      newslistdata: []
    }
  },
  methods: {
    onClickLeft() {
      this.$router.back()
    },
    edit() {
        if (!this.regpassword(this.temp.password)) {
            this.$notify({
                message: '请输入正确格式的密码（6-20位的数字加字母的组合）',
                duration: 3000,
                background: '#F56C6C'
            })
            return false
        }
        if (this.password2 === this.temp.password) {
            this.$r.post('http://hcdc.ydxxtech.com/api/resetPassword', this.temp).then(re => {
                if (re.data.status === 'success') {
                    this.$notify({
                        message: '修改成功',
                        duration: 3000,
                        background: '#67C23A'
                    })
                    this.$router.back()
                }
            })
        } else {
            this.$notify({
                message: '两次输入的密码需保持一致',
                duration: 3000,
                background: '#F56C6C'
            })
            return false
        }
    },
    resettemp() {
      this.temp = {
        phone: '',
        code: '',
          password: '',
          is_upda: '0'
      }
    },
    closepop() {
      this.resettemp()
      this.popupshow1 = false
    },
      regpassword(p) {
          const reg1 = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,20}$/
          return reg1.test(p)
      },
    nextto() {
      if (this.temp.phone === '') {
        this.$notify({
          message: '请输入手机号码',
          duration: 3000,
          background: '#F56C6C'
        })
        return false
      }
      if (this.temp.code === '') {
        this.$notify({
          message: '请输入验证码',
          duration: 3000,
          background: '#F56C6C'
        })
        return false
      }
        this.$r.post('http://hcdc.ydxxtech.com/api/resetPassword', this.temp).then(re => {
            if (re.data.status === 'success') {
                this.$notify({
                    message: '验证成功',
                    duration: 3000,
                    background: '#67C23A'
                })
                this.popupshow1 = true
                this.temp.is_upda = '1'
            }
        })
    }
  }
}
</script>

<style scoped>

</style>
