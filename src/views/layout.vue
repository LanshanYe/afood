<template>
  <div class="app-container">
    <headers :title="$route.meta.zhname || ''" />
    <keep-alive>
      <router-view />
    </keep-alive>
  </div>
</template>

<script>
import headers from '@/components/headers.vue'
export default {
  name: 'Navititle',
  components: {
    headers
  }
}
</script>

<style scoped>
</style>
