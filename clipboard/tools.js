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
            timeout = null;
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
            rid = this.rid;

        for(var i=0,len=dl.length;i<len;i++){
            if(dl[i].id==rid){
                idx = i;
                break;
            }
        };
        this.y = (3-idx)*this.unit;
        this.v = this.datalist[3-Math.floor(this.y/this.unit)];
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
                    console.log(that.default_time)
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

        this.province = {};
        this.render();
    },
    render:function(){
        var that = this,
            opts = this.opts;
        applytools.call(this,['createDom','createPop']);
        this.createPop();
        this.bindTarget();
        this.boxer.setAttribute('class','J_slbox cm-slbox cm-slbox3')
        this.elm_til.innerHTML = this.opts.title||'';

        for(var i=0;i<3;i++){
            (function(){
                var tp = ['province','city','area'][i];
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
            res.province = that.province.scroller.v;
            res.city = that.city.scroller.v;
            res.area = that.area.scroller.v;

            that.opts.confirm&&that.opts.confirm(res,function(){
                that.pop.classList.remove('cm-pop-active');
            })
        })
        this.target.addEventListener('click',function(){
            that.pop.classList.add('cm-pop-active')
        })
    }
}

function dateTable(opts){
    this.opts = opts;
    this.setting();
}
dateTable.prototype = {
    setting:function(){
        var that = this,
			opts = this.opts;

		this.targets = opts.targets;
		var gt = this.opts.defaultdate?new Date(this.opts.defaultdate.replace(/\-/ig,'/')):new Date();
		// this.settime(gt);
		this.prevtext = opts.prevtext?opts.prevtext:"&lt;";
		this.nexttext = opts.nexttext?opts.nexttext:"&gt;";
		this.monthtext = opts.monthtext?opts.monthtext:['一月','二月','三月','四月','五月','六月','七月','八月','九月','十月','十一月','十二月'];
        this.weektext = opts.weektext?opts.weektext:["日","一","二","三","四","五","六"];
        this.format_all = 'y/m/d h:i:s';
        this.format = opts.format||'y/m/d';
        this.default_time = opts.default_time||new Date();
        this.confirm_time = opts.default_time||new Date();
        
        if(this.targets){
            applytools.call(this,['createDom','createPop','timeFormat']);
            this.createPop();
            this.boxer.classList.add('cm-slbox-table')
            this.settil(this.title);
            this.boxer.style.paddingBottom = (opts.paddingBottom||20)+'px';
            this.bindTargets();
        }else{
            applytools.call(this,['timeFormat']);
            this.boxer = this.opts.boxer;
        };

        this.boxer.innerHTML = '<div class="cm-dateselect_table">\
                <div class="dp-btns">\
                    <a href="javascript:;" class="J_btn_prev dt-mbtn">&lt;</a>\
                    <a href="javascript:;" class="J_btn_next dt-mbtn dt-mbtna">&gt;</a>\
                    <a href="javascript:;" class="J_btn_year dt-btn"><span class="J_year">2012</span>年</a>\
                    <a href="javascript:;" class="J_btn_month dt-btn dt-btna"><span class="J_month">2012</span></a>\
                </div>\
                <table width="100%" cellspacing="0" cellpadding="0" class="J_table"></table>\
                <div class="dateselect_cont">\
                    <div class="cont-month cont-pop"><div class="box-month"></div></div>\
                    <div class="cont-year cont-pop">\
                        <div class="cont-yl"><p class="cont-ylrm cont-ylrm-l">&lt;</p></div>\
                        <div class="cont-yr"><p class="cont-ylrm cont-ylrm-r">&gt;</p></div>\
                        <div class="cont-yc"></div>\
                        <p class="cont-mls-hide cont-hide-y">取消选择</p>\
                    </div>\
                </div>\
            </div>';

        this._btn_prev = this.boxer.getElementsByClassName("J_btn_prev")[0];
        this._btn_next = this.boxer.getElementsByClassName("J_btn_next")[0];

        this.table = this.boxer.getElementsByClassName("J_table")[0];
        this.text_year = this.boxer.getElementsByClassName("J_year")[0];
        this.text_month = this.boxer.getElementsByClassName("J_month")[0];

        this._btn_month = this.boxer.getElementsByClassName('J_btn_month')[0];
        this.cont_month = this.boxer.getElementsByClassName('cont-month')[0];

        this._btn_year = this.boxer.getElementsByClassName('J_btn_year')[0];
        this.cont_year = this.boxer.getElementsByClassName('cont-year')[0];
        this.cont_year_c = this.boxer.getElementsByClassName('cont-yc')[0];
        this.cont_year_l = this.boxer.getElementsByClassName('cont-yl')[0];
        this.cont_year_r = this.boxer.getElementsByClassName('cont-yr')[0];

        this.temporary = {}
        this.resttemporary();
        this.resetmonth();
        this.temporary.year_copy = this.temporary.year;
        this.resetyear();
        this.table.innerHTML = this.rendertable();
        this.bindEvent();
        
    },
    settil:function(title){
        this.elm_til.innerHTML = title||'';
    },
    resttemporary:function(){
        this.temporary.year = this.default_time.getFullYear();
        this.temporary.month = this.default_time.getMonth()+1;
        this.temporary.date = this.default_time.getDate();
        this.text_year.innerHTML = this.temporary.year;
        this.text_month.innerHTML = this.monthtext[this.temporary.month-1];
    },
    resetmonth:function(){
        //月份内容填充
        var str_m = '';
        for(var i=1;i<=12;i++){
            str_m += '<p class="cont-mls '+(i==this.temporary.month?'cont-mls-cur':'')+'" data-value="'+i+'">'+this.monthtext[i-1]+'</p>';
        };
        str_m += '<p class="cont-mls-hide cont-hide-m">取消选择</p>'
        this.cont_month.innerHTML = str_m;
    },
    resetyear:function(){
        var st = this.temporary.year_copy - 4,
            str = '';
        for(var i=st;i<this.temporary.year_copy+5;i++){
            str += '<p class="cont-yls '+(i==this.temporary.year?'cont-yls-cur':'')+'" data-value="'+i+'">'+i+'</p>';
        }
        this.cont_year_c.innerHTML = str;
    },
    rendertable:function(){
        this.active = null;
		var newdate = new Date(this.temporary.year+'/'+this.temporary.month+'/1');
		var firstday = newdate.getDay();
		var m = newdate.getMonth()+1,y = newdate.getFullYear();
        var cm = this.confirm_time.getMonth()+1,cy = this.confirm_time.getFullYear(),cd = this.confirm_time.getDate();
        var ty = this.default_time.getFullYear(),tm = this.default_time.getMonth()+1,td = this.default_time.getDate();
        var ac = (cy==ty&&cm==tm&&cd==td)?false:true;
		var daynum = new Date(y,m,0).getDate();
		var trs = Math.ceil((firstday+daynum)/7);
		var str = '';
		for(var i=0;i<trs;i++){
			var stra = '';
			for(var ii=1;ii<=7;ii++){
                var cdstr = (y==cy&&m==cm&&(i*7+ii-firstday)==cd)?'selected':'',
                    tdstr = (ac&&y==ty&&m==tm&&(i*7+ii-firstday)==td)?'active':'';
				if((i*7+ii>firstday) && (i*7+ii<=daynum+firstday)){
					stra += '<td class="td"><a href="javascript:;" data-month="'+m+'" data-year="'+y+'" data-date="'+(i*7+ii-firstday)+'" class="a '+cdstr+' '+tdstr+'">'+(i*7+ii-firstday)+'</a></td>';
				}else{
					stra += '<td class="td"></td>';
				}
			}
			str += '<tr>'+stra+'</tr>';
		}
		return str;
    },
    bindEvent:function(){
        var that = this;
        //前一个月
		this._btn_prev.addEventListener('click',function(){
			that.temporary.month--;
			if(that.temporary.month<1){
				that.temporary.year--,that.temporary.month = 12;
			}
			that.text_month.innerHTML = that.monthtext[that.temporary.month-1];
			that.text_year.innerHTML = that.temporary.year;
            
            that.resetmonth();
            that.table.innerHTML = that.rendertable();
			that.opts.monthchange && that.opts.monthchange({year:that.temporary.year,month:that.temporary.month,target:that.target});
		});
		// 往后一个月
		this._btn_next.addEventListener('click',function(){
			that.temporary.month++;
			if(that.temporary.month>12){
				that.temporary.year++,that.temporary.month = 1;
			}
			that.text_month.innerHTML = that.monthtext[that.temporary.month-1];
			that.text_year.innerHTML = that.temporary.year
            that.resetmonth();
            that.table.innerHTML = that.rendertable();
			that.opts.monthchange && that.opts.monthchange({year:that.temporary.year,month:that.temporary.month,target:that.target});
        });
        //月份操作
		this.cont_month.addEventListener('click',function(e){
            var tar = e.target;
			if(e.target.classList.contains('cont-hide-m')){
              that.hidepop(that.cont_month);
            }else if(e.target.classList.contains('cont-mls')){
                that.temporary.month = parseInt(tar.getAttribute('data-value'));
                that.hidepop(that.cont_month);
                that.text_month.innerHTML = that.monthtext[that.temporary.month-1];
                that.table.innerHTML = that.rendertable();
                that.resetmonth();
                that.opts.monthchange && that.opts.monthchange({year:that.temporary.year,month:that.temporary.month,target:that.target});
            };
        })
        //年份操作
        this.cont_year.addEventListener('click',function(e){
            var tar = e.target;
			if(e.target.classList.contains('cont-hide-y')){
              that.hidepop(that.cont_year);
            }else if(e.target.classList.contains('cont-yls')){
                that.temporary.year = parseInt(tar.getAttribute('data-value'));
                that.hidepop(that.cont_year);
                that.text_year.innerHTML = that.temporary.year;
                that.table.innerHTML = that.rendertable();
                that.temporary.year_copy = that.temporary.year;
                that.resetyear();
                that.opts.monthchange && that.opts.monthchange({year:that.temporary.year,month:that.temporary.month,target:that.target});
            }else if(e.target.classList.contains('cont-ylrm-l')){
                that.temporary.year_copy -= 9;
			    that.resetyear();
            }else if(e.target.classList.contains('cont-ylrm-r')){
                that.temporary.year_copy += 9;
			    that.resetyear();
            };
        })
        this._btn_month.addEventListener('click',function(){
            that.showpop(that.cont_month);
        })
        this._btn_year.addEventListener('click',function(){
            that.showpop(that.cont_year);
        })
        //选择日期
		this.table.addEventListener('click',function(e){
			if(e.target.nodeName!="A") return;
			if(that.active){
				that.active.classList.remove('active');
			}
            that.active = e.target;
            var time = new Date(that.active.getAttribute('data-year')+'/'+that.active.getAttribute('data-month')+'/'+that.active.getAttribute('data-date'));
            e.target.classList.add('active');
            that.opts.selected&&that.opts.selected({time:time,time_str:that.timeFormat(time,that.format),target:that.target})
        })
        //隐藏弹层
        this.btn_cal&&this.btn_cal.addEventListener('click',function(){
            that.pop.classList.remove('cm-pop-active');
        })
        this.btn_sure&&this.btn_sure.addEventListener('click',function(){
			if(!that.active){
				CUES.tip({msg:'请选择日期'});
				return;
			}
			var time = new Date(that.active.getAttribute('data-year')+'/'+that.active.getAttribute('data-month')+'/'+that.active.getAttribute('data-date'));
			that.opts.confirm&&that.opts.confirm({time:time,time_str:that.timeFormat(time,that.format),target:that.target},function(){
                that.target.setAttribute('data-time',that.timeFormat(time,that.format_all))
                that.pop.classList.remove('cm-pop-active');
            })
        })
    },
	showpop:function(tar){
		tar.classList.add('cont-pop-active');
		setTimeout(function(){
			tar.classList.add('cont-pop-show')
		}, 0);
	},
	hidepop:function(tar){
		tar.classList.add('cont-pop-hide');
		setTimeout(function(){
			tar.classList.remove('cont-pop-show');
			tar.classList.remove('cont-pop-hide');
			tar.classList.remove('cont-pop-active');
		}, 350);
	},
    bindTargets:function(){
        var that = this;
        for(var i=0,len=this.targets.length;i<len;i++){
            (function(){
                var target = that.targets[i];
                target.addEventListener('click',function(){
                    that.settil(target.getAttribute('data-title'));
                    that.format = target.getAttribute('data-format')||'y/m/d';
                    that.default_time = target.getAttribute('data-time')?new Date(target.getAttribute('data-time')):new Date();
                    that.resttemporary();
                    that.resetmonth();
                    that.temporary.year_copy = that.temporary.year;
                    that.resetyear();
                    that.table.innerHTML = that.rendertable();
                    that.active = that.table.getElementsByClassName('active')[0]||null;
                    that.target = target;
                    that.pop.classList.add('cm-pop-active')
                })
            })()
        }
    }
}

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

