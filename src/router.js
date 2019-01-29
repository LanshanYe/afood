import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home.vue'
import Login from './views/Login.vue'
import Register from './views/Register.vue'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'home',
      meta: { zhname: '首页', index: 0, promise: false, tabbarshow: true },
      component: Home
    },
    {
      path: '/layout',
      name: 'layout',
      component: () => import('./views/layout.vue'),
      children: [
        {
          path: 'orderDetails',
          name: 'orderDetails',
          meta: {
            zhname: '订单',
            index: 92, promise: true, tabbarshow: true
          },
          component: () => import('./views/orderDetails.vue')
        },
        {
          path: 'news',
          name: 'news',
          meta: {
            zhname: '资讯',
            index: 100, promise: false, tabbarshow: false
          },
          component: () => import('./views/news.vue')
        },
        {
          path: 'personelnews',
          name: 'personelnews',
          meta: {
            zhname: '消息',
            index: 91, promise: false, tabbarshow: true
          },
          component: () => import('./views/personelnews.vue')
        },
        {
          path: 'foods',
          name: 'foods',
          meta: {
            zhname: '美食',
            index: 100, promise: false, tabbarshow: false
          },
          component: () => import('./views/foods.vue')
        },
        {
          path: 'place',
          name: 'place',
          meta: {
            zhname: '旅游景点',
            index: 100, promise: false, tabbarshow: false
          },
          component: () => import('./views/place.vue')
        },
        {
          path: 'developing',
          name: 'developing',
          meta: {
            zhname: '开发中。。。',
            index: 100, promise: false, tabbarshow: false
          },
          component: () => import('./components/developing.vue')
        }
      ]
    },
    {
      path: '/goods',
      name: 'goods',
      meta: {
        zhname: '订餐',
        index: 10, promise: true, tabbarshow: false
      },
      component: () => import('./views/Goods.vue')
    },
    {
      path: '/forgetPassword',
      name: 'forgetPassword',
      meta: {
        zhname: '忘记密码',
        index: 100, promise: false, tabbarshow: false
      },
      component: () => import('./views/forgetPassword.vue')
    },
      {
          path: '/setting',
          name: 'setting',
          meta: {
              zhname: '设置',
              index: 93, promise: false, tabbarshow: true
          },
          component: () => import('./views/setting.vue')
      },
    // {
    //     path: '/Shop',
    //     name: 'Shop',
    //     meta: {
    //         zhname: '商铺',
    //         index: 9, promise: true
    //     },
    //     component: () => import('./views/Shop.vue')
    // },
    {
      path: '/Login',
      name: 'Login',
      meta: { index: 20, promise: false, zhname: '登录', tabbarshow: false },
      component: Login
    },
    {
      path: '/Register',
      name: 'Register',
      meta: { index: 21, promise: false, zhname: '注册', tabbarshow: false },
      component: Register
    }
  ]
})
