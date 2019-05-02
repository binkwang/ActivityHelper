// pages/posts/posts.js
const util = require('../../utils/util.js');  
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    groupid: '', // 用户显示该group的活动
    groupdetail: '',
    userlist: '',
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

    // if (isGroupExisting) {
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

    this.checkGroupExist(this.data.groupid)
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
      url: '../publish/publish?groupid=' + this.data.groupid,
    })
  },
  
  onItemClick: function (e) {
    console.log(e.currentTarget.dataset.postid)
    wx.navigateTo({
      url: '../postdetail/postdetail?postid=' + e.currentTarget.dataset.postid,
    })
  },

  checkGroupExist: function (groupid) {
    var that = this

    wx.showLoading({
      title: '加载群信息',
    })

    wx.cloud.callFunction({
      name: 'get_group',

      data: {
        groupid: groupid
      },

      success: function (res) {

        var data = res.result.groups.data

        if (data.length > 0) {
          var groupdetail = data[0]
          console.log('groupdetail: ', groupdetail)
          groupdetail.create_time = util.formatTime(new Date(groupdetail.create_time))

          that.setData({
            groupdetail: groupdetail
          })

          wx.hideLoading()

          // 当前用户入群
          that.addUserToGroup(that.data.groupid)

          // group存在，拉取group活动 / 当前用户入群
          that.refresh()

        } else {
          console.log('group不存在')

          wx.hideLoading()

          // 创建
          that.cretatGroup(that.data.groupid)
        }

      },
      fail: console.error
    })
  },

  cretatGroup: function (groupid) {
    var that = this

    wx.showLoading({
      title: '创建群',
    })

    wx.cloud.callFunction({
      name: 'add_group',

      data: {
        group_id: this.data.groupid,
        nick_name: app.globalData.currentNickName,
        avatar_url: app.globalData.currentAvatarUrl,
      },

      success: function (res) {
        console.log(res.result)

        wx.hideLoading()

        // 创建成功，重新加载群信息
        that.checkGroupExist(that.data.groupid)
      },

      fail: console.error
    })
  },

  // 当前用户入群
  addUserToGroup: function (groupid) {
    var that = this
    
    wx.cloud.callFunction({
      name: 'add_group_user',
      data: {
        group_id: groupid,
        nick_name: app.globalData.currentNickName,
        avatar_url: app.globalData.currentAvatarUrl,
      },

      success: function (res) {
        console.log('当前用户入群-成功')
      },
      fail: console.error
    })

  },

  /**
   * 刷新数据
   */
  refresh: function () {
    var that = this

    wx.showLoading({
      title: '加载活动',
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

  // 获取群成员
  getUsers: function (groupid) {
    var that = this

    wx.showLoading({
      title: '加载群成员',
    })

    wx.cloud.callFunction({
      name: 'get_user_list_for_group',

      data: {
        groupid: groupid
      },

      success: function (res) {
        var userlist = res.result.userlist.data

        for (let i = 0; i < userlist.length; i++) {
          console.log(userlist[i])
          userlist[i].join_time = util.formatTime(new Date(userlist[i].join_time))
        }

        that.setData({
          userlist: userlist
        })

        wx.hideLoading()
      },
      fail: console.error
    })
  },
})