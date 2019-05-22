// pages/publish/publish.js
const app = getApp()
const dateTimePicker = require('../../utils/dateTimePicker.js')
const model = require('../../utils/model.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    groupId: '',
    activity_title: '',
    activityTypes: [],
    selectedActivityType: null,
    location: '',
    numLimit: 10, // 默认值
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

    titleLengthMin: 2,
    titleLengthMax: 50,
    currentTitleLength: 0,

    currentLocationLength: 0,

    sliderActiveColor: "#FCBD1B",
    sliderBackgroundColor: "#555555",
    sliderBlockColor: "#FCBD1B",
  },

  activityTypeSelected: function (event) {

    let typeId = event.currentTarget.dataset.itemid;
    console.log("typeId: ", typeId)

    for (var i = 0; i < this.data.activityTypes.length; i++) {
      if (typeId == this.data.activityTypes[i].typeId) {
        this.data.activityTypes[i].isSelected = true;
        this.selectedActivityType = this.data.activityTypes[i]
      } else {
        this.data.activityTypes[i].isSelected = false;
      }
    }

    this.setData({
      selectedActivityType: this.selectedActivityType,
      activityTypes: this.data.activityTypes,
    });
  },


  titleInputs: function (e) {
    
    var value = e.detail.value; // 获取输入框的内容
    var length = parseInt(value.length); // 获取输入框内容的长度
    
    //最少字数限制
    // if (length <= this.data.titleLengthMin) {
    // } else if (length > this.data.titleLengthMin) {
    // }

    if (length <= this.data.titleLengthMax) {
      this.setData({
        activity_title: value,
        currentTitleLength: length, //当前字数 
      })
    } else {
      return
    }
  },

  locationInputs: function (e) {

    var value = e.detail.value; // 获取输入框的内容
    var length = parseInt(value.length); // 获取输入框内容的长度

    if (length <= this.data.titleLengthMax) {
      this.setData({
        location: value,
        currentLocationLength: length, //当前字数 
      })
    } else {
      return
    }

  },

  //完成一次拖动后触发的事件
  sliderchange: function (e) {
    // wx.showToast({
    //   title: "拖动后触发" + e.detail.value,
    //   duration: 1000
    // })
  },

  //拖动过程中的触发的事件
  sliderchanging: function (e) {
    // wx.showToast({
    //   title: "拖动中触发" + e.detail.value,
    //   duration: 1000
    // })

    var value = e.detail.value;
    this.setData({
      numLimit: value,
    })


  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      groupId: options.groupId,
      activityTypes: model.activityTypes
    })

    console.log("activityTypes: ", this.data.activityTypes)

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

  publish: function () {
    var that = this

    let start_time = dateTimePicker.convertToTimetamp(this.data.dateTimeArray, this.data.dateTime);
    let end_time = dateTimePicker.convertToTimetamp(this.data.endDateTimeArray, this.data.endDateTime);




    wx.cloud.callFunction({
      name: 'publish_activity',
      data: {
        groupid: this.data.groupId,
        sponsor_name: app.globalData.currentNickName,
        sponsor_avatar_url: app.globalData.currentAvatarUrl,
        activity_title: this.data.activity_title,
        activityType: this.data.selectedActivityType.typeId,
        location: this.data.location,
        number_limit: this.data.numLimit,
        start_time: start_time,
        end_time: end_time
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

    console.log("this.data.selectedActivityType: ", this.data.selectedActivityType)

    if (this.data.selectedActivityType == null) {
      wx.showToast({
        image: '../../images/warn.png',
        title: '请选择活动类型',
      })
      return
    }

    if (this.data.activity_title.length == 0) {
      wx.showToast({
        image: '../../images/warn.png',
        title: '请输入标题',
      })
      return
    } else if (this.data.activity_title.length < this.data.titleLengthMin) {
      wx.showToast({
        image: '../../images/warn.png',
        title: '请输入2个字以上的标题',
      })
      return
    }

    if (this.data.location.length == 0) {
      wx.showToast({
        image: '../../images/warn.png',
        title: '请输入地点',
      })
      return
    } else if (this.data.location.length < this.data.titleLengthMin) {
      wx.showToast({
        image: '../../images/warn.png',
        title: '请输入2个字以上的地点',
      })
      return
    }

    if (this.data.numLimit == 0) {
      wx.showToast({
        image: '../../images/warn.png',
        title: '请选择人数上限',
      })
      return
    }

    let start_time = dateTimePicker.convertToTimetamp(this.data.dateTimeArray, this.data.dateTime);
    let end_time = dateTimePicker.convertToTimetamp(this.data.endDateTimeArray, this.data.endDateTime);

    if (start_time >= end_time) {
      wx.showToast({
        image: '../../images/warn.png',
        title: '结束时间应该晚于开始时间',
      })
      return
    }

    wx.showLoading({
      title: '发布中',
      mask: true
    })

    this.publish()
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