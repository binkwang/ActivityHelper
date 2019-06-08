//app.js
const util = require('./utils/util.js')
const env = require('./utils/env.js')

App({
  
  globalData: {
    shareTicket: null,
    loginCode: null, // 用在group页面，用于解析groupId
    shareInfoEncryptedData: null,
    shareInfoIV: null,
    getGroupIdSuccessCallBack: null,

    kUserInfo: 'userInfo',
    currentNickName: null,
    currentAvatarUrl: null,
  },

  onLaunch: function (options) {
    wx.clearStorage()

    wx.cloud.init({
      env: env.prod,
      traceUser: true
    })
  },

  onShow: function (options) {
    this.globalData.shareTicket = options.shareTicket
    console.log("app, this.globalData.shareTicket: ", this.globalData.shareTicket)
  },

  onHide: function (options) {
    console.log("app onHide...")
    // this.clearUserInfo()
  },

  redirectToHomePage() {
    wx.redirectTo({
      url: '/pages/grouplist/grouplist',
    })
  },

  // 在以下场景被调用：
  // 用户点击share ticket，在调转到达的页面被调用，如group页面
  // 参数：1. shareTicket 
  // 参数：2. successCallBack 是一个回调函数，在获取group id成功是调用，把group id传回group页面
  getGroupIdWithShareTicket: function (shareTicket, successCallBack) {
    this.globalData.getGroupIdSuccessCallBack = successCallBack

    // getLoginCode & getShareInfo 两个请求并发执行
    this.getLoginCode()
    this.getShareInfo(shareTicket)
  },

  getLoginCode() {
    let that = this

    wx.login({
      success: function (res) {
        console.log('获取login code成功: ' + res.code)
        that.globalData.loginCode = res.code

        that.checkIsReadyToParseGroupId()
      }
    })
  },

  getShareInfo: function (shareTicket) {
    let that = this

    wx.getShareInfo({
      shareTicket: shareTicket,

      success: function (res) {
        that.globalData.shareInfoEncryptedData = res.encryptedData
        that.globalData.shareInfoIV = res.iv

        console.log("shareInfoEncryptedData---: ", that.globalData.shareInfoEncryptedData)
        console.log("shareInfoIV---: ", that.globalData.shareInfoIV)

        that.checkIsReadyToParseGroupId()
      }
    })
  },

  // 所有参数都就绪之后，调用getGroupId
  checkIsReadyToParseGroupId: function () {

    // !object 可同时判断 null 和 undefined
    if (this.globalData.loginCode 
      && this.globalData.shareInfoEncryptedData  
      && this.globalData.shareInfoIV) { 
      this.parseGroupId(this.globalData.loginCode, this.globalData.shareInfoEncryptedData,this.globalData.shareInfoIV) 
      }
  },

  parseGroupId: function (loginCode, encryptedData, iv) {
    let that = this

    wx.cloud.callFunction({
      name: 'get_opengid',
      data: {
        js_code: loginCode,
        encryptedData: encryptedData,
        iv: iv
      },
      success: function (res) {
        console.log('get_opengid success openGId: ' + res.result.openGId)

        typeof that.globalData.getGroupIdSuccessCallBack == "function" && that.globalData.getGroupIdSuccessCallBack(res.result.openGId)

        that.clearShareTicket()
      },
      fail: function (err) {
        console.log('get_opengid err: ' + JSON.stringify(err))
        that.clearShareTicket()
      }
    })
  },

  clearShareTicket: function () {
    this.globalData.shareTicket = null
    this.globalData.loginCode = null
    this.globalData.shareInfoEncryptedData = null
    this.globalData.shareInfoIV = null
  },


  // 在group detail页面被调用
  getOpenId: function (successCallBack) {
    let that = this

    wx.cloud.callFunction({
      name: 'get_openid',

      complete: res => {
        console.log('获取openId成功: ', res.result.openId)
        typeof successCallBack == "function" && successCallBack(res.result.openId)
      }
    })
  },

  // 两个场景下被调用：
  // 1. 用户正常启动小程序，在首页 group list页面被调用
  // 2. 用户点击share ticket，在调转到达的页面被调用
  // userInfo有三级缓存，1.保存在Storage 2.用户已经授权,用wx.getUserInfo获取 3.用户未授权，跳转到授权页面
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

        if (res.authSetting['scope.userInfo']) { // 已经授权，直接调用wx.getUserInfo
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

  clearUserInfo: function () {
    this.globalData.currentNickName = null
    this.globalData.currentAvatarUrl = null
  },

  // 检查当前的userInfo是否为未授权状态
  checkIsAuthCanceled: function () {

    wx.getSetting({
      success: (res) => {
        if (!res.authSetting['scope.userInfo'])
          that.openConfirm()
      }
    })

  },

  openConfirm: function () {
    wx.showModal({
      content: '检测到您当前没有授权获取用户信息，是否去设置打开？',
      confirmText: "确认",
      cancelText: "取消",
      success: function (res) {
        if (res.confirm) { //点击“确认”时打开设置页面
          wx.openSetting({
            success: (res) => { }
          })
        } else { // 用户点击取消
          console.log('用户点击取消')
        }
      }
    })
  },

})