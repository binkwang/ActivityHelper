// pages/publish/publish.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    activity_title: '',
    location: '',
    number_limit: 0,
    maxContentLength: 100,
    minContentLength: 2
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(getApp().globalData)
    // 本页面要传数据到服务器，要对是否拿到这些数据做校验
  },

  input_activity_title: function (e) {
    if (e.detail.value.length >= this.data.maxContentLength) {
      wx.showToast({
        title: '标题达到最大字数限制',
      })
    }
    this.setData({
      activity_title: e.detail.value
    })
  },

  input_location: function (e) {
    if (e.detail.value.length >= this.data.maxContentLength) {
      wx.showToast({
        title: '地点达到最大字数限制',
      })
    }
    this.setData({
      location: e.detail.value
    })
  },

  input_number_limit: function (e) {
    this.setData({
      number_limit: Number(e.detail.value)
    })
  },


  publish: function () {
    var that = this
    wx.cloud.callFunction({
      name: 'publish_activity',
      data: {
        sponsor_name: app.globalData.currentNickName,
        sponsor_avatar_url: app.globalData.currentAvatarUrl,
        activity_title: this.data.activity_title,
        location: this.data.location,
        number_limit: this.data.number_limit,
        publish_time: "",
        start_time: "",
        end_time: ""
      },
      success: function (res) {
        // 强制刷新，这个传参很粗暴
        var pages = getCurrentPages();             //  获取页面栈
        var prevPage = pages[pages.length - 2];    // 上一个页面
        prevPage.setData({
          shouldRefresh: true
        })
        wx.hideLoading()
        wx.navigateBack({
          delta: 1
        })
      },
      fail: function (res) {
        that.publishFail('发布失败')
      }
    })
  },

  //发布按钮事件
  send: function () {
    if (this.data.activity_title.length == 0) {
    //if (this.data.activity_title.length < this.data.minContentLength) {
      wx.showToast({
        image: '../../images/warn.png',
        title: '标题太短!',
      })
      return
    }

    if (this.data.location.length == 0) {
      wx.showToast({
        image: '../../images/warn.png',
        title: '请输入地点!',
      })
      return
    }

    if (this.data.number_limit == 0) {
      wx.showToast({
        image: '../../images/warn.png',
        title: '请输入人数限制!',
      })
      return
    }
    
    var that = this;

    wx.showLoading({
      title: '发布中',
      mask: true
    })

    that.publish()
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


  publishFail(info) {
    wx.showToast({
      image: '../../images/warn.png',
      title: info,
      mask: true,
      duration: 2500
    })
  }

})