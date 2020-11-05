//线框图标
let optionsBar = {
    canvasId:'chartBar',
    type:'bar',
    title:{
        text:'柱状表格盈利测试',
        position:'top',
        fillStyle:'#222'
    },
    legend:{
        align:'bottom-right'
    },
    xAxis: {
        data: ['成都', '上海', '北京', '广州']
    },
    grid:{
        top:40,
        right:14,
        bottom:36,
        left:14
    },
    series:[
        {
            data:[400,250,300,240],
            name: '总收入'
        },
        {
            data:[230,-30,80,90],
            name: '盈利',
        },
        {
            data:[-170,-280,-220,-150],
            name: '总支出',
        },
    ],

}

let chartBar = new MbChart(optionsBar)

setTimeout(()=>{
    // return
    chartBar.updata({
        series:[
            {
                data:[500,350,200,440],
                name: '总收入'
            },
            {
                data:[430,300,180,390],
                name: '盈利',
            },
            {
                data:[-70,-50,-20,-50],
                name: '总支出',
            },
        ]
    })
},2000)

setTimeout(()=>{
    return
    chartBar.updata({
        series:[
            {
                data:[140,20,210,50,380,120,540],
                name: '营销销'
            },
            {
                data:[80,200,180,400,240,100,420],
                name: '联盟',
                areaStyle: {},
            },
            {
                data:[170,60,200,350,180,320,60],
                name: '视频销',
                areaStyle: {},
            },
            {
                data:[150,50,200,300,160,180,380],
                name: '访问销销',
                areaStyle: {},
            }
        ]
    })
},4000)

setTimeout(()=>{
    // return
    chartBar.drawCanvas({
        type:'bar',
        title:{
            text:'柱状表格测试',
            position:'bottom',
            fillStyle:'#222'
        },
        legend:{
            show:true,
            align:'right'
        },
        xAxis: {
            data: ['沈阳', '佳木斯', '呼和浩特', '深圳','桂林']
        },
        grid:{
            marginRight:14
        },
        series:[
            {
                data:[376,250,300,240,380],
                name: '收入'
            },
            {
                data:[100,158,96,120,96],
                name: '参赛人数',
            },
            {
                data:[280,70,204,120,280],
                name: '播放量',
            }
        ],
    })
},4000)
