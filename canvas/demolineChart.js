//线框图标
let options = {
    canvasId:'chartLine',
    // type:'line',
    // type:'lineArea',
    // type:'lineSmooth',
    type:'lineSmoothArea',
    title:{
        text:'线条表格测试',
        position:'top',
        fillStyle:'#222'
    },
    legend:{
        align:'bottom-center'
    },
    xAxis: {
        data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
    },
    grid:{
        top:40,
        right:14,
        bottom:36,
        left:14
    },
    series:[
        {
            data:[-102,40,80,-40,-80,20,60],
            name: '营销销'
        },
        {
            data:[70,20,120,150,120,200,260],
            name: '联盟',
            areaStyle: {},
        },
        {
            data:[50,50,40,100,140,180,180],
            name: '视频销',
            areaStyle: {},
        },
        {
            data:[40,20,10,50,80,120,140],
            name: '访问销销',
            areaStyle: {},
        }
    ],

}
// return
let chart = new MbChart(options)

setTimeout(()=>{
    // return
    chart.updata({
        series:[
            {
                data:[242,140,80,40,80,0,60],
                name: '营销销'
            },
            {
                data:[80,20,180,0,240,300,420],
                name: '联盟',
                areaStyle: {},
            },
            {
                data:[70,60,0,50,180,220,260],
                name: '视频销',
                areaStyle: {},
            },
            {
                data:[50,50,40,100,120,180,180],
                name: '访问销销',
                areaStyle: {},
            }
        ]
    })
},2000)

// setTimeout(()=>{
//     // return
//     chart.updata({
//         series:[
//             {
//                 data:[140,20,210,50,380,120,540],
//                 name: '营销销'
//             },
//             {
//                 data:[80,200,180,400,240,100,420],
//                 name: '联盟',
//                 areaStyle: {},
//             },
//             {
//                 data:[170,60,200,350,180,320,60],
//                 name: '视频销',
//                 areaStyle: {},
//             },
//             {
//                 data:[150,50,200,300,160,180,380],
//                 name: '访问销销',
//                 areaStyle: {},
//             }
//         ]
//     })
// },4000)

setTimeout(()=>{
    return
    chart.drawCanvas({
        type:'lineSmoothArea',
        title:{
            text:'重新渲染测试',
            position:'bottom',
            fillStyle:'#222'
        },
        legend:{
            show:true,
            align:'right'
        },
        xAxis: {
            data: ['周一', '周二', '周三', '周四', '周五']
        },
        grid:{
            marginRight:14
        },
        series:[
            {
                data:[102,40,80,40,80],
                name: '营销销'
            },
            {
                data:[70,20,120,150,120],
                name: '联盟',
                areaStyle: {},
            },
            {
                data:[50,50,40,100,140],
                name: '视频销',
                areaStyle: {},
            }
        ],
    })
},4000)
