const util = require('../../utils/util.js');  
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    contentLoaded: false,
    commentLoaded: false,
    postid: '',
    detail: {},
    imageUrls: [],
    comments: [],
    hasEnrolled: false,
    participationId: '', // current user participation id
    buttonTitle: '参加'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.showLoading({
      title: '加载中',
    })
    var that = this

    this.setData({
      postid: options.postid
    })

    this.getPostDetail(this.data.postid)
    this.refreshComment(this.data.postid)
  },



  getPostDetail: function (postid) {
    var that = this

    wx.cloud.callFunction({
      name: 'get_post_detail',

      data: {
        postid: postid
      },

      success: function (res) {
        var postdetail = res.result.postdetail.data[0]
        postdetail.publish_time = util.formatTime(new Date(postdetail.publish_time))
        postdetail.start_time = util.formatTime(new Date(postdetail.start_time))
        postdetail.end_time = util.formatTime(new Date(postdetail.end_time))

        that.setData({
          detail: postdetail,
          contentLoaded: true
        })

        that.checkLoadFinish()

      },

      fail: console.error
    })
  },

  /**
   * 获取评论
   */
  refreshComment: function (postid) {
    var that = this

    wx.cloud.callFunction({
      name: 'get_comment_for_post',

      data: {
        postid: postid,
      },

      success: function (res) {

        var commentList = res.result.comment_list.data
        that.checkHasEnrolled(commentList)

        for (let i = 0; i < commentList.length; i++) {
          commentList[i].time = util.formatTime(new Date(commentList[i].time))
        }

        that.setData({
          comments: commentList,
          commentLoaded: true
        })

        that.checkLoadFinish()
      },

      fail: console.error
    })
  },

  /**
   * 参加/取消参加
   */
  updateParticipation: function () {
    var that = this

    wx.showLoading({
      title: '请稍候',
    })

    if (this.data.hasEnrolled) {
      this.cancelParticipation(this.data.participationId)
    } else {
      this.addParticipation(this.data.postid)
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

  /**
   * 判断当前用户是否已经参加
   */
  checkLoadFinish: function() {
    if (this.data.contentLoaded && this.data.commentLoaded){
      wx.hideLoading()
    }
  },

  /**
   * 判断当前用户是否已经参加
   */
  checkHasEnrolled: function (commentList) {
    this.setData({
      hasEnrolled: false,
      participationId: '',
      buttonTitle: '参加'
    })

    for (let i = 0; i < commentList.length; i++) {
      if (commentList[i].participant_id == app.globalData.openId) {
        this.setData({
          hasEnrolled: true,
          participationId: commentList[i]._id,
          buttonTitle: '取消参加'
        })
        break
      }
    }
  },

  addParticipation: function (postid) {
    var that = this

    wx.cloud.callFunction({
      name: 'add_comment',

      data: {
        postid: postid,
        nick_name: app.globalData.currentNickName,
        avatar_url: app.globalData.currentAvatarUrl,
      },

      success: function (res) {
        wx.hideLoading()
        that.refreshComment(postid)
      },

      fail: console.error
    })
  },

  cancelParticipation: function (participationId) {
    var that = this

    wx.cloud.callFunction({
      name: 'cancel_participation',

      data: {
        participationId: participationId
      },

      success: function (res) {
        wx.hideLoading()
        that.refreshComment(that.data.postid)
      },

      fail: console.error
    })
  }
})
