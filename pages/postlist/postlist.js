// pages/posts/posts.js
const util = require('../../utils/util.js');  

const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    postlist: null,
    update: false,// 用于发布动态后的强制刷新标记
    userInfo: {},
    hasUserInfo: false,// 会导致每次加载授权按钮都一闪而过，需要优化
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this

    wx.getStorage({
      key: app.globalData.userInfo,

      success: function (res) {
        app.globalData.currentNickName = res.nickName
        app.globalData.currentAvatarUrl = res.avatarUrl
      },
      fail: function () {
        that.getUserInfo()
      }
    })

    wx.startPullDownRefresh()
    this.refresh()
  },

  /**
   * 刷新数据
   */
  refresh: function () {
    var that = this

    wx.showLoading({
      title: '加载中',
    })

    wx.cloud.callFunction({
      // 如果多次调用则存在冗余问题，应该用一个常量表示。放在哪里合适？
      name: 'get_activity_list',
      success: function (res) {
        var data = res.result.postlist.data
        for (let i = 0; i < data.length; i++) {
          console.log(data[i])
          data[i].publish_time = util.formatTime(new Date(data[i].publish_time))
          data[i].start_time = util.formatTime(new Date(data[i].start_time))
          data[i].end_time = util.formatTime(new Date(data[i].end_time))
        }
        wx.hideLoading()
        that.setData({
          postlist: data
        })
        wx.stopPullDownRefresh()
      },
      fail: console.error
    })
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
    var that = this

    if (this.data.update) {
      wx.startPullDownRefresh()
      this.refresh()

      this.setData({
        update: false
      })
    }
  },

  getUserInfo: function () {
    var that = this

    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) { 
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称
          wx.getUserInfo({ 
            success: res => {

              wx.setStorage({
                key: app.globalData.userInfo,
                data: res.userInfo,
              })
              
              app.globalData.currentNickName = res.userInfo.nickName
              app.globalData.currentAvatarUrl = res.userInfo.avatarUrl
            },
            fail: function () {
              console.log('getUserInfo fail..')
            }
          })

        } else { 
          // 跳转到授权页面 
          wx.navigateTo({
            url: '/pages/authorize/authorize',
          })
        }
      }
    })
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
    this.refresh()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    // TODO 主体功能完备后要支持分页加载
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

  /**
   * 带参跳转
   */
  newPost: function(e) {
    wx.navigateTo({
      url: '../publish/publish'
    })
  },
  
  onItemClick: function (e) {
    console.log(e.currentTarget.dataset.postid)
    wx.navigateTo({
      url: '../postdetail/postdetail?postid=' + e.currentTarget.dataset.postid,
    })
  }

})