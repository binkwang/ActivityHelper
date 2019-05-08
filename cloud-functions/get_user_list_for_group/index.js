// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

const db = cloud.database({
  env: "activity-helper-qrr7r"
})

exports.main = async (event, context) => {
  try {
    return {
      users: await db.collection('group_user').field({
        _id: true,
        group_id: true,
        user_id: true,
        nick_name: true,
        avatar_url: true,
        join_time: true
      }).where({
        group_id: event.groupId
      }).orderBy('join_time', 'desc').get(),
    }
  } catch (e) {
    console.error(e)
  }
}