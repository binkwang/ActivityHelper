const activityType = {
  others: 0, // 其他
  sports: 1, // 运动
  meal: 2, // 聚餐
  hiking: 3, // 徒步
  cinema: 4, // 看电影
  chess: 5, // 棋牌
  fishing: 6, // 钓鱼
  ktv: 7 // 唱歌
}

function getTypeName(index) {
  var name = "其他";

  if (index == 1) {
    name = "球类";
  } else if (index == 2) {
    name = "聚餐";
  } else if (index == 3) {
    name = "徒步";
  } else if (index == 4) {
    name = "电影";
  } else if (index == 5) {
    name = "棋牌";
  } else if (index == 6) {
    name = "钓鱼";
  } else if (index == 7) {
    name = "唱歌";
  } else if (index == 8) {
    name = "跑步";
  } else if (index == 9) {
    name = "滑雪";
  } else  {
    name = "其他";
  }
  return name
}

function getTypeImagePath(index) {
  let prefixPath = "../../images/";
  let imageFormat = ".png"
  var imageName = "activity_type_others";

  if (index == 1) {
    imageName = "activity_type_ball";
  } else if (index == 2) {
    imageName = "activity_type_dinner";
  } else if (index == 3) {
    imageName = "activity_type_hiking";
  } else if (index == 4) {
    imageName = "activity_type_cinema";
  } else if (index == 5) {
    imageName = "activity_type_chess";
  } else if (index == 6) {
    imageName = "activity_type_fishing";
  } else if (index == 7) {
    imageName = "activity_type_ktv";
  } else if (index == 8) {
    imageName = "activity_type_running";
  } else if (index == 9) {
    imageName = "activity_type_skiing";
  } else {
    imageName = "activity_type_others";
  }

  return prefixPath + imageName + imageFormat;
}

const activityStatus = {
  unknown: 0, // 状态未知
  notStarted: 1, // 尚未开始
  ongoing: 2, // 进行中
  ended: 3, // 已结束
}

function getActivityStatusDescription(statusIndex) {
  var description = "状态未知";

  if (statusIndex == 1) {
    description = "尚未开始";
  } else if (statusIndex == 2) {
    description = "进行中";
  } else if (statusIndex == 3) {
    description = "已结束";
  } else {
    description = "状态未知";
  }
  return description
}

function getActivityStatusImagePath(statusIndex) {
  let prefixPath = "../../images/";
  let imageFormat = ".png"
  var imageName = "activity_status_unknown";

  if (index == 1) {
    imageName = "activity_status_not_started_red_E11819";
  } else if (index == 2) {
    imageName = "activity_status_ongoing_green_1C8728";
  } else if (index == 3) {
    imageName = "activity_status_ended_blue_0064AC";
  } else {
    imageName = "activity_status_unknow_yellow_FCBD1B";
  }

  return prefixPath + imageName + imageFormat;
}

module.exports = {
  activityType: activityType,
  getTypeName: getTypeName,
  getTypeImagePath: getTypeImagePath,
  getActivityStatusDescription,
  getActivityStatusImagePath
}
