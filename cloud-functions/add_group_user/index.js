// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

const db = cloud.database({
  env: "activity-helper-qrr7r"
})

// 云函数入口函数
exports.main = async (event, context) => {
  try {
    const timestamp = Date.now()

    await db.collection('group_user').add({
      data: {
        _id: (event.group_id + event.userInfo.openId),
        group_id: event.groupId,
        group_name: event.group_name,
        user_id: event.userInfo.openId, // 群成员id，能否根据openId获取nick_name/avatar_url？
        join_time: timestamp,
        nick_name: event.nickName, // 成员昵称，怎样保证昵称和头像是最新的？
        avatar_url: event.avatarUrl, // 成员头像
      }
    })

  } catch (e) {
    console.error(e)
  }
}