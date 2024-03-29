// pages/authorize/authorize.js
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  onGotUserInfo: function (e) {
    console.log(e)

    if (e.detail.userInfo) { // 用户按了允许授权按钮

      wx.setStorage({
        key: app.globalData.kUserInfo,
        data: e.detail.userInfo
      })

      app.globalData.currentNickName = e.detail.userInfo.nickName
      app.globalData.currentAvatarUrl = e.detail.userInfo.avatarUrl

      var pages = getCurrentPages();             // 获取页面栈
      var prevPage = pages[pages.length - 2];    // 上一个页面

      prevPage.setData({
        fromAuthPage: true
      })

      wx.navigateBack({
        delta: 1
      })

    } else { //用户按了拒绝按钮

    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.hideShareMenu();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

})