function elmReachBottom(elm,num,callback){
    var that = this;
    num = num||0;
    var box_h = elm.offsetHeight;

    this.elmscroll = CUES.debounce(function(){
        if(elm.scrollTop+num>elm.scrollHeight - box_h){
            callback();
        }
    },100)

    elm.addEventListener('scroll',that.elmscroll);

    this.unbindscroll = function(){
        elm.removeEventListener('scroll',that.elmscroll);
    }
    
    var tc_y = 0;
    elm.addEventListener('touchstart',function(event){
        tc_y = event.touches[0].clientY;
    })

    elm.addEventListener('touchmove',function(event){
        var tcy = event.touches[0].clientY;
        if(tcy>tc_y&&elm.scrollTop<=0){
            event.preventDefault();
            event.stopPropagation();
        }else if(tcy<tc_y&&elm.scrollTop+box_h>=elm.scrollHeight){
            event.preventDefault();
            event.stopPropagation();
        }
        tc_y = tcy;
    })
}

function scrollRefresh(opts){
    this.opts = opts;
    this.height = opts.height;
    this.botcut = opts.botCut||40;
    this.toppx = opts.toppx;
    this.alldone = false;
    
    applytools.call(this,['createDom']);
    this.setting();
}
scrollRefresh.prototype = {
    setting:function(){
        var opts = this.opts;
        this.cr_top = this.createDom({tag:'div',classname:'cm-sr-top',msg:'<span class="cm-sr-top-arr"><span class="cm-sr-top-ico"></span></span><span class="cm-sr-top-text">下拉可以刷新</span>'})
        this.cr_bot = this.createDom({tag:'div',classname:'cm-sr-bot',msg:'<span class="cm-sr-bot-text">正在加载···</span><span class="cm-sr-bot-text-done">已加载全部数据</span>'})
        this.target = opts.target;
        this.target.appendChild(this.cr_top);
        this.target.appendChild(this.cr_bot);

        if(this.toppx!=undefined){
            this.cr_top.style.top = this.toppx+'px';
        }

        this.cr_top_text = this.cr_top.getElementsByClassName('cm-sr-top-text')[0];
        this.cont = this.target.getElementsByClassName('cm-srcont')[0];

        this.judgebotshort();
        this.bindevent();
    },
    judgebotshort:function(){
        this.height>=this.cont.scrollHeight+this.botcut?this.target.classList.add('cm-scrollrefresh-short'):this.target.classList.remove('cm-scrollrefresh-short');
    },
    bindevent:function(){
        var that = this,
            opts = this.opts,
            target = this.target,
            cr_top = this.cr_top,
            cr_top_text = this.cr_top_text;

        var y_start = 0,
            elm_scrollHeight = 0,
            elm_scrollTop = 0,
            cha = 0,
            wsb_my = 0;

        //默认打开locked
        var locked_type = '',
            haspullup = opts.pullupRefresh?true:false,
            reachBottom = opts.reachBottom?true:false;

        target.addEventListener('touchstart',function(e){
            y_start = e.touches[0].clientY;
            elm_scrollTop = target.scrollTop;
            cr_top.style.webkitTransition = "";
        });

        target.addEventListener('touchmove',function(e){
            var lasty = e.touches[0].clientY;
            cha = y_start - lasty + elm_scrollTop;
            
            if(locked_type=='up'){
                e.preventDefault();
                return;
            }
            if(cha<0 && haspullup){
                var a = Math.sin(Math.PI*(-cha/1000));
                a = a>1?1:a;
                wsb_my = a*150;
                cr_top.style.webkitTransform = 'translate3d(-50%,'+(wsb_my)+'px,0)';
                if(wsb_my>80){
                    cr_top.classList.add('cm-sr-top-ac');
                    cr_top_text.innerHTML = '释放立即刷新';
                }else{
                    cr_top.classList.remove('cm-sr-top-ac');
                    cr_top_text.innerHTML = '下拉可以刷新';
                }
            };
            if(cha<0){
                e.preventDefault();
            };
        })

        target.addEventListener('touchend',function(e){ 
            if(wsb_my>0&&haspullup){
                if(wsb_my<80){
                    cr_top.style.webkitTransition = "-webkit-transform 0.3s";
                    cr_top.style.webkitTransform = 'translate3d(-50%,0,0)';
                }else{
                    cr_top.style.webkitTransition = "-webkit-transform 0.3s";
                    cr_top.style.webkitTransform = 'translate3d(-50%,50px,0)';
                    cr_top_text.innerHTML = '正在加载···';
                    locked_type = 'up';
                    opts.pullupRefresh();
                    //延时清除加载
                    that.toptimer = setTimeout(function(){
                        that.domdone();
                    },3000)
                }
            }
        });

        this.reset = function(){
            wsb_my = 0;
            y_start = 0;
            locked_type = '';
        }

        this.elmscroll = CUES.debounce(function(){
            opts.scrollEnd&&opts.scrollEnd();
            elm_scrollHeight = target.scrollHeight;
            elm_scrollTop = target.scrollTop;
            if(elm_scrollTop+that.height+(opts.reachNumber||0)+2>=elm_scrollHeight&&reachBottom&&!that.alldone){
                opts.reachBottom&&opts.reachBottom();
                that.toptimer = setTimeout(function(){
                    that.domdone();
                },3000)
            }
        },100)
    
        target.addEventListener('scroll',that.elmscroll);
    
        this.unbindscroll = function(){
            target.removeEventListener('scroll',that.elmscroll);
        }
    },
    domdone:function(){
        var that = this;
        clearTimeout(this.toptimer);
        setTimeout(function(){
            that.cr_top_text.innerHTML = '加载完成';
            that.cr_top.style.webkitTransform = 'translate3d(-50%,0,0)';
            that.cr_top.classList.remove('cm-sr-top-ac');
            that.reset()
        },0)
        setTimeout(function(){
            that.cr_top_text.innerHTML = '下拉可以刷新';
        }, 300);
    },
    loading_done:function(obj){
        if(obj.loadingdone){
            this.alldone = true;
            this.cr_bot.classList.add('cm-sr-bot-done');
        }else{
            this.alldone = false;
            this.cr_bot.classList.remove('cm-sr-bot-done');
        }
        this.judgebotshort();
    }
}

