var CUES = {
    loading:function(options){
        $('body').append('<div class="tippop_bg tippop_bga" id="J_tippop_load"><div class="tippop"><div class="text load"><img src="assets/images/loading.gif" class="tipload">'+options.msg+'</div></div></div>');
    },
    loadclose:function(){
        $('#J_tippop_load').remove();
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
        var a_cal = this.createdom({"tag":"a","classname":"tippop_confirm_btn gb-c","msg":"取消"});
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
        var a_sure = this.createdom({"tag":"a","classname":"tippop_confirm_btn gb-c ","msg":options.suretext?options.suretext:"确定"});
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
    timeformat(time,format){
        format = format.replace("y",time.getFullYear());
        format = format.replace("m",(time.getMonth()+1)<10?'0'+(time.getMonth()+1):(time.getMonth()+1));
        format = format.replace("d",time.getDate()<10?'0'+time.getDate():time.getDate());
        format = format.replace("h",time.getHours()<10?'0'+time.getHours():time.getHours());
        format = format.replace("i",time.getMinutes()<10?'0'+time.getMinutes():time.getMinutes());
        format = format.replace("s",time.getSeconds()<10?'0'+time.getSeconds():time.getSeconds());
        return format;
    },
    heartjump:function(opts){
        let args,timeout,timestamp,lasttamp;
        let _self = this;
        opts = opts||{};
        opts.space = opts.space||200;
        opts.stand = opts.stand||200;


        let later = function(){
            let c = timestamp - lastfunc<opts.space-120;
            timeout = null;
            if(!c){
                _self.throttle&&_self.throttle(args);   
            }
            setTimeout(()=>{
                if(!timeout){
                    _self.debounce&&_self.debounce(args);
                }
            },opts.stand)
        }

        this.step = function(event){
            args = event;
            timestamp = new Date().getTime();
            if(!timeout){
                lastfunc = timestamp;
                timeout = setTimeout(later,opts.space)
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

            this.bodyscroll = function(event){
                clearTimeout(timer);
                if(_this.stop){return false;};
                timer = setTimeout(function(){
                    var scrolltop=document.documentElement.scrollTop||document.body.scrollTop,
                        bodyh = body.offsetHeight;
                    if(scrolltop+win_h+_this.num>bodyh){
                        _this.callback();
                    }
                    
                },100);
            };
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

function formatTime(date,type){
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  if(type==1){
    return [year, month, day].map(formatNumber).join('-');
  }else if(type==2){
    return [year, month, day].map(formatNumber).join('-') + ' ' + [hour, minute,second].map(formatNumber).join(':')
  }else{
    return [year, month, day].map(formatNumber).join('-') + ' ' + [hour, minute].map(formatNumber).join(':')
  }
}

function formatNumber(n) {
  n = n.toString()
  return n[1] ? n : '0' + n
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
        // this.elm.style.width = this.width;
        // this.elm.style.height = this.height;
        this.elm.setAttribute('width',this.width*this.rate);
        this.elm.setAttribute('height',this.height*this.rate);
        // this.elm.style.backgroundColor = "#ddd";

        
        
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
        img.src = v.url;
        img.onload = function(res){
            that.canvas.drawImage(img,v.left*rate,v.top*rate,v.width*rate,v.height*rate);
            that.idx++;
            that.setcanvas();
        };
        img.onerror = img.onabort = function () {
            that.idx++;
            that.setcanvas()
        }
    },
    //填充矩形
    setcanvasFillRect(){
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
    setcanvasText(){
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
            left = (v.left||0)*rate+(align=="center"?width/2:0),
            top = (v.top||0)*rate;

        this.canvas.font= wight+' '+fontsize+"px Arial";
        this.canvas.textBaseline = "top";
        this.canvas.textAlign= align;
        this.canvas.fillStyle = color;
        // this.canvas.fillText(text,left,top,width);

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
    cuttext(text,width,cb){
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
    setcanvasLine(){
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
    addsteps(arr){
        this.steps = this.steps.concat(arr);
        this.len = this.steps.length;
        this.setcanvas();
    }
}


function dataSelectNt(option){
    this.opt = option;
    this.setting();
    this.render();
    this.bindEvent();
    return this;
}
dataSelectNt.prototype = {
    setting:function(){
        var opt = this.opt;
        this.data = opt.data;
        this.fieldshow = opt.fieldshow;
        this.fieldvalue = opt.fieldvalue;
        this.default_v = opt.default_v?opt.default_v:null;
        this.unit = opt.unit?opt.unit:40;
        this.target = opt.target;
        this.maxY = -(this.data.length-3)*this.unit;
        this.Y = 3*this.unit;
        this.fy = this.ly = this.ofy = 0;
        this.v = null;
        this.change = this.opt.change ? this.opt.change:null;
    },
    render:function(){
        this.outer = this.createdom({"tag":"div","classname":"zshsclsbox"});
        this.target.appendChild(this.outer);

        this.scul = this.createdom({"tag":"ul","classname":"sc-ul"});
        this.scul.style.webkitTransition = "all .3s";
        this.scul.style.webkitTransform = 'translateZ(0) translateY('+(this.Y)+'px)';
        this.rendersub();
        this.opt.initchange && this.opt.change && this.opt.change(this.v);
    },
    rendersub:function(){
        this.scul.innerHTML = '';
        var len = this.data.length,fieldshow = this.fieldshow,default_v = this.default_v,unit = this.unit,fieldvalue = this.fieldvalue;
        this.maxY = -(this.data.length-3)*this.unit;
        for(var i=0;i<len;i++){
            var v = this.data[i];
            var li = this.createdom({"tag":"li","classname":"sc-option","msg":v[fieldshow]});
            if(v[fieldvalue] == default_v){
                this.Y = (2-i)*unit;
                this.v = v;
                this.scul.style.webkitTransform = 'translateZ(0) translateY('+((2-i)*unit)+'px)';
            };
            this.scul.appendChild(li);
        }
        this.outer.appendChild(this.scul);
    },
    createdom:function(options){
        var dom = document.createElement(options.tag);
        dom.className = options.classname;
        if(options.msg){
            dom.innerHTML = options.msg;
        }
        return dom;
    },
    bindEvent:function(){
        var _this = this,scul = this.scul,unit = this.unit,outer = this.outer,fieldshow = this.fieldshow;
        outer.addEventListener('touchstart',function(event){
            scul.style.webkitTransition = "all 0s";
            var touches = event.targetTouches;
            _this.fy = touches[0].pageY;
        },false);
        outer.addEventListener('touchmove',function(event){
            var touches = event.targetTouches;
             _this.ly = touches[0].pageY;
            var cy =  _this.ly-_this.fy;
            scul.style.webkitTransform = 'translateZ(0) translateY('+(_this.Y+cy)+'px)';
            event.preventDefault();
        },false)
        outer.addEventListener('touchend',function(event){
            scul.style.webkitTransition = "all .3s";
            if(_this.ly==0){
                _this.fy =  _this.ly = 0;
                return false;
            }
            _this.Y = Math.round((_this.Y + _this.ly - _this.fy)/unit)*unit;
            if(_this.Y<=_this.maxY){
                _this.Y = _this.maxY;
            }else if(_this.Y>=2*unit){
                _this.Y = 2*unit;
            };
            scul.style.webkitTransform = 'translateZ(0) translateY('+(_this.Y)+'px)';
            _this.fy =  _this.ly = 0;

            var v = _this.data[2-Math.floor(_this.Y/unit)];
            if(v!=_this.v){
                _this.v = v;
                _this.opt.change && _this.opt.change(v); 
            }
        },false);

        var heartjump = new CUES.heartjump();
        heartjump.throttle = function(event){
            scul.style.webkitTransition = "all .05s";
            if(event.wheelDelta>0){
                _this.Y =_this.Y+unit;
            }else{
                _this.Y =_this.Y-unit;
            }
            if(_this.Y<=_this.maxY){
                _this.Y = _this.maxY;
            }else if(_this.Y>=2*unit){
                _this.Y = 2*unit;
            };
            scul.style.webkitTransform = 'translateZ(0) translateY('+(_this.Y)+'px)';
        }
        heartjump.debounce = function(event){
            var v = _this.data[2-Math.floor(_this.Y/unit)];
            if(v!=_this.v){
                _this.v = v;
                _this.opt.change && _this.opt.change(v); 
            }
        }
        outer.addEventListener('mousewheel',function(event){
            event.stopPropagation();
            event.preventDefault();
            heartjump.step(event);
        })
    },
    init:function(option){
        this.data = option.data?option.data:[];
        this.default_v = option.default_v!=null?option.default_v:null;
        // console.log(444,this.default_v)
        this.maxY = (this.data.length-1)*this.unit;
        this.Y = 3*this.unit;
        this.v = null;
        this.scul.style.webkitTransform = 'translateZ(0) translateY('+(this.Y)+'px)';
        this.rendersub();
    },
    empty:function(){
        this.data = [];
        this.v = null;
        this.default_v = null;
        this.scul.innerHTML = '';
    }
};

/*update  dateselect.JS - 2017-12-9
 * By ShaoHua zhang
 * 577056210@qq.com  (low)
 * freedom front-end engineer */

var dateselect = function(options){
    this.opt = options;
    this.setting();
}
dateselect.prototype.setting = function(){
    var opt = this.opt;
    
    var _this = this;
    this.targets = opt.targets;
    // this.targetarr =  {};

    this.outer = this.createdom({"tag":"div","classname":"dateselect_input_box"});
    this.timegroups = opt.timegroups||["y","m","d","h","i","s"];
    this.unit = opt.unit||40;
    this.format = opt.format||'y/m/d h:m';
    this.selected = opt.selected?opt.selected:null;
    this.empty = opt.empty?opt.empty:null;
    document.body.appendChild(this.outer);
    this.setattr(this.outer,[["id","dateselect_input_box"]]);
    this.render_input();
    for(var i=0,len = this.targets.length;i<len;i++){
        (function(){

            var v = _this.targets[i],obj = {};
            obj.target = _this.targets[i];
            obj.nowtime = opt.defaultdate?new Date(opt.defaultdate.replace(/\-/ig,'/')):new Date();
            obj.nowtime = _this.inittime(obj.nowtime);
            
            _this.bindEvent_input_click(obj);
           
            // _this.targetarr[v.target] = obj;

        })();
    };
    this.bindEvent_input_cus();
};

dateselect.prototype.createdom = function(options){
    var dom = document.createElement(options.tag);
    dom.className = options.classname;
    if(options.msg){
        dom.innerHTML = options.msg;
    }
    return dom;
};

dateselect.prototype.setattr = function(dom,attrs){
    for(k in attrs){
        dom.setAttribute([attrs[k][0]],attrs[k][1]);
    }
};

dateselect.prototype.render_input = function(){
    this.outer.innerHTML = '<div class="dateselect_input"><div class="dpls"></div><p class="dp-btns"><a href="javascript:;" class="dp-btn dp-empty">清空</a><a href="javascript:;" class="dp-btn dp-cal">取消</a><a href="javascript:;" class="dp-btn dp-sure">确定</a></p></div>';
    this.dpls = this.outer.getElementsByClassName("dpls")[0];
    this.dp_cal = this.outer.getElementsByClassName("dp-cal")[0];
    this.dp_empty = this.outer.getElementsByClassName("dp-empty")[0];
    this.dp_sure = this.outer.getElementsByClassName("dp-sure")[0];
    this.dpls.className = "dpls dpls"+this.timegroups.length;
    this.selects = {};
    for(var i=0,len = this.timegroups.length;i<len;i++){
        this.createselect(this.timegroups[i]);
    };
};
dateselect.prototype.createselect = function(type){
    var ul = this.createdom({"tag":"ul","classname":"dp-select-ul"}),
        box = this.createdom({"tag":"div","classname":"dp-select"}),
        str = '';
    if(type=='y'){
        for(var i=2000;i<2030;i++){
            str += '<li class="dp-option">'+i+'年</li>';
        };
    }else if(type=='m'){
        for(var i=1;i<13;i++){
            str += '<li class="dp-option">'+(i<10?'0'+i:i)+'月</li>';
        };
    }else if(type=='d'){
        for(var i=1;i<32;i++){
            str += '<li class="dp-option">'+(i<10?'0'+i:i)+'日</li>';
        };
    }else if(type=='h'){
        for(var i=0;i<24;i++){
            str += '<li class="dp-option">'+(i<10?'0'+i:i)+'时</li>';
        };
    }else if(type=='i'){
        for(var i=0;i<60;i+=5){
            str += '<li class="dp-option">'+(i<10?'0'+i:i)+'分</li>';
        };
    }else if(type=='s'){
        for(var i=0;i<60;i+=5){
            str += '<li class="dp-option">'+(i<10?'0'+i:i)+'秒</li>';
        };
    };
    ul.innerHTML = str;
    box.appendChild(ul);
    this.selects[type] = {};
    this.selects[type].box = box;
    this.selects[type].ul = ul;
    if(type=='d'){
        this.selects[type].li = ul.getElementsByClassName("dp-option");
    }
    this.dpls.appendChild(this.selects[type].box);
    this.bindEvent_input(type,this.selects[type]);
};
dateselect.prototype.bindEvent_input = function(type,obj){
    var _this = this,
        box = obj.box,
        ul = obj.ul,
        unit = this.unit,
        twou = unit*2;
    obj.y = 0;
    obj.ly = 0;
    box.addEventListener('touchstart',function(event){
        var touches = event.targetTouches;
        obj.fy = touches[0].pageY;
    },false);
    box.addEventListener('touchmove',function(event){
        var touches = event.targetTouches;
            y =  touches[0].pageY -  obj.fy;
        obj.ly = touches[0].pageY;
        ul.style.cssText = "-webkit-transform:translate3d(0,"+(obj.y+y)+"px,0);transform:translate3d(0,"+(obj.y+y)+"px,0)";
        event.preventDefault();
    },false)
    box.addEventListener('touchend',function(event){
        if(obj.ly==0){ return false;}
        obj.y = obj.y + obj.ly - obj.fy;
        obj.y = Math.round(obj.y/unit)*unit;
        if(type=='y'){
            if(obj.y<-(27*unit)){obj.y = -(27*unit);}else if(obj.y>twou){obj.y = twou;};
            obj.value = 2002 - obj.y/unit;
            _this.changeym();
        }else if(type=='m'){
            if(obj.y<-(9*unit)){obj.y = -(9*unit);}else if(obj.y>twou){obj.y = twou;};
            obj.value = 3 - obj.y/unit;
            _this.changeym();
        }else if(type=='d'){
            if(obj.y<-obj.maxy){obj.y = -obj.maxy;}else if(obj.y>twou){obj.y = twou;};
            obj.value = 3 - obj.y/unit;
        }else if(type=='h'){
            if(obj.y<-(21*unit)){obj.y = -(21*unit);}else if(obj.y>twou){obj.y = twou;};
            obj.value = 2 - obj.y/unit;
        }else if(type=='i'){
            if(obj.y<-(9*unit)){obj.y = -(9*unit);}else if(obj.y>twou){obj.y = twou;};
            obj.value = 10 - obj.y*5/unit;
        }else if(type=='s'){
            if(obj.y<-(9*unit)){obj.y = -(9*unit);}else if(obj.y>twou){obj.y = twou;};
            obj.value = 10 - obj.y*5/unit;
        };
        ul.style.cssText = "-webkit-transform:translate3d(0,"+(obj.y)+"px,0);transform:translate3d(0,"+(obj.y)+"px,0);-webkit-transition: -webkit-transform 0.4s;transition:transform 0.4s;"
        obj.ly = 0;
    },false);

    var heartjump = new CUES.heartjump();
    heartjump.throttle = function(event){
        ul.style.webkitTransition = "all .05s";
        if(event.wheelDelta>0){
            obj.y = obj.y + unit;
        }else{
            obj.y = obj.y - unit;
        }
        if(type=='y'){
            if(obj.y<-(27*unit)){obj.y = -(27*unit);}else if(obj.y>twou){obj.y = twou;};
        }else if(type=='m'){
            if(obj.y<-(9*unit)){obj.y = -(9*unit);}else if(obj.y>twou){obj.y = twou;};
        }else if(type=='d'){
            if(obj.y<-obj.maxy){obj.y = -obj.maxy;}else if(obj.y>twou){obj.y = twou;};
        }else if(type=='h'){
            if(obj.y<-(21*unit)){obj.y = -(21*unit);}else if(obj.y>twou){obj.y = twou;};
        }else if(type=='i'){
            if(obj.y<-(9*unit)){obj.y = -(9*unit);}else if(obj.y>twou){obj.y = twou;};
        }else if(type=='s'){
            if(obj.y<-(9*unit)){obj.y = -(9*unit);}else if(obj.y>twou){obj.y = twou;};
        };
        ul.style.cssText = "-webkit-transform:translate3d(0,"+(obj.y)+"px,0);transform:translate3d(0,"+(obj.y)+"px,0);-webkit-transition: -webkit-transform 0.4s;transition:transform 0.4s;"
    }
    heartjump.debounce = function(event){
        if(type=='y'){
            obj.value = 2002 - obj.y/unit;
            _this.changeym();
        }else if(type=='m'){
            obj.value = 3 - obj.y/unit;
            _this.changeym();
        }else if(type=='d'){
            obj.value = 3 - obj.y/unit;
        }else if(type=='h'){
            obj.value = 2 - obj.y/unit;
        }else if(type=='i'){
            obj.value = 10 - obj.y*5/unit;
        }else if(type=='s'){
            obj.value = 10 - obj.y*5/unit;
        };
    }
    box.addEventListener('mousewheel',function(event){
        event.stopPropagation();
        event.preventDefault();
        heartjump.step(event);
    })
};
dateselect.prototype.changeym = function(){
    var dmax = 28,
        valy = this.selects['y'].value,
        valm = this.selects['m'].value,
        sd = this.selects['d'],
        vald = sd.value,
        dul = sd.ul,
        dlis = sd.li,
        unit = this.unit;

    
    if(valm==2){
        dlis[29].style.opacity = 0;
        dlis[30].style.opacity = 0;
        if(valy%4==0){
            dlis[28].style.opacity = 1;
            dmax = 26;
        }else{
            dlis[28].style.opacity = 0;
            dmax = 25;
        };
    }else if(valm==4 || valm==6 || valm==9 || valm==11){
        dlis[28].style.opacity = 1;
        dlis[29].style.opacity = 1;
        dlis[30].style.opacity = 0;
        dmax = 27;
    }else{
        dlis[28].style.opacity = 1;
        dlis[29].style.opacity = 1;
        dlis[30].style.opacity = 1;
    };
    sd.maxy = dmax*unit;

    if(vald>dmax+3){
        sd.value = dmax+3;
        sd.y = -sd.maxy;
        dul.style.cssText = "-webkit-transform:translate3d(0,-"+(dmax*unit)+"px,0);transform:translate3d(0,-"+(dmax*unit)+"px,0)";
    };
};
dateselect.prototype.bindEvent_input_click = function(obj){
    var _this = this,
        unit = this.unit,
        outer = this.outer,
        target = obj.target,
        timegroups = _this.timegroups;
    obj.target.addEventListener('click',function(){
        _this.obj = obj;
        _this.nowtime = target.value?new Date(target.value.replace(/\-/ig,'/')):new Date();
        _this.nowtime = _this.inittime(_this.nowtime);
        for(var i=0,len = timegroups.length;i<len;i++){
            var type = timegroups[i];
            var s = _this.selects[type];
            s.box.style.display = "block";
            if(type=='y'){
                s.value = _this.nowtime.getFullYear();
                s.y = (2002 - _this.nowtime.getFullYear())*unit
            }else if(type=='m'){
                s.value = _this.nowtime.getMonth()+1;
                s.y = (2 - _this.nowtime.getMonth())*unit
            }else if(type=='d'){
                s.value = _this.nowtime.getDate();
                s.y = (3 - _this.nowtime.getDate())*unit
            }else if(type=='h'){
                s.value = _this.nowtime.getHours();
                s.y = (2 - _this.nowtime.getHours())*unit
            }else if(type=='i'){
                s.value = _this.nowtime.getMinutes();
                s.y = (2 - _this.nowtime.getMinutes()/5)*unit
            }else if(type=='s'){
                s.value = _this.nowtime.getSeconds();
                s.y = (2 - _this.nowtime.getSeconds()/5)*unit
            };
            s.ul.style.cssText = "-webkit-transform:translate3d(0,"+(s.y)+"px,0);transform:translate3d(0,"+(s.y)+"px,0);"
        };
        _this.changeym();
        outer.style.display = "block";
    },false);
    
};

dateselect.prototype.timeformat = function(time,target,format){
    format = format.replace("y",time.getFullYear());
    format = format.replace("m",(time.getMonth()+1)<10?'0'+(time.getMonth()+1):(time.getMonth()+1));
    format = format.replace("d",time.getDate()<10?'0'+time.getDate():time.getDate());
    format = format.replace("h",time.getHours()<10?'0'+time.getHours():time.getHours());
    format = format.replace("i",time.getMinutes()<10?'0'+time.getMinutes():time.getMinutes());
    format = format.replace("s",time.getSeconds()<10?'0'+time.getSeconds():time.getSeconds());
    target.value = format ;
};
dateselect.prototype.bindEvent_input_cus = function(){
    var _this = this,
        outer = this.outer;
    this.dp_cal.addEventListener('click',function(){
        outer.style.display = "none";
    },false);
    this.dp_empty.addEventListener('click',function(){
        if(_this.empty){
            _this.empty(_this.obj.target);
            outer.style.display = "none";
        };
    },false)
    this.dp_sure.addEventListener('click',function(){
        var v = _this.format,
            timegroups = _this.timegroups;

            // console.log(timegroups)
        for(var i=0,len = timegroups.length;i<len;i++){
            var type = timegroups[i];
            var sel = _this.selects[type], vv = sel.value<10?'0'+sel.value:sel.value;
            v = v.replace(timegroups[i],vv);
        };
        _this.obj.target.value = v;
        _this.obj.target.innerHTML = v;
        outer.style.display = 'none';
        if(_this.selected){
            _this.selected(_this.obj.target,new Date(v.replace(/\-/ig,'/')),v)
        }
    },false)
};
dateselect.prototype.inittime = function(time){
    var i = parseInt(time.getMinutes()/5)*5;
    var s = parseInt(time.getSeconds()/5)*5;
    return new Date(time.getFullYear()+'/'+(time.getMonth()+1)+'/'+time.getDate()+' '+time.getHours()+':'+i+':'+s);
};

$(function(){
    $('#J_back').click(function(){
        window.history.go(-1);
    });
    $('.J_blurscroll').blur(function(){
        setTimeout(function(){
            $(window).scrollTop($(window).scrollTop())
        },10)
    })
})
