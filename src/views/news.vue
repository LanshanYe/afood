<template>
  <div class="app-container">
    <div class="recommendlists2">
      <div v-for="(it, index) in newslistdata" :key="index" class="recommendlist" @click="routeto(it)">
        <el-card :body-style="{padding: '5px'}" shadow="always">
          <div class="flexdiv">
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
    <transition name="el-zoom-in-bottom">
      <div v-show="shownewsinfo" class="newsinfobody">
        <div class="closenew">
          <van-icon name="clear" color="#a4a4a4" size="20px" @click="shownewsinfo = false" />
        </div>
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
  name: 'News',
  data() {
    return {
      isLoading: false,
      shownewsinfo: false,
      infos: {},
      newslistdata: []
    }
  },
  mounted() {
    this.$r.get('http://hcdc.ydxxtech.com/api/notice?type=2').then(re => {
      if (re.data.status === 'success' && re.data) {
        this.newslistdata = re.data.result
      }
    })
      if (this.$route.params.notice_id) {
        this.routeto(this.$route.params)
      }
  },
  methods: {
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
    .closenew{
      width: 100%;
      height: 40px;
      padding: 10px;
      text-align: right;
      position: fixed;
      background-color: #fff;
      top: 0;
      left: 0;
      z-index: 112;
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
