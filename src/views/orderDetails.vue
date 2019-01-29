<template>
  <div class="app-container">
    <div class="orderbody">
      <van-tabs v-model="active" class="orderdiv" swipeable animated @change="onClick">
        <van-tab v-for="(it, index) in tabdata" :key="index" :title="it.name">
          <div class="orderbox bordertop">
            <div v-for="(it, index) in orderlist" v-show="orderlist.length > 0" :key="index" class="aorder">
              <van-row class="lineheight2rem" type="flex">
                <div class="titleleft">
                  订餐人：{{ it.buyer_name }}
                </div>
                <div class="titleright statuscolor">{{ orderstate[it.order_status - 1] }}</div>
              </van-row>
              <van-row class="lineheight2rem ordertitle">
                {{ it.train_number + ' ' + it.start_station + '→' + it.end_station + ' ' + it.seat_number }}
              </van-row>
              <div v-for="(item, inx) in it.detail" :key="inx" class="agoodrow" @click="getinfo(it.order_id)">
                <van-row type="flex">
                  <van-col class="aorderleft">
                    <img :src="item.goods_cover" alt="">
                  </van-col>
                  <van-col class="aorderright">
                    <van-row type="flex" justify="space-between">
                      <van-col>{{ item.goods_title }}</van-col>
                      <van-col>×{{ item.goods_num }}</van-col>
                    </van-row>
                    <div class="lineheight2rem statuscolor">¥{{ item.goods_price }}/份</div>
                  </van-col>
                </van-row>
              </div>
              <van-row class="aorderbottom bordertop">
                <van-col span="18" class="statuscolor">合计：¥{{ it.total_price }}</van-col>
                <van-col span="6"><el-button v-if="it.order_status===2" size="mini" class="noticebtn" plain type="danger" @click="noticing(it)">退款</el-button></van-col>
                <van-col span="6"><el-button v-if="it.order_status===1" size="mini" class="noticebtn" plain type="primary" @click="paying(it)">支付</el-button></van-col>
                <van-col span="6"><el-button v-if="it.order_status===3" size="mini" class="noticebtn" plain type="primary" @click="noticing2(it)">确认收货</el-button></van-col>
              </van-row>
            </div>
            <div v-show="orderlist.length <= 0" class="empydiv">
              - 暂无订单 -
            </div>
          </div>
        </van-tab>
      </van-tabs>
    </div>
    <transition name="el-zoom-in-bottom">
      <div v-show="showorderinfo" class="infogoods">
        <div class="infogoodsbody">
          <div class="titles">
            订单详情
            <div class="orderclose">
              <van-icon name="close" color="#fff" size="20px" style="line-height: 2rem" @click="showorderinfo = false" />
            </div>
          </div>
          <div class="orderstatus">
            {{ orderstate[orderdata.order_status - 1] }}
          </div>
        </div>
        <div class="orderuser">
          <van-row type="flex">
            <div style="width: 60px;height: 60px;">
              <img src="../assets/images/address.png" style="width: 30px;margin-top: 15px;margin-left: 15px" alt="">
            </div>
            <div style="flex: 1;line-height: 30px">
              <p>{{ orderdata.buyer_name + ' ' + orderdata.buyer_phone }}</p>
              <p>{{ orderdata.train_number + ' ' + orderdata.start_station + '→' + orderdata.end_station + ' ' + orderdata.seat_number }}</p>
            </div>
          </van-row>
        </div>
        <div class="infomiddel">
          <div v-for="(item, inx) in orderdata.order_detail" :key="inx" class="agoodrow borderbottom infoagoodrow">
            <van-row type="flex">
              <van-col class="aorderleft2">
                <img :src="item.goods_cover" alt="">
              </van-col>
              <van-col class="aorderright goodsinfo">
                <van-row>
                  {{ item.goods_title }}
                </van-row>
                <van-row type="flex">
                  <div class="statuscolor infoprice">¥{{ item.goods_price }}/份</div>
                  <div class="infonum">×{{ item.goods_num }}</div>
                </van-row>
              </van-col>
            </van-row>
          </div>
          <div class="persons">
            <van-row type="flex">
              <div class="infoprice">餐具数量</div>
              <div class="infonum">×{{ orderdata.person }}</div>
            </van-row>
          </div>
        </div>
        <div class="orderinfos">
          <div class="orderinfostitle">
            订单信息
          </div>
          <van-cell-group>
            <van-field v-model="orderdata.order_id" input-align="right" readonly label="订单编号" />
            <van-field v-model="orderdata.created_at" input-align="right" readonly label="下单时间" />
            <van-field v-model="orderdata.buyer_remark" type="textarea" autosize input-align="right" readonly label="备注" />
          </van-cell-group>
        </div>
        <div class="orderinfobottom bordertop">
          <div class="orderinfobottomleft">
            合计：¥ <span class="statuscolor" style="font-size: 24px">{{ orderdata.total_price }}</span>
          </div>
          <div class="orderinfobottomright">
            <el-button v-if="orderdata.order_status===2" type="danger" plain size="mini" @click="noticing(orderdata)">退款</el-button>
            <el-button v-if="orderdata.order_status===1" type="primary" plain size="mini" @click="paying(orderdata)">支付</el-button>
            <el-button v-if="orderdata.order_status===3" type="primary" plain size="mini" @click="noticing2(orderdata)">确认收货</el-button>
          </div>
          <div class="clears"/>
        </div>
      </div>
    </transition>
    <transition name="el-zoom-in-bottom">
      <div v-show="showpaybox" class="paybox" @click.stop.prevent="payboxclick">
        <div class="paydiv">
          <!--<van-row class="payline">-->
            <!--<van-col offset="2" span="4">-->
              <!--<img src="../assets/images/ic_wechat.png" class="payimg" alt="">-->
            <!--</van-col>-->
            <!--<van-col offset="2" span="10">-->
              <!--微信支付-->
            <!--</van-col>-->
            <!--<van-col span="6">-->
              <!--<el-radio v-model="orderdata.pay_type" size="large" label="wechat"></el-radio>-->
            <!--</van-col>-->
          <!--</van-row>-->
          <van-row class="payline bordertop">
            <van-col offset="2" span="4">
              <img src="../assets/images/ic_alipay.png" class="payimg" alt="">
            </van-col>
            <van-col offset="2" span="10">
              支付宝支付
            </van-col>
            <van-col span="6">
              <el-radio v-model="orderdata.pay_type" size="large" label="alipay"></el-radio>
            </van-col>
          </van-row>
          <van-button :loading="payloading" size="large" style="background-color: #FD7251;color: white" @click="pays">确认支付</van-button>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import { Loading } from 'element-ui'
