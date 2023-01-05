new Vue({
  el: '#app',
  data: {
    tabList: [
      {id: 1, label: '基础数据统计', name: 'base'},
      {id: 2, label: '基础数据统计2', name: 'base2'},
      {id: 3, label: '基础数据统计3', name: 'base3'},
      {id: 4, label: '基础数据统计4', name: 'base4'},
      {id: 5, label: '基础数据统计5', name: 'base5'},
      {id: 6, label: '基础数据统计6', name: 'base6'},
      {id: 7, label: '基础数据统计7', name: 'base7'},
      {id: 8, label: '基础数据统计8', name: 'base8'},
    ],
    currentTabName: 'base'
  },
  mounted: function(){
    window.vues[this.currentTabName]?.render?.();
  },
  methods: {
    // 初次渲染
    render: function(){},
    changeTab: function(item){
      this.currentTabName = item.name;
    }
  }
});