import Vue from 'vue'
import App from './App.vue'
import myaxios from './utils/request'
import mymd5 from 'js-md5'
import router from './router'
import store from './store'
import Vant from 'vant'
import { Lazyload } from 'vant'
import 'vant/lib/index.css'
import '@/assets/css/allcss.css'
import './plugins/element.js'

import './permission'

Vue.use(Vant)
Vue.use(Lazyload, {loading: require('./assets/images/imgload.png'), error: require('./assets/images/imgerror.png')})
Vue.prototype.$r = myaxios
Vue.prototype.$md5 = mymd5
Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