export default {
  name: 'OrderDetails',
  data() {
    return {
      active: 0,
      tabdata: [
        { name: '全部', api: '/all' },
        { name: '待付款', api: '/wait_pay' },
        { name: '待配送', api: '/wait_send' },
        { name: '待收货', api: '/wait_receive' },
        { name: '已完成', api: '/finished' }
      ],
      orderlist: [],
      orderstate: ['待支付', '待配送', '待收货', '已收货', '已完成', '已退款'],
      orderdata: {},
        getinfoing: false,
      showorderinfo: false,
        payloading: false,
        showpaybox: false
    }
  },
  mounted() {
    this.getorder('/all')
  },
  methods: {
    noticing(t) {
        this.$dialog.confirm({
            title: '退款',
            message: '您确定要退款？'
        }).then(() => {
            this.$r.post('http://hcdc.ydxxtech.com/api/refund/' + t.order_id).then(re => {
                if (re.data.status === 'success') {
                    this.onClick(this.active)
                    this.$notify({
                        message: '退款成功',
                        duration: 3000,
                        background: '#67C23A'
                    })
                }
            }).catch(() => {
                this.$notify({
                    message: '出错了，请刷新页面',
                    duration: 3000,
                    background: '#F56C6C'
                })
                return false
            })
        }).catch(() => {
            return false
        })
    },
    noticing2(t) {
        this.$dialog.confirm({
            title: '收货',
            message: '您已确认收货吗？'
        }).then(() => {
            this.$r.post('http://hcdc.ydxxtech.com/api/receive/' + t.order_id).then(re => {
                if (re.data.status === 'success') {
                    this.onClick(this.active)
                    this.$notify({
                        message: '收货成功',
                        duration: 3000,
                        background: '#67C23A'
                    })
                }
            }).catch(() => {
                this.$notify({
                    message: '出错了，请刷新页面',
                    duration: 3000,
                    background: '#F56C6C'
                })
                return false
            })
        }).catch(() => {
            return false
        })
    },
    paying(t) {
        this.showpaybox = true
        this.orderdata = t
    },
      pays() {
        this.payloading = true
        this.$r.post('http://hcdc.ydxxtech.com/api/payOrder/' + this.orderdata.order_id, { pay_type: this.orderdata.pay_type, is_web: 1 }).then(re => {
            if (re.data) {
                const div = document.createElement('div')
                div.innerHTML = re.data //此处form就是后台返回接收到的数据
                document.body.appendChild(div)
                document.forms[0].submit()
            }
            this.payloading = false
        }).catch(errs => {
            console.log(errs)
            this.payloading = false
        })
      },
    getorder(status) {
      this.$r.get('http://hcdc.ydxxtech.com/api/myOrder' + status).then(re => {
        this.orderlist = re.data.data
      }).catch(() => {
        return false
      })
    },
    getinfo(it) {
      if (this.getinfoing) {
          return false
      }
      this.getinfoing = true
      this.$r.get('http://hcdc.ydxxtech.com/api/order/' + it).then(re => {
        this.orderdata = re.data.result
        this.showorderinfo = true
        this.getinfoing = false
      }).catch(() => {
        this.getinfoing = false
        return false
      })
    },
      payboxclick(e) {
          if (e.target.className === 'paybox') {
              this.showpaybox = false
          }
      },
    onClick(i) {
      var aloading = Loading.service({
        target: '.van-tabs__content',
        lock: true,
        fullscreen: false
      })
      this.$r.get('http://hcdc.ydxxtech.com/api/myOrder' + this.tabdata[i].api).then(re => {
        this.orderlist = re.data.data
        aloading.close()
      }).catch(() => {
        aloading.close()
      })
    }
  }
}
</script>

