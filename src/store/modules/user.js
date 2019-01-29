import { loginByUsername, logout, getUserInfo, getTrainsinfo } from '../../api/login'
import { getToken, setToken, removeToken } from '../../utils/auth'

const user = {
  state: {
    user: '',
    status: '',
    code: '',
    token: '',
    name: '',
    type: '',
    avatar: '',
    introduction: '',
    roles: [],
    trip: {},
    userinfo: {},
      traindata: {
          train_start: '',
          start_station_no: '',
          train_end: '',
          end_station_no: ''
      },
      getfood: {
          carriage: 'A',
          date: '',
          seid: '',
          ssid: '',
          train: ''
      },
      scheduleid: {
          phone: '',
          scheduleId: ''
      },
    setting: {
      articlePlatform: []
    }
  },

  mutations: {
    SET_CODE: (state, code) => {
      state.code = code
    },
    SET_TOKEN: (state, token) => {
      state.token = token
    },
    SET_INTRODUCTION: (state, introduction) => {
      state.introduction = introduction
    },
    SET_SETTING: (state, setting) => {
      state.setting = setting
    },
    SET_STATUS: (state, status) => {
      state.status = status
    },
    SET_NAME: (state, name) => {
      state.name = name
    },
    SET_TYPE: (state, type) => {
      state.type = type
    },
    SET_AVATAR: (state, avatar) => {
      state.avatar = avatar
    },
    SET_ROLES: (state, roles) => {
      state.roles = roles
    },
    SET_TRIP: (state, trip) => {
      state.trip = trip
    },
    SET_USERINFO: (state, userinfo) => {
      state.userinfo = userinfo
    },
      SET_SCHEDULEID: (state, scheduleid) => {
          state.scheduleid = scheduleid
      },
      SET_TRAINDATA: (state, data) => {
          state.traindata = data
      },
      SET_GETFOOD: (state, getfood) => {
          state.getfood = getfood
      }
  },

  actions: {
    // 用户名登录
    LoginByUsername({ commit }, userInfo) {
      return new Promise((resolve, reject) => {
        loginByUsername(userInfo.phone, userInfo.password).then(response => {
          const data = response.data
          if (data.result) {
            commit('SET_TOKEN', data.result.access_token)
            setToken(response.data.result.access_token)
          }
          resolve(response)
        }).catch(error => {
          reject(error)
        })
      })
    },
      setScheduleid({ commit }, scheduleid) {
          commit('SET_SCHEDULEID', scheduleid)
      },
      setGetfood({ commit }, getfood) {
          commit('SET_GETFOOD', getfood)
      },
      setTraindata({ commit }, traindata) {
          commit('SET_TRAINDATA', traindata)
      },

    // 获取用户信息
    GetUserInfo({ commit }) {
      return new Promise((resolve, reject) => {
        getUserInfo(getToken()).then(response => {
          if (response.data.status !== 'success') { // 由于mockjs 不支持自定义状态码只能这样hack
            reject('error')
          }
          const data = response.data.result
          commit('SET_NAME', data.nickname || data.real_name || data.phone)
          commit('SET_AVATAR', data.avatar_url || '')
          commit('SET_USERINFO', data || {})
          resolve(response)
        }).catch(error => {
          reject(error)
        })
      })
    },
    // 获取火车行程信息
    GetTrainInfo({ commit }, params) {
      return new Promise((resolve, reject) => {
        getTrainsinfo(params).then(response => {
          if (response.data.status !== 'success') {
            reject('error')
          }
          const data = response.data.result
            commit('SET_TOKEN', data.access_token)
            commit('SET_TRIP', data.trip || {})
            setToken(response.data.result.access_token)
          getUserInfo(data.access_token).then(response2 => {
            if (response2.data.status !== 'success') {
              reject('error')
            }
            const data2 = response2.data.result
            commit('SET_NAME', data2.nickname || data2.real_name || data2.phone)
            commit('SET_AVATAR', data2.avatar_url || '')
            commit('SET_USERINFO', data2 || {})
            resolve(response)
          }).catch(error2 => {
            reject(error2)
          })
        }).catch(error => {
          reject(error)
        })
      })
    },
    // 登出
    LogOut({ commit, state }) {
      return new Promise((resolve, reject) => {
        logout(state.token).then(() => {
          commit('SET_TOKEN', '')
            commit('SET_NAME', '')
            commit('SET_AVATAR', '')
            commit('SET_USERINFO', {})
          removeToken()
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 前端 登出
    FedLogOut({ commit }) {
      return new Promise(resolve => {
        commit('SET_TOKEN', '')
          commit('SET_NAME', '')
          commit('SET_AVATAR', '')
          commit('SET_USERINFO', {})
        removeToken()
        resolve()
      })
    }
  }
}

export default user
