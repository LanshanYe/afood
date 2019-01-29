<template>
  <div class="app-container homebody">
    <van-swipe :autoplay="3000" :loop="true" indicator-color="white" style="font-size: 0;">
      <van-swipe-item v-for="(it, index) in banners" :key="index">
        <div class="swiperImgdiv">
          <img :src="it.ad_content" class="swiperImg">
        </div>
      </van-swipe-item>
    </van-swipe>
    <div class="middelmenus">
      <div class="menus">
        <div v-for="(it,index) in middeldata" :key="index" class="menuList" @click.stop.prevent="routeto(it)">
          <img :src="it.img" alt="">
          <p>{{ it.title }}</p>
        </div>
      </div>
      <div class="hometexts">
        <span class="homelines"></span><span class="homelines2"></span>{{ text1 }}<span class="homelines2"></span><span class="homelines"></span>
      </div>
      <div class="greatfood">
        <div class="choosedcar borderbottom2">{{ nowdate }}</div>
        <div class="choosedcar borderbottom2">
          <div class="choosedcarleft">
            您的车次
          </div>
          <div class="choosedcarright">
            <span @click="choosetraincode">
              <span style="font-weight: bold" v-if="submitdata.trainCode">
                {{ submitdata.trainCode }}
              </span>
              <span v-else class="tipcolor">请选择车次</span>
            </span>
          </div>
        </div>
        <div class="borderbottom2 traincss">
          <div style="flex: 1;">
            <p style="font-size: 12px">出发城市</p>
            <span class="choosedcar2" @click="choosestart">{{ submitdata.train_start?submitdata.train_start:'请选择' }}</span>
          </div>
          <div style="width: 50px;text-align: center">
            <img src="../assets/images/traincode.png" style="width: 24px;margin-top: 12px" alt="">
          </div>
          <div style="flex: 1;text-align: right">
            <p style="font-size: 12px">到达城市</p>
            <span class="choosedcar2" @click="chooseend">{{ submitdata.train_end?submitdata.train_end:'请选择' }}</span>
          </div>
        </div>
        <div class="orderbutton">
          <van-button :loading="ordering" style="width: 100%;background-color: #ff5000;border-radius: 5px" type="warning" @click="order">开始订餐</van-button>
        </div>
      </div>
      <div v-show="recommend.length > 0" class="recommends">
        <div class="recommendstitle borderbottom2">
          <van-row>
            <div class="recommendsleft">资讯推荐</div>
            <div class="recommendsright" @click.stop.prevent="routeto({path: 'news'})"><p class="recommendsmore">更多&gt;</p></div>
          </van-row>
        </div>
        <div class="recommendlists">
          <div v-for="(it, index) in recommend" :key="index" class="recommendlist">
            <el-card :body-style="{padding: '5px'}" shadow="always">
              <div class="flexdiv" @click.stop.prevent="routetonews(it)">
                <div class="recommendsimgbox">
                  <img :src="it.cover" class="recommendsimg">
                </div>
                <div class="recommendstextbox">
                  <div class="recommendtitle">{{ it.title }}</div>
                  <div class="recommendabstract">{{ it.abstract }}</div>
                  <div class="recommendtime">{{ it.created_at }}</div>
                </div>
              </div>
            </el-card>
          </div>
        </div>
      </div>
    </div>
    <div v-if="trainLoading" class="iloading">
      <van-loading type="spinner" size="40px" color="white" />
    </div>
    <transition name="el-zoom-in-bottom">
      <div v-show="showword" class="trani">
        <div class="keywordbg" @click="closemyword"></div>
        <mykeyword :values="submitdata.trainCode" :curkey="curkey" @keyclick="getclicked" @close="closeword" />
      </div>
    </transition>
    <transition name="el-zoom-in-bottom">
      <div class="trani shadowbg" v-show="showdlink">
        <div class="dlinkdiv bordertop">
          <div class="dlinktext">请选择您所在的车厢范围</div>
          <div class="dlinktype" @click.stop.prevent="getcarriage('A')">1-8号车厢</div>
          <div class="dlinktype" @click.stop.prevent="getcarriage('B')">9-16号车厢</div>
        </div>
      </div>
    </transition>
    <transition name="el-zoom-in-bottom">
      <div class="trani" v-show="tranipicker1" @click.stop.prevent="bgclicks($event, 2)">
        <van-picker
                :columns="columns1"
                key="pickers1"
                show-toolbar
                class="tranipicker"
                title="选择出发城市"
                @cancel="onCancel"
                @confirm="onConfirm"/>
      </div>
    </transition>
    <transition name="el-zoom-in-bottom">
      <div class="trani" v-show="tranipicker2" @click.stop.prevent="bgclicks($event, 3)">
        <van-picker
                :columns="columns2"
                key="pickers2"
                class="tranipicker"
                show-toolbar
                title="选择到达城市"
                @cancel="onCancel2"
                @confirm="onConfirm2"/>
      </div>
    </transition>
  </div>
