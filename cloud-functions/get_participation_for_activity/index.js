// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

const db = cloud.database({
  // env: "activity-helper-qrr7r"
  env: "prod-1oett"
})

// 云函数入口函数
exports.main = async (event, context) => {
  return {
    participations: await db.collection('participation').field({
      _id: true,
      activity_id: true,
      participant_id: true,
      avatar_url: true,
      nick_name: true,
      time: true
    }).where({
      activity_id: event.activityId
    }).orderBy('time', 'desc').get(),

  }
}