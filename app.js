//app.js
const util = require('./utils/util.js');  
App({

  globalData: {
    userInfo: "userInfo",
    currentNickName: '',
    currentAvatarUrl: '',
    openId: '',
    openGid: '',
    shareTicket: '',
    appid: 'wxb1684ec13bc817a2',
    secret: '5081037841224b432acdf97f12a0b755', //TODO：不要放在客户端
  },

  onLaunch: function (options) {
    wx.clearStorage()

    //云开发初始化
    wx.cloud.init({
      env: 'activity-helper-qrr7r',
      traceUser: true
    })

    this.getOpenId()

  },

  onShow: function (options) {
    if (options && options.shareTicket) {
      console.log("options.shareTicket: ", options.shareTicket)
      this.globalData.shareTicket = options.shareTicket

      // this.getShareInfo(options.shareTicket)
    }
  },

  // getShareInfo(shareTicket) {

  getShareTiket: function (cb) {
    let that = this

    if (that.globalData.shareTicket) {

      wx.getShareInfo({
        shareTicket: that.globalData.shareTicket,
        success: function (res) {
          console.log('打印 getShareInfo:' + JSON.stringify(res))
          //获取encryptedData、iv
          let js_encryptedData = res.encryptedData
          let js_iv = res.iv
          wx.login({
            success: function (res) {
              //获取code
              console.log('打印 login code: ' + res.code)

              //调用云函数，破解opengid
              wx.cloud.callFunction({
                name: 'get_opengid',
                data: {
                  js_code: res.code,
                  appId: 'wxb1684ec13bc817a2',
                  encryptedData: js_encryptedData,
                  iv: js_iv
                },
                success: function (res) {
                  console.log('打印 get_opengid success openGId: ' + res.result.openGId)
                  console.log('打印 get_opengid success res: ' + JSON.stringify(res))

                  that.globalData.openGid = res.result.openGId

                  typeof cb == "function" && cb(that.globalData)
                },
                fail: function (err) {
                  console.log('打印 get_opengid err: ' + JSON.stringify(err))
                }
              })
            }
          })
        }
      })

    } else {
      console.log('不存在shareTicket')
    }
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