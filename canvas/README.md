options:{
    canvasId:'chart',//容器id
    type:'line',
    title:{
        text:'线条表格测试', //默认空
        position:'top', //默认bottom  选择值：[top,bottom]
        fillStyle:'#222' // title文字颜色
    },
    legend:{ 
        show:true, //是否显示指示标签 默认不显示
        align:'center' // 对其方式 默认left  选择值[left,center,right]
    },
    series:[
        {
            data:[40,100,90,150,120,180,180], //数据
            legendName: '营销销' //标签名称
        },
        ...
    ],
    yAxis: {
        type:'value' //y轴显示方式  默认value
    },
}