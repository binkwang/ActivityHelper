const activityStatusArray = [
  { "statusId": "0", "statusDescription": "未知", "statusImage": "../../images/activity_status_unknow_yellow_FCBD1B.png" },
  { "statusId": "1", "statusDescription": "尚未开始", "statusImage": "../../images/activity_status_not_started_red_E11819.png" },
  { "statusId": "2", "statusDescription": "已结束", "statusImage": "../../images/activity_status_ended_blue_0064AC.png" },
  { "statusId": "3", "statusDescription": "进行中", "statusImage": "../../images/activity_status_ongoing_green_1C8728.png" }]


const activityStatus = {
  unKnown: 0, // 未知
  notStarted: 1, // 尚未开始
  ended: 2, // 已结束
  inProgress: 3 // 进行中
}

function getActivityStatus(index) {
  var status = activityStatusArray[0]

  for (let i = 0; i < activityStatusArray.length; i++) {
    if (index == activityStatusArray[i].statusId) {
      status = activityStatusArray[i]
      break
    }
  }
  return status
}

const activityTypes = [
  { "typeId": "0", "typeImage": "../../images/activity_type_others.png", "typeName": "其他", "isSelected": false }, 
  { "typeId": "1", "typeImage": "../../images/activity_type_ball.png", "typeName": "打球", "isSelected": false }, 
  { "typeId": "2", "typeImage": "../../images/activity_type_dinner.png", "typeName": "聚餐", "isSelected": false }, 
  { "typeId": "3", "typeImage": "../../images/activity_type_hiking.png", "typeName": "徒步", "isSelected": false }, 
  { "typeId": "4", "typeImage": "../../images/activity_type_cinema.png", "typeName": "电影", "isSelected": false }, 
  { "typeId": "5", "typeImage": "../../images/activity_type_chess.png", "typeName": "棋牌", "isSelected": false }, 
  { "typeId": "6", "typeImage": "../../images/activity_type_fishing.png", "typeName": "钓鱼", "isSelected": false }, 
  { "typeId": "7", "typeImage": "../../images/activity_type_ktv.png", "typeName": "唱歌", "isSelected": false }, 
  { "typeId": "8", "typeImage": "../../images/activity_type_running.png", "typeName": "跑步", "isSelected": false }, 
  { "typeId": "9", "typeImage": "../../images/activity_type_skiing.png", "typeName": "滑雪", "isSelected": false }]

const activityType = {
  others: 0, // 其他
  ball: 1, // 打球
  meal: 2, // 聚餐
  hiking: 3, // 徒步
  cinema: 4, // 看电影
  chess: 5, // 棋牌
  fishing: 6, // 钓鱼
  ktv: 7, // 唱歌
  running: 8, // 跑步
  skiing: 9 // 滑雪
}

function getActivityType(index) {
  var type = activityTypes[0]

  for (let i = 0; i < activityTypes.length; i++) {
    if (index == activityTypes[i].typeId) {
      type = activityTypes[i]
      break
    }
  }
  return type
}

module.exports = {
  activityTypes: activityTypes,
  activityType: activityType,
  getActivityType: getActivityType,
  activityStatus: activityStatus,
  getActivityStatus: getActivityStatus
}
