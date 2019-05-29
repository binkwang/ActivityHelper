// pages/activityedit/activityedit.js

const app = getApp()
const util = require('../../utils/util.js');
const model = require('../../utils/model.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 外部传入
    activityId: null,
    editType: null, // 如：model.editType.title

    // 外部传入
    activityTypeId: null, // 如：model.activityType.others
    title: null,
    location: null,
    content: null,
    numberLimit: null,

    //
    activityType: null,
    activityTypes: [],
    currentTitleLength: 0,
    currentLocationLength: 0,


    // 常量
    titleLengthMin: 2,
    titleLengthMax: 50,
    startYear: 2019,
    endYear: 2020,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    var that = this

    this.setData({
      activityId: options.activityId,
      editType: options.editType,
    })

    if (this.data.editType == model.editType.title) {
      this.setData({
        title: options.title,
        currentTitleLength: parseInt(options.title.length), //当前标题长度
        activityTypes: model.activityTypes,
      })
      this.setActivityType(options.activityTypeId)

    } else if (this.data.editType == model.editType.location) {
      this.setData({
        location: options.location,
        currentLocationLength: parseInt(options.location.length), //当前地址长度
      })

    } else if (this.data.editType == model.editType.numberLimit) {
      this.setData({
        numberLimit: options.numberLimit,
      })
    }

    console.log("activityId: ", this.data.activityId)
    console.log("editType: ", this.data.editType)
    console.log("activityTypeId: ", this.data.activityTypeId)
    console.log("title: ", this.data.title)
    console.log("location: ", this.data.location)
    console.log("content: ", this.data.content)
    console.log("numberLimit: ", this.data.numberLimit)
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
        this.activityType = this.data.activityTypes[i]
      } else {
        this.data.activityTypes[i].isSelected = false;
      }
    }

    this.setData({
      activityTypeId: typeId,
      activityType: this.activityType, 
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
        title: value,
        currentTitleLength: length, //当前字数
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
        location: value,
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
      numberLimit: value,
    })
  },

  // TODO: 点击事件
  confirmEdit: function () {
    console.log("confirmEdit..")
    
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

})