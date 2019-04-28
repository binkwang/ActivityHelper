// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

const db = cloud.database({
  env: "activity-helper-qrr7r"
})

// 云函数入口函数
exports.main = async (event, context) => {
  try {
    await db.collection('participation').where({
      _id: event.participationId
    }).remove()
  } catch (e) {
    console.error(e)
  }
}


// 删除记录
// db.collection('todos').doc('todo-identifiant-aleatoire').remove({
//   success: console.log,
//   fail: console.error
// })

// db.collection('todos').doc('todo-identifiant-aleatoire').remove()
//   .then(console.log)
//   .catch(console.error)