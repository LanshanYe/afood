const getters = {
  url: state => state.app.url,
  carnum: state => state.app.carnum,
  scheduleid: state => state.user.scheduleid,
  trip: state => state.user.trip,
  traindata: state => state.user.traindata,
    getfood: state => state.user.getfood,
  device: state => state.app.device,
  token: state => state.user.token,
  avatar: state => state.user.avatar,
  name: state => state.user.name,
  userinfo: state => state.user.userinfo,
  introduction: state => state.user.introduction,
  status: state => state.user.status,
  roles: state => state.user.roles,
  setting: state => state.user.setting
}
export default getters
