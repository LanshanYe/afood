<template>
  <div class="app-container">
    <div class="header2">
      <div class="returnicon">
        <van-icon name="arrow-left" @click="goHome" />
      </div>
      <div class="searchbox">
        <van-search
          v-model="value"
          placeholder="可输入关键字搜索"
          show-action
          @clear="onclear"
          @focus="showsearchgoods = true"
        >
          <div slot="action" style="color: #FF4444" @click="onSearch">搜索</div>
        </van-search>
      </div>
    </div>
    <div class="shopbody">
      <div class="shop" />
    </div>
    <van-dialog
      v-model="showtraindata"
      show-cancel-button
      :before-close="beforeClose"
    >
      <van-field
        v-model="traindata.params.trainCode"
        label="车次"
        placeholder="请输入车次"
      />
      <van-field
        v-model="traindata.params.start_station_no"
        label="上车站"
        placeholder="请输入上车站"
      />
      <van-field
        v-model="traindata.params.end_station_no"
        label="下车站"
        placeholder="请输入下车站"
      />
    </van-dialog>
  </div>
</template>

<script>
import store from '@/store'
export default {
  name: 'Shop',
  data() {
    return {
      value: '',
      shopdata: [],
      showsearchgoods: false,
      showtraindata: false,
      traindata: {
        params: {
          trainCode: '',
          start_station_no: '',
          end_station_no: ''
        }
      }
    }
  },
  mounted() {
    if (store.getters.traindata.trainCode) {
      this.traindata.params = store.getters.traindata
      this.$r.get('/shop', this.traindata).then(re => {
        console.log(re)
      }).catch(() => {
        return false
      })
    } else {
      this.showtraindata = true
    }
  },
  methods: {
    onSearch() {
      console.log(1)
    },
    onclear() {
      console.log(2)
    },
    goHome() {
      this.$router.back()
    },
    beforeClose(action, done) {
      if (action === 'confirm') {
        if (this.traindata.params.trainCode === '') {
          this.$notify({
            message: '请输入车次',
            duration: 3000,
            background: '#F56C6C'
          })
          return false
        }
        if (this.traindata.params.start_station_no === '') {
          this.$notify({
            message: '请输入上车站',
            duration: 3000,
            background: '#F56C6C'
          })
          return false
        }
        if (this.traindata.params.end_station_no === '') {
          this.$notify({
            message: '请输入下车站',
            duration: 3000,
            background: '#F56C6C'
          })
          return false
        }
        this.$r.get('/Shop', this.traindata).then(re => {
          if (re.data.status === 'success') {
            this.$notify({
              message: '获取商户信息成功',
              duration: 3000,
              background: '#67C23A'
            })
            done()
          } else {
            this.$router.back()
          }
        }).catch(() => {
          return false
        })
      } else {
        done()
        this.$router.back()
      }
    }
  }
}
</script>

<style scoped>
    .shopbody{
        width: 100%;
        height: calc(100% - 44px);
    }
</style>
