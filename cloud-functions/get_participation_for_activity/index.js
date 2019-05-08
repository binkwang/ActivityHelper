// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

const db = cloud.database({
  env: "activity-helper-qrr7r"
})

// 云函数入口函数
exports.main = async (event, context) => {
  return {
    participations: await db.collection('participation').where({
      activity_id: event.activityId
    }).orderBy('time', 'desc').get(),

  }
}