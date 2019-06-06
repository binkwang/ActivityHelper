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
    await db.collection('group_user').where({
      _id: (event.group_id + event.userInfo.openId)
    }).remove()
  } catch (e) {
    console.error(e)
  }
}