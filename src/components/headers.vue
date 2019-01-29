<template>
  <div>
    <van-nav-bar
      class="navheader borderbottom"
      :title="title"
      :left-arrow="true"
      @click-left="onClickLeft"
    />
  </div>
</template>

<script>
export default {
  name: 'Headers',
  props: {
    title: {
      type: String,
      default: '标题'
    }
  },
  data() {
    return {

    }
  },
  methods: {
    onClickLeft() {
      this.$router.back()
    }
  }
}
</script>

<style scoped>
</style>
