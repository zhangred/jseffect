var CUES = {
    loading:function(options){
        if(this.load_elm) return;
        this.load_elm = true;
        this.load_elm = this.createdom({"tag":"div","classname":"tippop_bg tippop_bga","msg":'<div class="tippop"><div class="text load"><p class="text-io"></p>'+options.msg+'</div></div></div>'})
        document.body.appendChild(this.load_elm);
    },
    loadingclose:function(){
        this.load_elm.remove();
        this.load_elm = null;
    },
    tip:function(options){
        var msg = options.msg;
        var type = options.type?options.type:'tip';
        var time = options.time?options.time:1000;
        var elma = this.createdom({"tag":"div","classname":"tippop","msg":'<div class="text '+type+'">'+msg+'</div></div>'});
        document.body.appendChild(elma);
        setTimeout(function(){
            elma.style.opacity = 0;
            elma.style.webkitTransition = 'all 1.5s';
            setTimeout(function(){
                options.callback && options.callback();
                elma.remove();
            },1000);
        },time);
    },
    alert:function(options){
        var msg = options.msg;
        var elma = this.createdom({"tag":"div","classname":"tippop_alert"});
        var elmb = this.createdom({"tag":"p","classname":"tippop_alert_t","msg":options.msg});
        var elmc = this.createdom({"tag":"a","classname":"tippop_alert_b gb-c","msg":"确定"});
        elma.appendChild(elmb),elma.appendChild(elmc);
        document.body.appendChild(elma);

        var elm_bg = this.createdom({"tag":"div","classname":"tippop_bg"});
        document.body.appendChild(elm_bg);

        elmc.addEventListener('click',function(){
            elm_bg.remove();
            elma.remove();
            options.callback && options.callback();
        },false);
    },
    confirm:function(options){
        var msg = options.msg;
        var elma = this.createdom({"tag":"div","classname":"tippop_alert"});
        var elmb = this.createdom({"tag":"p","classname":"tippop_alert_t","msg":options.msg});
        var elmc = this.createdom({"tag":"p","classname":"tippop_alert_b"});
        var a_cal = this.createdom({"tag":"a","classname":"tippop_confirm_btn gb-c","msg":options.canceltext||"取消"});
        var a_sure = this.createdom({"tag":"a","classname":"tippop_confirm_btn gb-c","msg":options.suretext||"确定"});
        elmc.appendChild(a_cal),elmc.appendChild(a_sure);
        elma.appendChild(elmb),elma.appendChild(elmc);
        document.body.appendChild(elma);
        var elm_bg = this.createdom({"tag":"div","classname":"tippop_bg"});
        document.body.appendChild(elm_bg);
        a_cal.addEventListener('click',function(){
            elm_bg.remove();
            elma.remove();
            options.callback && options.callback(0);
        },false);
        a_sure.addEventListener('click',function(){
            elm_bg.remove();
            elma.remove();
            options.callback && options.callback(1);
        },false);
    },
    input:function(options){
        var msg = options.msg;
        var elma = this.createdom({"tag":"div","classname":"tippop_alert"});
        var elmb = this.createdom({"tag":"p","classname":"tippop_input_t","msg":options.msg});
        var input = this.createdom({"tag":"input","classname":"input"});
        var elmm = this.createdom({"tag":"p","classname":"tippop_input_m"});
        var elmc = this.createdom({"tag":"p","classname":"tippop_alert_b"});
        var a_cal = this.createdom({"tag":"a","classname":"tippop_confirm_btn gb-c","msg":"取消"});
        var a_sure = this.createdom({"tag":"a","classname":"tippop_confirm_btn gb-c","msg":options.suretext?options.suretext:"确定"});
        elmc.appendChild(a_cal),elmc.appendChild(a_sure);
        input.setAttribute('placeholder',options.placeholder?options.placeholder:'');
        elmm.appendChild(input);
        elma.appendChild(elmb),elma.appendChild(elmm),elma.appendChild(elmc);
        document.body.appendChild(elma);
        var elm_bg = this.createdom({"tag":"div","classname":"tippop_bg"});
        document.body.appendChild(elm_bg);
        a_cal.addEventListener('click',function(){
            elm_bg.remove();
            elma.remove();
            options.callback && options.callback(0);
        },false);
        a_sure.addEventListener('click',function(){
            elm_bg.remove();
            elma.remove();
            options.callback && options.callback(input.value);
        },false);
    },
    createdom:function(options){
        var dom = document.createElement(options.tag);
        dom.className = options.classname;
        if(options.msg){
            dom.innerHTML = options.msg;
        }
        return dom;
    },
    timeformat:function(time,format){
		format = format.replace("y",time.getFullYear());
		format = format.replace("m",(time.getMonth()+1)<10?'0'+(time.getMonth()+1):(time.getMonth()+1));
		format = format.replace("d",time.getDate()<10?'0'+time.getDate():time.getDate());
		format = format.replace("h",time.getHours()<10?'0'+time.getHours():time.getHours());
		format = format.replace("i",time.getMinutes()<10?'0'+time.getMinutes():time.getMinutes());
		format = format.replace("s",time.getSeconds()<10?'0'+time.getSeconds():time.getSeconds());
		return format;
    },
    throttle:function(fn,wait,space){
        var timeout;
        space = space||200;
        var later = function(){
            fn();
            setTimeout(function(){
                timeout = null
            },space)
        }
        return function(){
            if(!timeout){
                timeout = setTimeout(later,wait)
            }
        }
    },
    debounce:function(fn,wait,space){
        var timeout,timestamp,lastfunc;
        space = space||200;
        var later = function(){
            var now = new Date().getTime(),
                last = now - timestamp;
            if((last<wait&&last>0)||((lastfunc+space)>=now)){
                timeout = setTimeout(later,wait);
            }else{
                // console.log(4,now)
                timeout = null;
                lastfunc = now;
                fn()
            }
        }
        return function(){
            timestamp = new Date().getTime();
            lastfunc = timestamp;
            // console.log(1,timestamp)
            if(!timeout){
                timeout = setTimeout(later,wait)
            }
        }
    }
};
function getRequest(){
    var url = window.location.search,
        theRequest = {},
        str = '',
        para = [];
    if (url.indexOf("?") != -1) {
        str = url.substr(1);
        strs = str.split("&");
        for(var i = 0, len = strs.length; i < len; i ++) {
            para = strs[i].split("=");
            theRequest[para[0]] = decodeURIComponent( (para.length>=2)?para[1]:"");
        }
    }
    return theRequest;
};

