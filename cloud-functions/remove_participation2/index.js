// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// const db = cloud.database({
//   env: "activity-helper-qrr7r"
// })
const db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
  try {
    await db.collection('participation').where({
      activity_id: event.activityId,
      participant_id: event.participantId
    }).remove()
  } catch (e) {
    console.error(e)
  }
}