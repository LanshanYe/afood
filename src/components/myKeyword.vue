<template>
  <transition name="el-zoom-in-bottom">
    <div class="keyword bordertop">
      <div class="title borderbottom">
        <div class="titleleft">当前车次：<span class="titletext">{{ values }}</span></div>
        <div class="titleright" @click.stop.prevent="closeword">
          <van-icon name="arrow-down" />
        </div>
        <div class="clears"/>
      </div>
      <div class="abcline">
        <div v-for="(it, index) in abckeywords" :key="index" :class="curkey===index?'bgs':''" class="abckey" @click.stop.prevent="keyclick(it)">
          {{ it.value }}
        </div>
        <div class="abckey2" @click.stop.prevent="keyclick({value: '退格'})">
          <img src="../assets/images/backs.png" class="backs" alt="">
        </div>
        <div class="clears"/>
      </div>
      <div>
        <div v-for="(it, index) in numberkeywords" :key="index" :class="index===11?'numkey2':'numkey'" @click.stop.prevent="keyclick(it)">
          {{ it.value }}
        </div>
        <div class="clears"/>
      </div>
    </div>
  </transition>
</template>

<script>
export default {
  name: 'MyKeyword',
  props: {
    values: {
      type: String,
      default: ''
    },
    curkey: {
        type: null,
        default: ''
    }
  },
  data() {
    return {
      numberkeywords: [
        { value: '7' }, { value: '8' }, { value: '9' }, { value: '0' },
        { value: '4' }, { value: '5' }, { value: '6' }, { value: '清空' },
        { value: '1' }, { value: '2' }, { value: '3' }, { value: '确认' }
      ],
      rightkeywords: [],
      abckeywords: [
        { value: 'C', inx: 0 }, { value: 'D', inx: 1 }, { value: 'G', inx: 2 }
      ]
    }
  },
  methods: {
    keyclick(t) {
      this.$emit('keyclick', t)
    },
    closeword() {
      this.$emit('close', false)
    }
  }
}
</script>

<style scoped>
    .keyword{
        position: fixed;
        border-left: 1px solid #e3e3e3;
        bottom: 0;
        left: 0;
        width: 100%;
        z-index: 222;
        background-color: #fff;
    }
    .keyword .title{
        line-height: 40px;
    }
    .keyword .titleleft{
        width: 75%;
        padding: 0 15px;
        float: left;
    }
    .keyword .titleright{
        width: 25%;
        text-align: center;
        border-left: 1px solid #e3e3e3;
        border-right: 1px solid #e3e3e3;
        float: left;
    }
    .titletext{
        color: #FD7251;
        letter-spacing: 3px;
    }
    .numkey{
        width: 25%;
        line-height: 50px;
        height: 50px;
        float: left;
        border-bottom: 1px solid #e3e3e3;
        border-right: 1px solid #e3e3e3;
        text-align: center;
    }
    .numkey2{
      width: 25%;
      height: 50px;
      line-height: 50px;
      float: left;
      border-bottom: 1px solid #e3e3e3;
      border-right: 1px solid #e3e3e3;
      text-align: center;
      background-color: #FC744F;
      color: white;
    }
    .numkey2:active{
      background-color: red;
    }
    .numkey:active, .abckey:active, .abckey2:active{
        background-color: #bfbfbf;
    }
    .backs{
      width: 30px;
      margin-top: 10px;
    }
    .abckey{
        width: 25%;
        float: left;
        line-height: 50px;
        height: 50px;
        border-bottom: 1px solid #e3e3e3;
        border-right: 1px solid #e3e3e3;
        position: relative;
        text-align: center;
      color: #FC744F;
    }
    .abckey.bgs{
      color: white;
      background-color: #FC744F;
    }
  .abckey2{
    width: 25%;
    font-size: 0;
    float: left;
    height: 50px;
    border-bottom: 1px solid #e3e3e3;
    border-right: 1px solid #e3e3e3;
    position: relative;
    text-align: center;
  }
</style>