$(function(){
    $('#J_back').click(function(){
        window.history.go(-1);
    });
})


function botmore(num,callback){
    this.num = num;
    this.callback = callback;
    this.bindevent();
    this.stop = true;
};
botmore.prototype = {
    bindevent:function(){
        var _this = this;
        var timer = '',
            body = document.body||document.documentElement,
            win_h = body.offsetHeight;

            this.bodyscroll = CUES.throttle(function(){
                var scrolltop=document.documentElement.scrollTop||document.body.scrollTop,
                    bodyh = body.offsetHeight;
                if(scrolltop+win_h+_this.num>bodyh&&!_this.stop){
                    _this.callback();
                }
            })
            this.bindscroll();
    },
    bindscroll:function(){
        var _this = this;
        window.addEventListener('scroll', _this.bodyscroll,false);
    },
    unbindscroll:function(){
         var _this = this;
         window.removeEventListener('scroll',_this.bodyscroll,false);
    }
};

function jqELmMore(opts){
    this.num = opts.num||300;
    this.callback = opts.callback;
    this.stop = true;
    this.elm = document.getElementById(opts.elm);
    setTimeout(()=>{
        this.bindEvent();
    },opts.delay||0)
}
jqELmMore.prototype = {
    bindEvent:function(){
        let _this = this,
            elm = this.elm,
            elm_h = elm.offsetHeight,
            num = this.num;
        
        this.bodyscroll = CUES.throttle(function(){
            var scrolltop = elm.scrollTop,
                scrollHeight = elm.scrollHeight;

            if((scrolltop + elm_h + num)>scrollHeight && !_this.stop){
                _this.callback();
            }
        })
        this.bindscroll();
    },
    bindscroll:function(){
        var _this = this;
        this.elm.addEventListener('scroll', _this.bodyscroll,false);
    },
    unbindscroll:function(){
         var _this = this;
         this.elm.removeEventListener('scroll',_this.bodyscroll,false);
    }
}

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
        iszoom?zoomfet():dom.fadeOut(100);
        // iszoom&&zoomfet();
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

