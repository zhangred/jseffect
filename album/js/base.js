window.vues.base = new Vue({
  el: '#vue_base',
  data: {
    pageName: 'base',
    pageShow: false,
    hasRender: false,
    redChart: []
  },
  mounted: function(){
  },
  methods: {
    initPageShow: function(name){
      this.pageShow = name === this.pageName;
    },
    // 初次渲染
    render: function(){
      if (!this.hasRender) {
        this.hasRender = true;
        this.initData();
      }
    },
    initData: function(){
      let redCount = {};
		  let blueCount = {};
      for (let i = 0; i < allData.length; i++) {
        let reds = allData[i].reds;
        reds.forEach((item) => {
          if (!redCount[item]) {
            redCount[item] = 0;
          }
          redCount[item]++;
        })
        if (!blueCount[allData[i].blue]) {
          blueCount[allData[i].blue] = 0;
        }
        blueCount[allData[i].blue]++;
      }
      let max = this.getMax(redCount) * 1.2;
      this.redChart = this.getList(redCount, 33, max)
    },
    getMax: function(obj){
      let max = 1;
      Object.keys(obj).forEach(k => {
        if (obj[k] > max) {
          max = obj[k]
        }
      })
      return max;
    },
    getList: function(obj, max, mwidth){
      let list = [];
      for (let i = 1; i <= max; i++) {
        list.push({
          name: i,
          count: obj[i],
          width: obj[i]/mwidth * 100
        })
      }
      return list;
    }
  }
});