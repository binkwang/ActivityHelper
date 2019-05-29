const app = getApp()
const util = require('../../utils/util.js'); 
const model = require('../../utils/model.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 外部传入
    activityId: '', 

    // 获取activity detail之后赋值
    contentLoaded: false,
    detail: {},
    isSponsor: false, // 当前用户是否为活动发起者
    isActivityStarted: false, // 当前活动是否已经开始

    // 获取participations后赋值
    participationsLoaded: false,
    participations: [],
    hasEnrolled: false, // 当前用户是否已经加入
    participationId: '', // 当前用户participation id
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
        let currentTime = res.result.currentTime
        let data = res.result.activitydetail.data
        
        if (data.length > 0) {

          var activitydetail = data[0]
          activitydetail.activity_status = that.getActivityStatus(activitydetail.start_time, activitydetail.end_time, currentTime)

          activitydetail.start_time = util.formatTime(new Date(activitydetail.start_time))
          activitydetail.end_time = util.formatTime(new Date(activitydetail.end_time))
          activitydetail.publish_time = util.formatTime(new Date(activitydetail.publish_time))

          activitydetail.activity_type = model.getActivityType(activitydetail.activity_type)

          if (activitydetail.sponsor_id == app.globalData.openId) {
            that.data.isSponsor = true
          }

          that.setData({
            detail: activitydetail,
            isSponsor: that.data.isSponsor,
            isActivityStarted: that.data.isActivityStarted
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

    if (this.data.isActivityStarted) {
      wx.showToast({
        image: '../../images/warn.png',
        title: '活动已经开始',
      })

    } else {
      wx.showLoading({
        title: '请稍候',
      })

      if (this.data.hasEnrolled) {
        this.cancelParticipation(this.data.participationId)
      } else {
        this.addParticipation(this.data.activityId, this.data.detail.number_limit)
      }
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
    if (this.data.contentLoaded && this.data.participationsLoaded) {
      console.log("this.data.detail.number_limit: ", this.data.detail.number_limit)
      console.log("this.data.participations.length: ", this.data.participations.length)

      wx.hideLoading()
    }
  },

  /**
   * 判断当前用户是否已经参加
   */
  checkHasEnrolled: function (participations) {
    this.setData({
      hasEnrolled: false,
      participationId: ''
    })

    for (let i = 0; i < participations.length; i++) {
      if (participations[i].participant_id == app.globalData.openId) {
        this.setData({
          hasEnrolled: true,
          participationId: participations[i]._id
        })
        break
      }
    }
  },

  addParticipation: function (activityId, numberLimit) {
    var that = this

    console.log("addParticipation activityId: ", activityId)
    console.log("addParticipation numberLimit: ", numberLimit)
    console.log("this.data.participations.length: ", this.data.participations.length)

    wx.cloud.callFunction({
      name: 'add_participation',

      data: {
        activityId: activityId,
        numberLimit: numberLimit,
        nickName: app.globalData.currentNickName,
        avatarUrl: app.globalData.currentAvatarUrl,
      },

      success: function (res) {
        that.data.participationsLoaded = false // 这样给data赋值避免页面刷新
        that.refreshParticipations(activityId)
      },

      fail: console.error
    })
  },

  // 通过participationId来删除参与者
  cancelParticipation: function (participationId) {
    var that = this

    wx.cloud.callFunction({
      name: 'remove_participation',

      data: {
        participationId: participationId
      },

      success: function (res) {
        that.data.participationsLoaded = false // 这样给data赋值避免页面刷新
        that.refreshParticipations(that.data.activityId)
      },

      fail: console.error
    })
  },

  // 通过participantId/activityId来删除参与者
  cancelParticipation2: function (participantId, activityId) {
    var that = this

    wx.cloud.callFunction({
      name: 'remove_participation2',

      data: {
        participantId: participantId,
        activityId: activityId
      },

      success: function (res) {
        that.data.participationsLoaded = false // 这样给data赋值避免页面刷新
        that.refreshParticipations(that.data.activityId)
      },

      fail: console.error
    })
  },

  // editActivityInfo: function (event) {
  //   console.log("editActivityInfo button tapped")

  //   wx.showModal({
  //     title: '操作提示',
  //     content: '修改活动信息后，请及时告知所有参与者',
  //     success: function (res) {
  //       if (res.confirm) {
  //         console.log('confirm selected')
  //         // navigate to edit page
          
  //       } else if (res.cancel) {
  //         console.log('cancel selected')
  //       }
  //     }
  //   })
  // },

  editTitle: function (event) {
    let extraInfo = "&editType=" + model.editType.title + "&activityTypeId=" + this.data.detail.activity_type.typeId + "&title=" + this.data.detail.activity_title
    this.navigateTo(extraInfo)
  },

  editLocation: function (event) {
    let extraInfo = "&editType=" + model.editType.location + "&location=" + this.data.detail.location
    this.navigateTo(extraInfo)
  },

  // editStartTime: function (event) {
  //   let extraInfo = "&activityType=" + detail.activity_type + "&title=" + detail.title
  //   this.navigateTo('startTime')
  // },

  // editEndTime: function (event) {
  //   let extraInfo = "&activityType=" + detail.activity_type + "&title=" + detail.title
  //   this.navigateTo('endTime')
  // },

  editNumberLimit: function (event) {
    let extraInfo = "&editType=" + model.editType.numberLimit + "&numberLimit=" + this.data.detail.number_limit
    this.navigateTo(extraInfo)
  },

  navigateTo: function (extraInfo) {
    var baseUrl = '../activityedit/activityedit?activityId=' + this.data.activityId
    var targetUrl = baseUrl + extraInfo
    console.log("targetUrl: ", targetUrl)
    wx.navigateTo({
      url: targetUrl
    })
  },
  
  // participant单元格点击事件
  participantTapped: function (event) {
    var that = this

    var participantId = event.currentTarget.dataset.itemid;
    console.log("participantTapped: ", participantId)

    // 活动发起人移除某参与人
    if (this.data.isSponsor) {

      if (this.data.isActivityStarted) {
        wx.showToast({
          image: '../../images/warn.png',
          title: '无法移除',
        })

      } else {

        wx.showModal({
          title: '操作提示',
          content: '确定移除该参加者吗？\n移除后请即使告知对方',
          success: function (res) {
            if (res.confirm) {
              wx.showLoading({
                title: '请稍候',
              })
              that.cancelParticipation2(participantId, that.data.activityId)
            } else if (res.cancel) {
              console.log('cancel selected')
            }
          }
        })

      }
    }
  },

  getActivityStatus: function (startTime, endTime, currentTime) {
    var that = this;
    var activityStatus;
    if (currentTime < startTime) {
      // 未开始
      activityStatus = model.getActivityStatus(model.activityStatus.notStarted)
      this.data.isActivityStarted = false
    } else if (currentTime > endTime) {
      // 已结束
      activityStatus = model.getActivityStatus(model.activityStatus.ended)
      this.data.isActivityStarted = true
    } else {
      // 进行中
      activityStatus = model.getActivityStatus(model.activityStatus.inProgress)
      this.data.isActivityStarted = true
    }
    return activityStatus;
  },

})