window.cmtools = {
    createDom:function(options){
        var dom = document.createElement(options.tag);
        dom.className = options.classname;
        if(options.msg){
            dom.innerHTML = options.msg;
        }
        return dom;
    },
    setAttr:function(dom,attrs){
		for(k in attrs){
			dom.setAttribute([attrs[k][0]],attrs[k][1]);
		}
	},
    createPop:function(){
        this.pop = this.createDom({"tag":"div","classname":"cm-pop"});
        this.pop.innerHTML = '<a href="javascript:;" class="J_popclose cm-pop-bg" data-target="#J_pop_bottom"></a>\
            <div class="cm-pop-cont cm-pop-botcont">\
                <div class="cm-pop-otil"><a href="javascript:;" class="J_cal cp-btn">取消</a><a href="javascript:;" class="J_sure cp-btn cp-btna">确定</a><p class="J_til cp-til"></p></div>\
                <div class="J_slbox cm-slbox"></div>\
            </div>';
        this.boxer = this.pop.getElementsByClassName("J_slbox")[0];
        this.btn_cal = this.pop.getElementsByClassName("J_cal")[0];
        this.elm_til = this.pop.getElementsByClassName('J_til')[0];
        this.btn_sure = this.pop.getElementsByClassName("J_sure")[0];
        document.body.appendChild(this.pop);
    },
    createScroller:function(scroller,opts){
        scroller.datalist = opts.datalist;
        scroller.fieldshow = opts.fieldshow||'name';
        scroller.fieldvalue = opts.fieldvalue||'id';
        scroller.default_v = typeof(opts.default_v)!='undefined'?opts.default_v:null;
        scroller.unit = opts.unit?opts.unit:36;
        scroller.maxY = -(scroller.datalist.length-4)*scroller.unit;
        scroller.y = 4*scroller.unit;
        scroller.v = {};

        scroller.caser = this.createDom({"tag":"div","classname":"cp-case"});
        scroller.roller = this.createDom({"tag":"ul","classname":"cp-ul"});
        scroller.caser.appendChild(scroller.roller);
    },
    renderScroll:function(scroller){
        var len = scroller.datalist.length,
            fieldshow = scroller.fieldshow,
            default_v = typeof(scroller.default_v)!='undefined'?scroller.default_v:null,
            unit = scroller.unit,
            fieldvalue = scroller.fieldvalue,
            str = '';

        scroller.roller.style.webkitTransition = "all 0s";
        scroller.roller.style.webkitTransform = 'translateZ(0) translateY('+(4*scroller.unit)+'px)';
        
        scroller.maxY = -(len-4)*unit;
        for(var i=0;i<len;i++){
            var v = scroller.datalist[i];
            str += '<li class="cp-li">'+v[fieldshow]+'</li>';
            if(v[fieldvalue] == default_v){
                scroller.y = (3-i)*unit;
                this.v = v;
                scroller.roller.style.webkitTransform = 'translateZ(0) translateY('+((3-i)*unit)+'px)';
            };
        }
        scroller.roller.innerHTML = str;
        scroller.li = scroller.roller.getElementsByClassName('cp-li');
    },
    bindScroll:function(scroller){
        var that = this;
        var roller = scroller.roller,
            unit = scroller.unit,
            outer = scroller.caser;

        var fy = ly = 0;

        outer.addEventListener('touchstart',function(event){
            roller.style.webkitTransition = "all 0s";
            var touches = event.targetTouches;
            fy = touches[0].pageY;
        },false);
        outer.addEventListener('touchmove',function(event){
            var touches = event.targetTouches;
            ly = touches[0].pageY;
            var cy =  ly - fy;
            roller.style.webkitTransform = 'translateZ(0) translateY('+(scroller.y+cy)+'px)';
            event.preventDefault();
        },false)
        outer.addEventListener('touchend',function(event){
            roller.style.webkitTransition = "all .3s";
            if(ly==0){
                fy = ly = 0;
                return false;
            }
            scroller.y = Math.round((scroller.y + ly - fy)/unit)*unit;
            if(scroller.y<=scroller.maxY){
                scroller.y = scroller.maxY;
            }else if(scroller.y>=3*unit){
                scroller.y = 3*unit;
            };
            roller.style.webkitTransform = 'translateZ(0) translateY('+(scroller.y)+'px)';
            fy =  ly = 0;

            var v = scroller.datalist[3-Math.floor(scroller.y/unit)];
            if(v[scroller.fieldvalue]!=that.v[scroller.fieldvalue]){
                that.v = v;
                that.selected&&that.selected(v); 
            }
        },false);
    },
    empty:function(){
        this.boxer.classList.add('cm-slbox-dis')
        this.datalist = null;
        this.default_v = null;
        this.roller.innerHTML = '';
    },
    reset:function(opts){
        this.datalist = opts.datalist?opts.datalist:this.datalist;
        this.default_v = opts.default_v!=null?opts.default_v:null;
        this.maxY = -(this.datalist.length-4)*this.unit;
        this.y = 4*this.unit;
        this.v = {};
        this.boxer.classList.remove('cm-slbox-dis')
        this.renderScroll(this)
    },
    timeFormat:function(time,format){
		format = format.replace("y",time.getFullYear());
		format = format.replace("m",(time.getMonth()+1)<10?'0'+(time.getMonth()+1):(time.getMonth()+1));
		format = format.replace("d",time.getDate()<10?'0'+time.getDate():time.getDate());
		format = format.replace("h",time.getHours()<10?'0'+time.getHours():time.getHours());
		format = format.replace("i",time.getMinutes()<10?'0'+time.getMinutes():time.getMinutes());
		format = format.replace("s",time.getSeconds()<10?'0'+time.getSeconds():time.getSeconds());
		return format;
    },
    resety:function(){
        var idx = -1,
            dl = this.datalist,
            rid = this.rid,
            v = null;

        for(var i=0,len=dl.length;i<len;i++){
            if(dl[i].id==rid){
                idx = i;
                v = dl[i];
                break;
            }
        };
        this.y = (3-idx)*this.unit;
        if(v){
            this.v = v
        }
        this.roller.style.webkitTransform = 'translateZ(0) translateY('+(this.y)+'px)';
    },
    distouch:function(c){
        if(c){
            this.boxer.classList.add('cm-slbox-dis')
        }else{
            this.boxer.classList.remove('cm-slbox-dis')
        }
    }
}
function applytools(keys){
    for(var i=0,len=keys.length;i<len;i++){
        this[keys[i]] = cmtools[keys[i]];
    }
};

function touchscroll(outer){
    applytools.call(this,['createDom','createPop','createScroller','renderScroll','bindScroll','empty','reset','resety','distouch']);
    this.boxer = outer.boxer;
    this.createScroller(this,outer.opts)
    this.boxer.appendChild(this.caser);
    this.renderScroll(this);
    this.bindScroll(this);
    return this;
}


