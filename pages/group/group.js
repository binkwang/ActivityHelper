// pages/posts/posts.js
const app = getApp()
const util = require('../../utils/util.js');  
const model = require('../../utils/model.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    groupId: null, // 用户显示该group的活动
    parentType: null, // '0'-从list页面进入，'1'-从shared card进去

    groupDetailLoaded: false,
    groupDetail: '', // 数据, 仅用来验证当前数据库中有没有该群

    activitiesLoaded: false,
    activities: [],

    usersLoaded: false, // 群成员, 暂时没用到
    users: [], // 群成员, 暂时没用到
    
    fromAuthPage: false,
    newActivityPosted: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo') //TODO: 获取用户信息
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

    wx.showLoading({
      title: '加载中',
    })

    // 此页面的父页面有两个来源：
    // 1. 从上个页面的列表里面点击，此时这个群在数据库中肯定存在；
    // 2. 点击shard card跳转到此页面
    // 如果是第一次点击shard card，则该群在数据库中还不存在，要建群，然后把当前用户加入群中

    let shareTicket = app.globalData.shareTicket
    console.log("group page, shareTicket: ", shareTicket)

    if (shareTicket) {

      // setUserInfo & getGroupIdWithShareTicket 并发执行

      app.setUserInfo(function () {
        that.checkIsReadyToLoadPageData()
      },
        function () {
          that.navigateToAuthPage()
      })

      app.getGroupIdWithShareTicket(shareTicket, function (groupId) {
        that.data.parentType = "0" // 从share ticket进入
        that.data.groupId = groupId

        that.checkIsReadyToLoadPageData()
      })

    } else if (options.groupId) {
      this.data.parentType = "1" // 从group list页面进入
      this.data.groupId = options.groupId

      this.loadPageData(this.data.groupId)

    } else {
      console.log('unexpected..')
    }
  },

  checkIsReadyToLoadPageData: function () {
    if (this.data.groupId && this.data.parentType 
    && app.globalData.currentNickName && app.globalData.currentAvatarUrl) {

      this.loadPageData(this.data.groupId)
    }
  },

  loadPageData: function (groupId) {
    this.getGroupDetails(groupId)
    // this.getUsers(groupId)
    this.getActivities(groupId)
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

          that.setData({
            groupDetail: detail,
            groupDetailLoaded: true
          })

          that.checkIsLoadFinished()

          // 如果用户从群分享卡片点击进入，该用户可能未加入
          // 获取群信息成功之后，使用户入群
          if (that.data.parentType === '0') { 
            that.addUserToGroup(that.data.groupId)
          }

        } else {

          // 如果用户从群分享卡片点击进入，该群可能尚未创建
          if (that.data.parentType === '0') { 
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
      },

      success: function (res) {
        console.log("group创建成功")
        that.loadPageData(that.data.groupId)
      },

      fail: console.error
    })
  },

  // 当前用户入群，即使该成员已经入群，调用该函数也没有影响
  // (目前没用到群成员数据)
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

  getActivities: function (groupId) {
    var that = this

    console.log('加载活动列表..')

    wx.cloud.callFunction({
      name: 'get_activity_list',
      data: {
        groupId: groupId
      },

      success: function (res) {
        var currentTime = res.result.currentTime
        var data = res.result.activities.data
        for (let i = 0; i < data.length; i++) {
          data[i].activity_status = that.getActivityStatus(data[i].start_time, data[i].end_time, currentTime)
          data[i].activity_type = model.getActivityType(data[i].activity_type)
        }
        
        that.setData({
          activities: data,
          activitiesLoaded: true
        })

        that.checkIsLoadFinished()
      },
      fail: console.error
    })
  },

  // 获取群成员
  getUsers: function (groupId) {
    var that = this

    console.log('加载群成员..')

    wx.cloud.callFunction({
      name: 'get_user_list_for_group',
      data: {
        groupId: groupId
      },

      success: function (res) {
        var data = res.result.users.data
        for (let i = 0; i < data.length; i++) {
          console.log('获取群成员列表..', data[i])
        }

        that.setData({
          users: data,
          usersLoaded: true
        })

        that.checkIsLoadFinished()
      },
      fail: console.error
    })
  },

  checkIsLoadFinished: function () {

    if (this.data.groupDetailLoaded 
    && this.data.activitiesLoaded) {
      console.log("数据加载完成")
      wx.hideLoading()
      wx.stopPullDownRefresh()
    }

  },

  getActivityStatus: function (startTime, endTime, currentTime) {
    var that = this;
    var activityStatus;
    if (currentTime < startTime) {
      // 未开始
      activityStatus = model.getActivityStatus(model.activityStatus.notStarted)
    } else if (currentTime > endTime) {
      // 已结束
      activityStatus = model.getActivityStatus(model.activityStatus.ended)
    } else {
      // 进行中
      activityStatus = model.getActivityStatus(model.activityStatus.inProgress)
    }
    return activityStatus;
  },

  navigateToAuthPage: function () {
    wx.navigateTo({
      url: '/pages/authorize/authorize',
    })
  },

  /**
   * 带参跳转
   */
  newPost: function (e) {
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

    // 这样给data能避免页面刷新
    this.data.groupDetailLoaded = false;
    this.data.activitiesLoaded = false;

    wx.showLoading({
      title: '加载中',
    })

    this.loadPageData(this.data.groupId)
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
      imageUrl: '../../logo/logo-BlaBlaCat.png',
      path: '/pages/group/group'
    }
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

    if (this.data.fromAuthPage) {

      wx.showLoading({
        title: '加载中',
      })

      this.checkIsReadyToLoadPageData()

      this.data.fromAuthPage = false
    }

    if (this.data.newActivityPosted) {

      wx.showLoading({
        title: '加载中',
      })

      this.checkIsReadyToLoadPageData()

      this.data.newActivityPosted = false
    }
  },

})