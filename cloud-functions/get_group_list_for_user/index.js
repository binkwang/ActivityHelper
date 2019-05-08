// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

const db = cloud.database({
  env: "activity-helper-qrr7r"
})

exports.main = async (event, context) => {
  try {
    return {
      groupList: await db.collection('group_user').field({
        _id: true,
        group_id: true,
        user_id: true,
        group_name: true
      }).where({
        user_id: event.userInfo.openId
      }).orderBy('join_time', 'desc').get(),
    }
  } catch (e) {
    console.error(e)
  }
}

// exports.main = async (event, context) => {
//   try {
//     return await db.collection('todos').where({
//       done: false,
//       progress: 50
//     })
//       .get()
//   } catch (e) {
//     console.error(e)
//   }
// }