function datePicker(opts){
    this.opts = opts;
    this.setting();
}
datePicker.prototype = {
    setting:function(){
        var opts = this.opts;
        this.targets = opts.targets;
        this.timegroups = ['y','m','d','h','i','s'];
        this.unit = opts.unit||36;
        this.format_all = 'y/m/d h:i:s';
        this.format = opts.format||'y/m/d h:i:s';
        this.confirm = opts.confirm||null;
        this.default_time = opts.default_time||new Date();
        this.minyear = opts.minyear||2000;
        this.render();
        this.bindTargets();
    },
    render:function(){
        var that = this;
        applytools.call(this,['createDom','createPop','timeFormat']);
        this.createPop();
        this.bindTarget();
        this.group = {y:{},m:{},d:{},h:{},i:{},s:{}};
        var opt = {
            y:{outer:this.group.y.boxer,datalist:this.getlistdata({start:this.minyear,end:2040,range:1,unit:'年'}), default_v:this.minyear},
            m:{outer:this.group.m.boxer,datalist:this.getlistdata({start:1,end:13,range:1,unit:'月'}), default_v:1},
            d:{outer:this.group.d.boxer,datalist:this.getlistdata({start:1,end:32,range:1,unit:'日'}), default_v:1},
            h:{outer:this.group.h.boxer,datalist:this.getlistdata({start:0,end:24,range:1,unit:'时'}), default_v:0},
            i:{outer:this.group.i.boxer,datalist:this.getlistdata({start:0,end:60,range:5,unit:'分'}), default_v:0},
            s:{outer:this.group.s.boxer,datalist:this.getlistdata({start:0,end:60,range:5,unit:'秒'}), default_v:0}
        }

        for(tp in this.group){
            this.group[tp].boxer = this.createDom({"tag":"div","classname":"cm-slbox-time"});
            this.boxer.appendChild(this.group[tp].boxer);
            this.group[tp].opts = opt[tp];
            this.group[tp].scroller = new touchscroll(this.group[tp]);
            if(tp=='y'||tp=='m'){
                this.group[tp].scroller.selected = function(rs){
                    that.changeday();
                }
            }
        }
    },
    getlistdata:function(opts){
        var arr = [];
        for(var i=opts.start;i<opts.end;i+=opts.range){
            arr.push({id:i,name:(i<10?'0'+i:i)+opts.unit})
        }
        return arr;
    },
    changeday:function(){
        var valy = this.group.y.scroller.v.id,
            valm = this.group.m.scroller.v.id,
            sd = this.group.d,
            li = this.group.d.scroller.li,
            date = new Date(valy+'/'+valm+'/01');
        
        date.setMonth(valm);
        date.setDate(0);

        var dmax = date.getDate();
        for(var i=27;i<31;i++){
            li[i].style.opacity = i<dmax?1:0;
        };
        sd.scroller.maxY = -(dmax-4)*this.unit;
        if(sd.scroller.v.id>dmax){
            sd.scroller.v = {id:dmax,name:dmax+'日'};
            sd.scroller.y = sd.scroller.maxY;
            sd.scroller.roller.style.webkitTransform = 'translateZ(0) translateY('+(sd.scroller.y)+'px)';
        }
    },
    settil:function(title){
        this.elm_til.innerHTML = title;
    },
    bindTarget:function(){
        var that = this;
        this.btn_cal.addEventListener('click',function(){
            that.pop.classList.remove('cm-pop-active');
        })
        this.btn_sure.addEventListener('click',function(){
            var group = that.group,
                time = new Date(group.y.scroller.v.id+'/'+group.m.scroller.v.id+'/'+group.d.scroller.v.id+' '+group.h.scroller.v.id+':'+group.i.scroller.v.id+':'+group.s.scroller.v.id);
            that.confirm&&that.confirm({time:time,time_str:that.timeFormat(time,that.format),target:that.target},function(){
                that.target.setAttribute('data-time',that.timeFormat(time,that.format_all))
                that.pop.classList.remove('cm-pop-active');
            })
        })
    },
    bindTargets:function(){
        var that = this;
        for(var i=0,len=this.targets.length;i<len;i++){
            (function(){
                var target = that.targets[i];
                target.addEventListener('click',function(){
                    that.settil(target.getAttribute('data-title'));
                    that.timegroup = (target.getAttribute('data-timegroup')||'y-m-d-h-i-s').split('-');
                    that.format = target.getAttribute('data-format')||'y/m/d h:i:s';
                    that.default_time = target.getAttribute('data-time')?new Date(target.getAttribute('data-time')):new Date();
                    that.default_time = that.resettime(that.default_time);
                    that.resetroller();
                    that.target = target;
                    that.pop.classList.add('cm-pop-active')
                })
            })()
        }
    },
    resettime:function(time){
        var i = parseInt(time.getMinutes()/5)*5;
        var s = parseInt(time.getSeconds()/5)*5;
        return new Date(time.getFullYear()+'/'+(time.getMonth()+1)+'/'+time.getDate()+' '+time.getHours()+':'+i+':'+s);
    },
    resetroller:function(){
        var that = this,
            time = this.default_time,
            group = this.group,
            timegroup = this.timegroup;
        this.boxer.setAttribute('class','J_slbox cm-slbox cm-slbox'+timegroup.length)
        group.y.scroller.rid = time.getFullYear();
        group.m.scroller.rid = time.getMonth()+1;
        group.d.scroller.rid = time.getDate();
        group.h.scroller.rid = time.getHours();
        group.i.scroller.rid = time.getMinutes();
        group.s.scroller.rid = time.getSeconds();
        for(i in this.timegroups){
            group[this.timegroups[i]].scroller.boxer.style.display = (timegroup.indexOf(this.timegroups[i])>-1?'block':"none");
            group[this.timegroups[i]].scroller.resety();
        }
    }
}

