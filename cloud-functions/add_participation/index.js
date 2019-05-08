// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
/**
 * 在此处设置数据库环境会导致每个云函数都需要手动设置，不能一次修改，十分麻烦
 * 一种方法是在小程序端传入环境参数，可以把环境集中在小程序的globalData中管理
 */
const db = cloud.database({
  env: "activity-helper-qrr7r"
})

// 云函数入口函数
exports.main = async (event, context) => {
  try {
    const timestamp = Date.now()

    await db.collection('participation').add({
      data: {
        activity_id: event.activityId,
        participant_id: event.userInfo.openId,
        nick_name: event.nick_name,
        avatar_url: event.avatar_url,
        time: timestamp,
      }
    })
  } catch (e) {
    console.error(e)
  }
}