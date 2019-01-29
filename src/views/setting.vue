<template>
  <div class="setting">
    <div class="usertop">
      <div class="useravatar">
        <div class="userimgbox">
          <div class="userimg">
            <img v-if="userdata.phone" :src="userdata.avatar_url || require('../assets/images/useravatar.png')" alt="">
            <img v-else src="../assets/images/useravatar_nologin.png" alt="" @click="routeto">
          </div>
        </div>
        <p v-if="userdata.phone">{{ userdata.nickname || userdata.phone }}</p>
        <p v-else><el-button type="warning" style="background-color: #FC744F;margin-top: 10px" size="mini" @click="routeto">点击登录</el-button></p>
      </div>
    </div>
    <div class="usercell bordertop">
      <div v-if="userdata.phone" class="cells">
        <van-cell class="borderbottom" title="修改密码" is-link @click="cellclick" />
        <van-cell class="bordertop borderbottom" style="margin-top: 20px" value="退出当前账号" @click="logout"/>
      </div>
    </div>
    <van-popup v-model="popupshow1" :overlay="false" class="popup" position="right">
      <div class="popbox">
        <div>
          <van-icon name="arrow-left" size="20px" @click="closepop" />
        </div>
        <van-cell-group>
          <van-field
            v-model="temp.old_password"
            required
            clearable
            type="password"
            label="旧密码"
            placeholder="请输入旧密码至少6为 最多12位"
          />

          <van-field
            v-model="temp.new_password"
            type="password"
            label="新密码"
            clearable
            placeholder="请输入新密码至少6为 最多12位"
            required
          />
        </van-cell-group>
        <div class="btn">
          <van-button type="primary" size="large" round @click="edit">确认更改</van-button>
        </div>
      </div>
    </van-popup>
    <!--<div class="logout">-->
      <!--<van-button :loading="editloading" type="warning" size="large" round @click="logout">退出登录</van-button>-->
    <!--</div>-->
  </div>
</template>

<script>
import { getToken } from '@/utils/auth' // getToken from cookie
import store from '@/store'
export default {
  name: 'Setting',
  data() {
    return {
      celldata: [
        { title: '修改密码', popupshow: false, islink: true, url: '' }
      ],
      temp: {
        old_password: '',
        new_password: ''
      },
        userdata: {},
      editloading: false,
      popupshow1: false
    }
  },
    mounted() {
        if (getToken()) { // determine if there has token
            if (store.getters.userinfo.phone) {
                this.userdata = store.getters.userinfo
            } else {
                store.dispatch('GetUserInfo').then((re) => { // 拉取user_info
                    this.userdata = re.data.result
                }).catch((err) => {
                    store.dispatch('FedLogOut').then(() => {
                        this.$notify({
                            message: err || '请重新登录',
                            duration: 3000,
                            background: '#F56C6C'
                        })
                        this.userdata = {}
                    }).catch(() => {
                        this.userdata = {}
                        return false
                    })
                })
            }
        }
    },
  methods: {
    cellclick() {
      this.popupshow1 = true
    },
    closepop() {
      this.popupshow1 = false
    },
    logout() {
      this.$dialog.confirm({
        title: '退出登录',
        message: '您确定要退出登录吗'
      }).then(() => {
        this.$store.dispatch('LogOut').then(() => {
          this.$notify({
            message: '退出登录成功',
            duration: 3000,
            background: '#67C23A'
          })
          this.userdata = {}
        })
      }).catch(() => {
        this.userdata = {}
        return false
      })
    },
    edit() {
      if (this.temp.old_password === '' || this.temp.new_password === '') {
        this.$notify({
          message: '请输入密码',
          duration: 3000,
          background: '#E6A23C'
        })
        return false
      } else {
          if (!this.regpassword(this.temp.new_password)) {
              this.$notify({
                  message: '请输入正确格式的新密码（6-20位的数字加字母的组合）',
                  duration: 3000,
                  background: '#F56C6C'
              })
              return false
          }
        this.editloading = true
        this.$r.post('http://hcdc.ydxxtech.com/api/updatePassword', this.temp).then(re => {
          this.editloading = false
          this.temp = {
            old_password: '',
            new_password: ''
          }
          if (re.data.status === 'success') {
            this.$notify({
              message: '修改成功',
              duration: 3000,
              background: '#67C23A'
            })
          }
        }).catch(() => {
          this.editloading = false
        })
      }
    },
      routeto() {
        this.$router.replace('/login')
      },
      regpassword(p) {
          const reg1 = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,20}$/
          return reg1.test(p)
      }
  }
}
</script>

<style scoped>
    .setting{
        padding-bottom: 50px;
        width: 100%;
        height: 100%;
        overflow: auto;
      background-color: #f3f3f3;
    }
    .logout{
        position: fixed;
        bottom: 60px;
        left: 0;
        width: 100%;
        padding: 0 30px;
    }
  .usertop{
    width: 100%;
    background-image: url("../assets/images/userbg.png");
    background-repeat: no-repeat;
    background-size: 100%;
    position: relative;
    background-color: white;
  }
  .useravatar{
    width: 100%;
    padding-top: 30%;
    text-align: center;
    padding-bottom: 10px;
  }
  .useravatar p{
    color: #FC744F;
    font-weight: bold;
    margin-top: 10px;
    font-size: 18px;
    letter-spacing: 5px;
  }
  .userimgbox{
    width: 25%;
    border-radius: 100%;
    background-color: #f7b3a1;
    font-size: 0;
    display: inline-block;
    padding: 1px;
  }
  .userimg{
    width: 100%;
    border-radius: 100%;
    overflow: hidden;
  }
  .userimg img{
    width: 100%;
  }

  .usercell{
    min-height: 50px;
    border-radius: 6px;
    overflow: hidden;
  }
</style>
