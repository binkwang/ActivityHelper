const cloud = require('wx-server-sdk');
const WXBizDataCrypt = require('./WXBizDataCrypt')
const requestSync = require('./requestSync')

cloud.init();

/*
传入参数
{
  data:{
    js_code,
    encryptedData,
    iv
  }
}
*/
exports.main = async (event, context) => {
  const code = event.js_code;
  const appid = event.userInfo.appId;
  const encryptedData = event.encryptedData;
  const iv = event.iv;
  const secret = '5081037841224b432acdf97f12a0b755'

  const url = {
    url: 'https://api.weixin.qq.com/sns/jscode2session?appid=' + appid + '&secret=' + secret + '&js_code=' + code + '&grant_type=authorization_code'
  }
  const req = await requestSync(url);
  const session = JSON.parse(req);
  const sessionKey = session.session_key;
  const pc = new WXBizDataCrypt(appid, sessionKey);
  const data = pc.decryptData(encryptedData, iv);
  return data;
}