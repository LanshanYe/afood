<template>
  <div class="app-container">
    <van-pull-refresh v-model="isLoading" class="refreshbody paddingHo" @refresh="onRefresh">
      <div v-for="(it, index) in newslistdata" :key="index" class="rownew" @click="routeto(it)">
        <van-row gutter="10" class="borderbottom">
          <van-col span="6">
            <img :src="it.cover" class="newimgs" alt="">
          </van-col>
          <van-col span="18">
            <p class="newstitle">{{ it.title }}</p>
            <p class="newsabstract">{{ it.abstract }}</p>
            <p class="newstime">{{ it.created_at }}</p>
          </van-col>
        </van-row>
      </div>
    </van-pull-refresh>
    <transition name="el-zoom-in-bottom">
      <div v-show="shownewsinfo" class="newsinfobody">
        <van-icon name="clear" color="#a4a4a4" size="20px" class="close" @click="shownewsinfo = false" />
        <div class="newsinfoimg">
          <img :src="infos.cover || ''" alt="">
        </div>
        <p style="color: #FC744F;line-height: 3rem;text-align: right">发布于{{ infos.created_at || '' }}</p>
        <div class="content">
          {{ infos.title || '' }}
        </div>
        <div class="contents" v-html="infos.content" />
      </div>
    </transition>
  </div>
</template>

<script>
export default {
  name: 'Personelnews',
  data() {
    return {
      isLoading: false,
      shownewsinfo: false,
      infos: {},
      newslistdata: []
    }
  },
  mounted() {
    this.$r.get('http://hcdc.ydxxtech.com/api/notice?type=1').then(re => {
      if (re.data.status === 'success' && re.data) {
        this.newslistdata = re.data.result
      }
    }).catch(() => {
      return false
    })
  },
  methods: {
    onRefresh() {
      this.$r.get('http://hcdc.ydxxtech.com/api/notice?type=1').then(re => {
        if (re.data.status === 'success' && re.data) {
          this.newslistdata = re.data.result
          this.$notify({
            message: '刷新成功',
            duration: 3000,
            background: '#67C23A'
          })
        }
        this.isLoading = false
      }).catch(() => {
        this.isLoading = false
      })
    },
    routeto(t) {
        this.$r.get('http://hcdc.ydxxtech.com/api/notice/' + t.notice_id).then(re => {
            this.shownewsinfo = true
            this.infos = re.data.result
        })
    }
  }
}
</script>

<style scoped>
    .newimgs{
        width: 100%;
        max-height: 100px;
    }
    .paddingHo{
        padding-left: 10px;
        padding-right: 10px;
    }
    .newstitle{
        line-height: 22px;
    }
    .newsabstract{
        font-size: 14px;
        line-height: 22px;
    }
    .newstime{
        text-align: right;
        font-size: 12px;
        color: #909090;
    }
    .rownew{
        padding: 10px 0;
    }
    .content{
        font-size: 18px;
        text-align: center;
        line-height: 30px;
    }
    .contents{
        font-size: 14px;
        text-indent: 28px;
        line-height: 20px;
    }
    /*newsinfo start*/
    .newsinfobody{
        width: 100%;
        height: 100%;
        overflow: auto;
        position: fixed;
        z-index: 111;
        background-color: white;
        top: 0;
        left: 0;
        padding: 40px 10px 10px;
        font-size: 14px;
    }
    .newsinfoimg{
        text-align: center;
        width: 100%;
        max-height: 30vh;
        overflow: hidden;
    }
    .newsinfoimg img{
        width: 100%;
    }
    /*newsinfo end*/

</style>