function addressPicker(opts){
    this.opts = opts;
    this.setting();
}
addressPicker.prototype = {
    setting:function(){
        var opts = this.opts;
        this.target = opts.target;
        this.unit = opts.unit||36;

        this.fieldrange = this.opts.fieldrange||['province','city','area'];
        this.render();
    },
    render:function(){
        var that = this,
            opts = this.opts;
        applytools.call(this,['createDom','createPop']);
        this.createPop();
        this.bindTarget();
        this.boxer.setAttribute('class','J_slbox cm-slbox cm-slbox'+this.fieldrange.length)
        this.elm_til.innerHTML = this.opts.title||'';

        for(var i=0;i<this.fieldrange.length;i++){
            (function(){
                var tp = that.fieldrange[i];
                that[tp] = {};
                that[tp].boxer = that.createDom({"tag":"div","classname":"cm-slbox-time"});
                that.boxer.appendChild(that[tp].boxer);
                that[tp].opts = {outer:that[tp].boxer,datalist:opts[tp].datalist||[],default_v:opts[tp].default_v||null}
                that[tp].change = opts[tp].change||null;
                that[tp].scroller = new touchscroll(that[tp])
                that[tp].scroller.selected = function(rs){
                    that[tp].change&&that[tp].change(rs);
                }
                that[tp].empty = function(){
                    that[tp].scroller.empty();
                }
                that[tp].distouch = function(c){
                    that[tp].scroller.distouch(c);
                }
                that[tp].reset = function(sopts){
                    that[tp].scroller.reset(sopts);
                }
            })()
        }
    },
    bindTarget:function(){
        var that = this;
        this.btn_cal.addEventListener('click',function(){
            that.pop.classList.remove('cm-pop-active');
        })
        this.btn_sure.addEventListener('click',function(){
            var res = {};
            for(var i=0;i<that.fieldrange.length;i++){
                var key = that.fieldrange[i];
                res[key] = that[key].scroller.v;
            }

            that.opts.confirm&&that.opts.confirm(res,function(){
                that.pop.classList.remove('cm-pop-active');
            })
        })
        this.target.addEventListener('click',function(){
            that.pop.classList.add('cm-pop-active')
        })
    }
}

function swipe(opts){
    var that = this;
    opts.space = opts.space||3000;

    applytools.call(this,['createDom']);

    var el = document.getElementById(opts.id),
        box = el.getElementsByClassName('swipe-cont')[0],
        imgs = el.getElementsByClassName('swipe-item'),
        imglen = imgs.length,
        poslen = imgs.length,
        imgmaxlen = imglen - 1,
        width = el.offsetWidth,
        timer = '',
        touch_s = {},
        touch_m = {},
        dataindex = 0,
        isdire = -1;

        if(imglen==1){
            return;
        }
        if(imglen==2){
            box.innerHTML += box.innerHTML;
            imgs = el.getElementsByClassName('swipe-item');
            imglen = imgs.length;
            imgmaxlen = imglen - 1;
        };

        var dtlen = this.dtlen,
            self = this,
            figs = [];

        for(var i=0,len = imgs.length;i<len;i++){
            that.styletransform(imgs[i].style,'translateZ(0) translateX(-' + width + 'px)');
        };

        figs = [imgs[imgmaxlen], imgs[0], imgs[1]];

        that.styletransform(figs[0].style,'translateZ(0) translateX(-' + width + 'px)');
        that.styletransform(figs[1].style,'translateZ(0) translateX(0)');
        that.styletransform(figs[2].style,'translateZ(0) translateX(' + width + 'px)');

        var pos = '';
        for(var i=0;i<poslen;i++){
            pos += '<span class="swipe-po"></span>';
        }
        var po_cont = this.createDom({tag:'p',classname:'swipe-pos',msg:pos});
        el.appendChild(po_cont);

        pos = el.getElementsByClassName('swipe-po');

        this.handstart = function(event){
            clearInterval(timer);
            for (var i = 0; i < 3; i++) {
                figs[i].style.webkitTransition = "all 0s";
                figs[i].transition = "all 0s";
            };
            touch_s = event.touches[0];
        }
        this.handmove = function(event){
            touch_m = event.touches[0];
            if(isdire==1){
                var cy = touch_m.clientX - touch_s.clientX;
                for (var i = 0; i < 3; i++) {
                    that.styletransform(figs[i].style,'translateZ(0) translateX(' + ((i - 1) * width + cy) + 'px)')
                };
                event.stopPropagation();
                event.preventDefault();
                return;
            };
            if(isdire==-1){
                isdire = Math.abs(touch_m.clientY-touch_s.clientY)>Math.abs(touch_m.clientX-touch_s.clientX)?0:1;
                if(isdire){
                    event.preventDefault();
                    return;
                }
            };
        }
        this.handend = function(event){
            if(isdire==1){
                event.stopPropagation();
            };

            timer = setInterval(function() {
                that.goleft();
            }, opts.space+300);

            if (!touch_m.clientX) {
                return false;
            };
            if(touch_m.clientX-touch_s.clientX<=-(width/10)){
                that.goleft();
            }else if(touch_m.clientX-touch_s.clientX>=(width/10)){
                var s = dataindex;
                dataindex--;
                if (dataindex < 0) {
                    dataindex = imgmaxlen;
                };
                that.changepo(s, dataindex);
                figs.pop();
                var o = imgs[(dataindex - 1) < 0 ? imgmaxlen : dataindex - 1];
                that.styletransform(o.style,'translateZ(0) translateX(-' + width + 'px)','all 0s');
                figs = [o].concat(figs);
                that.styletransform(figs[2].style,'translateZ(0) translateX(' + width + 'px)','all 0.3s');
                that.styletransform(figs[1].style,'translateZ(0) translateX(0)','all 0.3s');
            }else{
                for (var i = 0; i < 3; i++) {
                    that.styletransform(figs[i].style,'translateZ(0) translateX(' + ((i - 1) * width) + 'px)','all 0.3s')
                };
            }

            isdire = -1;
        }


        el.addEventListener('touchstart',this.handstart);
        el.addEventListener('touchmove',this.handmove);
        el.addEventListener('touchend',this.handend);

        that.goleft = function(){
            var s = dataindex;
            dataindex++;
            if (dataindex > imgmaxlen) {
                dataindex = 0;
            };
            that.changepo(s, dataindex);
            figs.shift();
            var o = imgs[(dataindex + 1) > imgmaxlen ? 0 : dataindex + 1];
            that.styletransform(o.style,'translateZ(0) translateX(' + width + 'px)','all 0s');
            figs.push(o);

            that.styletransform(figs[0].style,'translateZ(0) translateX(-' + width + 'px)','all 0.3s');
            that.styletransform(figs[1].style,'translateZ(0) translateX(0)','all 0.3s');
        };

        that.changepo = function(f, t) {
            that.swipeend&&that.swipeend({idx:t%poslen,item:imgs[t%poslen]})
            pos[f % poslen]&&pos[f % poslen].setAttribute('class', 'swipe-po');
            pos[t % poslen]&&pos[t % poslen].setAttribute('class', 'swipe-po swipe-po-ac');
        };
        timer = setInterval(function() {
            that.goleft();
        }, opts.space);

        that.changepo(1, dataindex);
}
swipe.prototype = {
    styletransform:function(elm,css,time){
        if(time){
            elm.webkitTransition = time;
            elm.transition = time;
        };
        elm.webkitTransform = css;
        elm.transform = css;
    }
}


