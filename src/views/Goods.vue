<template>
  <div class="app-container" style="padding-bottom: 50px;">
    <div class="header2">
      <div class="returnicon">
        <van-icon name="arrow-left" @click="goHome" />
      </div>
      <div class="searchbox">
        <van-search
          v-model="value"
          placeholder="请输入搜索关键词"
          show-action
          @clear="onclear"
          @focus="showsearchgoods = true"
        >
          <div slot="action" style="color: #FF4444" @click="onSearch">搜索</div>
        </van-search>
      </div>
    </div>
    <div class="goods-container borderbottom">
      <div class="left">
        <van-badge-group :active-key="activeKey" @change="onChange">
          <van-badge v-for="(it, index) in goods" :key="index" :title="it.cate_name" />
        </van-badge-group>
      </div>
      <div class="right">
        <div class="goodstitle borderbottom fffbg">
          <p>{{ goods[activeKey].cate_name }}<span style="color: #cfcfcf;font-size: 12px">{{ goods[activeKey].decription }}</span></p>
        </div>
        <div class="goodsLists">
          <template v-if="goods[activeKey].child">
            <van-row v-for="(it, index) in goods[activeKey].child" :key="index" type="flex" class="agood">
              <van-col span="8" class="agoodleft">
                <img v-lazy="it.pics" alt="" @click="showinfo(it)">
              </van-col>
              <van-col span="16" class="agoodright">
                <div @click="showinfo(it)">
                  <div class="agoodtext agoodtitle">{{ it.pro_name }}</div>
                  <div class="agoodtext agooddesc">{{ it.description }}</div>
                  <div class="agoodtext agooddesc">剩余{{ it.number }}份</div>
                </div>
                <div class="agoodprice">
                  <div class="agoodpriceleft">¥ {{ it.price }}</div>
                  <my-stepper v-model="it.buynum" :max="it.number" @adding="addfood($event, it)" @reducing="reducefood(it)" />
                </div>
              </van-col>
            </van-row>
          </template>
          <template v-else>
            <van-row class="agood" gutter="5">
              <van-col span="24">
                暂无菜品
              </van-col>
            </van-row>
          </template>
        </div>
      </div>
    </div>
    <van-submit-bar
      ref="bottomcart"
      class="bordertop"
      :price="price * 100"
      button-text="提交订单"
      @submit="onSubmit"
    >
      <van-icon :info="goodsnum" name="shopping-cart-o" size="20px" class="carts" @click="showcarts" />
    </van-submit-bar>
    <van-actionsheet v-model="showcart" :lazy-render="false" title="已选套餐">
      <div v-show="goodsdata2.length === 0" class="bordertop" style="line-height: 100px;text-align: center;width: 100%">
        暂无已选套餐
      </div>
      <div class="cart">
        <van-row v-for="(it, index) in goodsdata2" :key="index" class="agood bordertop" type="flex">
          <van-col span="8" class="agoodleft">
            <img v-lazy="it.pics" alt="" @click="showinfo(it)">
          </van-col>
          <van-col span="16" class="agoodright">
            <div @click="showinfo(it)">
              <div class="agoodtext agoodtitle">{{ it.pro_name }}</div>
              <div class="agoodtext agooddesc">{{ it.description }}</div>
              <div class="agoodtext agooddesc">剩余{{ it.number }}份</div>
            </div>
            <!--<div class="agoodtext agooddesc2">月售 {{ it.monthsell }} 好评率 {{ it.great }}</div>-->
            <div class="agoodprice">
              <div class="agoodpriceleft">¥ {{ it.price }}</div>
              <my-stepper v-model="it.buynum" :max="it.number" @adding="addfood($event, it)" @reducing="reducefood(it)" />
            </div>
          </van-col>
        </van-row>
      </div>
      <div class="count bordertop">
        合计：<span style="color: #FC744F">{{ price }} 元</span>
      </div>
    </van-actionsheet>
    <transition name="el-zoom-in-center">
      <div v-show="showgoodsinfo" class="goodsinfo">
        <div class="goodsinfotop borderbottom">
          <van-icon name="close" color="#b4b4b4" style="margin-top: 3px" size="24px" @click="cloasgoodsinfo" />
        </div>
        <div class="goodsinfobody">
          <el-card shadow="always">
            <img :src="goodsinfodata.pics" class="swiperImg">
            <p>{{ goodsinfodata.pro_name }}</p>
            <p class="text2 textright">库存: {{ goodsinfodata.number }}</p>
            <div class="bottom clearfix">
              <div class="price">¥ {{ goodsinfodata.price }}</div>
              <my-stepper v-model="goodsinfodata.buynum" :max="goodsinfodata.number" @adding="addfood($event, goodsinfodata)" @reducing="reducefood(goodsinfodata)" />
            </div>
          </el-card>
          <!--<div class="goodsinfocontent bordertop">-->
            <!--<div class="goodsinfocontenttitle">商品详情</div>-->
            <!--<div class="text2 textbody" v-html="goodsinfodata.content"/>-->
          <!--</div>-->
        </div>
      </div>
    </transition>
    <transition name="el-zoom-in-top">
      <div v-show="showsearchgoods" class="searchgoodsLists">
        <div class="bgcolorfff">
          <van-row v-for="(it, index) in goodssearchdata" :key="index" class="agood" type="flex">
            <van-col span="8" class="agoodleft">
              <img v-lazy="it.pics" alt="" @click="showinfo(it)">
            </van-col>
            <van-col span="16" class="agoodright">
              <div @click="showinfo(it)">
                <div class="agoodtext agoodtitle">{{ it.pro_name }}</div>
                <div class="agoodtext agooddesc">{{ it.description }}</div>
                <div class="agoodtext agooddesc">剩余{{ it.number }}份</div>
              </div>
              <!--<div class="agoodtext agooddesc2">月售 {{ it.monthsell }} 好评率 {{ it.great }}</div>-->
              <div class="agoodprice">
                <div class="agoodpriceleft">¥ {{ it.price }}</div>
                <my-stepper v-model="it.buynum" :max="it.number" @adding="addfood($event, it)" @reducing="reducefood(it)" />
              </div>
            </van-col>
          </van-row>
          <van-row v-show="goodssearchdata.length === 0" class="emtydiv">
            暂无搜索数据
          </van-row>
          <div class="closesearchgoods" @click="showsearchgoods = false">
            <van-icon name="arrow-up" size="24px" />
          </div>
        </div>
      </div>
    </transition>
    <transition name="el-zoom-in-bottom">
      <div v-show="showorder" ref="orders" class="orderbody">
        <div class="ordertop">
          <van-icon name="close" color="#fff" size="20px" class="close" @click="closeorder" />
          <div class="citys">
            <div class="citystext">
              <p v-if="submitdata.start_station===''" style="font-size: 22px" @click="tranipicker1 = true">请选择上车站</p>
              <p v-else style="font-size: 22px">{{ submitdata.start_station }}</p>
            </div>
            <div class="middelicon">
              <van-icon name="upgrade" color="#fff" size="20px" class="rights" />
            </div>
            <div class="citystext">
              <p v-if="submitdata.end_station===''" style="font-size: 22px" @click="tranipicker2 = true">请选择下车站</p>
              <p v-else style="font-size: 22px">{{ submitdata.end_station }}</p>
            </div>
          </div>
          <div class="tips">
            <span style="margin-right: 20px">{{ submitdata.train_number }}</span>
            <span>{{ submitdata.order_time }}</span>
          </div>
        </div>
        <div class="orderbottom">
          <div class="orderbottombox">
            <van-cell-group>
              <van-field v-model="submitdata.buyer_name" input-align="right" placeholder="请输入姓名" label="姓名" />
              <van-field v-model="submitdata.seat_number" readonly placeholder="请输入座位号" input-align="right" label="座位号" @focus="seatshow = true"/>
              <van-field v-model="submitdata.buyer_phone" input-align="right" readonly label="手机号码" />
              <van-field v-model="submitdata.time" input-align="right" readonly label="配送时间" />
              <van-field v-model="submitdata.remark" type="textarea" rows="1" autosize input-align="right" label="备注" placeholder="可输入备注信息"/>
              <van-checkbox v-model="submitdata.checked" class="xieyi" checked-color="#4b0">同意 《舌尖de旅途协议》</van-checkbox>
            </van-cell-group>
            <div class="goodsdiv">
              <div class="lineheight2rem">
                支付方式
              </div>
              <div style="padding: 6px 0 6px 15px">
                <el-radio-group v-model="submitdata.pay_type">
                  <el-radio label="alipay">
                    <img src="../assets/images/ic_alipay.png" class="payimg" alt="">支付宝
                  </el-radio>
                  <!--<el-radio label="wechat">-->
                    <!--<img src="../assets/images/ic_wechat.png" class="payimg" alt="">微信-->
                  <!--</el-radio>-->
                </el-radio-group>
              </div>
              <div class="lineheight2rem">
                您的订单
              </div>
              <div class="goodslists2">
                <div v-for="(it, index) in goodsdata2" :key="index" class="goodslist2">
                  <div class="goodslistdiv1">{{ it.pro_name }}</div>
                  <div class="goodslistdiv2">¥ {{ it.price }}</div>
                  <div class="goodsliststepper"><my-stepper v-model="it.buynum" :max="it.number" @adding="addfood($event, it)" @reducing="reducefood(it)" /></div>
                </div>
                <div class="goodslist2">
                  <div class="goodslistdiv1">餐具数量</div>
                  <div class="goodsliststepper"><my-stepper v-model="submitdata.person" :min="1" /></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </transition>
    <div v-show="showorder" class="orderDinners">
      <van-row>
        <van-col span="16" style="padding-left: 20px;background-color: #384143;color: white;height: 44px;line-height: 44px">¥ <span style="font-size: 24px">{{ price }}</span></van-col>
        <van-col span="8">
          <van-button :loading="ordering" style="background-color: #FD7251;width: 100%" type="warning" @click="gopay">立 即 支 付</van-button>
        </van-col>
      </van-row>
    </div>
    <div v-show="seatshow" class="seat bordertop">
      <van-picker
              :columns="columns"
              show-toolbar
              title="选择座位"
              @cancel="onCancel"
              @confirm="onConfirm"/>
    </div>
    <transition name="fade">
      <div v-show="showorder&&showorderheader" class="myorderheader">
        <van-row>
          <van-col offset="4" span="16">
            <van-col span="10">{{ submitdata.start_station }}</van-col>
            <van-col span="4"><van-icon name="arrow" color="#fff" size="16px" style="margin-top: 2px"/></van-col>
            <van-col span="10">{{ submitdata.end_station }}</van-col>
          </van-col>
          <van-col span="4">
            <van-icon name="close" color="#fff" size="20px" @click="showorder = false" />
          </van-col>
        </van-row>
      </div>
    </transition>
    <van-dialog
      v-model="showtrainum"
      show-cancel-button
      :before-close="beforeClose"
    >
      <van-field
        v-model="submitdata.train_number"
        label="车次"
        placeholder="请输入车次"
      />
    </van-dialog>
    <transition name="el-zoom-in-bottom">
      <div class="trani" v-show="tranipicker1">
        <van-picker
                :columns="columns1"
                key="pickers1"
                show-toolbar
                class="tranipicker"
                title="选择上车站"
                @cancel="onCancel1"
                @confirm="onConfirm1"/>
      </div>
    </transition>
    <transition name="el-zoom-in-bottom">
      <div class="trani" v-show="tranipicker2">
        <van-picker
                :columns="columns2"
                key="pickers2"
                class="tranipicker"
                show-toolbar
                title="选择下车站"
                @cancel="onCancel2"
                @confirm="onConfirm2"/>
      </div>
    </transition>
  </div>
