// pages/posts/posts.js
const util = require('../../utils/util.js');  
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    groupId: '', // 用户显示该group的活动
    parentType: '', // '0'-从list页面进入，'1'-从shared card进去
    groupDetail: '', // 暂时没用到
    users: [], // 显示群成员
    activities: [],
    groupDetailLoaded: false,
    activitiesLoaded: false,
    usersLoaded: false,
    shouldRefreshActivities: false, // 发布新活动后的刷新标记
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    console.log('options.groupId:', options.groupId)

    this.setData({
      groupId: options.groupId,
      parentType: options.parentType
    })

    // groupId可能有两个来源：
    // 从上个页面的列表里面点击，此时这个群在数据库中肯定存在；
    // 点击shard card跳转到此页面
    // 如果是第一次点击shard card，则该群在数据库中还不存在，要建群，然后把当前用户加入群中

    wx.showLoading({
      title: '加载中',
    })

    this.getGroupDetails(this.data.groupId)
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

    if (this.data.shouldRefreshActivities) {
      this.getActivities()

      this.setData({
        shouldRefreshActivities: false
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
      url: '../publish/publish?groupId=' + this.data.groupId,
    })
  },
  
  onItemClick: function (e) {
    let activityId = e.currentTarget.dataset.activityid
    console.log("activityId:", activityId)

    wx.navigateTo({
      url: '../activitydetail/activitydetail?activityId=' + activityId,
    })
  },

  getGroupDetails: function (groupId) {
    var that = this

    wx.cloud.callFunction({
      name: 'get_group',

      data: {
        groupId: groupId
      },

      success: function (res) {

        var data = res.result.groups.data

        if (data.length > 0) {
          var detail = data[0]
          detail.create_time = util.formatTime(new Date(detail.create_time))

          that.setData({
            groupDetail: detail,
            groupDetailLoaded: true
          })

          if (that.data.parentType === '0') { // 如果用户从群分享卡片点击进入，该用户可能未加入
            that.addUserToGroup(that.data.groupId)
          }
          
          that.getUsers()
          that.getActivities()

        } else {

          if (that.data.parentType === '0') { // 如果用户从群分享卡片点击进入，该群可能尚未创建
            console.log('group 不存在')
            that.cretatGroup(that.data.groupId)
          } else {
            console.log('获取group信息失败')
          }
        }

      },
      fail: console.error
    })
  },

  cretatGroup: function (groupId) {
    var that = this

    wx.cloud.callFunction({
      name: 'add_group',

      data: {
        groupId: this.data.groupId,
        nick_name: app.globalData.currentNickName,
        avatar_url: app.globalData.currentAvatarUrl,
      },

      success: function (res) {
        console.log("group创建成功 - ", res.result)
        that.getGroupDetails(that.data.groupId)
      },

      fail: console.error
    })
  },

  // 当前用户入群，即使该成员已经入群，调用该函数也没有影响
  addUserToGroup: function (groupId) {
    var that = this
    
    wx.cloud.callFunction({
      name: 'add_group_user',
      data: {
        groupId: groupId,
        nickName: app.globalData.currentNickName,
        avatarUrl: app.globalData.currentAvatarUrl,
      },

      success: function (res) {
        console.log('当前用户入群 - 成功')
      },
      fail: console.error
    })
  },

  getActivities: function () {
    var that = this
    console.log("groupId: ", this.data.groupId)

    wx.cloud.callFunction({
      name: 'get_activity_list',
      data: {
        groupId: this.data.groupId
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
          activities: data,
          activitiesLoaded: true
        })

        that.checkLoadFinish()
      },
      fail: console.error
    })
  },

  // 获取群成员
  getUsers: function (groupId) {
    var that = this

    wx.cloud.callFunction({
      name: 'get_user_list_for_group',
      data: {
        groupId: groupId
      },

      success: function (res) {
        var data = res.result.users.data
        for (let i = 0; i < data.length; i++) {
          console.log(data[i])
          data[i].join_time = util.formatTime(new Date(data[i].join_time))
        }
        
        that.setData({
          users: data,
          usersLoaded: true
        })

        that.checkLoadFinish()
      },
      fail: console.error
    })
  },

  checkLoadFinish: function () {
    if (this.data.groupDetailLoaded && this.data.activitiesLoaded && this.data.usersLoaded) {
      console.log("全部数据加载完成")
      wx.hideLoading()
    }
  },

})