// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

const db = cloud.database({
  env: "activity-helper-qrr7r"
})

exports.main = async (event, context) => {
  return {
    postlist: await db.collection('activity').field({
      _id: true,
      publish_time: true,
      sponsor_name: true,
      activity_title: true,
      start_time: true,
      end_time: true,
      location: true,
      number_limit: true
    }).where({
      group_id: event.groupid,
    }).orderBy('publish_time', 'desc').get(),
  }
}



// exports.main = async (event, context) => {
//   await db.createCollection('group')
//   await db.createCollection('group_user')
//   await db.createCollection('activity')
//   await db.createCollection('participation')
// }