</template>

<script>
import myStepper from '@/components/myStepper.vue'
import store from '../store'
export default {
  name: 'Goods',
  components: {
    myStepper
  },
  data() {
    return {
        value: '',
        tranipicker1: false,
        tranipicker2: false,
        train_end: '',
        train_start: '',
        start_y: 0,
        end_y: 0,
        columns1: [],
        columns2: [],
        badgedata: [
            {title: '热销', info: 'hot', url: '', content: '大家喜欢吃，才叫真好吃'},
            {title: '单人套餐', info: '', url: '', content: '单人套餐'},
            {title: '双人套餐', info: '', url: '', content: '真好吃'},
            {title: '米饭', info: '', url: '', content: '米饭'}
        ],
        goods: [
            {cate_name: '', child: []}
        ],
        goodssearchdata: [],
        goodsinfodata: {
            images: []
        },
       // swiperwidth: 0,
        balls: [
            {
                show: false
            },
            {
                show: false
            },
            {
                show: false
            }
        ],
        dropBalls: [],
        cart: {
            x: 22,
            y: 0
        },
        submitdata: {
            buyer_name: '',
            is_web: 1,
            buyer_phone: '',
            seat_number: '',
            train_number: '',
            items: '',
            time: '预计10分钟内送达',
            pay_type: 'alipay',
            start_station: '',
            end_station: '',
            goods: '',
            order_time: '',
            person: 1,
            remark: '',
            checked: true
        },
        swiperOption: {
            autoplay: true
        },
        ordering: false,
        seatshow: false,
        showtrainum: false,
        currentDate: '',
        columns: [
            {
                values: ['01车', '02车', '03车', '04车', '05车', '06车', '07车', '08车', '09车', '10车', '11车', '12车', '13车', '14车', '15车', '16车', '17车', '18车', '19车', '20车'],
                className: 'column1'
            },
            {
                values: ['无座', '01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20'],
                className: 'column2'
            },
            {
                values: ['无座', 'A', 'B', 'C', 'D', 'F'],
                className: 'column3'
            }
            ],
      activeKey: 0,
      price: 0,
      shop_id: 1,
      showcart: false,
      showorder: false,
        showorderheader: false,
      showgoodsinfo: false,
      showsearchgoods: false,
      addfoodstate: true,
      goodsnum: 0,
      goodsdata: [],
      goodsdata2: [],
      trainsdata: []
    }
  },
  mounted() {
      // this.swiperwidth = document.body.clientWidth - 72
      if (store.getters.trip.train_number) {
          this.submitdata.train_number = store.getters.trip.train_number || ''
          this.submitdata.start_station = store.getters.trip.start_station
          this.submitdata.end_station_no = store.getters.trip.end_station_no
          this.submitdata.start_station_no = store.getters.trip.start_station_no
          this.submitdata.end_station = store.getters.trip.end_station
          this.submitdata.seat_number = store.getters.trip.seat_number
      } else {
          this.submitdata.train_number = store.getters.traindata.trainCode
          this.submitdata.start_station = store.getters.traindata.train_start
          this.submitdata.end_station_no = store.getters.traindata.end_station_no
          this.submitdata.start_station_no = store.getters.traindata.start_station_no
          this.submitdata.end_station = store.getters.traindata.train_end
      }
      const routeGoodsId = parseFloat(this.$route.params.goods_id)
    var time1 = new Date()
    var dates = time1.getFullYear() + '-' + (time1.getMonth() + 1) + '-' + time1.getDate()
    this.submitdata.order_time = dates
    this.submitdata.buyer_name = store.getters.userinfo.real_name || store.getters.userinfo.nickname || ''
    this.submitdata.buyer_phone = store.getters.userinfo.phone
    if (routeGoodsId) {
      this.showgoodsinfo = true
    }
      // getfood: {
      //     carriage: 'A',
      //         date: '',
      //         seid: '',
      //         ssid: '',
      //         train: ''
      // },
    var foodp = store.getters.getfood
      var noncestr = new Date().getTime()
      var sign = this.$md5('carriage=' + foodp.carriage + '&date=' + foodp.date + '&noncestr=' + noncestr + '&ssid=' + foodp.ssid + '&seid=' + foodp.seid + '&train=' + foodp.train + '&key=MTMyMWFkYXNjZGFnMzI5Nzkx')
      var params = {
          ...foodp,
          nonceStr: noncestr,
          sign: sign.toUpperCase()
      }
      this.$r.post('/shopping/v2/currCateProduct', params).then(re => {
          console.log(re)
          if (re.data.error_code === 'ok') {
              this.goods = re.data.data.product
          } else {
              this.$router.back()
          }
      }).catch(() => {
          return false
      })
    // this.$r.get('/goods?start_station_no=' + this.submitdata.start_station_no + '&trainCode=' + this.submitdata.train_number + '&end_station_no=' + this.submitdata.end_station_no).then(re => {
    //     if (re.data.status === 'success') {
    //         this.goods = re.data.result
    //     } else {
    //         this.$router.replace('/')
    //     }
    // }).catch(errs => {
    //     console.log(errs)
    // })
  },
  methods: {
    onSearch() {
      this.goodssearchdata = []
      for (var i = 0; i < this.goods.length; i++) {
        for (var j = 0; j < this.goods[i].child.length; j++) {
          if (this.goods[i].child[j].pro_name.indexOf(this.value) !== -1) {
            this.goodssearchdata.push(this.goods[i].child[j])
          }
        }
      }
    },
    onclear() {},
      onConfirm(value){
        var texts = ''
        value.forEach((v) => {
            texts += v
        })
          if (texts.indexOf('无座') !== -1) {
            texts = texts.substr(0, 3) + '无座'
          }
          this.submitdata.seat_number = texts
          this.seatshow = false
      },
      onCancel(){
          this.seatshow = false
      },
    goHome() {
      this.$router.push('/')
    },
    onChange(key) {
      this.activeKey = key
    },
      ordersscroll(e) {
          if (e.target.scrollTop > 60) {
            if (!this.showorderheader) {
                this.showorderheader = true
            }
          } else {
              if (this.showorderheader) {
                  this.showorderheader = false
              }
          }
      },
      closeorder() {
          if (this.$refs.orders) {
              this.$refs.orders.removeEventListener('scroll', this.ordersscroll)
          }
        this.showorder = false
      },
    onSubmit() {
        var time1 = new Date()
        var dates = time1.getFullYear() + '-' + (time1.getMonth() + 1) + '-' + time1.getDate()
        this.submitdata.order_time = dates
      if (this.submitdata.train_number === '' || this.submitdata.train_number === undefined || this.submitdata.train_number === null) {
        this.showtrainum = true
      } else {
          this.$refs.orders.addEventListener('scroll', this.ordersscroll)
        this.showorder = true
        //   this.columns1 = []
        //   this.columns2 = []
        // this.$r.get('/railInformation', { params: {
        //   date: this.submitdata.order_time,
        //   trainCode: this.submitdata.train_number
        // }}).then(re => {
        //   if (re.data.status === 'success') {
        //       this.trainsdata = re.data.result.list
        //       var data1 = this.trainsdata
        //       data1.splice(data1.length - 1, 1)
        //       data1.forEach(v => {
        //           this.columns1.push({ text: v.station_name, disabled: false, station_no: v.station_no })
        //       })
        //       var data2 = this.trainsdata
        //       data2.splice(0, 1)
        //       data2.forEach(v => {
        //           this.columns2.push({ text: v.station_name, disabled: false, station_no: v.station_no })
        //       })
        //   }
        // }).catch(() => {
        // })
      }
    },
    beforeClose(action, done) {
      if (action === 'confirm') {
          if(this.submitdata.train_number === '') {
              done()
              return false
          }
          done()
          this.$refs.orders.addEventListener('scroll', this.ordersscroll)
        this.showorder = true
          this.columns1 = []
          this.columns2 = []
        this.$r.get('/railInformation', { params: {
          date: this.submitdata.order_time,
          trainCode: this.submitdata.train_number
        }}).then(re => {
          if (re.data.status === 'success') {
              this.trainsdata = re.data.result.list
              var data1 = this.trainsdata
              data1.splice(data1.length - 1, 1)
              data1.forEach(v => {
                  this.columns1.push({ text: v.station_name, disabled: false, station_no: v.station_no })
              })
              var data2 = this.trainsdata
              data2.splice(0, 1)
              data2.forEach(v => {
                  this.columns2.push({ text: v.station_name, disabled: false, station_no: v.station_no })
              })
          }
        }).catch(() => {
            return false
        })
      } else {
        done()
      }
    },
    showcarts() {
      this.showcart = true
    },
    addfood(e, it) {
      var state = true
      for (var i = 0; i < this.goodsdata2.length; i++) {
        if (this.goodsdata2[i].pro_id === it.pro_id) {
          state = false
          break
        }
      }
      if (state) {
        this.goodsdata2.push(it)
      }
      this.price += parseInt(it.price)
      this.goodsnum++
    },
    reducefood(it) {
      var inx = 0
      var state = false
      var that = this
      for (var i = 0; i < this.goodsdata2.length; i++) {
        if (this.goodsdata2[i].pro_id === it.pro_id) {
          inx = i
          if (this.goodsdata2[i].buynum < 1) {
            state = true
            break
          }
        }
      }
      if (state) {
        that.goodsdata2.splice(inx, 1)
      }
      this.price -= parseInt(it.price)
      this.goodsnum--
    },
    choosefood(it) {
      var state = true
      for (var i = 0; i < this.goodsdata2.length; i++) {
        if (this.goodsdata2[i].pro_id === it.pro_id) {
          state = false
          break
        }
      }
      if (state) {
        this.goodsdata2.push(it)
      }
      var count = 0
      for (var p = 0; p < this.goodsdata.length; p++) {
        if (this.goodsdata[p].buynum > 0) {
          if (this.goodsdata[p].buynum >= 40) {
            count += 40 * parseInt(this.goodsdata[p].price)
          } else {
            count += parseInt(this.goodsdata[p].buynum) * parseInt(this.goodsdata[p].price)
          }
        }
      }
      this.price = count
    },
    showinfo(t) {
        this.showgoodsinfo = true
        this.goodsinfodata = t
    },
    cloasgoodsinfo() {
      this.showgoodsinfo = false
    },
      t_start() {},
      onConfirm1(v) {
        if (this.columns1.length === 0) {
            this.tranipicker1 = false
            return false
        }
          this.submitdata.start_station = v.text
          this.submitdata.start_station_no = v.station_no
          this.tranipicker1 = false
          store.dispatch('setTraindata', { train_start: this.submitdata.start_station, train_end: this.submitdata.end_station, end_station_no: this.submitdata.end_station_no, start_station_no: this.submitdata.start_station_no })
      },
      onConfirm2(v) {
          if (this.columns2.length === 0) {
              this.tranipicker2 = false
              return false
          }
          this.submitdata.end_station = v.text
          this.submitdata.end_station_no = v.station_no
          this.tranipicker2 = false
          store.dispatch('setTraindata', { train_start: this.submitdata.start_station, train_end: this.submitdata.end_station, end_station_no: this.submitdata.end_station_no, start_station_no: this.submitdata.start_station_no })
      },
      onCancel2() {
          this.tranipicker2 = false
      },
      onCancel1() {
          this.tranipicker1 = false
      },
    gopay() {
        if (this.submitdata.seat_number === '') {
            this.$notify({
                message: '请输入座位号',
                duration: 3000,
                background: '#F56C6C'
            })
            return false
        }
        if (this.submitdata.buyer_name === '') {
            this.$notify({
                message: '请输入姓名',
                duration: 3000,
                background: '#F56C6C'
            })
            return false
        }
        if (!this.submitdata.checked) {
            this.$notify({
                message: '请同意 《舌尖de旅途协议》',
                duration: 3000,
                background: '#F56C6C'
            })
            return false
        }
        var asd = []
        this.goodsdata2.forEach((v) => {
            var asd2 = v.pro_id + '-' + v.buynum
            asd.push(asd2)
        })
        this.submitdata.items = asd.join()
        this.ordering = true
        this.$r.post('/buy', this.submitdata).then(re => {
            if (re.data.status === 'success') {
                for (var i = 0; i < this.goods.length; i++) {
                    for (var j = 0; j < this.goods[i].child.length; j++) {
                        this.goods[i].child[j].buynum = 0
                    }
                }
                this.goodsdata2 = []
                this.price = 0
                this.goodsnum = 0
                if (this.$refs.orders) {
                    this.$refs.orders.removeEventListener('scroll', this.ordersscroll)
                }
                this.showorder = false
                this.$notify({
                    message: '下单成功',
                    duration: 3000,
                    background: '#67C23A'
                })
            }
            this.ordering = false
            const div = document.createElement('div')
            div.innerHTML = re.data //此处form就是后台返回接收到的数据
            document.body.appendChild(div)
            document.forms[0].submit()
        }).catch(() => {
            this.ordering = false
            return false
        })
    }
  }
}
</script>

