var CUES = {
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
        var a_cal = this.createdom({"tag":"a","classname":"tippop_confirm_btn","msg":"取消"});
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
        var elmc = this.createdom({"tag":"p","classname":"tippop_alert_b"});
        var a_cal = this.createdom({"tag":"a","classname":"tippop_confirm_btn","msg":"取消"});
        var a_sure = this.createdom({"tag":"a","classname":"tippop_confirm_btn","msg":options.suretext?options.suretext:"确定"});
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
    this.format = opt.format||'y/m/d h:i';
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
    if(vald>dmax){
        sd.value = dmax;
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
        var val = target.getAttribute('data-time');
        _this.nowtime = val?new Date(val.replace(/\-/ig,'/')):new Date();
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
        outer.style.display = "block";
    },false);
    
};

dateselect.prototype.timeformat = function(time,format){
    format = format.replace("y",time.getFullYear());
    format = format.replace("m",(time.getMonth()+1)<10?'0'+(time.getMonth()+1):(time.getMonth()+1));
    format = format.replace("d",time.getDate()<10?'0'+time.getDate():time.getDate());
    format = format.replace("h",time.getHours()<10?'0'+time.getHours():time.getHours());
    format = format.replace("i",time.getMinutes()<10?'0'+time.getMinutes():time.getMinutes());
    format = format.replace("s",time.getSeconds()<10?'0'+time.getSeconds():time.getSeconds());
    return format;
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
        // var timestr = _this.timeformat(new Date(v.replace(/\-/ig,'/')),_this.format);
        _this.obj.target.setAttribute('data-time',v);
        if(_this.selected){
            _this.selected({
                target:_this.obj.target,
                time:new Date(v.replace(/\-/ig,'/')),
                timestr:v
            })
        }else{
            outer.style.display = 'none';
        }
    },false)
};
dateselect.prototype.hide = function(){
    this.outer.style.display = 'none';
}
dateselect.prototype.inittime = function(time){
    var i = parseInt(time.getMinutes()/5)*5;
    var s = parseInt(time.getSeconds()/5)*5;
    return new Date(time.getFullYear()+'/'+(time.getMonth()+1)+'/'+time.getDate()+' '+time.getHours()+':'+i+':'+s);
};


function dataSelect(option){
    this.opt = option;
    this.setting();
    this.render();
    this.bindEvent();
    return this;
}
dataSelect.prototype = {
    setting:function(){
        var opt = this.opt;
        this.data = opt.data;
        this.fieldshow = opt.fieldshow;
        this.fieldvalue = opt.fieldvalue;
        this.default_v = opt.default_v?opt.default_v:null;
        this.unit = opt.unit?opt.unit:40;
        this.target = opt.target;
        this.title = opt.title?opt.title:'';
        this.maxY = -(this.data.length-3)*this.unit;
        this.Y = 3*this.unit;
        this.fy = this.ly = this.ofy = 0;
        this.v = null;
    },
    render:function(){
        this.outer = this.createdom({"tag":"div","classname":"select_data_box"});
        document.body.appendChild(this.outer);

        this.outer.innerHTML = '<a href="javascript:;" class="closebg"></a><div class="select_data"><p class="sc-btns"><a href="javascript:;" class="sc-btn sc-cal">取消</a><a href="javascript:;" class="sc-btn sc-btna sc-sure">确定</a><span class="sc-title">'+this.title+'</span></p><div class="scls"><div class="sclsbox"></div></div></div>';
        this.sclsbox = this.outer.getElementsByClassName("sclsbox")[0];
        this.sc_cal = this.outer.getElementsByClassName("sc-cal")[0];
        this.sc_sure = this.outer.getElementsByClassName("sc-sure")[0];
        this.closebg = this.outer.getElementsByClassName("closebg")[0];


        this.scul = this.createdom({"tag":"ul","classname":"sc-ul"});
        this.scul.style.webkitTransition = "all .3s";
        this.scul.style.webkitTransform = 'translateZ(0) translateY('+this.Y+'px)';
        this.rendersub();
        this.opt.initselected && this.opt.selected(this.v);
    },
    rendersub:function(){
        this.scul.innerHTML = '';
        var len = this.data.length,fieldshow = this.fieldshow,default_v = this.default_v,unit = this.unit,fieldvalue = this.fieldvalue;
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
        this.sclsbox.appendChild(this.scul);
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
        var _this = this,scul = this.scul,unit = this.unit,outer = this.outer,target = this.target,fieldshow = this.fieldshow;
        this.sclsbox.addEventListener('touchstart',function(event){
            scul.style.webkitTransition = "all 0s";
            var touches = event.targetTouches;
            _this.fy = touches[0].pageY;
        },false);
        this.sclsbox.addEventListener('touchmove',function(event){
            var touches = event.targetTouches;
             _this.ly = touches[0].pageY;
            var cy =  _this.ly-_this.fy;
            scul.style.webkitTransform = 'translateZ(0) translateY('+(_this.Y+cy)+'px)';
            event.preventDefault();
        },false)
        this.sclsbox.addEventListener('touchend',function(event){
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

        this.sc_cal.addEventListener('click',function(){
            _this.hide();
        },false);
        this.target.addEventListener('click',function(){
            _this.show();
        },false);
        this.sc_sure.addEventListener('click',function(){
            _this.opt.selected && _this.opt.selected(_this.v)
        },false);
        this.closebg.addEventListener('click',function(){
            _this.hide();
        });
    },
    init:function(option){
        this.data = option.data?option.data:this.data;
        this.default_v = option.default_v!=null?option.default_v:null;
        this.maxY = -(this.data.length-3)*this.unit;
        this.Y = 3*this.unit;;
        this.scul.style.webkitTransform = 'translateZ(0) translateY('+(this.Y)+'px)';
        this.v = null;
        this.rendersub();
    },
    hide:function(){
        this.outer.style.display = "none";
        this.outer.setAttribute('class','select_data_box');
    },
    show:function(){
        var _this = this;
        this.outer.style.display = "block";
        setTimeout(function(){
            _this.outer.setAttribute('class','select_data_box select_data_box_active');
        },10);
    },
    empty:function(){
        this.data = [];
        this.v = null;
        this.default_v = null;
        this.scul.innerHTML = '';
    }
};