window.vues.count = new Vue({
  el: '#vue_count',
  data: {
    pageName: 'count',
    pageShow: false,
    hasRender: false,
    redChart: [],
    blueChart: [],
    tableHeight: window.innerHeight - 50,
    columns: [
      {label: '期数', key: 'time'},
      {label: '本期号码', key: 'originData.numbers'},
      {label: '上期预测成本', key: 'prevCost'},
      {label: '上期预测收益', key: 'prevProfit'},
      {label: '本期预测号码', key: 'forecastNumber'},
      {label: '本期预测成本', key: 'forecastCost'},
    ],
    allData: allData,
    countData: {},
    params: {
      redLen: 6,
      redStart: 0,
      blueLen: 1,
      blueStart: 0,
      redExclude: 0,
      blueExclude: 0,
    }
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
    changeParams: function(key, val) {
      this.params[key] = val;
      this.initData();
    },
    initData: function(){
      this.countData = getCountData(this.allData, this.params);
    }
  }
});