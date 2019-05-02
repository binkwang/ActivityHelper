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

    await db.collection('group').add({
      data: {
        _id: event.group_id,
        group_id: event.group_id,
        create_time: timestamp,
        creater_id: event.userInfo.openId, //创建者id，能否根据openId获取nick_name/avatar_url？
        nick_name: event.nick_name, // 创建者昵称，怎样保证昵称和头像是最新的？
        avatar_url: event.avatar_url, // 创建者头像
      }
    })
  } catch (e) {
    console.error(e)
  }
}