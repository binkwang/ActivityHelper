//app.js
const util = require('./utils/util.js');  
App({

  globalData: {
    userInfo: "userInfo",
    currentNickName: '',
    currentAvatarUrl: '',
    openId: '',
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

    this.getOpenId()

  },

  onShow: function (options) {
    if (options && options.shareTicket) {
      console.log("options.shareTicket: ", options.shareTicket)
      this.getShareInfo(options.shareTicket)
    } else {
      console.log("没有shareTicket..")
    }
  },

  getShareInfo(shareTicket) {
  // getShareTiket: function (cb) {
    let that = this

    wx.getShareInfo({
      shareTicket: shareTicket,
      success: function (res) {
        console.log('打印 getShareInfo:' + JSON.stringify(res))
        let js_encryptedData = res.encryptedData
        let js_iv = res.iv

        wx.login({
          success: function (res) {
            console.log('打印 login code: ' + res.code)
            let js_code = res.code

            //调用云函数，破解opengid
            wx.cloud.callFunction({
              name: 'get_opengid',
              data: {
                js_code: js_code,
                appId: that.globalData.appId,
                encryptedData: js_encryptedData,
                iv: js_iv
              },
              success: function (res) {
                console.log('打印 get_opengid success openGId: ' + res.result.openGId)
                console.log('打印 get_opengid success res: ' + JSON.stringify(res))

                that.globalData.openGid = res.result.openGId

                console.log('打印 that.globalData.openGid: ' + that.globalData.openGid)

                // typeof cb == "function" && cb(that.globalData)
              },
              fail: function (err) {
                console.log('打印 get_opengid err: ' + JSON.stringify(err))
              }
            })
          }
        })
      }
    })

  },

  getOpenId() {
    let that = this

    wx.cloud.callFunction({
      name: 'get_openid',
      complete: res => {
        console.log('云函数获取到的openId: ', res.result.openId)
        that.globalData.openId = res.result.openId
      }
    })
  },

  // 在其他界面监听，method是回调方法。
  watch: function (method) {
    var obj = this.globalData

    Object.defineProperty(obj, "openGid", {
      configurable: true,
      enumerable: true,

      set: function (value) {
        console.log('set openGid value: ' + value)
        this._openGid = value;
        console.log('set _openGid value: ' + value)
        method(value)
      },
      get: function () {
        // 在其他界面调用getApp().globalData.openGid的时候，这里就会执行
        return this._openGid
      }
    })
  },
})