function overtouch(opt){
    this.opt = opt;
    if(!opt.elm){return false;};
    this.setting();
    this.bindevent();
    return this;
};
overtouch.prototype = {
    setting:function(){
        var opt = this.opt;
        this.elm = opt.elm;
        this.edge = opt.edge== undefined?10:opt.edge;
    },
    bindevent:function(){
        var elm = this.elm,
            bc = elm.getBoundingClientRect(),
            elm_w = elm.clientWidth,
            ftouch = {"pageX":0,"pageY":0},
            ltouch = {"pageX":bc.left,"pageY":bc.top},
            edge = this.edge,
            wdw = window.innerWidth;
            
        elm.style.cssText = "position:fixed; left:0; top:0; bottom:auto;";
        elm.style.webkitTransform = 'translateZ(0) translate('+bc.left+'px,'+bc.top+'px)';

        elm.addEventListener('touchstart',function(event){
            elm.style.webkitTransition = "all 0s";
            ftouch = event.targetTouches[0];
        },false);
        elm.addEventListener('touchmove',function(event){
            var mtouch = event.targetTouches[0];
            elm.style.webkitTransform = 'translateZ(0) translate('+(mtouch.pageX - ftouch.pageX + ltouch.pageX)+'px,'+(mtouch.pageY - ftouch.pageY + ltouch.pageY)+'px)';
            event.preventDefault();
        },false)
        elm.addEventListener('touchend',function(event){
            elm.style.webkitTransition = "all .3s";
            var lbc = elm.getBoundingClientRect();
            ltouch.pageX = lbc.left<=(wdw/2)?edge:(wdw-edge-elm_w);
            ltouch.pageY = lbc.top;
            
            elm.style.webkitTransform = 'translateZ(0) translate('+(ltouch.pageX)+'px,'+(ltouch.pageY)+'px)';
        },false);
    }
}

