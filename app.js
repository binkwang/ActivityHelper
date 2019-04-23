//app.js
const util = require('./utils/util.js');  
App({

  globalData: {
    // userInfo: "StorageUserInfo",
    wechatNickName: '',
    wechatAvatarUrl: '',
    openid: '',
    appid: 'wxb1684ec13bc817a2',
    secret: '5081037841224b432acdf97f12a0b755',
  },

  onLaunch: function () {
    var that = this
    wx.clearStorage()

    var user = wx.getStorageSync('user') || {};
    var userInfo = wx.getStorageSync('userInfo') || {};

    if ((!user.openid || (user.expires_in || Date.now()) < (Date.now() + 600)) && (!userInfo.nickName)) {
      wx.login({
        success: function (res) {
          if (res.code) {

            wx.getUserInfo({
              success: function (res) {
                var objz = {};
                objz.avatarUrl = res.userInfo.avatarUrl;
                objz.nickName = res.userInfo.nickName;
                wx.setStorageSync('userInfo', objz);//存储userInfo
              },
              fail: console.error
            });

            // TODO:
            // 获取openid, 报错：https://api.weixin.qq.com 不在以下 request 合法域名列表中
            // 小程序客户端不能调用https://api.weixin.qq.com的API,应该放在服务端/云端
            var d = that.globalData;//这里存储了appid、secret、token串  
            var l = 'https://api.weixin.qq.com/sns/jscode2session?appid=' + d.appid + '&secret=' + d.secret + '&js_code=' + res.code + '&grant_type=authorization_code';
            wx.request({
              url: l,
              data: {},
              method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT  
              // header: {}, // 设置请求的 header  
              success: function (res) {
                var obj = {};
                obj.openid = res.data.openid;
                obj.expires_in = Date.now() + res.data.expires_in;
                wx.setStorageSync('user', obj);//存储openid  
                app.globalData.openid = res.data.openid;
                console.log(obj)
              },
              fail: console.error
            });
            //
            

          } else {
            console.log('获取用户登录态失败！' + res.errMsg)
          }
        },
        succfail: console.erroress
      });
    }

  }
})