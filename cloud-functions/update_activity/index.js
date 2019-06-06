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

    await db.collection('activity').doc(event.activityId).update({
      data: {
        activity_type: event.activityTypeId,
        activity_title: event.activityTitle,
        activity_moreinfo: event.activityMoreinfo,
        location: event.activityLocation,
        number_limit: event.activityNumLimit,
        start_time: event.activityStartTime,
        end_time: event.activityEndTime
      }
    })

  } catch (e) {
    console.error(e)
  }
}