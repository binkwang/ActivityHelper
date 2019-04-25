//app.js
const util = require('./utils/util.js');  
App({

  globalData: {
    userInfo: "userInfo",
    currentNickName: '',
    currentAvatarUrl: '',
    openId: '',
    appid: 'wxb1684ec13bc817a2',
    secret: '5081037841224b432acdf97f12a0b755', //TODO：不要放在客户端
  },

  onLaunch: function () {
    wx.clearStorage()

    //云开发初始化
    wx.cloud.init({
      env: 'activity-helper-qrr7r',
      traceUser: true
    })

    this.getOpenId()

  },

  getOpenId() {
    let that = this;

    wx.cloud.callFunction({
      name: 'get_openid',
      complete: res => {
        console.log('云函数获取到的openId: ', res.result.openId)
        that.globalData.openId = res.result.openId
      }
    })
  },
})