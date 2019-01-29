import request from '../utils/request'

export function loginByUsername(phone, password) {
  const data = {
    phone: phone,
    password: password
  }
  return request({
    url: 'http://hcdc.ydxxtech.com/api/login',
    method: 'post',
    data: data
  })
}

export function logout() {
  return request({
    url: 'http://hcdc.ydxxtech.com/api/loginout',
    method: 'get'
  })
}

export function getUserInfo() {
  return request({
    url: 'http://hcdc.ydxxtech.com/api/info',
    method: 'get'
  })
}

export function getTrainsinfo(params) {
  var pas = {}
  for (var p in params) {
    if (params[p] !== '') {
      pas[p] = params[p]
    }
  }
  return request({
    url: 'http://hcdc.ydxxtech.com/api/synchronization',
    method: 'get',
      params: pas
  })
}
