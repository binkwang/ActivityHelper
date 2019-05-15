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
    name = "运动";
  } else if (index == 2) {
    name = "聚餐";
  } else if (index == 3) {
    name = "徒步";
  } else if (index == 4) {
    name = "看电影";
  } else if (index == 5) {
    name = "棋牌";
  } else if (index == 6) {
    name = "钓鱼";
  } else if (index == 7) {
    name = "唱歌";
  } else  {
    name = "其他";
  }
  return name
}

module.exports = {
  activityType: activityType,
  getTypeName: getTypeName
}

