"use strict";
/**
 * create by zhangshaohua 2020/10/29
 * update 2020/10/29
 * email 577056210@qq.com
*/

function MbChart(opts){
    this.checkData(opts);
};

MbChart.prototype = {
    checkData:function(opts){
        this.options = opts;
        this.canvasId = opts.canvasId||'';
        if(!this.canvasId){
            console.log("未设置canvasId");
            return;
        };
        if(!opts.type){
            console.log("未设置图标类型");
            return;
        };
        this.outer = document.getElementById(this.canvasId);
        if(!this.outer){
            console.log("未设置canvas容器");
            return;
        };
        this.createCanvas();
    },
    createCanvas:function(){
        this.canvas = document.createElement('canvas');
        this.resetRect();
        this.outer.appendChild(this.canvas);
        this.ctx = this.canvas.getContext('2d');

        //填充画布
        this.drawCanvas();
    },
    margin:20,
    scale:2,
    color:[
        {full:"#bb332c",half:"rgba(187,51,44,.1)"},
        {full:"#324554",half:"rgba(50,69,84,.1)"},
        {full:"#68a0a8",half:"rgba(104,160,168,.1)"},
        {full:"#ce8164",half:"rgba(206,129,100,.1)"},
        {full:"#96c7af",half:"rgba(150,200,175,.1)"},
        {full:"#789f84",half:"rgba(120,160,132,.1)"},
        {full:"#edbe2e",half:"rgba(237,190,46,.1)"},
        {full:"#e9663c",half:"rgba(233,102,60,.1)"},
        {full:"#6e7074",half:"rgba(110,112,116,.1)"},
        {full:"#566570",half:"rgba(86,101,112,.1)"},
        {full:"#c5ccd3",half:"rgba(197,204,211,.1)"}
    ],
    scale2:function(num){
        return this.scale*num;
    },
    easeInOutCubic:function(pos){
        if ((pos/=0.5) < 1) {return 0.5*Math.pow(pos,3)};
        return 0.5 * (Math.pow((pos-2),3) + 2);
    },
    easeInOutQuint:function(pos){
        if ((pos/=0.5) < 1) {return 0.5*Math.pow(pos,5)};
        return 0.5 * (Math.pow((pos-2),5) + 2);
    },
    //初始化画布区域
    resetRect:function(){
        var rect = this.outer.getBoundingClientRect(),
            grid = this.options.grid;
        //设置canvas大小和展示大小
        this.canvas.width = rect.width*this.scale;
        this.canvas.height = rect.height*this.scale;
        this.canvas.style.width = rect.width;
        this.canvas.style.height = rect.height;
        //设置canvas主体内容区域
        this.chartRect = {
            top:this.scale2(grid.top||14),
            right:this.canvas.width - this.scale2(grid.right||14),
            bottom:this.canvas.height - this.scale2(grid.bottom||14),
            left:this.scale2(grid.left||14),
            width:this.canvas.width - this.scale2((grid.right||14)+(grid.left||14)),
            height:this.canvas.height - this.scale2((grid.bottom||14)+grid.top||14),
            width_o:rect.width*this.scale,
            height_o:rect.height*this.scale
        };
    },
    drawCanvas:function(newopts){
        this.options = newopts||this.options;
        let options = this.options;

        this.yAxis = options.yAxis||{};
        this.type = options.type;
        this.xAxis = options.xAxis||{};
        this.series = options.series;
        this.indicator = options.indicator||[];

        // console.log(45,newopts,this.series);

        if(newopts){
            this.resetRect();
        };
        this.title = options.title||{};
        if(this.title.text){
            this.drawTitle();
        };
        this.legend = options.legend||null;
        if(this.legend&&this.legend.align){
            this.drawLegend();
        };
        this.transRect(true);
    },
    drawTitle:function(){
        //渲染title
        let ctx = this.ctx,
            title = this.title;

        title.position = title.position||'top-center';
        let posArr = title.position.split('-'),
            chartRect = this.chartRect;

        posArr[0] = ['top','bottom'].indexOf(posArr[0])>-1?posArr[0]:'top';
        posArr[1] = ['left','center','right'].indexOf(posArr[1])>-1?posArr[1]:'center';

        let y = {top:this.scale2(26),bottom:chartRect.height_o-this.scale2(22)}[posArr[0]],
            x = {left:this.scale2(10),center:chartRect.width_o/2,right:chartRect.width_o-this.scale2(10)}[posArr[1]];

        ctx.font = this.scale2(18)+"px Arial";
        ctx.textBaseline="middle";
        ctx.textAlign = posArr[1];
        ctx.fillStyle = title.fillStyle||"#111111";
        ctx.fillText(title.text,x,y);
    },
    drawLegend:function(){
        //渲染标识
        let series = this.series,
            legend = this.legend,
            textList = [],
            widthText = 0,
            color = this.color,
            ctx = this.ctx,
            space = this.scale2(6),
            padding = this.scale2(10),
            heightText = this.scale2(16),
            tw,
            bgc;

        ctx.font = this.scale2(12)+"px Arial";
        ctx.textAlign="center";
        ctx.textBaseline="middle";
        //设置文字大小对齐方式
        for(var i=0;i<series.length;i++){
            var item = series[i];
            item.color = [];
            if(['pie','funnel'].indexOf(this.type)>-1){
                let data = item.data,
                    len = textList.length;
                for(var j=0;j<data.length;j++){
                    tw = ctx.measureText(data[j].name).width;
                    bgc = (data[j].fillStyle&&data[j].fillStyle.full)||color[j+len].full;
                    item.color.push(bgc);
                    textList.push({
                        text:data[j].name,
                        width:tw+padding,
                        fillStyle:bgc
                    });
                    widthText = widthText +(tw+padding);
                }
            }else{
                tw = ctx.measureText(item.name).width;
                bgc = (item.fillStyle&&item.fillStyle.full)||color[i].full;
                item.color.push(bgc);
                textList.push({
                    text:item.name,
                    width:tw+padding,
                    fillStyle:bgc
                });
                widthText = widthText +(tw+padding);
            };
        };

        //位置处理
        let posArr = legend.align.split('-'),
            chartRect = this.chartRect,
            x,
            y,
            xy = {
                top:this.scale2(18),
                right:chartRect.width_o - this.scale2(14),
                bottom:chartRect.height_o-this.scale2(30),
                left:this.scale2(14)
            };
        
        posArr[0] = ['top','bottom','right','left'].indexOf(posArr[0])>-1?posArr[0]:'bottom';
        
        if(['top','bottom'].indexOf(posArr[0])>-1){
            posArr[1] = ['left','center','right'].indexOf(posArr[1])>-1?posArr[1]:'center';
            y = xy[posArr[0]];
            if(posArr[1]=='center'){
                widthText = widthText + (textList.length-1)*space;
                x = (chartRect.width_o - widthText)/2;
            }else if(posArr[1]=='right'){
                x = chartRect.right - widthText - (textList.length-1)*space;
            }else{
                x = xy.left;
            };
            //渲染
            for(var i=0;i<textList.length;i++){
                ctx.fillStyle = textList[i].fillStyle;
                ctx.fillRect(x,y,textList[i].width,heightText);
                ctx.fillStyle = "#ffffff";
                ctx.fillText(textList[i].text,x+textList[i].width/2,(y + heightText/2));
                x += (textList[i].width+space);
            };
        }else{
            posArr[1] = ['top','center','bottom'].indexOf(posArr[1])>-1?posArr[1]:'center';
            x = xy[posArr[0]];
            if(posArr[1]=='center'){
                y = (chartRect.height_o - textList.length*heightText - (textList.length-1)*space)/2;
            }else if(posArr[1]=='bottom'){
                y = chartRect.height_o - textList.length*heightText - (textList.length-1)*space - this.scale2(12);
            }else{
                y = xy.top;
            };
            //渲染
            for(var i=0;i<textList.length;i++){
                ctx.fillStyle = textList[i].fillStyle;
                if(posArr[0]=='left'){
                    ctx.fillRect(x,y,textList[i].width,heightText);
                    ctx.fillStyle = "#ffffff";
                    ctx.fillText(textList[i].text,x+textList[i].width/2,(y + heightText/2));
                }else{
                    ctx.fillRect(xy.right-textList[i].width,y,textList[i].width,heightText);
                    ctx.fillStyle = "#ffffff";
                    ctx.fillText(textList[i].text,x-textList[i].width/2,(y + heightText/2));
                };
                y += (heightText+space);
            };
        }
    },
    //更新表格内容
    updata:function(newdata){
        let series = this.series;
        for(var i=0;i<series.length;i++){
            // series[i].data = newdata.series[i].data;
            Object.assign(series[i],newdata.series[i])
        };
        this.transRect();
    },
    transRect:function(first){
        // console.log('transRect',first)
        if(['line','lineArea','lineSmooth','lineSmoothArea','bar'].indexOf(this.type)>-1){
            this.transLineRect(first);
        }else if(['pie','radar','funnel'].indexOf(this.type)>-1){
            this.transPieRaFuRect(first);
        };
    },
    //开始变化数据
    transLineRect:function(first){
        //计算xy轴数据
        let xcen = false;
        if(this.type=='bar'){
            xcen = true;
        };
        this.setAxisData(xcen);

        let series = this.series,
            baseLoc = this.baseLoc,
            originX = baseLoc.originX,
            originY = baseLoc.originY,
            zeroY = baseLoc.zeroY,
            spW = baseLoc.spW,
            minNumY = baseLoc.minNumY,
            height = baseLoc.height,
            ctx = this.ctx,
            length = series.length,
            chartRect = this.chartRect;

        // console.log('baseloc',baseLoc);
        
        //设置最终xy坐标
        for(var i=0;i<length;i++){
            series[i].xy = this.getlocxy(series[i].data,originX,originY,spW,height,baseLoc.spnum*baseLoc.spnumY,minNumY);
        };

        //设置贝塞尔曲线控制点
        if(this.type=='lineSmooth'||this.type=='lineSmoothArea'){
            for(var i=0;i<length;i++){
                series[i].bessel = this.getBessel(series[i].xy,spW);
            };
        };

        //设置初始坐标00
        if(first){
            for(var i=0;i<length;i++){
                series[i].xyStart = series[i].xy.map((item,index)=>{
                    return [series[i].xy[index][0],zeroY];
                });
            };
        };
        //补充坐标差矩
        for(var i=0;i<length;i++){
            series[i].xyRange = series[i].xy.map((item,index)=>{
                return [series[i].xy[index][0],series[i].xyStart[index][1] - item[1]];
            });
        };

        //当前转换坐标
        for(var i=0;i<length;i++){
            series[i].xyTrans = series[i].xy.map((item,index)=>{
                return [0,0];
            });
        };

        // console.log('series',series);
        let time_rang = 0;
        let inter = setInterval(()=>{
            time_rang += .04;
            if(time_rang>=1){
                time_rang = 1;
                clearInterval(inter)
            }
            for(var i=0;i<length;i++){
                series[i].xyTrans = series[i].xyRange.map((item,index)=>{
                    return [series[i].xy[index][0],series[i].xyStart[index][1]-item[1]*time_rang];
                });
            };
            this.drawRect(series,chartRect,ctx);
            if(time_rang>=1){
                for(var i=0;i<series.length;i++){
                    series[i].xyStart = [].concat(series[i].xy);
                };
            };
        },20);

    },
    //获取贝塞尔控制点
    getBessel:function(xy,w){
        var rs = [],
            len = xy.length,
            per = .4;

        for(var i=0;i<len;i++){
            if(i===0){
                rs.push([xy[0][0]+w*per,xy[0][1]]);
            }else if(i===(len-1)){
                rs.push([xy[len-1][0]-w*per,xy[len-1][1]]);
            }else{
                rs.push( [xy[i][0]-w*per,xy[i][1]] , [xy[i][0]+w*per,xy[i][1]] );
            };
        };

        return rs;
    },
    //计算xy轴数据
    setAxisData:function(xcen){
        //xcen -> 判断x轴文字是否居中
         //计算最大值，设置中心坐标 y轴
        let series = this.series,
            xAxis = this.xAxis,
            all = [],
            ctx = this.ctx;

        for(var i=0;i<series.length;i++){
            all = all.concat(series[i].data);
        };
        let spnumY = 5,
            max = Math.max(...all),
            min = Math.min(...all),
            spnum = 0,
            spnumList = [5,10,20,50,80,100,
                    120,150,180,200,300,500,800,1000,1200,1500,1800,2000,2500,
                    3000,5000,8000,10000,15000,20000,30000,50000,100000,500000,1000000];

        if(min>0){min = 0};
        if(max<0){max = 0};

        for(var i=0;i<spnumList.length;i++){
            if(Math.abs(max-min)<spnumList[i]*spnumY){
                spnum = spnumList[i];
                break;
            };
        };

        this.baseLoc = {};

        this.baseLoc.minNumY = Math.floor(min/spnum)*spnum;
        this.baseLoc.maxNumY = this.baseLoc.minNumY + spnumY*spnum;
        if(this.baseLoc.minNumY>min||this.baseLoc.maxNumY<max){
            for(var i=0;i<spnumList.length;i++){
                if(spnum<spnumList[i]){
                    spnum = spnumList[i];
                    break;
                };
            };
            this.baseLoc.minNumY = Math.floor(min/spnum)*spnum;
            this.baseLoc.maxNumY = this.baseLoc.minNumY + spnumY*spnum;
        };

        //设置字符文字大小
        ctx.font = this.scale2(12)+"px Arial";
        let maxwa = Math.ceil(ctx.measureText(''+max).width),
            maxwb = Math.ceil(ctx.measureText(''+min).width),
            maxw = maxwa>maxwb?maxwa:maxwb;


        //设置中心坐标点
        this.baseLoc.spnum = spnum;
        this.baseLoc.spnumY = spnumY;
        
        this.baseLoc.originX = this.chartRect.left + maxw + this.scale2(8);
        this.baseLoc.width = this.chartRect.right - this.baseLoc.originX - this.scale2(4);
        this.baseLoc.spW = xcen?(this.baseLoc.width/xAxis.data.length):(this.baseLoc.width/(xAxis.data.length-1));
        
        this.baseLoc.originY = this.chartRect.bottom - this.scale2(this.baseLoc.minNumY<0?6:24);
        this.baseLoc.height = this.chartRect.bottom - this.scale2(this.baseLoc.minNumY<0?12:30) -this.chartRect.top;
        this.baseLoc.spH = this.baseLoc.height/spnumY;
        
        this.baseLoc.zeroX = this.chartRect.left+maxw+this.scale2(8);
        this.baseLoc.zeroY = this.chartRect.top + this.baseLoc.maxNumY/spnum*this.baseLoc.spH + this.scale2(6);
        
        this.baseLoc.textX = this.chartRect.left+maxw;
        this.baseLoc.textY = this.baseLoc.zeroY + this.scale2(14);
        this.baseLoc.barSx = this.baseLoc.spW*.1;
        this.baseLoc.barW = this.baseLoc.spW*.8/series.length;
    },
    //根据位置参数获取点的坐标值
    getlocxy:function(data,originX,originY,spW,height,numRange,minNumY){
        let rs = [];
        for(var i=0;i<data.length;i++){
            rs.push([
                originX+i*spW,
                originY - height*((data[i]-minNumY)/numRange)
            ]);
        };
        return rs;
    },
    //渲染表格内容
    drawRect:function(series,chartRect,ctx){
        //清除画布
        this.ctx.clearRect(chartRect.left,chartRect.top,chartRect.width,chartRect.height);
        //渲染线框表格
        if(this.type=='line'||this.type=='lineArea'){
            this.setChartGrid();
            for(var i=0;i<series.length;i++){
                let color = series[i].fillStyle||this.color[i];
                this.setLineSingle(series[i].xyTrans,color,ctx);
            };
            this.setChartAxis();
        }else if(this.type=='lineSmooth'||this.type=='lineSmoothArea'){
            this.setChartGrid();
            for(var i=0;i<series.length;i++){
                let color = series[i].fillStyle||this.color[i];
                this.setLineSmoothSingle(series[i].xyTrans,series[i].bessel,color,ctx);
            };
            this.setChartAxis();
        }else if(this.type=='bar'){
            this.setChartGrid(true);
            for(var i=0;i<series.length;i++){
                let color = series[i].fillStyle||this.color[i];
                this.setBarSingle(i,series[i].xyTrans,color,ctx);
            };
            this.setChartAxis(true);
        };
    },
    //渲染网格
    setChartGrid:function(xcen){
        //y轴横线
        let ctx = this.ctx,
            baseLoc = this.baseLoc,
            chartRect = this.chartRect,
            xAxis = this.xAxis;

        //y轴横线
        ctx.strokeStyle = '#ddd';
        for(var i=0;i<=5;i++){
            let ly = baseLoc.originY-baseLoc.spH*i;
            ctx.beginPath();
            ctx.moveTo(baseLoc.originX, ly);
            ctx.lineTo(chartRect.right, ly);
            ctx.closePath();
            ctx.stroke();
        };
        
        //x轴竖线
        ctx.strokeStyle = '#f3f3f3';
        let len = xcen?xAxis.data.length:xAxis.data.length-1;
        for(var i=0;i<len;i++){
            let lx = baseLoc.originX + baseLoc.spW*(i+1);
            ctx.beginPath();
            ctx.moveTo(lx, baseLoc.originY);
            ctx.lineTo(lx, chartRect.top);
            ctx.closePath();
            ctx.stroke();
        };
    },
    //设置xy轴数据
    setChartAxis:function(xcen){
        //xcen -> 判断x轴文字是否居中
        let ctx = this.ctx,
            baseLoc = this.baseLoc,
            chartRect = this.chartRect,
            xAxis = this.xAxis,
            dlen = xAxis.data.length;

        //y轴数字以及表刻
        ctx.textAlign = 'right';
        ctx.textBaseline = 'middle';
        ctx.fillStyle = '#333';
        ctx.strokeStyle = '#333';
        for(var i=0;i<=5;i++){
            let ly = baseLoc.originY - baseLoc.spH*i,
                text = i*baseLoc.spnum+baseLoc.minNumY;

            ctx.fillText(text,baseLoc.textX,ly);
            ctx.beginPath();
            ctx.moveTo(baseLoc.originX - this.scale2(4), ly);
            if(text==0){
                ctx.lineTo(chartRect.right, ly);
            }else{
                ctx.lineTo(baseLoc.originX, ly);
            };
            ctx.closePath();
            ctx.stroke();
        };

        //x轴数字以及表刻
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillStyle = '#333';
        ctx.strokeStyle = '#333';

        
        ctx.shadowBlur = 1;
        ctx.shadowOffsetX = 2;
        ctx.shadowOffsetY = 2;
        for(var i=0;i<dlen;i++){
            // ctx.textAlign = 'right'
            let lx = baseLoc.zeroX+baseLoc.spW*i;
            ctx.shadowColor = "#ffffff";
            if(i==dlen-1&&!xcen){
                ctx.textAlign = 'right'
            }else if(i==0&&!xcen){
                ctx.textAlign = 'left'
            }else{
                ctx.textAlign = 'center'
            };
            ctx.fillText(xAxis.data[i]||'',lx+(xcen?baseLoc.spW/2:0),baseLoc.textY);
            ctx.shadowColor = "transparent";
            ctx.beginPath();
            ctx.moveTo(lx,baseLoc.zeroY);
            if(i==0){
                ctx.moveTo(lx,baseLoc.originY+this.scale2(baseLoc.minNumY<0?0:4));
                ctx.lineTo(lx,chartRect.top);
            }else{
                ctx.lineTo(lx,baseLoc.zeroY+this.scale2(4));
            };
            ctx.closePath();
            ctx.stroke();
        };
    },
    //直线表格
    setLineSingle:function(xy,color,ctx){
        if(this.type=='lineArea'){
            ctx.fillStyle = color.half;
            ctx.beginPath();
            ctx.moveTo(xy[0][0],xy[0][1]);
            for(var i=1;i<xy.length;i++){
                ctx.lineTo(xy[i][0],xy[i][1])
            }
            ctx.lineTo(this.chartRect.right-this.scale2(4),this.baseLoc.zeroY);
            ctx.lineTo(this.baseLoc.zeroX,this.baseLoc.zeroY);
            ctx.closePath();
            ctx.fill();
        };

        ctx.strokeStyle = color.full;
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.lineWidth = this.scale2(1);
        ctx.moveTo(xy[0][0],xy[0][1]);
        for(var i=1;i<xy.length;i++){
            ctx.lineTo(xy[i][0],xy[i][1])
        };
        ctx.stroke();
        for(var i=0;i<xy.length;i++){
            ctx.beginPath();
            ctx.arc(xy[i][0], xy[i][1], this.scale2(2), 0, 2 * Math.PI);
            ctx.closePath();
            ctx.stroke();
            ctx.fill();
        };
    },
    //平滑线表格
    setLineSmoothSingle:function(xy,bessel,color,ctx){
        if(this.type=='lineSmoothArea'){
            ctx.fillStyle = color.half;
            ctx.beginPath();
            ctx.moveTo(xy[0][0],xy[0][1]);
            for(var i=1;i<xy.length;i++){
                ctx.bezierCurveTo(bessel[2*i-2][0],bessel[2*i-2][1],bessel[2*i-1][0],bessel[2*i-1][1],xy[i][0],xy[i][1]);
            };
            ctx.lineTo(this.chartRect.right-this.scale2(4),this.baseLoc.zeroY);
            ctx.lineTo(this.baseLoc.zeroX,this.baseLoc.zeroY);
            ctx.closePath();
            ctx.fill();
        };
        ctx.strokeStyle = color.full;
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.lineWidth = this.scale2(1);
        ctx.moveTo(xy[0][0],xy[0][1]);
        for(var i=1;i<xy.length;i++){
            ctx.bezierCurveTo(bessel[2*i-2][0],bessel[2*i-2][1],bessel[2*i-1][0],bessel[2*i-1][1],xy[i][0],xy[i][1]);
        };
        ctx.stroke();
        for(var i=0;i<xy.length;i++){
            ctx.beginPath();
            ctx.arc(xy[i][0], xy[i][1], this.scale2(2), 0, 2 * Math.PI);
            ctx.closePath();
            ctx.stroke();
            ctx.fill();
        };
    },
    //绘制柱状图
    setBarSingle:function(idx,xy,color,ctx){
        ctx.fillStyle = color.full;
        let baseLoc = this.baseLoc;
        for(var i=0;i<xy.length;i++){
            ctx.fillRect( baseLoc.zeroX+baseLoc.barSx+i*baseLoc.spW+idx*baseLoc.barW , baseLoc.zeroY, baseLoc.barW, xy[i][1]-baseLoc.zeroY);
        };
    },

    //变化饼状图，雷达图，漏斗图数据
    transPieRaFuRect:function(first){
        //计算中心最大间距轴数据
        let series = this.series,
            type = this.type,
            indicator = this.indicator,
            chartRect = this.chartRect,
            maxRange = chartRect.width>chartRect.height?(chartRect.height/2):(chartRect.width/2),
            ctx = this.ctx,
            color = this.color,
            radar_sin=[],
            radar_cos=[],
            radar_split = this.options.split||5,
            radar_fill = this.options.fill===undefined?true:this.options.fill,
            funnel_width = chartRect.width,
            funnel_reverse = this.options.reverse||false,
            funnel_max = this.options.max||0,
            funnel_h = 0;
        
        chartRect.centerX = (chartRect.left+chartRect.right)/2;
        chartRect.centerY = (chartRect.top+chartRect.bottom)/2;
        
        // console.log('chartrect',chartRect,maxRange);

        if(type=='pie'){
            //饼图->计算长半径，短半径，旋转角度
            for(var i=0;i<series.length;i++){
                let item = series[i];
                if(item.radius[0]===undefined) {item.radius[0] = 0};
                if(item.radius[1]===undefined) {item.radius[1] = 100};

                item.radiusRange = [maxRange*item.radius[0]/100,maxRange*item.radius[1]/100];
                //计算数据综合
                let all = 0,
                    data = item.data;
                for(var j=0;j<data.length;j++){
                    all += data[j].value
                }

                let deg = 360/all;
                //计算旋转角度
                item.degNumStart = first?[]:item.degNum.concat([]);
                item.degNum = [];
                item.degNumRange = [];
                for(var j=0;j<data.length;j++){
                    item.degNum.push(data[j].value*deg);
                    if(first) {item.degNumStart.push(0)};
                    item.degNumRange.push(item.degNum[j]-item.degNumStart[j]);
                };
            };
        }else if(type=='radar'){
            maxRange = maxRange*(this.options.radius||100)/100;
            let indLen = indicator.length,
                cx = chartRect.centerX,
                cy = chartRect.centerY,
                xa,ya;
            for(var i=0;i<indLen;i++){
                let deg = (i*360/indLen-90)*Math.PI/180,
                    sin = Math.sin(deg),
                    cos = Math.cos(deg);
                radar_sin.push(sin);
                radar_cos.push(cos);
            };
            for(var i=0;i<series.length;i++){
                let item = series[i];

                //计算位移坐标
                item.xyStart = first?[]:item.xy.concat([]);
                //计算最终坐标并计算差值
                item.xy = [];
                item.xyRange = [];
                item.strokeStyle = item.color&&item.color.full||color[i].full;
                item.fillStyle = item.color&&item.color.half||color[i].half;
                for(var k=0;k<item.data.length;k++){
                    xa = cx + maxRange*(item.data[k]/indicator[k].max)*radar_cos[k];
                    ya = cy + maxRange*(item.data[k]/indicator[k].max)*radar_sin[k];
                    if(first) {item.xyStart.push([cx,cy])};
                    item.xy.push([xa,ya]);
                    item.xyRange.push([xa-item.xyStart[k][0],ya-item.xyStart[k][1]]);
                };
            };
        }else if(type=='funnel'){
            funnel_width = funnel_width*(this.options.radius||100)/100;
            funnel_h = chartRect.height/series[0].data.length;

            let item = series[0],
                cx = chartRect.centerX,
                xa = 0;

            if(!funnel_max){
                for(var i=0;i<item.data.length;i++){
                    if(item.data[i].value>funnel_max){
                        funnel_max = item.data[i].value;
                    };
                };
            };

            // console.log(funnel_width,chartRect.width,funnel_max)

            item.xyStart = first?[{}]:item.xy.concat([]);
            item.xy = [];
            item.xyRange = [];
            if(funnel_reverse){
                item.xyStart.shift();
            }else{
                item.xyStart.pop();
            };
            for(let k=0;k<item.data.length;k++){
                xa = funnel_width*item.data[k].value/(2*funnel_max);
                if(first) {item.xyStart.push([cx,cx])};
                item.xy.push([cx-xa,cx+xa]);
                item.xyRange.push([cx-xa-item.xyStart[k][0],cx+xa-item.xyStart[k][1]]);
            };
            if(funnel_reverse){
                item.xy.unshift([cx,cx]);
                item.xyRange.unshift([0,0]);
                item.xyStart.unshift([cx,cx]);
            }else{
                item.xy.push([cx,cx]);
                item.xyRange.push([0,0]);
                item.xyStart.push([cx,cx]);
            };
        };
        // console.log('series',series)

        let time_rang = 0;

        let inter = setInterval(()=>{
            time_rang += .02;
            if(time_rang>=1){
                time_rang = 1;
                clearInterval(inter);
            };
            let per = this.easeInOutQuint(time_rang);
            ctx.clearRect(chartRect.left,chartRect.top,chartRect.width,chartRect.height);
            switch(type){
                case 'pie':
                    this.setPieSingle(per,series,ctx,chartRect.centerX,chartRect.centerY);
                    break;
                case 'radar':
                    this.setRadarGrid(chartRect.centerX,chartRect.centerY,indicator,radar_split,maxRange,radar_sin,radar_cos,ctx);
                    this.setRadarSingle(per,series,ctx,radar_fill);
                    break;
                case 'funnel':
                    this.setFunnelSingle(per,series[0],chartRect.top,funnel_h,chartRect.centerX,ctx);
                    break;
                default:
                    console.log('no');
            };
        },20);
    },
    //渲染饼图
    setPieSingle:function(per,series,ctx,cx,cy){
        for(var i=0;i<series.length;i++){
            let startDeg = -90,
                startArc = -.5,
                pi = Math.PI/180,
                xya,tempr,xyb,rg;

            let item = series[i],
                degNumRange = item.degNumRange,
                radiusRange = item.radiusRange,
                degNumStart = item.degNumStart,
                color = item.color;
            
            for(var k=0;k<degNumRange.length;k++){
                xya = [
                    cx+radiusRange[0]*Math.cos((startDeg)*pi),
                    cy+radiusRange[0]*Math.sin((startDeg)*pi)
                ];
                rg = (degNumRange[k]*per+degNumStart[k]);
                ctx.beginPath();
                ctx.fillStyle = color[k];
                ctx.moveTo(xya[0],xya[1]);
                tempr = rg/180;
                ctx.arc(cx,cy, radiusRange[0], (startArc)* Math.PI, (startArc+tempr) * Math.PI);
                startDeg += rg;
                startArc += tempr;
                xyb = [
                    cx+radiusRange[1]*Math.cos((startDeg)*pi),
                    cy+radiusRange[1]*Math.sin((startDeg)*pi)
                ];
                ctx.lineTo(xyb[0],xyb[1]);
                ctx.arc(cx,cy, radiusRange[1], (startArc)* Math.PI, (startArc-tempr) * Math.PI,true);
                ctx.closePath();
                ctx.fill();
            };

        };
    },
    //渲染雷达图
    //雷达图底图
    setRadarGrid(cx,cy,indicator,split,range,sin,cos,ctx){
        let len = indicator.length;
        ctx.lineWidth = 1;
        ctx.strokeStyle = '#ddd';
        ctx.textBaseline = 'middle';
            
        for(var i=0;i<split;i++){
            ctx.beginPath();
            let rg = range*(split-i)/split;
            ctx.fillStyle = i%2?'#f6f6f6':'#ffffff';
            for(var k=0;k<len;k++){
                if(k==0){
                    ctx.moveTo(cx+rg*cos[k],cy+rg*sin[k]);
                }else{
                    ctx.lineTo(cx+rg*cos[k],cy+rg*sin[k]);
                };
            };
            ctx.closePath();
            ctx.fill();
            ctx.stroke();
        }
        for(var i=0;i<len;i++){
            ctx.beginPath();
            ctx.moveTo(cx,cy);
            ctx.lineTo(cx+range*cos[i],cy+range*sin[i]);
            ctx.fillStyle = '#111111';
            ctx.textAlign = cos[i]<0?'right':cos[i]<0.01?'center':'left';
            ctx.fillText(indicator[i].name||'',cx+(range+this.scale2(10))*cos[i],cy+(range+this.scale2(10))*sin[i]);
            ctx.closePath();
            ctx.stroke();
        }
    },
    setRadarSingle:function(per,series,ctx,fill){
        for(var i=0;i<series.length;i++){
            let item = series[i],
                xyStart = item.xyStart,
                xyRange = item.xyRange;
        
            ctx.lineWidth = 1;
            ctx.strokeStyle = item.strokeStyle;
            ctx.fillStyle = item.fillStyle;
            ctx.beginPath();
            for(var k=0;k<item.data.length;k++){
                let x = xyStart[k][0]+xyRange[k][0]*per,
                    y = xyStart[k][1]+xyRange[k][1]*per;
                if(k==0){
                    ctx.moveTo(x,y);
                }else{
                    ctx.lineTo(x,y);
                };
            };
            ctx.closePath();
            fill&&ctx.fill();
            ctx.stroke();
        }

        for(var i=0;i<series.length;i++){
            let item = series[i],
                xyStart = item.xyStart,
                xyRange = item.xyRange;

            ctx.fillStyle = '#ffffff';
            ctx.textBaseline = 'middle';
            ctx.textAlign = 'center';
            for(var k=0;k<item.data.length;k++){
                ctx.strokeStyle = item.strokeStyle;
                let x = xyStart[k][0]+xyRange[k][0]*per,
                    y = xyStart[k][1]+xyRange[k][1]*per;
                ctx.beginPath();
                ctx.arc(x,y,5,0,2*Math.PI);
                ctx.closePath();
                ctx.fill();
                ctx.stroke();
            };
        };
    },
    //渲染漏斗图
    setFunnelSingle(per,item,top,sph,cx,ctx){
        let xyStart = item.xyStart,
            xyRange = item.xyRange,
            color = item.color,
            data = item.data;
        ctx.strokeStyle = '#fff';
        for(var i=0;i<item.data.length;i++){
            ctx.fillStyle = color[i];
            ctx.beginPath();
            ctx.moveTo(xyStart[i][0]+xyRange[i][0]*per,top+sph*i);
            ctx.lineTo(xyStart[i][1]+xyRange[i][1]*per,top+sph*i);
            ctx.lineTo(xyStart[i+1][1]+xyRange[i+1][1]*per,top+sph*(i+1));
            ctx.lineTo(xyStart[i+1][0]+xyRange[i+1][0]*per,top+sph*(i+1));
            ctx.closePath();
            ctx.fill();
            ctx.stroke();
            ctx.fillStyle = '#fff';
            ctx.fillText(data[i].name||'',cx,top+sph*(i+.5));
        };
    },
    showRectArea(color){
        this.ctx.fillStyle = color||'#ddd';
        this.ctx.fillRect(this.chartRect.left,this.chartRect.top,this.chartRect.right-this.chartRect.left,this.chartRect.bottom-this.chartRect.top);
        this.ctx.fill();
    }
};