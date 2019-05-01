// pages/posts/posts.js
const util = require('../../utils/util.js');  
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    groupid: '', // 用户显示该group的活动
    activities: null,
    shouldRefresh: false, // 用于发布动态后的强制刷新标记
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    console.log('options.groupid:', options.groupid)

    this.setData({
      groupid: options.groupid
    })


    // // TODO： 

    // // groupid可能有两个来源：
    // // 从上个页面的列表里面点击，此时这个群在数据库中肯定存在
    // // 第一次点击shard card跳转到此页面，此时该群在数据裤中还不存在，要建群

    // if (isGrougExisting) {
    //   wx.startPullDownRefresh()
    //   this.refresh()
    // } else {
    //   // 在数据库中创建该群
    //   // 然后刷新页面
    // }

    // // 检查该用户是否是该群成员，如果不是，则加入该群

    // if (!isUserInGroup) {
    //   // 用户加入群中
    // }

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
    var that = this

    if (this.data.shouldRefresh) {

      wx.startPullDownRefresh()
      this.refresh()

      this.setData({
        shouldRefresh: false
      })
    }
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
      name: 'get_activity_list',

      data: {
        groupid: this.data.groupid
      },

      success: function (res) {
        var data = res.result.activities.data

        for (let i = 0; i < data.length; i++) {
          console.log(data[i])
          data[i].publish_time = util.formatTime(new Date(data[i].publish_time))
          data[i].start_time = util.formatTime(new Date(data[i].start_time))
          data[i].end_time = util.formatTime(new Date(data[i].end_time))
        }
        
        that.setData({
          activities: data
        })

        wx.hideLoading()
        wx.stopPullDownRefresh()
      },
      fail: console.error
    })
  },
  
})