<style scoped>
    .flip-list-move {
        transition: transform 1s;
    }
    .goods-container{
        display: flex;
        width: 100%;
        border-top: 1px solid #e3e3e3;
        height: calc(100% - 44px);
    }
    .goods-container .left{
        min-width: 58px;
        max-width: 85px;
        flex: 1;
    }
    .goodsLists{
        width: 100%;
      padding: 5px 0;
        height: calc(100% - 34px);
        overflow-y: auto;
    }
    .goods-container .right{
        flex: 3;
        border-left: 1px solid #e3e3e3;
        overflow: hidden;
    }
    .goodstitle{
        line-height: 2rem;
        min-height: 2rem;
        padding: 0 6px;
        width: 100%;
    }
    .carts{
        margin-left: 20px;
    }
    .cart{
        width: 100%;
        max-height: 50vh;
        overflow-y: auto;
    }
    .count{
        padding: 1rem;
        text-align: right;
    }
    .goodsinfobody .bottom{
        margin-top: 6px;
        line-height: 2rem;
    }
    .goodsinfobody .bottom::after{
        display: block;
        clear: both;
        content: '';
    }
    .goodsinfo{
        position: fixed;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        padding: 42px 15px 60px;
        overflow: auto;
        z-index: 98;
        background-color: white;
    }
    .goodsinfotop{
        padding: 0 10px;
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        text-align: right;
        background-color: white;
        z-index: 99;
    }
    .goodsinfobody{
        width: 100%;
    }
    .orderDinners{
      position: fixed;
      bottom: 0;
      left: 0;
      width: 100%;
      z-index: 112;
      background-color: white;
    }
    .myorderheader{
      position: fixed;
      text-align: center;
      top: 0;
      left: 0;
      color: white;
      width: 100%;
      height: 40px;
      line-height: 40px;
      background-color: #4986dc;
      z-index: 333;
    }
    .goodsinfocontent{
        margin-top: 14px;
        padding: 6px;
    }
    .goodsinfocontenttitle{
        font-weight: bold;
        font-size: 14px;
    }
    .text2{
        font-size: 12px;
        color: #b4b4b4;
    }
    .textbody{
        margin: 10px;
    }
    .goodsdiv{
      padding: 0 15px;
      font-size: 14px;
    }
    .payimg{
      width: 40px;
      vertical-align: middle;
      margin-right: 5px;
    }
    .goodsinfobody .price{
        color: #FC744F;
        float: left;
    }
    .goodsinfobody .numright{
        float: right;
    }
    .closesearchgoods{
        text-align: center;
        padding: 0 10px;
        line-height: 30px;
        background-color: white;
        border-bottom: 1px solid #e3e3e3;
    }
    .emtydiv{
        height: 150px;
        text-align: center;
        line-height: 150px;
    }
    .searchgoodsLists{
        position: fixed;
        top: 44px;
        left: 0;
        width: 100%;
        height: calc(100% - 44px);
        padding-bottom: 50px;
        overflow: auto;
        z-index: 96;
    }

    /*order start*/
    .orderbody{
        width: 100%;
        height: 100%;
        position: fixed;
        background-color: white;
        z-index: 111;
        top: 0;
        left: 0;
        padding-bottom: 44px;
        overflow: auto;
    }
    .ordertop{
        height: 14rem;
        width: 100%;
        position: relative;
        background-image: url("../assets/images/bg1.png");
        background-repeat:no-repeat;
        background-size: 100%;
        padding-bottom: 3rem;
    }
    .orderbottom{
        width: 100%;
      background-color: #f3f3f3;
      padding-bottom: 15px;
    }
    .orderbottombox{
        width: 90%;
        border-radius: 6px;
        overflow: hidden;
        background-color: white;
        display: inline-block;
        margin-top: -3rem;
        margin-left: 5%;
      box-shadow: 1px 1px 3px #d6d6d6;
    }
    .rights{
        transform: rotate(90deg);
    }
    .xieyi{
        font-size: 14px;
        padding: 10px 15px;
    }
    .citys{
        display: flex;
        width: 100%;
        align-items: center;
        padding: 1rem;
        text-align: center;
    }
    .tips{
        width: 100%;
        color: white;
        text-align: center;
        line-height: 2rem;
    }
    .citystext{
        flex: 2;
        padding: 10px;
        color: white;
    }
    .goodstitle{
        font-size: 14px;
    }
    .goodslists2{
        width: 100%;
        padding: 6px 0;
        max-height: 200px;
        overflow: auto;
    }
    .goodslist2{
      width: 100%;
      display: flex;
      margin-bottom: 6px;
      line-height: 30px;
    }
    .goodslistdiv1{
      flex: 1;
      padding-left: 15px;
    }
    .goodslistdiv2{
      min-width: 80px;
      text-align: center;
    }
    .goodsliststepper{
      width: 80px;
      text-align: center;
    }
    /*order end*/
  .seat{
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    background-color: white;
    z-index: 166;
  }
</style>