</template>

<script>
import store from '@/store'
import mykeyword from '@/components/myKeyword.vue'
import { getToken } from '@/utils/auth'
export default {
  name: 'Home',
  components: {
    mykeyword
  },
  data() {
    return {
      banners: [],
        recommend: [],
      showtraindata: false,
      showword: false,
        tranipicker1: false,
        tranipicker2: false,
        nowdate: '',
        columns1: [],
        columns2: [],
      trainsdata: null,
        swiperOption: {
            autoplay: {
                delay: 3000, //自动切换的时间间隔，单位ms
                stopOnLastSlide: false, //当切换到最后一个slide时停止自动切换
                disableOnInteraction: false
            }
        },
      middeldata: [
          { img: require('../assets/images/food.png'), title: '美食', path: 'foods' },
          { img: require('../assets/images/place.png'), title: '旅游景点', path: 'place' },
        { img: require('../assets/images/news.png'), title: '资讯', path: 'news' }
      ],
      isLoading: false,
      showkeyboard: false,
      ordering: false,
      trainLoading: false,
      isreadonly: true,
        oldcarnum: '',
      temp: {
        date: '',
        train: ''
      },
        getfood: {
            carriage: 'A',
            date: '',
            seid: '',
            ssid: '',
            train: ''
        },
        showdlink: false,
      submitdata: {
        start_station_no: '',
        end_station_no: '',
        trainCode: '',
          train_end: '',
          train_start: '',
      },
        curkey: '',
        keyreg: /^[C, D, G]$/,
      currentDate: new Date(),
      text1: '高铁订餐'
    }
  },
  mounted() {
      // this.$r.get('/notice?type=2').then(re => {
      //     if (re.data.status === 'success' && re.data) {
      //         if (re.data.result) {
      //             if (re.data.result.length >= 2) {
      //                 this.recommend.push(re.data.result[0])
      //                 this.recommend.push(re.data.result[1])
      //             } else if (re.data.result.length === 1) {
      //                 this.recommend.push(re.data.result[0])
      //             } else {
      //                 this.recommend = []
      //             }
      //         }
      //     }
      // }).catch(() => {
      //     return false
      // })
      this.$r.get('/shopping/v2/advert').then(re => {
          if (re.data.error_code === 'ok') {
              this.banners = re.data.data
          }
      }).catch(() => {
          return false
      })
      this.getfood = store.getters.getfood
    var time12 = new Date()
    this.temp.date = time12.getFullYear() + '-' + (time12.getMonth() + 1) + '-' + time12.getDate()
    this.getfood.date = this.temp.date
    this.nowdate = time12.getFullYear() + '年' + (time12.getMonth() + 1) + '月' + time12.getDate() + '日' + ' 星期' + (time12.getDay() === 0 ? '天' : time12.getDay())
      if (store.getters.userinfo.phone) {
          if (store.getters.traindata.trainCode) {
              this.submitdata = store.getters.traindata
              this.getfood.train = store.getters.traindata.trainCode
              this.getcolum()
          }
      } else {
          if (store.getters.scheduleid.scheduleId) {
              store.dispatch('GetTrainInfo', store.getters.scheduleid).then(() => {
                  if (store.getters.trip.train_number) {
                      if (store.getters.trip.start_time) {
                          this.nowdate = store.getters.trip.start_time
                          this.temp.date = store.getters.trip.start_time.split(' ')[0]
                          this.getfood.date = this.temp.date
                      }
                      this.submitdata.trainCode = store.getters.trip.train_number || ''
                      this.getfood.train = store.getters.trip.train_number || ''
                      this.submitdata.train_start = store.getters.trip.start_station
                      this.submitdata.train_end = store.getters.trip.end_station
                      this.submitdata.start_station_no = store.getters.trip.start_station_no
                      this.submitdata.end_station_no = store.getters.trip.end_station_no
                      this.getcolum()
                  }
              }).catch(errs => {
                  console.log(errs)
                  return false
              })
          } else if (getToken()) {
              store.dispatch('GetUserInfo')
          } else if (store.getters.scheduleid.phone) {
              store.dispatch('GetTrainInfo', store.getters.scheduleid).catch(errs => {
                  console.log(errs)
                  return false
              })
          }
      }
  },
    destroyed() {
        store.dispatch('setTraindata', this.submitdata)
        store.dispatch('setGetfood', this.getfood)
    },
  methods: {
    iconclick(name) {
      this.$router.push({ name: name })
    },
      getcolum() {
        var noncestr = new Date().getTime()
        var sign = this.$md5('train=' + this.submitdata.trainCode + '&noncestr=' + noncestr + '&key=MTMyMWFkYXNjZGFnMzI5Nzkx')
        var params = {
            train: this.submitdata.trainCode,
            nonceStr: noncestr,
            sign: sign.toUpperCase()
        }
          this.$r.post('/shopping/v2/getTrainAllStation', params).then(re => {
              if (re.data.error_code === 'ok') {
                  this.trainsdata = re.data.data.station
                  var data1 = this.trainsdata
                  data1.splice(data1.length - 1, 1)
                  data1.forEach(v => {
                      this.columns1.push({ ...v, disabled: false, text: v.station })
                  })
                  var data2 = this.trainsdata
                  data2.splice(0, 1)
                  data2.forEach(v => {
                      this.columns2.push({ ...v, disabled: false, text: v.station })
                  })
                  if (this.submitdata.train_end !== '' && this.submitdata.train_start !== '') {
                      for (var i = 0; i < this.trainsdata.length; i++) {
                          if (this.submitdata.train_end === this.trainsdata[i].station) {
                              this.getfood.seid = this.trainsdata[i].id
                          }
                          if (this.submitdata.train_start === this.trainsdata[i].station) {
                              this.getfood.ssid = this.trainsdata[i].id
                          }
                      }
                  }
              }
          }).catch(() => {
              return false
          })
      },
      choosetraincode() {
          this.oldcarnum = this.submitdata.trainCode
          if (this.submitdata.trainCode) {
              var firstvalue = this.submitdata.trainCode.substr(0, 1)
              if (firstvalue === 'C') {
                  this.curkey = 0
              } else if (firstvalue === 'D') {
                  this.curkey = 1
              } else if (firstvalue === 'G') {
                  this.curkey = 2
              } else {
                  this.curkey = ''
              }
          } else {
              this.curkey = ''
          }
          this.showword = true
      },
      onConfirm(v, i) {
          if (this.columns1.length === 0) {
              this.tranipicker1 = false
              return false
          }
        this.columns2.forEach((v, inx) => {
            if (inx >= i) {
                v.disabled = false
            } else {
                v.disabled = true
            }
        })
          this.columns2 = this.columns2.concat()
        this.submitdata.train_start = v.text
          this.submitdata.start_station_no = v.station_no
          this.submitdata.train_end = ''
          this.getfood.ssid = v.id
          this.getfood.seid = ''
          this.tranipicker1 = false
          this.tranipicker2 = true
      },
      onConfirm2(v) {
          if (this.columns2.length === 0) {
              this.tranipicker2 = false
              return false
          }
          this.submitdata.train_end = v.text
          this.submitdata.end_station_no = v.station_no
          this.getfood.seid = v.id
          this.tranipicker2 = false
      },
      onCancel2() {
          this.tranipicker2 = false
      },
      onCancel() {
          this.tranipicker1 = false
      },
    getclicked(t) {
        if (t.value === '退格') {
          this.submitdata.trainCode = this.submitdata.trainCode.substr(0, this.submitdata.trainCode.length - 1)
        } else if (t.value === '清空') {
          this.submitdata.trainCode = ''
        } else if (t.value === '确认') {
          this.showword = false
            this.columns1 = []
            this.columns2 = []
            this.submitdata.train_end = ''
            this.submitdata.train_start = ''
            this.getfood.ssid = ''
            this.getfood.seid = ''
            if (this.submitdata.trainCode) {
                this.$r.post('/shopping/v2/getIsReconnection', {date: this.temp.date, train: this.submitdata.trainCode, mp_id: 9, type: 'zzdc'}).then(re => {
                    if (re.data.error_code === 'ok') {
                        if (re.data.data.d_link !== 'N') {
                            this.showdlink = true
                        } else {
                            this.tranipicker1 = true
                        }
                        this.getcolum()
                    } else {
                        this.submitdata.trainCode = ''
                    }
                }).catch(errs => {
                    console.log(errs)
                })
            } else {
                this.$notify({
                    message: '请选择车次',
                    duration: 3000,
                    background: '#F56C6C'
                })
                return false
            }
        } else {
            if (this.submitdata.trainCode.length > 4) {
                if (this.keyreg.test(t.value)) {
                    this.curkey = t.inx
                    this.submitdata.trainCode = this.submitdata.trainCode.substr(1)
                    this.submitdata.trainCode = t.value + this.submitdata.trainCode
                } else {
                    return false
                }
            } else {
                if (this.keyreg.test(t.value)) {
                    if (this.submitdata.trainCode.length === 0) {
                        this.submitdata.trainCode = t.value
                    } else {
                        var firstvalue = this.submitdata.trainCode.substr(0, 1)
                        if (this.keyreg.test(firstvalue)) {
                            this.submitdata.trainCode = this.submitdata.trainCode.substr(1)
                            this.submitdata.trainCode = t.value + this.submitdata.trainCode
                        } else {
                            this.submitdata.trainCode = t.value + this.submitdata.trainCode
                        }
                    }
                    this.curkey = t.inx
                } else {
                    this.submitdata.trainCode += t.value
                }
            }
        }
        this.getfood.train = this.submitdata.trainCode
    },
    closeword(t) {
      this.showword = t
        this.submitdata.trainCode = this.oldcarnum
        this.getfood.train = this.submitdata.trainCode
    },
    onRefresh() {
      this.$r.get('/banner').then(re => {
        if (re.data.status === 'success') {
          this.banners = re.data.result
        }
        this.$notify({
          message: '刷新成功',
          duration: 3000,
          background: '#67C23A'
        })
        this.isLoading = false
      })
    },
    order() {
        if (this.submitdata.trainCode === '') {
            this.$notify({
                message: '请选择车次',
                duration: 3000,
                background: '#F56C6C'
            })
            return false
        }
        if (this.submitdata.train_start === '') {
            this.$notify({
                message: '请选择出发城市',
                duration: 3000,
                background: '#F56C6C'
            })
            return false
        }
        if (this.submitdata.train_end === '') {
            this.$notify({
                message: '请选择到达城市',
                duration: 3000,
                background: '#F56C6C'
            })
            return false
        }
        if (this.getfood.seid === '' || this.getfood.ssid === '') {
            this.$notify({
                message: '该车次暂不支持订餐，请移步餐车购买',
                duration: 3000,
                background: '#F56C6C'
            })
            return false
        }
        // this.ordering = true
        this.$router.push('/Goods')
        // this.$r.post('/shopping/v2/currCateProduct', this.getfood).then(re => {
        //     if (re.data.status === 'success') {
        //         this.$router.push('/Goods')
        //     }
        //     this.ordering = false
        // }).catch(() => {
        //     this.ordering = false
        // })
    },
    routeto(t) {
      this.$router.push({ name: t.path })
    },
      routetonews(t) {
        this.$router.push({ name: 'news', params: { notice_id: t.notice_id } })
    },
      chooseend() {
          if (!this.submitdata.train_start) {
              this.$notify({
                  message: '请先选择上车站',
                  duration: 3000,
                  background: '#F56C6C'
              })
              return false
          }
          this.tranipicker2 = true
      },
      choosestart() {
          this.tranipicker1 = true
      },
      getcarriage(N) {
        this.getfood.carriage = N
          this.showdlink = false
          this.tranipicker1 = true
      },
      bgclicks(e, n) {
          if (e.target.className === 'trani') {
              if (n === 1) {
                  this.submitdata.trainCode = this.oldcarnum
                  this.getfood.train = this.submitdata.trainCode
                  this.showword = false
              } else if (n === 2) {
                  this.tranipicker1 = false
              } else if (n === 3) {
                  this.tranipicker2 = false
              }
          }
      },
      closemyword() {
          this.submitdata.trainCode = this.oldcarnum
          this.getfood.train = this.submitdata.trainCode
          this.showword = false
      },
    bannerclick(t) {
      if (t.type === 'url') {
        window.open(t.target)
      } else if (t.type === 'goods_id') {
        this.$router.push({ name: 'goods', params: { goods_id: t.target }})
      } else {
        return false
      }
    }
  }
}
</script>

