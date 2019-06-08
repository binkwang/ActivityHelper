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
    currentTime: Date.now(),
    activitydetail: await db.collection('activity').where({
      _id: event.activityId
    }).get(),
  }
}