const util = require('../../utils/util.js');
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    groupList: null,
    fromAuthPage: false,
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

    app.setUserInfo(function () {
      wx.startPullDownRefresh()
      wx.showLoading({
        title: '加载中',
      })
      that.getGroupList()
    },
    function () {
      that.navigateToAuthPage()
    })
  },

  /**
   * 刷新数据
   */
  getGroupList: function () {
    var that = this

    wx.cloud.callFunction({
      name: 'get_group_list_for_user',
      
      success: function (res) {
        var data = res.result.groupList.data

        for (let i = 0; i < data.length; i++) {
          console.log(data[i])
        }

        that.setData({
          groupList: data
        })

        wx.hideLoading()
        wx.stopPullDownRefresh()
      },
      fail: console.error
    })
  },

  navigateToAuthPage: function () {
    wx.navigateTo({
      url: '/pages/authorize/authorize',
    })
  },

  onItemClick: function (e) {
    let groupId = e.currentTarget.dataset.groupid
    console.log("groupId: ", groupId)

    wx.navigateTo({
      url: '../group/group?groupId=' + groupId
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

    // 首页显示，shareTicket设为null，避免从group list再次进入group页面时shareTicket仍然有值
    app.clearShareTicket()

    if (this.data.fromAuthPage) {
      wx.startPullDownRefresh()
      wx.showLoading({
        title: '加载中',
      })
      this.getGroupList()
      this.data.fromAuthPage = false
    } 
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    wx.showLoading({
      title: '加载中',
    })

    this.getGroupList()
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
    return {
      title: '',
      imageUrl: '../../images/bbc-logo-share.png',
      path: '/pages/group/group'
    }
  },

})