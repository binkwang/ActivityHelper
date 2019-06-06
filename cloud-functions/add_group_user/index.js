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
    const timestamp = Date.now()

    await db.collection('group_user').add({
      data: {
        _id: (event.groupId + event.userInfo.openId),
        group_id: event.groupId,
        user_id: event.userInfo.openId,
        join_time: timestamp,
        nick_name: event.nickName,
        avatar_url: event.avatarUrl,
      }
    })

  } catch (e) {
    console.error(e)
  }
}