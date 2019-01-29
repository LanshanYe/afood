import axios from 'axios'
import store from '../store'
import { Notify } from 'vant'
import { getToken } from './auth'

function getscheduleid(params) {
  var datas = {
      scheduleId: '',
      phone: ''
  }
  if (params) {
    var idinx = params.indexOf('scheduleId=')
    var phonex = params.indexOf('phone=')
    if (idinx !== -1) {
      var params2 = params.substr(idinx)
      var inx2 = params2.indexOf('&')
      if (inx2 !== -1) {
          datas.scheduleId = parseInt(params2.substr(0, inx2).split('=')[1])
      } else {
          datas.scheduleId = parseInt(params2.split('=')[1])
      }
    }
    if (phonex !== -1) {
      var params3 = params.substr(phonex)
      var phonex2 = params3.indexOf('&')
      if (phonex2 !== -1) {
          datas.phone = parseInt(params3.substr(0, phonex2).split('=')[1])
      } else {
          datas.phone = parseInt(params3.split('=')[1])
      }
    }
  }
  return datas
}
const url = window.location.href.split('#')[0]
if (window.location.href.indexOf('?') >= 0 ) {
    store.dispatch('setScheduleid', getscheduleid(window.location.href.split('?')[1]))
}

let apiUrl = ''
if (url.indexOf('v3i.minicart.cn') !== -1) {
    apiUrl = 'http://v3i.minicart.cn'
} else {
  if (url.indexOf('hcdc.ydxxtech.com') !== -1) {
    apiUrl = 'http://hcdc.ydxxtech.com/api'
  } else {
    apiUrl = '/api'
  }
}

if (apiUrl === '/api') {
  store.dispatch('setUrl', 'http://v3i.minicart.cn')
} else {
  store.dispatch('setUrl', apiUrl)
}
// create an axios instance
const service = axios.create({
  baseURL: apiUrl, // api 的 base_url
  timeout: 30000 // request timeout
})

// request interceptor
service.interceptors.request.use(
  config => {
    // Do something before request is sent
    console.log(config)
    if (getToken()) {
      // 让每个请求携带token-- ['X-Token']为自定义key 请根据实际情况自行修改
      config.headers['Authorization'] = 'Bearer ' + getToken()
    }
    return config
  },
  error => {
    // Do something with request error
    // for debug
    Promise.reject(error)
  }
)

// response interceptor
service.interceptors.response.use(
  response => {
    if (response) {
      if (response.data) {
        if (response.data.error_code) {
          if (response.data.error_code !== 'ok') {
              Notify({
                  message: response.data.msg || '出错了',
                  duration: 5000,
                  background: '#F56C6C'
              })
          }
        }
      }
    }
    return Promise.resolve(response)
  },
  error => {
    if (error.response) {
      if (error.response.status === 401) {
        store.dispatch('FedLogOut').then(() => {
          location.reload() // 为了重新实例化vue-router对象 避免bug
        })
      } else if (error.response.status === 500) {
        Notify({
          message: '服务器错误',
          duration: 3000,
          background: '#F56C6C'
        })
      }
    }
    return Promise.reject(error)
  }
)

export default service
