 const app = getApp()
const util = require('../../utils/util.js'); 
const model = require('../../utils/model.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    contentLoaded: false,
    participationsLoaded: false,
    activityId: '',
    detail: {},
    imageUrls: [],
    participations: [],
    hasEnrolled: false,
    enrollDisabled: false, // TODO: 是否禁用“参加/取消参加“功能
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
      activityId: options.activityId
      // activityId: '96c1cbbe5cdbf1f91285be470c6d8a4f' // mock
    })

    this.getActivityDetail(this.data.activityId)
    this.refreshParticipations(this.data.activityId)

    // app.getLoginCode(function () {
    //   that.getActivityDetail(that.data.activityId)
    //   that.refreshParticipations(that.data.activityId)
    // })
  },

  getActivityDetail: function (activityId) {
    var that = this

    wx.cloud.callFunction({
      name: 'get_activity_detail',

      data: {
        activityId: activityId
      },

      success: function (res) {

        let data = res.result.activitydetail.data
        
        if (data.length > 0) {

          var activitydetail = data[0]
          activitydetail.publish_time = util.formatTime(new Date(activitydetail.publish_time))
          activitydetail.start_time = util.formatTime(new Date(activitydetail.start_time))
          activitydetail.end_time = util.formatTime(new Date(activitydetail.end_time))

          activitydetail.activity_type = model.getActivityType(activitydetail.activity_type)

          that.setData({
            detail: activitydetail
          })
        }

        that.setData({
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
  refreshParticipations: function (activityId) {
    var that = this

    wx.cloud.callFunction({
      name: 'get_participation_for_activity',

      data: {
        activityId: activityId,
      },

      success: function (res) {

        var participations = res.result.participations.data
        that.checkHasEnrolled(participations)

        for (let i = 0; i < participations.length; i++) {
          participations[i].time = util.formatTime(new Date(participations[i].time))
        }

        that.setData({
          participations: participations,
          participationsLoaded: true
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
      this.addParticipation(this.data.activityId)
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
    if (this.data.contentLoaded && this.data.participationsLoaded){
      wx.hideLoading()
    }
  },

  /**
   * 判断当前用户是否已经参加
   */
  checkHasEnrolled: function (participations) {
    this.setData({
      hasEnrolled: false,
      participationId: '',
      buttonTitle: '参加'
    })

    for (let i = 0; i < participations.length; i++) {
      if (participations[i].participant_id == app.globalData.openId) {
        this.setData({
          hasEnrolled: true,
          participationId: participations[i]._id,
          buttonTitle: '取消参加'
        })
        break
      }
    }
  },

  addParticipation: function (activityId) {
    var that = this

    wx.cloud.callFunction({
      name: 'add_participation',

      data: {
        activityId: activityId,
        nick_name: app.globalData.currentNickName,
        avatar_url: app.globalData.currentAvatarUrl,
      },

      success: function (res) {
        that.data.participationsLoaded = false // 这样给data赋值不会导致页面刷新
        that.refreshParticipations(activityId)
      },

      fail: console.error
    })
  },

  cancelParticipation: function (participationId) {
    var that = this

    wx.cloud.callFunction({
      name: 'remove_participation',

      data: {
        participationId: participationId
      },

      success: function (res) {
        that.data.participationsLoaded = false // 这样给data赋值不会导致页面刷新
        that.refreshParticipations(that.data.activityId)
      },

      fail: console.error
    })
  },
  
  // 点击participant单元格
  participantTapped: function (event) {

    var participantId = event.currentTarget.dataset.itemid;
    console.log("participantTapped: ", participantId)

    // var newSelectItems = [];
    // for (var i = 0; i < this.data.selectItems.length; i++) {
    //   if (itemid == this.data.selectItems[i].itemid) {
    //     //"text": "10元", "itemid": "1", "chageColor": false
    //     newSelectItems[i] = {
    //       "text": this.data.selectItems[i].text,
    //       "itemid": this.data.selectItems[i].itemid,
    //       "chageColor": true
    //     };
    //   } else {
    //     newSelectItems[i] = {
    //       "text": this.data.selectItems[i].text,
    //       "itemid": this.data.selectItems[i].itemid,
    //       "chageColor": false
    //     };
    //   }
    // }

    // this.setData({
    //   selectItems: newSelectItems,
    // });
  }

})
