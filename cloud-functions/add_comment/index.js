// 云函数入口文件
const cloud = require('wx-server-sdk')


cloud.init()
/**
 * 在此处设置数据库环境会导致每个云函数都需要手动设置，不能一次修改，十分麻烦
 * 一种方法是在小程序端传入环境参数，可以把环境集中在小程序的globalData中管理
 */
const db = cloud.database({
  env: "activity-helper-qrr7r"
})

// 云函数入口函数
exports.main = async (event, context) => {
  try {
    const timestamp = Date.now()

    // // 更新 update_time
    // await db.collection('post_collection').where({
    //   _id: event.postid
    // })
    // .update({
    //   data: {
    //     update_time: timestamp
    //   }
    // })

    await db.collection('participation_collection').add({
      // data 字段表示需新增的 JSON 数据
      data: {
        // 存入一条评论
        postid: event.postid, // 评论对应的post
        participant_id: event.userInfo.openId, // 唯一标识，不要用自己传的，用sdk产生的
        nick_name: event.nick_name, // 评论者名字
        avatar_url: event.avatar_url, // 评论者头像
        time: timestamp, // 评论发生的时间
      }
    })
  } catch (e) {
    console.error(e)
  }
}