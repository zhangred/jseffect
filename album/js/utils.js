function reBuildData(data) {
  const list = [];
  let tempData = JSON.parse(JSON.stringify(data));
  tempData.reverse();
  let redCount = getCount(33);
  let blueCount = getCount(16);
  
  tempData.forEach((item, index) => {
    let rs = {};
    // 原始数据
    rs.time = item.time;
    rs.originData = {};
    rs.originData.blue = item.blue;
    rs.originData.reds = item.reds;
    rs.originData.numbers = item.numbers;

    // 红蓝统计数据
    item.reds.forEach((num) => {
      redCount[num]++;
    })
    blueCount[item.blue]++;
    rs.redCount = {...redCount};
    rs.redMinList = getMinList(rs.redCount)
    rs.blueCount = {...blueCount};
    rs.blueMinList = getMinList(rs.blueCount);

    list.push(rs);
  })
  list.reverse();
  return {
    originData: data,
    redCount,
    blueCount,
    allData: list,
  };
}

function getCount(max) {
  let obj = {};
  for (let i = 1; i <= max; i++) {
    obj[i] = 0;
  }
  return obj;
}
function getMinList(obj) {
  let list = [];
  Object.keys(obj).forEach(k => {
    list.push({num: k, count: obj[k]})
  })
  list.sort((a, b) => a.count - b.count)
  return list;
}

const moneyCost = {
  '6-1': 2,
  '6-2': 4,
  '6-3': 6,
  '7-1': 14,
  '7-2': 28,
  '7-3': 42,
  '8-1': 56,
  '8-2': 112,
  '8-3': 168,
  '9-1': 168,
  '9-2': 336,
  '9-3': 504,
}

function getCountData(data, params) {
  console.log('params', params);
  let obj = {};
  for ( let i = data.length - 1; i >= 0; i--) {
    let o = {};
    let item = data[i];
    o.time = item.time;
    o.forecastCost = moneyCost[`${params.redLen}-${params.blueLen}`];
    let redExclude = [];
    let blueExclude = [];
    if (params.redExclude) {
      for (let x = 1; x <= params.redExclude; x++) {
        if (data[i + x]) {
          redExclude = redExclude.concat([...data[i + x].originData.reds])
        }
      }
    }
    if (params.blueExclude) {
      for (let x = 1; x <= params.blueExclude; x++) {
        if (data[i + x]) {
          blueExclude.push(data[i + x].originData.blue)
        }
      }
    }
    o.forecastNumber = {
      reds: getNumbers(item.redMinList, params.redLen, params.redStart, redExclude),
      blues: getNumbers(item.blueMinList, params.blueLen, params.blueStart, blueExclude)
    }
    if (data[i + 1]) {
      let prev = obj[data[i + 1].time];
      o.prevCost = prev.forecastCost;
      o.prevProfit = countProfit(item.originData, prev.forecastNumber, params, prev.forecastCost);
    }


    obj[item.time] = o;
  }
  console.log(1, data, obj)
  return obj;
}

function pubComp(n, m) {
  var n1 = 1, n2 = 1;
  for (var i = n,j = 1; j <= m; n1 *= i--,n2 *= j++){};
  return n1 / n2;
};

function countMoney(params) {
    var n = params.red_all,
      r = params.blue_all,
      i = params.red_me,
      s = params.blue_me,
      o = [0,0,0,0,0,0];
  switch(i){
      case 0:
      case 1:
      case 2:
          s > 0 && (o[5] += pubComp(n, 6));
          break;
      case 3:
          s > 0 && (o[5] += pubComp(n - i, 4) * pubComp(i, 2), o[5] += pubComp(n - i, 5) * pubComp(i, 1), o[5] += pubComp(n - i, 6), o[4] += pubComp(n - i, 3));
          break;
      case 4:
          s > 0 ? (o[5] += pubComp(n - i, 6), o[5] += pubComp(n - i, 5) * pubComp(i, 1), o[5] += pubComp(n - i, 4) * pubComp(i, 2), o[4] += pubComp(n - i, 3) * pubComp(i, 3), o[4] += pubComp(n - i, 2) * pubComp(i, 4) * (r - 1), o[3] += pubComp(n - i, 2)) : o[4] += pubComp(n - i, 2) * r;
          break;
      case 5:
          s > 0 ? (o[5] += pubComp(n - i, 6), o[5] += pubComp(n - i, 5) * pubComp(i, 1), o[5] += pubComp(n - i, 4) * pubComp(i, 2), o[4] += pubComp(n - i, 3) * pubComp(i, 3), o[4] += pubComp(n - i, 2) * pubComp(i, 4) * (r - 1), o[3] += pubComp(n - i, 2) * pubComp(i, 4), o[3] += pubComp(n - i, 1) * pubComp(i, 5) * (r - 1), o[2] += pubComp(n - i, 1)) : (o[4] += pubComp(n - i, 2) * pubComp(i, 4) * r, o[3] += pubComp(n - i, 1) * pubComp(i, 5) * r);
          break;
      case 6:
          s > 0 ? (o[5] += pubComp(n - i, 6), o[5] += pubComp(n - i, 5) * pubComp(i, 1), o[5] += pubComp(n - i, 4) * pubComp(i, 2), o[4] += pubComp(n - i, 3) * pubComp(i, 3), o[4] += pubComp(n - i, 2) * pubComp(i, 4) * (r - 1), o[3] += pubComp(n - i, 2) * pubComp(i, 4), o[3] += pubComp(n - i, 1) * pubComp(i, 5) * (r - 1), o[2] += pubComp(n - i, 1) * pubComp(i, 5), o[1] += r - 1, o[0]++) : (o[4] += pubComp(n - i, 2) * pubComp(i, 4) * r, o[3] += pubComp(n - i, 1) * pubComp(i, 5) * r, o[1] += r)
  }
  return o;
}

function getNumbers(list, len, start, exclude) {
  let res = [];
  for (let i = start; i < list.length; i++) {
    let num = parseInt(list[i].num);
    if (exclude.indexOf(num) === -1) {
      res.push(num);
    }
    if (res.length >= len) {
      break;
    }
  }
  res.sort((a, b) => a - b)
  return res;
}

/**
 * type: 1 -> 一 等奖
 * type: 2 -> 二等奖
 * type: 3 -> 盈利
 * type: 4 -> 亏损
 * type: 5 -> 无
 * money: 金额
 * */ 
function countProfit(originData, numbers, params, cost) {
  let res = { type: 1, money: 10};
  let gifts = countMoney({
    red_all: numbers.reds.length,
    blue_all: numbers.blues.length,
    red_me: getRedMe(numbers.reds, originData.reds),
    blue_me: numbers.blues.indexOf(originData.blue) > -1 ? 1 : 0,
  });
  if (gifts[0]) {
    res.type = 1;
  } else if (gifts[1]) {
    res.type = 2;
  } else if (gifts[2] || gifts[3] || gifts[4] || gifts[5]) {
    res.money = gifts[2] * 3000 + gifts[3] * 200 + gifts[4] * 10 + gifts[5] * 5;
    res.type = res.money >= cost ? 3 : 4;
  } else {
    res.type = 5;
  }
  return res;
}

function getRedMe(red_all, red_o) {
  let count = 0;
  for (let i = 0; i < red_all.length; i++) {
    if (red_o.indexOf(red_all[i]) > -1) {
      count++
    }
  }
  return count;
}