<style>
  .middelmenus{
    width: 100%;
    position: relative;
  }
  .menus{
    display: flex;width: 100%;padding: 10px 0;
    background-color: white;
    border-radius: 6px;
  }
  .menuList{
    flex: 1;
    cursor: pointer;
    text-align: center;
  }
  .menuList img{
    width: 40%;
    max-width: 100px;
    max-height: 5rem;
  }
  .menuList p{
    line-height: 1.5rem;
    font-size: 14px;
    margin-top: 4px;
  }
  .orderbutton{
    width: 100%;
    padding-top: 15px;
    text-align: center;
  }
  .greatfood{
    width: 100%;
    padding: 15px 10px;
    background-color: white;
    position: relative;
  }
  .keywordbg{
    width: 100%;
    height: 100%;
  }
  .shadowbg{
    background-color: rgba(0,0,0,0.6);
  }
  .dlinkdiv{
    position: absolute;
    bottom: 0;
    width: 100%;
    text-align: center;
    padding: 30px 0;
    left: 0;
    background-color: #fff;
  }
  .dlinktype{
    border: 1px solid #ECB354;
    display: inline-block;
    color: #ECB354;
    font-size: 14px;
    width: 60%;
    line-height: 50px;
    margin-top: 30px;
  }
  .hometexts{
    width: 100%;
    font-weight: bold;
    border-radius: 6px 6px 0 0;
    background-image: url("../assets/images/abg.png");
    background-size: contain;
    background-repeat: no-repeat;
    background-position-x: 50%;
    background-color: #f7f4f7;
    text-align: center;
    line-height: 50px;
    font-size: 14px;
    overflow: hidden;
  }
  .homelines2{
    display: inline-block;
    height: 2px;
    margin: 0 5px;
    width: 2px;
    vertical-align: middle;
    background-color: #fff;
  }
  .homelines{
    display: inline-block;
    height: 2px;
    width: 24px;
    vertical-align: middle;
    background-color: #fff;
  }
  .homebody{
    padding-bottom: 50px;overflow: auto;background-color: #f3f3f3
  }
  .choosedcarright{
    flex: 1;
    text-align: right;
  }
  .choosedcarleft{
    flex: 1;
  }
  .choosedcar{
    line-height: 40px;
    font-size: 14px;
    display: flex;
  }
  .choosedcar2{
    line-height: 30px;
    font-weight: bold;
  }
  .traincss{
    display: flex;width: 100%;
    padding: 10px 0;
  }
  .iloading{
    position: absolute;
    border-radius: 3px;
    width: 80px;
    height: 80px;
    padding: 20px;
    margin-left: -40px;
    left: 50%;
    top: 30%;
    z-index: 222;
    background-color: rgba(0, 0, 0, 0.5);
  }
</style>
