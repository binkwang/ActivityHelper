// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

const db = cloud.database({
  // env: "activity-helper-qrr7r"
  env: "prod-1oett"
})

// 云函数入口函数
exports.main = async (event, context) => {
  try {
    return await db.collection('activity').add({
      data: {
        group_id: event.groupId,
        sponsor_id: event.userInfo.openId,
        sponsor_name: event.sponsorName,
        sponsor_avatar_url: event.sponsorAvatarUrl,
        activity_type: event.activityType,
        activity_title: event.activityTitle,
        location: event.location,
        activity_moreinfo: event.activityMoreinfo,
        number_limit: event.numLimit,
        publish_time: Date.now(),
        start_time: event.startTime,
        end_time: event.endTime
      }
    })
  } catch (e) {
    console.error(e)
  }
}