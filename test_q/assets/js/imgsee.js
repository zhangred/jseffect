function imgsee(opt){
    var dom = $('<div class="seeimgbox">\
        <a href="javascript:;" class="J_close close">关闭</a>\
        <p class="num"><span class="cur">1</span>/<span class="tol">0</span></p>\
        <p class="imgbox"></p>\
        <p class="J_down botdo">下载</p>\
    </div>');

    $('body').append(dom);

    var cur = dom.find('.cur').eq(0),
        tol = dom.find('.tol').eq(0),
        J_close = dom.find('.J_close'),
        J_down = dom.find('.J_down').eq(0)[0],
        imgbox = dom.find('.imgbox').eq(0)[0],
        imgs = '',
        mbox = '';

    tol.html(opt.imgs.length);

    initdata(opt.imgs)

    var width = window.innerWidth,
        height = window.innerHeight,
        start_loc = [{"x":0,"y":0},{"x":0,"y":0}], // 开始移动坐标
        end_loc = [{"x":0,"y":0},{"x":0,"y":0}], // 最后移动坐标
        scale_loc = {"x":0,"y":0,"range":0,"ox":0,"oy":0}, //  缩放参数，
        isscale = false, // 是否双指缩放
        dataindex = 0, // 当前指针
        iszoom = false,
        figs = [],
        ismove = false;

    imgbox.addEventListener('touchstart',function(event){
        var touches = event.targetTouches;
        if(touches.length==2){
            if(ismove){return;};
            setstartloc(touches,1);
            isscale = true;
        }else{
            for(var i=0;i<3;i++){
                if(figs[i]) figs[i].style.webkitTransition = "all 0s";
            };
            setstartloc(touches,0);
        };
    },false);
    imgbox.addEventListener('touchmove',function(event){
        var touches = event.targetTouches;
        if(isscale){
            elmscalefunc(touches[0],touches[1]);
        }else if(iszoom){ // 缩放状态时移动
            elmtransfunc(touches[0]);
        }else{
            ismove = true;
            end_loc[0].x = touches[0].pageX;
            var cy =  end_loc[0].x - start_loc[0].x;
            for(var i=0;i<3;i++){
                if(figs[i]) figs[i].style.webkitTransform = 'translateZ(0) translateX('+((i-1)*width+cy)+'px)';
            };
        }
        event.preventDefault();
    },false);

    imgbox.addEventListener('touchend',function(event){
        if(isscale){

            initmobj();

            if(event.touches[0]){
                setstartloc(event.touches,0);
            }
            isscale = false;
        }else if(iszoom){
            initmobj();
        }else{
            var sx = start_loc[0].x,ex = end_loc[0].x;
            if(ex==0){
                return false;
            };
            /*做滑动*/
            if(ex-sx<= -(width/5)){
                dataindex++;
                if(dataindex>imgmaxlen){
                    dataindex--;
                }else{
                    figs.shift();
                    var o = (dataindex+1)>imgmaxlen?null:imgs[dataindex+1];
                    if(o) o.style.webkitTransition = "all 0s";
                    if(o) o.style.webkitTransform = 'translateZ(0) translateX('+width+'px)';
                    figs.push(o);
                };
            }else if(ex-sx>=width/5){
                dataindex--;
                if(dataindex<0){
                    dataindex = 0;
                }else{
                    figs.pop();
                    figs.reverse();
                    var o = (dataindex-1)<0?null:imgs[dataindex-1];
                    if(o) o.style.webkitTransition = "all 0s";
                    if(o) o.style.webkitTransform = 'translateZ(0) translateX(-'+width+'px)';
                    figs.push(o);
                    figs.reverse();
                };
            };
            changepo();
            goscroll();
        }

    },false);

    imgbox.addEventListener('click',function(){
        iszoom&&zoomfet();
    },false)

    /*设置点击坐标*/
    function setstartloc(tc,idx){
        start_loc[idx].x = tc[idx].clientX;
        start_loc[idx].y = tc[idx].clientY;
        if(idx==1&&start_loc[0].x==0){
            setstartloc(tc,0);
        };
        if(start_loc[0].x&&start_loc[1].x){
            setcenter(tc);
        };
    };

    /*设置初始两点的坐标和间距*/
    function setcenter(tc){
        var bc = mobj.getBoundingClientRect(),
            cen = getcenter(start_loc[0],start_loc[1]);

        scale_loc.x = cen.x - bc.left;
        scale_loc.y = cen.y - bc.top;
        scale_loc.range = cen.range;
    };

    /*计算中心点和间距*/    
    function getcenter(a,b){
        var o = {};
        o.x = (a.x + b.x)/2;
        o.y = (a.y + b.y)/2;
        o.range = Math.sqrt(Math.pow(a.x - b.x,2)+Math.pow(a.y - b.y,2));
        return o;
    };
    
    /*图片缩放功能*/
    function elmscalefunc(tca,tcb){
        
        var o = Math.sqrt(Math.pow(tca.clientX - tcb.clientX,2)+Math.pow(tca.clientY - tcb.clientY,2)),
            scale_last = o/scale_loc.range,
            cs = 1 - scale_last,
            ox = cs*scale_loc.x + scale_loc.ox;
            oy = cs*scale_loc.y + scale_loc.oy;
        
        mobj.style.transform = "translate("+ox+"px,"+oy+"px) scale("+scale_last+","+scale_last+")";
    };

    /*重置图片元素*/
    function initmobj(){
        var bc = mobj.getBoundingClientRect();

        mobj.style.cssText = 'width:'+bc.width+'px;height:'+bc.height+'px;top:'+bc.top+'px;left:'+bc.left+'px;';

        scale_loc = {"x":0,"y":0,"range":0,"ox":0,"oy":0};
        start_loc = [{"x":0,"y":0},{"x":0,"y":0}];
        end_loc = [{"x":0,"y":0},{"x":0,"y":0}];

        iszoom = bc.width>width?true:false;
        !iszoom&&zoomfet();
    };

    /*图像移动*/
    function elmtransfunc(tc){
        var s = start_loc[0],e = end_loc[0];
        e.x = tc.clientX;
        e.y = tc.clientY;
        var cx = e.x - s.x,
            cy = e.y - s.y;
        mobj.style.transform = "translate("+cx+"px,"+cy+"px)";
    }

    /*滚动图片*/
    function goscroll(){
        setTimeout(function(){
            end_loc[0].x = 0;
            for(var i=0;i<3;i++){
                var v = figs[i];
                if(v){
                    v.style.webkitTransition = "all .3s";
                    v.style.webkitTransform = 'translateZ(0) translateX('+((i-1)*width)+'px)';
                }
            };
        },20);
        mobj = mbox[dataindex];
        setTimeout(function(){
            ismove = false;
        },300);
    };

    /*小于比例的时候图片初始化*/
    function zoomfet(){
        mobj.style.cssText = '';
    }

    /*展示指针*/
    function changepo(f,t){
        cur.html(dataindex+1)
    };

    /*点击下载当前图片，返回当前图片url*/
    J_down.addEventListener('click',function(){
        opt.dlcallback(opt.imgs[dataindex]);
    },false);

    /*关闭当前图片预览插件*/
    J_close.click(function(){
        dom.fadeOut(100);
    });

    /*初始图片预览插件*/
    this.show = function(opt){
        this.showdown(opt.showdown||false);
        if(opt.narr){
            initdata(opt.narr);
        };
        for(var i=0;i<imglen;i++){
            imgs[i].style.webkitTransform = 'translateZ(0) translateX(-'+width+'px)';
        };
        var num = opt.num||0;
        figs = [num==0?null:imgs[num-1],imgs[num],num>=imgmaxlen?null:imgs[num+1]];
        dataindex = num;
        if(figs[0]) figs[0].style.webkitTransform = 'translateZ(0) translateX(-'+width+'px)';
        if(figs[1]) figs[1].style.webkitTransform = 'translateZ(0) translateX(0)';
        if(figs[2]) figs[2].style.webkitTransform = 'translateZ(0) translateX('+width+'px)';
        mobj = mbox[num];
        cur.html(dataindex+1);
        dom.fadeIn();
    };

    /*初始图片dom以及相关展示信息*/
    function initdata(arr){
        tol.html(arr.length);

        var str = '',list = arr,len = list.length;
        for(var i=0;i<len;i++){
            str += '<a href="javascript:;" class="sibox"><span class="mbox"><span class="siimg" style="background-image:url('+list[i]+');"></span></span></a>';
        };
        imgbox.innerHTML = str;
        imglen = arr.length,
        imgmaxlen = imglen - 1,
        imgs = imgbox.getElementsByClassName('sibox');
        mbox = imgbox.getElementsByClassName('mbox');
    };

    /*是否展示下载按钮，默认不展示*/
    this.showdown = function(tf){
        if(tf){
            J_down.style.display = "inline-block"
        }else{
            J_down.style.display = "none"
        }
    };
    this.showdown(opt.showdown);
};