function dataSelect(option){
    this.opts = option;
    this.setting();
    return this;
}
dataSelect.prototype = {
    setting:function(){
        var opts = this.opts;
        this.target = opts.target;
        this.outer = opts.outer;
        this.fieldvalue = opts.fieldvalue||'id';
        this.selected = this.opts.selected ? this.opts.selected:null;
        this.title = opts.title||'';
        this.v = {};
        this.value = {};

        if(!this.outer&&!this.target){
            console.warn('请设置触发对象或者容器')
            return;
        }

        this.render();
    },
    render:function(){
        var that = this;
        if(this.target){
            applytools.call(this,['createDom','createPop']);
            this.createPop();
            this.scroller = new touchscroll(this);
            this.settil(this.title);
            this.bindTarget()
        }else{
            applytools.call(this,['createDom']);
            this.boxer = this.createDom({"tag":"div","classname":"cm-slbox"});
            this.boxer.classList.add('cm-slbox-nom')
            this.outer.appendChild(this.boxer)
            this.scroller = new touchscroll(this);
        }
        this.scroller.selected = function(rs){
            that.selected&&that.selected(rs);
            that.v = rs;
        }
    },
    settil:function(title){
        this.elm_til.innerHTML = title;
    },
    reset:function(opts){
        this.scroller.reset(opts);
    },
    empty:function(){
        this.v = {};
        this.scroller.empty();
    },
    bindTarget:function(){
        var that = this;
        this.target.addEventListener('click',function(){
            that.pop.classList.add('cm-pop-active');
        })
        this.btn_cal.addEventListener('click',function(){
            that.pop.classList.remove('cm-pop-active');
        })
        this.btn_sure.addEventListener('click',function(){
            if(typeof(that.v[that.fieldvalue])!='undefined'){
                that.opts.confirm&&that.opts.confirm(that.v,function(){
                    that.value = that.v;
                    that.pop.classList.remove('cm-pop-active');
                });
            }
        })
    }
};

function multDataSelect(opts){
    this.opts = opts;
    this.setting();
}
multDataSelect.prototype = {
    setting:function(){
        var opts = this.opts;
        this.target = opts.target;
        this.unit = opts.unit||36;

        this.province = {};
        this.render();
    },
    render:function(){
        var that = this,
            opts = this.opts,
            selectlist = opts.selectlist;

        applytools.call(this,['createDom','createPop']);
        this.createPop();
        this.bindTarget();
        this.boxer.setAttribute('class','J_slbox cm-slbox cm-slbox'+selectlist.length)
        this.elm_til.innerHTML = this.opts.title||'';

        for(var i=0;i<3;i++){
            (function(){
                var tp = selectlist[i];
                console.log(tp)
                that[tp.key] = {};
                that[tp.key].boxer = that.createDom({"tag":"div","classname":"cm-slbox-time"});
                that.boxer.appendChild(that[tp.key].boxer);
                that[tp.key].opts = {outer:that[tp.key].boxer,datalist:tp.datalist||[],default_v:tp.default_v||null}
                that[tp.key].change = tp.change||null;
                that[tp.key].scroller = new touchscroll(that[tp.key])
                that[tp.key].scroller.selected = function(rs){
                    that[tp.key].change&&that[tp.key].change(rs);
                }
                that[tp.key].empty = function(){
                    that[tp.key].scroller.empty();
                }
                that[tp.key].distouch = function(c){
                    that[tp.key].scroller.distouch(c);
                }
                that[tp.key].reset = function(sopts){
                    that[tp.key].scroller.reset(sopts);
                }

            })()
        }
        console.log(this)
    },
    bindTarget:function(){
        var that = this;
        this.btn_cal.addEventListener('click',function(){
            that.pop.classList.remove('cm-pop-active');
        })
        this.btn_sure.addEventListener('click',function(){
            var res = {},
                list = that.opts.selectlist,
                len = list.length;
            for(var i=0;i<len;i++){
                var k = list[i].key;
                res[k] = that[k].scroller.v;
            }

            that.opts.confirm&&that.opts.confirm(res,function(){
                that.pop.classList.remove('cm-pop-active');
            })
        })
        this.target.addEventListener('click',function(){
            that.pop.classList.add('cm-pop-active')
        })
    }
}

