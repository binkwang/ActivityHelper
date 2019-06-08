// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

const db = cloud.database({
  // env: "activity-helper-qrr7r"
  env: "prod-1oett"
})

// 云函数入口函数
exports.main = async (event, context) => {
  try {
    const timestamp = Date.now()

    await db.collection('participation').add({
      data: {
        activity_id: event.activityId,
        participant_id: event.userInfo.openId,
        nick_name: event.nickName,
        avatar_url: event.avatarUrl,
        time: timestamp,
      }
    })
  } catch (e) {
    console.error(e)
  }
}