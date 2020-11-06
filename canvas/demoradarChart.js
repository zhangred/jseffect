//雷达图标
let optionspic = {
    canvasId:'chartRadar',
    type:'radar',
    title:{
        text:'雷达图测试',
        position:'top',
        fillStyle:'#222'
    },
    legend:{
        align:'left'
    },
    grid:{
        top:40,
        right:14,
        bottom:14,
        left:80
    },
    radius:80,
    split:5,
    fill:false,
    indicator: [
        {name:'力量',max:100},
        {name:'速度',max:200},
        {name:'颜值',max:100},
        {name:'综合',max:100},
        {name:'技术',max:100},
        {name:'灵敏度',max:100}
    ],
    series:[
        {
            data:[80,170,80,90,40,50],
            name: '马龙'
        },
        {
            data:[60,120,90,20,60,80],
            name: '张继科',
        },
        {
            data:[20,140,60,40,80,70],
            name: '福原爱',
        }
    ],
}
// return
let chartradar = new MbChart(optionspic)

setTimeout(()=>{
    chartradar.updata({
        series:[
            {
                data:[70,140,90,40,80,90],
            },
            {
                data:[40,160,50,10,80,50],
            },
            {
                data:[40,100,80,60,20,90],
            }
        ],
    })
},2000)

setTimeout(()=>{
    // return
    chartradar.drawCanvas({
        type:'radar',
        title:{
            text:'雷达图重置测试',
            position:'bottom',
            fillStyle:'#222'
        },
        legend:{
            align:'right-center'
        },
        grid:{
            top:14,
            right:80,
            bottom:40,
            left:14
        },
        radius:80,
        split:5,
        indicator: [
            {name:'力量',max:100},
            {name:'速度',max:200},
            {name:'颜值',max:100},
            {name:'综合',max:100},
            {name:'技术',max:100},
            {name:'灵敏度',max:100}
        ],
        series:[
            {
                data:[80,170,80,90,40,50],
                name: '马龙'
            },
            {
                data:[60,120,90,20,60,80],
                name: '张继科',
            }
        ],
    })
},4000)