function zshcanvas(opt){
    this.opt = opt;
    this.baseinit();
}
zshcanvas.prototype = {
    baseinit:function(){
        var opt = this.opt;
        this.rem = opt.rem||1,
        this.rate = opt.rate||1,
        this.steps = opt.steps||[];
        this.width = opt.width;
        this.height = opt.height;
        this.id = opt.id;
        this.idx = 0;
        this.len = this.steps.length;

        this.elm = document.getElementById(this.id);
        this.elm.setAttribute('width',this.width*this.rate);
        this.elm.setAttribute('height',this.height*this.rate);
        
        var that = this;
        setTimeout(function(){
            that.canvas = that.elm.getContext("2d");
            that.setcanvas();
        },10);
    },
    //渲染画布
    setcanvas:function(){
        var that = this;
        if(this.idx>=this.len){
            setTimeout(function(){
                var imgdata = that.elm.toDataURL();
                that.opt.callback&&that.opt.callback({data:imgdata,canvas:that.canvas});
            },50)
        }else{
            var type = this.steps[this.idx].type;
            if(type=="img"){
              this.setcanvasImg();
            }else if(type=="text"){
              this.setcanvasText();
            }else if(type=="fillrect"){
              this.setcanvasFillRect();
            }else if(type=="line"){
                this.setcanvasLine();
            }
        }
    },
    // 渲染图片
    setcanvasImg:function(){
        var that = this,
            v = this.steps[this.idx],
            rate = this.rate;

        var img = new Image();
        img.setAttribute("crossOrigin",'Anonymous');
        img.src = v.url;
        img.onload = function(res){
            if(!v.height){
                v.height = this.height*v.width/this.width;
            }
            if(v.radius){
                var x = v.left*rate,
                    y = v.top*rate,
                    width = v.width*rate,
                    height = v.height*rate,
                    radius = v.radius*rate;

                that.canvas.save()
                that.canvas.beginPath()
                that.canvas.arc(x + radius, y + radius, radius, Math.PI, Math.PI * 3 / 2);
                that.canvas.lineTo(width - radius + x, y);
                that.canvas.arc(width - radius + x, radius + y, radius, Math.PI * 3 / 2, Math.PI * 2);
                that.canvas.lineTo(width + x, height + y - radius);
                that.canvas.arc(width - radius + x, height - radius + y, radius, 0, Math.PI * 1 / 2);
                that.canvas.lineTo(radius + x, height +y);
                that.canvas.arc(radius + x, height - radius + y, radius, Math.PI * 1 / 2, Math.PI);
                that.canvas.closePath();
                that.canvas.clip();
                that.canvas.drawImage(img,v.left*rate, v.top*rate, v.width*rate, v.height*rate)
                that.canvas.restore()
            }else{
               that.canvas.drawImage(img,v.left*rate,v.top*rate,v.width*rate,v.height*rate); 
            }
            that.idx++;
            that.setcanvas();
        };
        img.onerror = img.onabort = function () {
            that.idx++;
            that.setcanvas()
        }
    },
    //填充矩形
    setcanvasFillRect:function(){
        var that = this,
            v = this.steps[this.idx],
            rate = this.rate;
        this.canvas.fillStyle = v.fillstyle;
        if(v.radius){
            var x = v.left*rate,
                y = v.top*rate,
                width = v.width*rate,
                height = v.height*rate,
                radius = v.radius*rate;

            this.canvas.beginPath();
            this.canvas.arc(x + radius, y + radius, radius, Math.PI, Math.PI * 3 / 2);
            this.canvas.lineTo(width - radius + x, y);
            this.canvas.arc(width - radius + x, radius + y, radius, Math.PI * 3 / 2, Math.PI * 2);
            this.canvas.lineTo(width + x, height + y - radius);
            this.canvas.arc(width - radius + x, height - radius + y, radius, 0, Math.PI * 1 / 2);
            this.canvas.lineTo(radius + x, height +y);
            this.canvas.arc(radius + x, height - radius + y, radius, Math.PI * 1 / 2, Math.PI);
            this.canvas.closePath();
            this.canvas.fill();
        }else{
            this.canvas.fillRect(v.left*rate,v.top*rate,v.width*rate,v.height*rate);
        };

        that.idx++;
        that.setcanvas()
    },
    //填充文字
    setcanvasText:function(){
        var that = this,
            v = this.steps[this.idx],
            rate = this.rate,
            line = 0,
            align = v.align||"left",
            text = v.text,
            fontsize = (v.fontsize||20)*rate,
            wight = v.weight||'',
            color = v.color||"#000000",
            lineheight = (v.lineheight||30)*rate,
            width = (v.width||750)*rate,
            left = (v.left||0)*rate,
            top = (v.top||0)*rate;

        left = align=='center'?left + width/2 : left;
        left = align=='right'?left + width : left;

        this.canvas.font= wight+' '+fontsize+"px Arial";
        this.canvas.textBaseline = "top";
        this.canvas.textAlign= align;
        this.canvas.fillStyle = color;

        this.cuttext(text,width,function(t,done){
            that.canvas.fillText(t,left,top+line*lineheight,width);
            line++;
            if(done){
                that.idx++;
                that.setcanvas();
            }
        })

        
    },
    //切割文字
    cuttext:function(text,width,cb){
        var that = this,
            len = text.length+1,
            ctx = this.canvas;

        for(var i=0;i<=len;i++){
            var t = text.substr(0,i);
            if(ctx.measureText(t).width>width&&i<len){
                t = text.substr(0,i-1);
                cb(t);
                text = text.substr(i-1);
                this.cuttext(text,width,cb)
                break;
            }else if(i>=len){
                cb(text,true)
            }
        }
    },
    //横线
    setcanvasLine:function(){
        var that = this,
            v = this.steps[this.idx],
            rate = this.rate,
            ctx = this.canvas,
            cap = v.cap||"butt";

        ctx.beginPath();
        ctx.lineCap=cap;
        if(v.dash){
            var dash = v.dash.map(function(item){
                return item*rate;
            })
            ctx.setLineDash(dash);
        }
        ctx.moveTo(v.left*rate,v.top*rate);
        ctx.lineTo((v.left+v.oftx)*rate,(v.top+v.ofty)*rate);
        ctx.lineWidth = v.width*rate;
        ctx.strokeStyle = v.color||"#000000";
        ctx.stroke();

        this.idx++;
        this.setcanvas();
    },
    //补充画布
    addsteps:function(arr){
        this.steps = this.steps.concat(arr);
        this.len = this.steps.length;
        this.setcanvas();
    },
    //重新渲染
    resetsteps:function(arr){
        this.steps = arr||[];
        this.len = this.steps.length;
        this.idx = 0;
        this.canvas.clearRect(0,0,this.width*this.rate,this.height*this.rate);
        this.setcanvas();
    }
}


$(function(){
    $('.J_blurscroll').blur(function(){
        setTimeout(function(){
            $(window).scrollTop($(window).scrollTop())
        },10)
    })
})