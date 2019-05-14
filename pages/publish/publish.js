// pages/publish/publish.js
const app = getApp()
var dateTimePicker = require('../../utils/dateTimePicker.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    groupId: '',
    activity_title: '',
    location: '',
    number_limit: 0,
    maxContentLength: 100,
    minContentLength: 2,
    startYear: 2019,
    endYear: 2020,
    dateTime: null,
    dateTimeArray: null,
    originalDateTime: null,
    originalDateTimeArray: null,
    endDateTime: null,
    endDateTimeArray: null,
    originalEndDateTime: null,
    originalEndDateTimeArray: null,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    this.setData({
      groupId: options.groupId
    })

    console.log("this.data.groupId: ", this.data.groupId)

    // 获取完整的年月日 时分秒，以及默认显示的数组
    var startPicker = dateTimePicker.dateTimePicker(this.data.startYear, this.data.endYear);

    this.setData({
      dateTime: startPicker.dateTime,
      dateTimeArray: startPicker.dateTimeArray,
      originalDateTime: startPicker.dateTime.slice(0),
      originalDateTimeArray: dateTimePicker.deepcopyArray(startPicker.dateTimeArray),
    });

    // 获取完整的年月日 时分秒，以及默认显示的数组
    var endPicker = dateTimePicker.dateTimePicker(this.data.startYear, this.data.endYear);

    this.setData({
      endDateTime: endPicker.dateTime,
      endDateTimeArray: endPicker.dateTimeArray,
      originalEndDateTime: endPicker.dateTime.slice(0),
      originalEndDateTimeArray: dateTimePicker.deepcopyArray(endPicker.dateTimeArray),
    });
  },

  changeDateTime(e) {
    this.setData({
      dateTime: e.detail.value,
      originalDateTime: e.detail.value.slice(0),
      originalDateTimeArray: dateTimePicker.deepcopyArray(this.data.dateTimeArray),
    });
  },

  cancelChangeDateTime(e) {
    this.setData({
      dateTime: this.data.originalDateTime,
      dateTimeArray: this.data.originalDateTimeArray,
    });
  },

  changeDateTimeColumn(e) {

    //引用赋值，改变arr的值，this.data.dateTime也会被改变
    var arr = this.data.dateTime, dateArr = this.data.dateTimeArray; 

    // e.detail.column: 当前改变的列的索引号
    // e.detail.value: 当前改变的列的新值
    arr[e.detail.column] = e.detail.value;

    // 设置当前年月的天数组
    dateArr[2] = dateTimePicker.getMonthDay(dateArr[0][arr[0]], dateArr[1][arr[1]]); 
    
    // set data, 页面会自动刷新
    this.setData({
      dateTime: arr,
      dateTimeArray: dateArr
    });
  },

  changeEndDateTime(e) {
    this.setData({ 
      endDateTime: e.detail.value,
      originalEndDateTime: e.detail.value.slice(0),
      originalEndDateTimeArray: dateTimePicker.deepcopyArray(this.data.endDateTimeArray),
    });
  },

  cancelEndChangeDateTime(e) {
    this.setData({
      endDateTime: this.data.originalEndDateTime,
      endDateTimeArray: this.data.originalEndDateTimeArray,
    });
  },

  changeEndDateTimeColumn(e) {
    var arr = this.data.endDateTime, dateArr = this.data.endDateTimeArray;

    arr[e.detail.column] = e.detail.value;
    dateArr[2] = dateTimePicker.getMonthDay(dateArr[0][arr[0]], dateArr[1][arr[1]]);

    this.setData({
      endDateTime: arr,
      endDateTimeArray: dateArr
    });
  },

  input_activity_title: function (e) {
    if (e.detail.value.length >= this.data.maxContentLength) {
      wx.showToast({
        title: '标题达到最大字数限制',
      })
    }
    this.setData({
      activity_title: e.detail.value
    })
  },

  input_location: function (e) {
    if (e.detail.value.length >= this.data.maxContentLength) {
      wx.showToast({
        title: '地点达到最大字数限制',
      })
    }
    this.setData({
      location: e.detail.value
    })
  },

  input_number_limit: function (e) {
    this.setData({
      number_limit: Number(e.detail.value)
    })
  },


  publish: function () {
    var that = this
    wx.cloud.callFunction({
      name: 'publish_activity',
      data: {
        groupid: this.data.groupId,
        sponsor_name: app.globalData.currentNickName,
        sponsor_avatar_url: app.globalData.currentAvatarUrl,
        activity_title: this.data.activity_title,
        location: this.data.location,
        number_limit: this.data.number_limit,
        publish_time: "", // TODO:
        start_time: "", // TODO:
        end_time: "" // TODO:
      },
      success: function (res) {
        // 强制刷新，这个传参很粗暴
        var pages = getCurrentPages();             //  获取页面栈
        var prevPage = pages[pages.length - 2];    // 上一个页面
        prevPage.setData({
          shouldRefreshActivities: true
        })
        wx.hideLoading()
        wx.navigateBack({
          delta: 1
        })
      },
      fail: function (res) {
        that.publishFail('发布失败')
      }
    })
  },

  //发布按钮事件
  send: function () {
    if (this.data.activity_title.length == 0) {
    //if (this.data.activity_title.length < this.data.minContentLength) {
      wx.showToast({
        image: '../../images/warn.png',
        title: '标题太短!',
      })
      return
    }

    if (this.data.location.length == 0) {
      wx.showToast({
        image: '../../images/warn.png',
        title: '请输入地点!',
      })
      return
    }

    if (this.data.number_limit == 0) {
      wx.showToast({
        image: '../../images/warn.png',
        title: '请输入人数限制!',
      })
      return
    }
    
    var that = this;

    wx.showLoading({
      title: '发布中',
      mask: true
    })

    that.publish()
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


  publishFail(info) {
    wx.showToast({
      image: '../../images/warn.png',
      title: info,
      mask: true,
      duration: 2500
    })
  }

})