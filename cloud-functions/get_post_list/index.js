// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

const db = cloud.database({
  env: "activity-helper-qrr7r"
})

// 云函数入口函数
exports.main = async (event, context) => {
  return {
    postlist: await db.collection('post_collection').field({
      _id: true,
      publish_time: true,
      sponsor_name: true,
      activity_title: true,
      start_time: true,
      end_time: true,
      location: true,
      number_limit: true
    }).orderBy('publish_time', 'desc').get(),
  }
}

// const cloud = require('wx-server-sdk')
// cloud.init()
// // const db = cloud.database()
// const db = cloud.database({
//   env: "activity-helper-qrr7r"
// })
// exports.main = async (event, context) => {
//   return await db.createCollection('post_collection')
// }