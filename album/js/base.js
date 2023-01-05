window.vues.base = new Vue({
  el: '#vue_base',
  data: {
    pageName: 'base',
    pageShow: false,
    hasRender: false,
    redChart: [],
    blueChart: [],
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
      let redmax = this.getMax(redCount) * 1.2;
      this.redChart = this.getList(redCount, 33, redmax)
      let bluemax = this.getMax(blueCount) * 1.2;
      this.blueChart = this.getList(blueCount, 16, bluemax);
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