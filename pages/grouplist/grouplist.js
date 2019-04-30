const util = require('../../utils/util.js');
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    grouplist: null,
    openGid: '',
  },



  // TODO: Improve
  clickReload: function () {
    let that = this
    app.getShareTiket(function (globalData) {
      that.setData({
        openGid: globalData.openGid
      })
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this

    // 页面开启转发功能
    wx.showShareMenu({
      withShareTicket: true
    })

    app.getShareTiket(function (globalData) {
      that.setData({
        openGid: globalData.openGid
      })
    })

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
    this.refresh()
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

  onItemClick: function (e) {
    console.log("groupid:", e.currentTarget.dataset.groupid)
    wx.navigateTo({
      url: '../postlist/postlist?groupid=' + e.currentTarget.dataset.groupid,
    })
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
      name: 'get_group_list_for_user',
      success: function (res) {
        var data = res.result.grouplist.data
        for (let i = 0; i < data.length; i++) {
          console.log(data[i])
          data[i].join_time = util.formatTime(new Date(data[i].join_time))
        }
        wx.hideLoading()
        that.setData({
          grouplist: data
        })
        wx.stopPullDownRefresh()
      },
      fail: console.error
    })
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


})