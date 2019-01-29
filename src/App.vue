<template>
  <div id="app">
    <transition :name="transitionName">
      <router-view />
    </transition>
    <tabbar v-show="$route.meta.tabbarshow"></tabbar>
  </div>
</template>
<script>
import tabbar from '@/components/tabbar.vue'
export default {
  name: 'App',
  data() {
    return {
      transitionName: 'slide-left'
    }
  },
    components: {
      tabbar
    },
  watch: {// 使用watch 监听$router的变化
    $route(to, from) {
      // 如果to索引大于from索引,判断为前进状态,反之则为后退状态
      if (to.meta.index > from.meta.index) {
        // 设置动画名称
        this.transitionName = 'slide-left'
      } else {
        this.transitionName = 'slide-right'
      }
    }
  }
}
</script>
<style>
  #app{
    position: relative;
    width: 100%;
    height: 100%;
  }
</style>
