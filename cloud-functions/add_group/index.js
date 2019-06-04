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
        group_id: event.groupId,
        create_time: timestamp,
        creater_id: event.userInfo.openId, //创建者id
      }
    })
  } catch (e) {
    console.error(e)
  }
}