function swipe(opts){
    var that = this;
    opts.space = opts.space||3000;
    opts.autoplay = opts.autoplay==undefined?true:opts.autoplay;
    opts.loop = opts.loop==undefined?true:opts.loop;
    opts.indicators = opts.indicators==undefined?'spot':opts.indicators;

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
        if(opts.loop&&imglen==2){
            box.innerHTML += box.innerHTML;
            imgs = el.getElementsByClassName('swipe-item');
            imglen = imgs.length;
            imgmaxlen = imglen - 1;
        };

        var dtlen = this.dtlen,
            self = this,
            figs = [];

        for(var i=0,len = imgs.length;i<len;i++){
            that.styletransform(imgs[i],'translateZ(0) translateX(-' + width + 'px)');
        };

        figs = ['', imgs[0], imgs[1]];
        if(opts.loop){
            figs[0] = imgs[imgmaxlen];
        }
        that.styletransform(figs[0],'translateZ(0) translateX(-' + width + 'px)');
        that.styletransform(figs[1],'translateZ(0) translateX(0)');
        that.styletransform(figs[2],'translateZ(0) translateX(' + width + 'px)');

        var pos = '';
        for(var i=0;i<poslen;i++){
            pos += '<span class="swipe-po"></span>';
        }
        var po_cont = this.createDom({tag:'p',classname:'swipe-pos',msg:pos});
        po_cont.style.opacity = opts.indicators=='spot'?1:0;
        el.appendChild(po_cont);
        pos = el.getElementsByClassName('swipe-po');
        
        var num_cont = this.createDom({tag:'p',classname:'swipe-num',msg:'<span class="swipe-num-cur"></span><span class="swipe-sp">/</span><span class="swipe-num-tol"></span>'});
        num_cont.style.opacity = opts.indicators=='number'?1:0;
        el.appendChild(num_cont);
        var pop_cur = el.getElementsByClassName('swipe-num-cur')[0];
        var pop_tol = el.getElementsByClassName('swipe-num-tol')[0];
        pop_cur.innerHTML = 1;
        pop_tol.innerHTML = poslen;

        this.handstart = function(event){
            clearInterval(timer);
            for (var i = 0; i < 3; i++) {
                if(figs[i]){
                    figs[i].style.webkitTransition = "all 0s";
                    figs[i].transition = "all 0s";
                }
            };
            touch_s = event.touches[0];
            touch_m = {};
        }
        this.handmove = function(event){
            touch_m = event.touches[0];
            if(isdire==1){
                var cy = touch_m.clientX - touch_s.clientX;
                for (var i = 0; i < 3; i++) {
                    figs[i]&&that.styletransform(figs[i],'translateZ(0) translateX(' + ((i - 1) * width + cy) + 'px)')
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

            if(opts.autoplay){
                timer = setInterval(function() {
                    that.goleft();
                }, opts.space+300);
            }
            if (!touch_m.clientX) {
                return false;
            };
            if(touch_m.clientX-touch_s.clientX<=-(width/10)){
                that.goleft();
            }else if(touch_m.clientX-touch_s.clientX>=(width/10)){
                var s = dataindex;
                dataindex--;
                if (dataindex < 0) {
                    if(opts.loop){
                        dataindex = imgmaxlen;
                    }else{
                        dataindex++;
                        that.resetcur();
                        return;
                    }
                };
                that.changepo(s, dataindex);
                figs.pop();
                var o = imgs[(dataindex - 1) < 0 ? (opts.loop?imgmaxlen:-1) : dataindex - 1];
                that.styletransform(o,'translateZ(0) translateX(-' + width + 'px)','all 0s');
                figs = [o].concat(figs);
                that.styletransform(figs[2],'translateZ(0) translateX(' + width + 'px)','all 0.3s');
                that.styletransform(figs[1],'translateZ(0) translateX(0)','all 0.3s');
            }else{
                that.resetcur();
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
                if(opts.loop){
                    dataindex = 0;
                }else{
                    dataindex--;
                    that.resetcur();
                    return;
                }
            };
            that.changepo(s, dataindex);
            figs.shift();
            var o = imgs[(dataindex + 1) > imgmaxlen ? (opts.loop?0:-1) : dataindex + 1];

            that.styletransform(o,'translateZ(0) translateX(' + width + 'px)','all 0s');
            figs.push(o);

            that.styletransform(figs[0],'translateZ(0) translateX(-' + width + 'px)','all 0.3s');
            that.styletransform(figs[1],'translateZ(0) translateX(0)','all 0.3s');
        };
        that.resetcur = function(){
            for (var i = 0; i < 3; i++) {
                that.styletransform(figs[i],'translateZ(0) translateX(' + ((i - 1) * width) + 'px)','all 0.3s')
            };
        }

        that.changepo = function(f, t) {
            that.swipeend&&that.swipeend({idx:t%poslen,item:imgs[t%poslen]})
            pos[f % poslen]&&pos[f % poslen].setAttribute('class', 'swipe-po');
            pos[t % poslen]&&pos[t % poslen].setAttribute('class', 'swipe-po swipe-po-ac');
            pop_cur.innerHTML = t % poslen+1;
        };
        
        opts.autoplay = opts.autoplay==undefined?true:opts.autoplay;
        if(opts.autoplay){
            timer = setInterval(function() {
                that.goleft();
            }, opts.space);
        }

        that.changepo(1, dataindex);
}
swipe.prototype = {
    styletransform:function(elm,css,time){
        if(!elm) return;
        if(time){
            elm.style.webkitTransition = time;
            elm.style.transition = time;
        };
        elm.style.webkitTransform = css;
        elm.style.transform = css;
    }
}

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
    function initdata(arr){
        datalist = arr;
        tol.innerHTML = (arr.length);

        var str = '',list = arr,len = list.length;
        for(var i=0;i<len;i++){
            str += '<a href="javascript:;" class="sibox"><span class="mbox"><span class="siimg" style="background-image:url('+list[i].thumb+');"></span></span></a>';
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
            weight = v.weight||'',
            color = v.color||"#000000",
            lineheight = (v.lineheight||30)*rate,
            width = (v.width||750)*rate,
            left = (v.left||0)*rate,
            top = (v.top||0)*rate;

        left = align=='center'?left + width/2 : left;
        left = align=='right'?left + width : left;

        this.canvas.font= weight+' '+fontsize+"px Arial";
        this.canvas.textBaseline = "top";
        this.canvas.textAlign= align;
        this.canvas.fillStyle = color;
        // this.canvas.setFakeBoldText(v.bold?true:false);


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
    $('#J_back').click(function(){
        window.history.go(-1)
    })
    $('.J_blurscroll').blur(function(){
        setTimeout(function(){
            $(window).scrollTop($(window).scrollTop())
        },10)
    })
})
