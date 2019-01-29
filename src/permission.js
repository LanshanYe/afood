import router from './router'
import store from './store'
import { Notify } from 'vant'
import { getToken } from '@/utils/auth' // getToken from cookie

router.beforeEach((to, from, next) => {
  if (to.meta.promise) {
    if (getToken()) { // determine if there has token
      /* has token*/
      if (store.getters.userinfo.phone) {
        next()
      } else {
        store.dispatch('GetUserInfo').then(() => { // 拉取user_info
          next()
        }).catch((err) => {
          store.dispatch('FedLogOut').then(() => {
            Notify({
              message: err || '请重新登录',
              duration: 3000,
              background: '#F56C6C'
            })
            next({ path: '/login?from=' + to.path })
          }).catch(() => {
            next({ path: '/login?from=' + to.path })
          })
        })
      }
    } else {
      next('/login?from=' + to.path) // 否则全部重定向到登录页
    }
  } else {
    next()
  }
})
