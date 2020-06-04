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
        var elmb = this.createdom({"tag":"p","classname":"tippop_alert_t","msg":typeof(msg)=='object'?JSON.stringify(options.msg):options.msg});
        var elmc = this.createdom({"tag":"a","classname":"tippop_alert_b","msg":options.suretext||"确定"});
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
        var a_cal = this.createdom({"tag":"a","classname":"tippop_confirm_btn","msg":options.canceltext||"取消"});
        var a_sure = this.createdom({"tag":"a","classname":"tippop_confirm_btn","msg":options.suretext||"确定"});
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
        var elmc = this.createdom({"tag":"div","classname":"tippop_alert_b"});
        var a_cal = this.createdom({"tag":"p","classname":"tippop_confirm_btn","msg":options.canceltext||"取消"});
        var a_sure = this.createdom({"tag":"p","classname":"tippop_confirm_btn","msg":options.suretext?options.suretext:"确定"});
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
            var v = input.value.trim();
            if(v.length==0) return;
            elm_bg.remove();
            elma.remove();
            options.callback && options.callback(1,input.value);
        },false);
        input.addEventListener('blur',function(){
            setTimeout(function(){
                var scrollTop = document.documentElement.scrollTop || window.pageYOffset || document.body.scrollTop;
                window.scrollTo(0,scrollTop);
            },300)
        })
    },
    createdom:function(options){
        var dom = document.createElement(options.tag);
        dom.className = options.classname;
        if(options.msg){
            dom.innerHTML = options.msg;
        }
        return dom;
    },
    throttle:function(fn,wait){
        var timeout;
        var later = function(){
            fn();
            setTimeout(function(){
                timeout = null
            },200)
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
    },
    timeformat:function(time,format){
		format = format.replace("y",time.getFullYear());
		format = format.replace("m",(time.getMonth()+1)<10?'0'+(time.getMonth()+1):(time.getMonth()+1));
		format = format.replace("d",time.getDate()<10?'0'+time.getDate():time.getDate());
		format = format.replace("h",time.getHours()<10?'0'+time.getHours():time.getHours());
		format = format.replace("i",time.getMinutes()<10?'0'+time.getMinutes():time.getMinutes());
		format = format.replace("s",time.getSeconds()<10?'0'+time.getSeconds():time.getSeconds());
		return format;
    }
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
        this.pop = this.createDom({"tag":"div","classname":"cm-pop cm-pop-auto"});
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
        this.datalist = opts.datalist?opts.datalist:[];
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
                v = dl[i]
                break;
            }
        };
        this.y = (3-idx)*this.unit;
        if(v){
            this.v = v;
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


function botmore(num,callback){
    this.num = num;

    var _this = this;
    var body = document.body||document.documentElement,
        win_h = body.offsetHeight;

    this.bodyscroll = CUES.throttle(function(){
        var scrolltop=document.documentElement.scrollTop||document.body.scrollTop,
            bodyh = body.scrollHeight;
        if(scrolltop+win_h+num>bodyh){
            callback();
        }
    },100)

    window.addEventListener('scroll', _this.bodyscroll,false);

    this.unbindscroll = function(){
        window.removeEventListener('scroll',_this.bodyscroll,false);
    }
};

function imgsee(opts){
    applytools.call(this,['createDom']);
    var dom = this.createDom({tag:'div',classname:'cm-seeimgbox',msg:'<p class="num"><span class="cur">1</span>/<span class="tol">--</span></p><p class="imgbox"></p><p class="J_down botdo">下载</p>'})
    document.body.appendChild(dom);

    // dom.classList.add('cm-seeimgbox-ac');
    var that = this;
    var cur = dom.getElementsByClassName('cur')[0],
        tol = dom.getElementsByClassName('tol')[0],
        J_down = dom.getElementsByClassName('J_down')[0],
        imgbox = dom.getElementsByClassName('imgbox')[0],
        imgs = '',
        mbox = '';

    var datalist = opts.datalist;
    initdata(datalist)

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
            initmobj(event.touches[0]?true:false);
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
        iszoom?zoomfet():that.domhide();
    },false)

    this.domshow = function(){
        dom.classList.add('cm-seeimgbox-ac');
        setTimeout(function(){
            dom.classList.add('cm-seeimgbox-show');
        },10)
    };
    this.domhide = function(){
        dom.classList.remove('cm-seeimgbox-show');
        setTimeout(function(){
            dom.classList.remove('cm-seeimgbox-ac');
        },310)
    }

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
    function initmobj(hastouch){
        // alert(454)
        var bc = mobj.getBoundingClientRect();
        mobj.style.cssText = 'width:'+bc.width+'px;height:'+bc.height+'px;top:'+bc.top+'px;left:'+bc.left+'px;';
        scale_loc = {"x":0,"y":0,"range":0,"ox":0,"oy":0};
        start_loc = [{"x":0,"y":0},{"x":0,"y":0}];
        end_loc = [{"x":0,"y":0},{"x":0,"y":0}];
        iszoom = bc.width>width?true:false;
        // alert(dataindex+'-'+JSON.stringify(datalist[dataindex]))
        if(!iszoom||!datalist[dataindex].isdownload){
            zoomfet();
        }else{
            borderfet(hastouch);
        }
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
        iszoom = false;
        mobj.style.cssText = '';
        mobj.style.webkitTransition = "all .2s";
        setTimeout(function(){
            mobj.style.webkitTransition = "none";
        },210)
    }

    /*边界处理 */
    function borderfet(hastouch){
        if(hastouch) return
        var bc = mobj.getBoundingClientRect(),
            imgbc = mobj.getElementsByClassName('simgr')[0].getBoundingClientRect(),
            ani = false,
            tr = {left:bc.left,top:bc.top};
        if((imgbc.height<height&&imgbc.top<0)||(imgbc.height>height&&imgbc.top>0)){
            ani = true;
            tr.top = tr.top - imgbc.top
        }else if((imgbc.height<height&&imgbc.top+imgbc.height>height)||(imgbc.height>height&&imgbc.top+imgbc.height<height)){
            ani = true;
            tr.top = tr.top - imgbc.top + (height-imgbc.height);
        };

        if((imgbc.width<width&&imgbc.left<0)||(imgbc.width>width&&imgbc.left>0)){
            ani = true;
            tr.left = tr.left - imgbc.left;
        }else if((imgbc.width<width&&imgbc.left+imgbc.width>width)||(imgbc.width>width&&imgbc.left+imgbc.width<width)){
            ani = true;
            tr.left = tr.left - imgbc.left + (width-imgbc.width);
        }
        if(ani){
            mobj.style.cssText = 'width:'+bc.width+'px;height:'+bc.height+'px;top:'+tr.top+'px;left:'+tr.left+'px;';
            mobj.style.webkitTransition = "all .1s";
            setTimeout(function(){
                mobj.style.webkitTransition = "none";
            },110)
        }
    }

    /*展示指针*/
    function changepo(){
        that.imgdownload(dataindex)
        cur.innerHTML = (dataindex+1)
    };

    /*点击下载当前图片，返回当前图片url*/
    J_down.addEventListener('click',function(){
        opts.download(datalist[dataindex]);
    },false);

    // /*初始图片预览插件*/
    this.show = function(nopts){
        this.domshow();
        this.showdown(nopts.showdown||opts.showdown||false);
        if(nopts.datalist){
            initdata(nopts.datalist);
        };
        for(var i=0;i<imglen;i++){
            imgs[i].style.webkitTransform = 'translateZ(0) translateX(-'+width+'px)';
        };
        var idx = nopts.idx||0;
        figs = [idx==0?null:imgs[idx-1],imgs[idx],idx>=imgmaxlen?null:imgs[idx+1]];
        dataindex = idx;
        if(figs[0]) figs[0].style.webkitTransform = 'translateZ(0) translateX(-'+width+'px)';
        if(figs[1]) figs[1].style.webkitTransform = 'translateZ(0) translateX(0)';
        if(figs[2]) figs[2].style.webkitTransform = 'translateZ(0) translateX('+width+'px)';
        mobj = mbox[idx];
        cur.innerHTML = (dataindex+1);
        that.imgdownload(dataindex)
    };

    this.imgdownload = function(ix){
        var o = datalist[ix],
            img = new Image;
        
        if(o.isdownload) return;
        img.src = o.origin;
        img.onload = function(){
            var self = this;
            o.isdownload = true;
            mbox[ix].getElementsByClassName('siimg')[0].innerHTML = '<img class="simgr" src="'+o.origin+'">';
            setTimeout(function(){
                if(self.width<width&&self.height<height){
                    if(self.width/self.height>width/height){
                        mbox[ix].getElementsByClassName('simgr')[0].style.minWidth = '100%'
                    }else{
                        mbox[ix].getElementsByClassName('simgr')[0].style.minHidth = '100%'
                    }
                }
            },0)
        }
    }

    /*初始图片dom以及相关展示信息*/
    function initdata(narr){
        var arr = [],
            len = narr.length;
        for(var i=0;i<len;i++){
            arr.push(typeof(narr[i])=='string'?{origin:narr[i],thumb:narr[i]}:narr[i]);
        }
        
        datalist = arr;
        tol.innerHTML = (arr.length);
        
        var str = '',list = arr,len = list.length;
            
        console.log(4,narr,arr,list)
        for(var i=0;i<len;i++){
            var tx = list[i].text?'<p class="sitx">'+list[i].text+'</p>':''
            str += '<a href="javascript:;" class="sibox">'+tx+'<span class="mbox"><span class="siimg" style="background-image:url('+list[i].thumb+');"></span></span></a>';
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
    this.showdown(opts.showdown);
};

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


// function overtouch(opt){
//     this.opt = opt;
//     if(!opt.elm){return false;};
//     this.setting();
//     this.bindevent();
//     return this;
// };
// overtouch.prototype = {
//     setting:function(){
//         var opt = this.opt;
//         this.elm = opt.elm;
//         this.edge = opt.edge== undefined?10:opt.edge;
//     },
//     bindevent:function(){
//         var elm = this.elm,
//             bc = elm.getBoundingClientRect(),
//             elm_w = elm.clientWidth,
//             ftouch = {"pageX":0,"pageY":0},
//             ltouch = {"pageX":bc.left,"pageY":bc.top},
//             edge = this.edge,
//             wdw = window.innerWidth,
//             wdh = window.innerHeight;
            
//         elm.style.cssText = "position:fixed; left:0; top:0; bottom:auto;";
//         elm.style.webkitTransform = 'translateZ(0) translate('+bc.left+'px,'+bc.top+'px)';

//         elm.addEventListener('touchstart',function(event){
//             elm.style.webkitTransition = "all 0s";
//             ftouch = event.targetTouches[0];
//         },false);
//         elm.addEventListener('touchmove',function(event){
//             var mtouch = event.targetTouches[0];
//             elm.style.webkitTransform = 'translateZ(0) translate('+(mtouch.pageX - ftouch.pageX + ltouch.pageX)+'px,'+(mtouch.pageY - ftouch.pageY + ltouch.pageY)+'px)';
//             event.preventDefault();
//         },false)
//         elm.addEventListener('touchend',function(event){
//             elm.style.webkitTransition = "all .3s";
//             var lbc = elm.getBoundingClientRect();
//             ltouch.pageX = lbc.left<=(wdw/2)?edge:(wdw-edge-elm_w);
//             ltouch.pageY = lbc.top<edge?edge:(lbc.top>wdh-edge?wdh-edge:lbc.top);
            
//             elm.style.webkitTransform = 'translateZ(0) translate('+(ltouch.pageX)+'px,'+(ltouch.pageY)+'px)';
//         },false);
//     }
// }


$(function(){
    $('#J_back').click(function(){
        window.history.go(-1)
    })
    $('.J_blurscroll').blur(function(){
        setTimeout(function(){
            $(window).scrollTop($(window).scrollTop())
        },100)
    })
    
    // 展开弹层
    $('.J_showpop').click(function(){
        console.log(45)
        var tar = $($(this).attr('data-target'));
        tar.addClass('cm-pop-active');
    });
    //关闭弹层
    $('.J_popclose').click(function(){
        $($(this).attr('data-target')).removeClass('cm-pop-active');
    });
})
function closepop(tar){
    tar.removeClass('cm-pop-active');
};
function showpop(tar){
    tar.addClass('cm-pop-active');
};
function togglepop(tar){
    tar.toggle('cm-pop-active');
}
