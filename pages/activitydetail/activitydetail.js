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

    openId: '', // 当前用户id, 用来判断：1.当前用户是不是发起者 2.当前用户有没有参加该活动

    // 获取activity detail之后赋值
    contentLoaded: false,
    detail: {},
    isSponsor: false, // 当前用户是否为活动发起者
    isActivityStarted: false, // 当前活动是否已经开始

    hasMoreinfo: true, // detail是否有activity_moreinfo

    // 获取participations后赋值
    participationsLoaded: false,
    participations: [],
    hasEnrolled: false, // 当前用户是否已经加入
    participationId: '', // 当前用户participation id

    shouldRefreshActivityDetails: false, // 由修改页面传回
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
    wx.hideShareMenu();


    wx.showLoading({
      title: '加载中',
    })
    
    var that = this

    this.setData({
      activityId: options.activityId
    })

    app.getOpenId(function (openId) {
      that.data.openId = openId
      that.checkLoadFinish()
    })

    this.getActivityDetail(this.data.activityId)
    this.refreshParticipations(this.data.activityId)
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

          activitydetail.formatStartTime = util.formatTime(new Date(activitydetail.start_time))
          activitydetail.formatEndTime = util.formatTime(new Date(activitydetail.end_time))
          activitydetail.formatPublishTime = util.formatTime(new Date(activitydetail.publish_time))

          activitydetail.startWeekDay = util.getWeekDay(activitydetail.start_time)
          activitydetail.endWeekDay = util.getWeekDay(activitydetail.end_time)

          activitydetail.activity_type = model.getActivityType(activitydetail.activity_type)

          if (activitydetail.sponsor_id == that.data.openId) {
            that.data.isSponsor = true
          }

          if (util.isEmpty(activitydetail.activity_moreinfo)) {
            //activitydetail.activity_moreinfo = "空"
          }

          that.setData({
            hasMoreinfo: that.data.hasMoreinfo,
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

          // addParticipation函数执行时，
          // 可能全局的用户头像和昵称还没有获得，
          // 导致写入数据库里的参加者昵称和头像是空的
          // 提供一个默认的用户名和头像
          if (util.isEmpty(participations[i].nick_name)) {
            participations[i].nick_name = model.unknown_nick_name
          }
          if (util.isEmpty(participations[i].avatar_url)) {
            participations[i].avatar_url = model.unknown_avatar_url
          }
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
      this.addParticipation(this.data.activityId, this.data.detail.number_limit)
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

    if (this.data.shouldRefreshActivityDetails) {
      wx.showLoading({
        title: '加载中',
      })

      this.getActivityDetail(this.data.activityId)
      this.data.shouldRefreshActivityDetails = false
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
    wx.stopPullDownRefresh();
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
    if (this.data.contentLoaded && this.data.participationsLoaded && this.data.openId!="") {
      console.log("数据加载完成")
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
      if (participations[i].participant_id == this.data.openId) {
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
        nickName: app.globalData.currentNickName, // 数据库
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
        activityId: activityId,
        participantId: participantId
      },

      success: function (res) {
        that.data.participationsLoaded = false // 这样给data赋值避免页面刷新
        that.refreshParticipations(that.data.activityId)
      },

      fail: console.error
    })
  },

  editTitle: function (event) {
    this.navigateTo(model.editType.title)
  },

  editLocation: function (event) {
    this.navigateTo(model.editType.location)
  },

  editStartTime: function (event) {
    this.navigateTo(model.editType.startTime)
  },

  editEndTime: function (event) {
    this.navigateTo(model.editType.endTime)
  },

  editNumLimit: function (event) {
    this.navigateTo(model.editType.numLimit)
  },

  editMoreinfo: function (event) {
    this.navigateTo(model.editType.moreinfo)
  },
  
  navigateTo: function (editType) {

    if (this.data.isSponsor && !this.data.isActivityStarted) {
      var url = '../activityedit/activityedit?activityId=' + this.data.activityId
        + "&editType=" + editType
        + "&activityTypeId=" + this.data.detail.activity_type.typeId
        + "&activityTitle=" + this.data.detail.activity_title
        + "&activityMoreinfo=" + this.data.detail.activity_moreinfo
        + "&activityLocation=" + this.data.detail.location
        + "&activityNumLimit=" + this.data.detail.number_limit
        + "&activityStartTime=" + this.data.detail.start_time
        + "&activityEndTime=" + this.data.detail.end_time

      console.log("url: ", url)
      wx.navigateTo({
        url: url
      })
    }
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
          title: '只能在活动开始前移除',
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
