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
    await db.collection('participation').where({
      _id: event.participationId
    }).remove()
  } catch (e) {
    console.error(e)
  }
}