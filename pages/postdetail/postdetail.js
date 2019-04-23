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
        console.log(res.result.comment_list.data)

        var commentList = res.result.comment_list.data

        that.hasEnrolled(commentList)

        for (let i = 0; i < commentList.length; i++) {
          commentList[i].time = util.formatTime(new Date(commentList[i].time))
        }

        that.setData({
          comments: res.result.comment_list.data,
          commentLoaded: true
        })

        that.checkLoadFinish()
      },

      fail: console.error
    })
  },

  /**
   * 参加活动
   */
  sendComment: function() {
    var that = this
    wx.showLoading({
      title: '请稍候',
    })

    wx.cloud.callFunction({
      name: 'add_comment',
      
      data: {
        postid: this.data.detail._id,
        nick_name: app.globalData.wechatNickName,
        avatar_url: app.globalData.wechatAvatarUrl,
      },

      success: function (res) {
        wx.hideLoading()
        that.refreshComment(that.data.postid)
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

  checkLoadFinish: function() {
    if (this.data.contentLoaded && this.data.commentLoaded){
      wx.hideLoading()
    }
  },

  /**
   * 判断当前用户是否已经参加
   */
  hasEnrolled: function (commentList) {
    for (let i = 0; i < commentList.length; i++) {
      // TODO: 暂时没获得app.globalData.openid
      if (commentList[i].participant_id == app.globalData.openid) {
        that.data.hasEnrolled = true
        that.data.buttonTitle = '取消参加'
        break
      } else {
        that.data.hasEnrolled = false
        that.data.buttonTitle = '参加'
      }
    }
  }
})