<style scoped>
    .orderbody{
        padding-top: 40px;
        width: 100%;
      height: 100%;
      padding-bottom: 50px;
    }
    .orderdiv{
      width: 100%;
      height: 100%;
    }
    .orderbox{
      width: 100%;
      height: 100%;
      overflow: auto;
      padding: 10px 10px 0 10px;
      background-color: #f3f3f3;
    }
    .ordertitle{
      font-size: 14px;
      color: #535353;
    }
    .agoodrow{
      margin-top: 5px;
      margin-bottom: 5px;
      max-height: 300px;
      overflow-y: auto;
    }
    .aorder{
      width: 100%;
      padding: 10px 10px 0;
      position: relative;
      border-radius: 8px;
      margin-bottom: 10px;
      box-shadow: 1px 1px 6px #d6d6d6;
      background-color: white;
    }
    .infomiddel{
      margin: 10px 0;
      padding: 5px 20px;
      background-color: white;
    }
    .empydiv{
        line-height: 100px;
        text-align: center;
    }
    .noticebtn{
        width: 100%;
        padding: 7px 0;
        text-align: center;
    }
    .aorderleft{
      width: 50px;
      font-size: 0;
      overflow: hidden;
    }
    .aorderleft img{
      width: 100%;
    }
    .aorderleft2{
      width: 100px;
      font-size: 0;
      overflow: hidden;
    }
    .aorderleft2 img{
      width: 100%;
    }
    .aorderright{
      padding: 0 6px;
      font-size: 14px;
      line-height: 24px;
      flex: 1;
    }
  .paybox{
    position: fixed;
    width: 100%;
    height: 100%;
    left: 0;
    top: 0;
    z-index: 266;
    background-color: rgba(0,0,0,.5);
  }
  .aorderbottom{
    line-height: 48px;
    margin: 6px 0;
  }
  .paydiv{
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    background-color: white;
  }
  .infoagoodrow{
    padding-bottom: 10px;
  }
  .statuscolor{
    color: #e00025;
    font-family:"\9ED1\4F53"
  }
  .payline{
    line-height: 80px;
  }
  .titleleft{
    flex: 1;
  }
  .titleright{
    width: 60px;
    text-align: right;
  }
  .payimg{
    vertical-align: middle;
    width: 40px;
  }
  .titles{
    width: 100%;
    line-height: 32px;
    position: fixed;
    top: 0;
    left: 0;
    z-index: 212;
    background-color: #FD7251;
    padding: 6px 20px;
    text-align: center;
  }
  .orderstatus{
    line-height: 50px;
    margin-top: 15px;
  }
  .persons{
    line-height: 40px; font-size: 14px;padding: 0 6px;
  }
  .goodsinfo{
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }
    .infogoods{
      width: 100%;
      position: fixed;
      left: 0;
      top: 0;
      padding-bottom: 50px;
      background-color: #f3f3f3;
      height: 100%;
      overflow: auto;
      z-index: 211;
    }
    .infogoodsbody{
      width: 100%;
      color: white;
      background-color: #FD7251;
      padding: 38px 20px 6px;
    }
  .orderclose{
    width: 20px;
    height: 100%;
    position: absolute;
    right: 20px;
    top: 6px;
    overflow: hidden;
  }
  .orderuser{
    padding: 15px 5px;
    font-size: 14px;
    background-color: white;
  }
  .infonum{
    flex: 1;
    text-align: right;
  }
  .infoprice{
    flex: 1;
  }
  .orderinfos{
    position: relative;
    background-color: white;
  }
  .orderinfobottom{
    height: 50px;
    line-height: 50px;
    width: 100%;
    position: fixed;
    left: 0;
    bottom: 0;
    z-index: 212;
    padding: 0 15px;
    background-color: white;
  }
  .orderinfostitle{
    height: 40px;
    line-height: 40px;
    padding: 0 15px;
    font-size: 14px;
    font-weight: bold;
  }
  .orderinfostitle:before{
    content: '';
    position: absolute;
    left: 8px;
    top: 11px;
    width: 2px;
    height: 16px;
    background-color: #f16b58;
  }
  .orderinfobottomleft{
    float: left;
  }
  .orderinfobottomright{
    float: right;
  }
</style>
