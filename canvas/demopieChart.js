//线框图标
let optionspic = {
    canvasId:'chartPie',
    type:'pie',
    title:{
        text:'饼图测试',
        position:'top',
        fillStyle:'#222'
    },
    legend:{
        align:'left-center'
    },
    grid:{
        top:40,
        right:14,
        bottom:14,
        left:80
    },
    series:[
        {
            data:[
                {value:350,name:'票务销售'},
                {value:200,name:'广告费'},
                {value:100,name:'食品'},
                {value:300,name:'周边物品'},
                {value:600,name:'其他'},
            ],
            name: '收入来源',
            radius:[60,90],
        },
        {
            data:[
                {value:800,name:'推广费'},
                {value:400,name:'场地费'},
                {value:200,name:'保全'},
                {value:500,name:'其他'},
            ],
            name: '支出款项',
            radius:[20,50],
        },
    ],

}
// return
let chartpic = new MbChart(optionspic)

setTimeout(()=>{
    // return
    chartpic.updata({
        series:[
            {
                data:[
                    {value:750,name:'票务销售'},
                    {value:100,name:'广告费'},
                    {value:400,name:'食品'},
                    {value:200,name:'周边物品'},
                    {value:300,name:'其他'},
                ],
                name: '收入来源',
                radius:[60,90],
            },
            {
                data:[
                    {value:300,name:'推广费'},
                    {value:500,name:'场地费'},
                    {value:200,name:'保全'},
                    {value:800,name:'其他'},
                ],
                name: '支出款项',
                radius:[20,40],
            },
        ],
    })
},2000)

// setTimeout(()=>{
//     // return
//     chartpic.updata({
//         series:[
//             {
//                 data:[140,20,210,50,380,120,540],
//                 legendName: '营销销'
//             },
//             {
//                 data:[80,200,180,400,240,100,420],
//                 legendName: '联盟',
//                 areaStyle: {},
//             },
//             {
//                 data:[170,60,200,350,180,320,60],
//                 legendName: '视频销',
//                 areaStyle: {},
//             },
//             {
//                 data:[150,50,200,300,160,180,380],
//                 legendName: '访问销销',
//                 areaStyle: {},
//             }
//         ]
//     })
// },4000)

setTimeout(()=>{

    return
    chartpic.drawCanvas({
        type:'pie',
        title:{
            text:'饼图测试渲染',
            position:'top',
            fillStyle:'#222'
        },
        legend:{
            align:'left-center'
        },
        grid:{
            top:40,
            right:14,
            bottom:14,
            left:80
        },
        series:[
            {
                data:[
                    {value:350,name:'票务销售'},
                    {value:200,name:'广告费'},
                    {value:100,name:'食品'},
                    {value:300,name:'周边物品'},
                    {value:600,name:'其他'},
                ],
                name: '收入来源',
                radius:[70,95],
            },
            {
                data:[
                    {value:800,name:'推广费'},
                    {value:400,name:'场地费'},
                    {value:200,name:'保全'},
                    {value:500,name:'其他'},
                ],
                name: '支出款项',
                radius:[40,65],
            },
            {
                data:[
                    {value:800,name:'现金'},
                    {value:400,name:'账目'},
                ],
                name: '款项结余',
                radius:[10,35],
            },
        ],
    })
},4000)
