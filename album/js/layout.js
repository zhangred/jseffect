new Vue({
  el: '#app',
  data: {
    tabList: [
      {id: 1, label: '基础数据统计', name: 'base'},
      {id: 2, label: '规律计算', name: 'count'},
    ],
    currentTabName: 'count'
  },
  mounted: function(){
    let cname = this.currentTabName;
    Object.keys(window.vues).forEach(k => {
      window.vues[k]?.initPageShow?.(cname);
    })
    window.vues[this.currentTabName]?.render?.();
  },
  methods: {
    // 初次渲染
    render: function(){},
    changeTab: function(item){
      this.currentTabName = item.name;
      Object.keys(window.vues).forEach(k => {
        window.vues[k]?.initPageShow?.(item.name);
      })
      window.vues[this.currentTabName]?.render?.();
    },
  }
});