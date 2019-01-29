const app = {
  state: {
    device: 'desktop',
    url: '',
    carnum: ''
  },
  mutations: {
    TOGGLE_DEVICE: (state, device) => {
      state.device = device
    },
    SET_URL: (state, url) => {
      state.url = url
    },
    SET_CARNUM: (state, carnum) => {
      state.carnum = carnum
    }
  },
  actions: {
    toggleDevice({ commit }, device) {
      commit('TOGGLE_DEVICE', device)
    },
    setUrl({ commit }, url) {
      commit('SET_URL', url)
    },
    setCarnum({ commit }, carnum) {
      commit('SET_CARNUM', carnum)
    }
  }
}

export default app
