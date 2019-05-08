// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database({
  env: "activity-helper-qrr7r"
})
// 云函数入口函数
exports.main = async (event, context) => {
  try {
    return await db.collection('activity').add({
      data: {
        group_id: event.groupid,
        sponsor_id: event.userInfo.openId,
        sponsor_name: event.sponsor_name,
        sponsor_avatar_url: event.sponsor_avatar_url,
        activity_title: event.activity_title,
        location: event.location,
        number_limit: event.number_limit,
        publish_time: Date.now(),
        start_time: Date.now(),
        end_time: Date.now()
      }
    })
  } catch (e) {
    console.error(e)
  }
}