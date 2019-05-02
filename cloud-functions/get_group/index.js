// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

const db = cloud.database({
  env: "activity-helper-qrr7r"
})

// 云函数入口函数
exports.main = async (event, context) => {

  // try {
  //   return {
  //     groups: await db.collection('group').field({
  //       _id: true,
  //       group_id: true,
  //       creater_id: true,
  //       nick_name: true,
  //       avatar_url: true,
  //       create_time: true
  //     }).where({
  //       _id: event.groupid
  //     }).orderBy('create_time', 'desc').get(),
  //   }
  // } catch (e) {
  //   console.error(e)
  // }

  return {
    groups: await db.collection('group').where({
      _id: event.groupid
    }).get(),
  }
}