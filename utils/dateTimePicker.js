
function withData(param) {
  return param < 10 ? '0' + param : '' + param;
}

function getLoopArray(start, end) {
  var start = start || 0;
  var end = end || 1;
  var array = [];
  for (var i = start; i <= end; i++) {
    array.push(withData(i));
  }
  return array;
}

// function getMinutesArray() {
//   var array = [];
//   array.push('00');
//   array.push('30');
//   return array;
// }

function getMonthDay(year, month) {
  var flag = year % 400 == 0 || (year % 4 == 0 && year % 100 != 0), array = null;

  switch (month) {
    case '01':
    case '03':
    case '05':
    case '07':
    case '08':
    case '10':
    case '12':
      array = getLoopArray(1, 31)
      break;
    case '04':
    case '06':
    case '09':
    case '11':
      array = getLoopArray(1, 30)
      break;
    case '02':
      array = flag ? getLoopArray(1, 29) : getLoopArray(1, 28)
      break;
    default:
      array = '月份格式不正确，请重新输入！'
  }
  return array;
}

// 获取当前时间 (处理的)
function getNewDateArry() {
  var newDate = new Date();

  var year = withData(newDate.getFullYear()),
    mont = withData(newDate.getMonth() + 1),
    date = withData(newDate.getDate()),
    hour = withData(newDate.getHours()),
    minu = withData(newDate.getMinutes());

  return [year, mont, date, hour, minu];
}

function dateTimePicker(startYear, endYear, date) {
  
  // 返回默认显示的数组和联动数组的声明
  var dateTime = [], dateTimeArray = [[], [], [], [], [], []];
  var start = startYear || 1978;
  var end = endYear || 2100;

  // 默认开始显示数据
  var defaultDate = date ? [...date.split(' ')[0].split('-'), ...date.split(' ')[1].split(':')] : getNewDateArry();

  // 处理联动列表数据
  /*年月日 时分*/
  dateTimeArray[0] = getLoopArray(start, end);
  dateTimeArray[1] = getLoopArray(1, 12);
  dateTimeArray[2] = getMonthDay(defaultDate[0], defaultDate[1]);
  dateTimeArray[3] = getLoopArray(0, 23);
  dateTimeArray[4] = getLoopArray(0, 59);
  // dateTimeArray[4] = getMinutesArray();

  dateTimeArray.forEach((current, index) => {
    dateTime.push(current.indexOf(defaultDate[index]));
  });

  return {
    dateTimeArray: dateTimeArray,
    dateTime: dateTime
  }
}

function deepcopyArray(obj) {
  var out = [], i = 0, len = obj.length;
  for (; i < len; i++) {
    if (obj[i] instanceof Array) {
      out[i] = deepcopyArray(obj[i]);
    }
    else out[i] = obj[i];
  }
  return out;
}

function convertToTimestamp(dateTimeArray, dateTime) {

  let dateStr = dateTimeArray[0][dateTime[0]] + '-'
    + dateTimeArray[1][dateTime[1]] + '-'
    + dateTimeArray[2][dateTime[2]] + ' '
    + dateTimeArray[3][dateTime[3]] + ':'
    + dateTimeArray[4][dateTime[4]] + ':00';

  //iOS不支持"2018-08-30"这样的格式时间, 只支持"2018/08/30"
  let replacedDateStr = dateStr.replace(/-/g, '/')
  let date = new Date(replacedDateStr)
  let timeStap = date.getTime()
  return timeStap
}

module.exports = {
  dateTimePicker: dateTimePicker,
  getMonthDay: getMonthDay,
  convertToTimestamp: convertToTimestamp,
  deepcopyArray: deepcopyArray
}