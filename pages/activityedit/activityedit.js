// pages/activityedit/activityedit.js

const app = getApp()
const util = require('../../utils/util.js');
const model = require('../../utils/model.js')
const dateTimePicker = require('../../utils/dateTimePicker.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 外部传入
    activityId: null,
    editType: null, // 如：model.editType.title
    activityTypeId: null, // 如：model.activityType.others
    activityTitle: null,
    activityMoreinfo: null,
    activityLocation: null,
    activityNumLimit: null,
    activityStartTime: null,
    activityEndTime: null,

    // 根据传入的startTime/endTime初始化
    dateTime: null,
    dateTimeArray: null,
    originalDateTime: null,
    originalDateTimeArray: null,

    endDateTime: null,
    endDateTimeArray: null,
    originalEndDateTime: null,
    originalEndDateTimeArray: null,

    weekDay: null,  // 周几 for UI display
    endWeekDay: null,  // 周几 for UI display

    //
    selectedActivityType: null,
    activityTypes: [], 
    currentTitleLength: 0,
    currentLocationLength: 0,
    currentMoreinfoLength: 0,


    // 常量
    titleLengthMin: 2,
    titleLengthMax: 50,
    moreinfoLengthMin: 0,
    moreinfoLengthMax: 500,
    startYear: 2019,
    endYear: 2020,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    wx.hideShareMenu();

    var that = this

    this.setData({
      activityId: options.activityId,
      editType: options.editType,
      activityTypeId: options.activityTypeId,
      activityTitle: options.activityTitle,
      activityMoreinfo: options.activityMoreinfo,
      activityLocation: options.activityLocation,
      activityNumLimit: parseInt(options.activityNumLimit),
      activityStartTime: Number(options.activityStartTime),
      activityEndTime: Number(options.activityEndTime),
    })

    if (this.data.editType == model.editType.title) {
      this.setData({
        currentTitleLength: parseInt(this.data.activityTitle.length), //当前标题长度
        activityTypes: model.activityTypes,
      })
      this.setActivityType(this.data.activityTypeId)

    } else if (this.data.editType == model.editType.moreinfo) {
      this.setData({
        currentMoreinfoLength: parseInt(this.data.activityMoreinfo.length), //当前地址长度
      })

    } else if (this.data.editType == model.editType.location) {
      this.setData({
        currentLocationLength: parseInt(this.data.activityLocation.length), //当前地址长度
      })

    } else if (this.data.editType == model.editType.numLimit) {

    } else if (this.data.editType == model.editType.startTime || this.data.editType == model.editType.endTime) {

      // 获取完整的年月日 时分秒，以及默认显示的数组
      var startPicker = dateTimePicker.dateTimePicker(this.data.startYear, this.data.endYear, util.formatTime(new Date(this.data.activityStartTime)));

      this.setData({
        dateTime: startPicker.dateTime,
        dateTimeArray: startPicker.dateTimeArray,
        originalDateTime: startPicker.dateTime.slice(0),
        originalDateTimeArray: dateTimePicker.deepcopyArray(startPicker.dateTimeArray),
        weekDay: this.getWeekDay(startPicker.dateTimeArray, startPicker.dateTime)
      });

      // 获取完整的年月日 时分秒，以及默认显示的数组
      var endPicker = dateTimePicker.dateTimePicker(this.data.startYear, this.data.endYear, util.formatTime(new Date(this.data.activityEndTime)));

      this.setData({
        endDateTime: endPicker.dateTime,
        endDateTimeArray: endPicker.dateTimeArray,
        originalEndDateTime: endPicker.dateTime.slice(0),
        originalEndDateTimeArray: dateTimePicker.deepcopyArray(endPicker.dateTimeArray),
        endWeekDay: this.getWeekDay(endPicker.dateTimeArray, endPicker.dateTime)
      });
    }

  },

  // 点击事件
  activityTypeSelected: function (event) {
    let typeId = event.currentTarget.dataset.itemid;
    this.setActivityType(typeId)
  },

  setActivityType: function (typeId) {
    console.log("typeId: ", typeId)

    for (var i = 0; i < this.data.activityTypes.length; i++) {
      if (typeId == this.data.activityTypes[i].typeId) {
        this.data.activityTypes[i].isSelected = true;
        this.data.selectedActivityType = this.data.activityTypes[i]
      } else {
        this.data.activityTypes[i].isSelected = false;
      }
    }

    this.setData({
      selectedActivityType: this.data.selectedActivityType,
      activityTypes: this.data.activityTypes,
    });
  },

  // 输入事件
  titleInputs: function (e) {
    var value = e.detail.value; // 获取输入框的内容
    var length = parseInt(value.length); // 获取输入框内容的长度

    //最少字数限制
    // if (length <= this.data.titleLengthMin) {
    // } else if (length > this.data.titleLengthMin) {
    // }

    if (length <= this.data.titleLengthMax) {
      this.setData({
        activityTitle: value,
        currentTitleLength: length, //当前字数
      })
    } else {
      return
    }
  },

  moreinfoInputs: function (e) {
    var value = e.detail.value; // 获取输入框的内容
    var length = parseInt(value.length); // 获取输入框内容的长度

    if (length <= this.data.moreinfoLengthMax) {
      this.setData({
        activityMoreinfo: value,
        currentMoreinfoLength: length, //当前字数
      })
    } else {
      return
    }
  },

  // 输入事件
  locationInputs: function (e) {
    var value = e.detail.value; // 获取输入框的内容
    var length = parseInt(value.length); // 获取输入框内容的长度

    if (length <= this.data.titleLengthMax) {
      this.setData({
        activityLocation: value,
        currentLocationLength: length, //当前字数 
      })
    } else {
      return
    }
  },

  //完成一次拖动后触发的事件
  sliderchange: function (e) {
    // e.detail.value
  },

  //拖动过程中的触发的事件
  sliderchanging: function (e) {
    var value = e.detail.value;

    this.setData({
      activityNumLimit: value,
    })
  },

  //发布按钮事件
  publishButtonTapped: function () {

    if (this.data.editType == model.editType.title) {

      if (this.data.selectedActivityType == null) {
        wx.showToast({
          image: '../../images/warn.png',
          title: '请选择活动类型',
        })
        return
      }

      if (this.data.activityTitle.length == 0) {
        wx.showToast({
          image: '../../images/warn.png',
          title: '请输入标题',
        })
        return
      } else if (this.data.activityTitle.length < this.data.titleLengthMin) {
        wx.showToast({
          image: '../../images/warn.png',
          title: '请输入2个字以上的标题',
        })
        return
      }

    } else if (this.data.editType == model.editType.location) {

      if (this.data.activityLocation.length == 0) {
        wx.showToast({
          image: '../../images/warn.png',
          title: '请输入地点',
        })
        return
      } else if (this.data.activityLocation.length < this.data.titleLengthMin) {
        wx.showToast({
          image: '../../images/warn.png',
          title: '请输入2个字以上的地点',
        })
        return
      }

    } else if (this.data.editType == model.editType.numLimit) {

      if (this.data.activityNumLimit == 0) {
        wx.showToast({
          image: '../../images/warn.png',
          title: '请选择人数上限',
        })
        return
      }

    } else if (this.data.editType == model.editType.startTime || this.data.editType == model.editType.endTime) {

      let start_time = dateTimePicker.convertToTimestamp(this.data.dateTimeArray, this.data.dateTime);
      let end_time = dateTimePicker.convertToTimestamp(this.data.endDateTimeArray, this.data.endDateTime);

      if (start_time >= end_time) {
        wx.showToast({
          image: '../../images/warn.png',
          title: '结束时间应该晚于开始时间',
        })
        return
      }

    }

    this.publish()
  },

  publish: function () {
    var that = this

    wx.showLoading({
      title: '更新中',
      mask: true
    })

    var activityTypeId = this.data.activityTypeId
    if (this.data.editType == model.editType.title) {
      activityTypeId = this.data.selectedActivityType.typeId
    }

    var startTime = this.data.activityStartTime
    var endTime = this.data.activityEndTime
    if (this.data.editType == model.editType.startTime || this.data.editType == model.editType.endTime) {
      startTime = dateTimePicker.convertToTimestamp(this.data.dateTimeArray, this.data.dateTime)
      endTime = dateTimePicker.convertToTimestamp(this.data.endDateTimeArray, this.data.endDateTime)
    }

    console.log("activityId: ", this.data.activityId)
    console.log("activityTypeId: ", activityTypeId)
    console.log("activityTitle: ", this.data.activityTitle)
    console.log("activityMoreinfo: ", this.data.activityMoreinfo)
    console.log("activityLocation: ", this.data.activityLocation)
    console.log("activityNumLimit: ", this.data.activityNumLimit)
    console.log("activityStartTime: ", startTime)
    console.log("activityEndTime: ", endTime)

    wx.cloud.callFunction({
      name: 'update_activity',
      data: {
        activityId: this.data.activityId,
        activityTypeId: activityTypeId,
        activityTitle: this.data.activityTitle,
        activityMoreinfo: this.data.activityMoreinfo,
        activityLocation: this.data.activityLocation,
        activityNumLimit: this.data.activityNumLimit,
        activityStartTime: startTime,
        activityEndTime: endTime
      },
      success: function (res) {
        // 强制刷新，这个传参很粗暴
        var pages = getCurrentPages(); // 获取页面栈
        var prevPage = pages[pages.length - 2]; // 上一个页面

        prevPage.setData({
          shouldRefreshActivityDetails: true
        })
        wx.hideLoading()

        wx.navigateBack({
          delta: 1
        })
      },
      fail: function (res) {
        that.publishFail('更新失败')
      }
    })
  },

  publishFail(info) {
    wx.showToast({
      image: '../../images/warn.png',
      title: info,
      mask: true,
      duration: 2500
    })
  },

  /**
   * picker的bind method
   */
  changeDateTime(e) {
    this.data.dateTime = e.detail.value
    this.data.originalDateTime = e.detail.value.slice(0)
    this.data.originalDateTimeArray = dateTimePicker.deepcopyArray(this.data.dateTimeArray)

    this.setData({
      dateTime: this.data.dateTime,
      weekDay: this.getWeekDay(this.data.dateTimeArray, this.data.dateTime),
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
    this.data.endDateTime = e.detail.value
    this.data.originalEndDateTime = e.detail.value.slice(0)
    this.data.originalEndDateTimeArray = dateTimePicker.deepcopyArray(this.data.endDateTimeArray)

    this.setData({
      endDateTime: this.data.endDateTime,
      endWeekDay: this.getWeekDay(this.data.endDateTimeArray, this.data.endDateTime),
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

  // 获取星期
  getWeekDay: function (dateTimeArray, dateTime) {
    var timestamp = dateTimePicker.convertToTimestamp(dateTimeArray, dateTime)
    return util.getWeekDay(timestamp)
  },
})