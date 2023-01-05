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
  console.log(list)
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