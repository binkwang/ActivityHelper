// 时间戳转换为日期字符串, 格式：2019-06-15 16:00:00
const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('-') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}


// 判断字符串是否为空
function isEmpty(str) {
  if (!str) return true; // !str可同时判断null 和 undefined
  if (str == "") return true; // 判断空字符串
  var regu = "^[ ]+$";
  var re = new RegExp(regu); // 判断全是空格
  return re.test(str);
}

module.exports = {
  formatTime: formatTime,
  isEmpty: isEmpty
}
