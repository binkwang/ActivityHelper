//app.js
const util = require('./utils/util.js');  

App({

  globalData: {
    shareTicket: '',
    loginCode: null, // 用在group页面，用于解析groupId
    shareInfoEncryptedData: null,
    shareInfoIV: null,
    getGroupIdSuccessCallBack: null,

    

    kUserInfo: 'userInfo',
    currentNickName: null,
    currentAvatarUrl: null,

    appId: 'wxb1684ec13bc817a2',

    
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

    }
  },

  redirectToHomePage() {
    wx.redirectTo({
      url: '/pages/grouplist/grouplist',
    })
  },



  getGroupId: function (successCallBack) {
    this.globalData.getGroupIdSuccessCallBack = successCallBack
    this.getLoginCode()
    this.getShareInfo(shareTicket)
  },



  // 只在group页面调用，获取loginCode，用于解析groupId
  getLoginCode() {
    let that = this

    wx.login({
      success: function (res) {
        console.log('获取login code成功: ' + res.code)
        that.globalData.loginCode = res.code

        that.check()
      }
    })
  },

  getShareInfo: function (shareTicket) {
    let that = this

    wx.getShareInfo({
      shareTicket: shareTicket,

      success: function (res) {
        console.log('shareInfo:' + JSON.stringify(res))

        that.globalData.shareInfoEncryptedData = res.encryptedData
        that.globalData.shareInfoIV = res.iv

        that.check()
      }
    })
  },

  check: function () {

    // !object 可同时判断 null 和 undefined
    if (!this.globalData.loginCode 
      && !this.globalData.shareInfoEncryptedData  
      && !this.globalData.shareInfoIV) { 
      this.getGroupId(this.globalData.loginCode, this.globalData.shareInfoEncryptedData,this.globalData.shareInfoIV) }

  },

  getGroupId: function (loginCode, encryptedData, iv) {
    let that = this

    wx.cloud.callFunction({
      name: 'get_opengid',
      data: {
        js_code: loginCode,
        appId: that.globalData.appId,
        encryptedData: encryptedData,
        iv: iv
      },
      success: function (res) {
        console.log('打印 get_opengid success openGId: ' + res.result.openGId)


        typeof that.globalData.getGroupIdSuccessCallBack == "function" && that.globalData.getGroupIdSuccessCallBack(res.result.openGId)

      },
      fail: function (err) {
        console.log('打印 get_opengid err: ' + JSON.stringify(err))
      }
    })
  },


  getOpenId(successCallBack) {
    let that = this

    wx.cloud.callFunction({
      name: 'get_openid',

      complete: res => {
        console.log('获取openId成功: ', res.result.openId)
        typeof successCallBack == "function" && successCallBack(res.result.openId)
      }
    })
  },
  
  setUserInfo: function (successCallBack, authCallBack) {
    var that = this

    wx.getStorage({
      key: that.globalData.kUserInfo,

      success: function (res) {
        that.globalData.currentNickName = res.data.nickName
        that.globalData.currentAvatarUrl = res.data.avatarUrl

        typeof successCallBack == "function" && successCallBack()
      },

      fail: function () {
        that.getUserInfo(successCallBack, authCallBack)
      }
    })
  },

  getUserInfo: function (successCallBack, authCallBack) {
    var that = this
    wx.getSetting({
      success: function (res) {

        if (res.authSetting['scope.userInfo']) { // 已经授权，直接调用getUserInfo
          wx.getUserInfo({
            success: function (res) {
              wx.setStorage({
                key: that.globalData.kUserInfo,
                data: res.userInfo,
              })

              that.globalData.currentNickName = res.userInfo.nickName
              that.globalData.currentAvatarUrl = res.userInfo.avatarUrl

              typeof successCallBack == "function" && successCallBack()
            },
            fail: function () {
              console.log('getUserInfo fail..')
            }
          })

        } else { // 跳转到授权页面 
          typeof authCallBack == "function" && authCallBack()
        }
      }
    })
  },

})