//app.js
const util = require('./utils/util.js');  



App({

  globalData: {
    loginCode: '',
    openId: '', // 当前用户id
    shareTicket: '',
    userInfo: 'userInfo',
    currentNickName: '',
    currentAvatarUrl: '',
    _openGid: '',
    appId: 'wxb1684ec13bc817a2',
    secret: '5081037841224b432acdf97f12a0b755', //TODO：不要放在客户端
  },

  onLaunch: function (options) {
    wx.clearStorage()

    wx.cloud.init({
      env: 'activity-helper-qrr7r',
      traceUser: true
    })
  },

  onShow: function (options) {
    var that = this

    let shareTicket = options.shareTicket
    console.log("app shareTicket: ", shareTicket)

    if (shareTicket) {
      this.globalData.shareTicket = shareTicket

    } else {

      this.getLoginCode(function () {
        // call back
      })

    }
  },

  redirectToHomePage() {
    wx.redirectTo({
      url: '/pages/grouplist/grouplist',
    })
  },

  getLoginCode(successCallBack) {
    let that = this

    wx.login({
      success: function (res) {
        console.log('获取login code成功: ' + res.code)
        that.globalData.loginCode = res.code

        that.getOpenId(successCallBack)
      }
    })
  },

  getOpenId(successCallBack) {
    let that = this

    wx.cloud.callFunction({
      name: 'get_openid',

      complete: res => {
        console.log('获取openId成功: ', res.result.openId)
        that.globalData.openId = res.result.openId

        typeof successCallBack == "function" && successCallBack()
      }
    })
  },

})
