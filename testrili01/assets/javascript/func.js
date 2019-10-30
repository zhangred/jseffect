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
dateselect.prototype = {
	setting:function(){
		var _this = this,
			opt = this.opt
		this.targets = opt.targets;

		this.outer = this.createdom({"tag":"div","classname":"dateselect_input_box"});
		this.timegroups = ["y","m","d","h","i","s"];
		this.unit = opt.unit||40;
		this.format = 'y/m/d h:i:s';
		this.selected = opt.selected?opt.selected:null;
		this.default = opt.default||new Date('2016/2/27');
		document.body.appendChild(this.outer);
		this.setattr(this.outer,[["id",opt.id||"dateselect_input_box"]]);
		this.render_input();
	},
	createdom:function(options){
		var dom = document.createElement(options.tag);
		dom.className = options.classname;
		if(options.msg){
			dom.innerHTML = options.msg;
		}
		return dom;
	},
	setattr:function(dom,attrs){
		for(k in attrs){
			dom.setAttribute([attrs[k][0]],attrs[k][1]);
		}
	},
	render_input:function(){
		this.outer.innerHTML = '<div class="dateselect_input">\
				<p class="dp-btns">\
					<a href="javascript:;" class="dp-btn dp-cal">取消</a>\
					<a href="javascript:;" class="dp-til">选择时间</a>\
					<a href="javascript:;" class="dp-btn dp-sure">确定</a>\
				</p>\
				<div class="dpls"></div>\
			</div>';
		this.dpls = this.outer.getElementsByClassName("dpls")[0];
		this.dp_cal = this.outer.getElementsByClassName("dp-cal")[0];
		this.dp_til = this.outer.getElementsByClassName('dp-til')[0];
		this.dp_sure = this.outer.getElementsByClassName("dp-sure")[0];
		this.dpls.className = "dpls dpls6";
		this.selects = {};
		for(var i=0,len = this.timegroups.length;i<len;i++){
			this.createselect(this.timegroups[i]);
		};
		this.resetselect(this.default);
		this.bindEvent_input_cus();
		this.bindEvent_input_click();
	},
	createselect:function(type){
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
	},
	resetselect:function(time,timegroups){
		var _this = this,
			timegroups_all = this.timegroups,
			unit = this.unit;

		timegroups = timegroups||timegroups_all;
		
		_this.nowtime = _this.inittime(time);

        for(var i=0,len = timegroups_all.length;i<len;i++){
            var type = timegroups_all[i];
			var s = _this.selects[type];
            s.box.style.display = timegroups.indexOf(type)>-1?'block':'none';   
            if(type=='y'){
                s.value = _this.nowtime.getFullYear();
                s.y = (2002 - _this.nowtime.getFullYear())*unit
            }else if(type=='m'){
                s.value = _this.nowtime.getMonth()+1;
                s.y = (2 - _this.nowtime.getMonth())*unit
            }else if(type=='d'){
                s.value = _this.nowtime.getDate();
				s.y = (3 - _this.nowtime.getDate())*unit
				_this.changeym();
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
	},
	inittime:function(time){
    	var i = parseInt(time.getMinutes()/5)*5;
    	var s = parseInt(time.getSeconds()/5)*5;
    	return new Date(time.getFullYear()+'/'+(time.getMonth()+1)+'/'+time.getDate()+' '+time.getHours()+':'+i+':'+s);
	},
	bindEvent_input:function(type,obj){
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
	},
	changeym:function(){
		var valy = this.selects['y'].value,
			valm = this.selects['m'].value,
			sd = this.selects['d'],
			vald = sd.value,
			dul = sd.ul,
			dlis = sd.li,
			unit = this.unit,
			date = new Date(valy+'/'+valm+'/01');

		date.setMonth(date.getMonth() + 1);
		date.setDate(0);
		var dmax = date.getDate();
		for(var i=27;i<31;i++){
			dlis[i].style.opacity = i<dmax?1:0;
		};
		sd.maxy = (dmax-3)*unit;
		
		if(vald>dmax){
			sd.value = dmax;
			sd.y = -sd.maxy;
			dul.style.cssText = "-webkit-transform:translate3d(0,"+(sd.y)+"px,0);transform:translate3d(0,"+(sd.y)+"px,0)";
		};
	},
	hide:function(){
    	this.outer.setAttribute('class','dateselect_input_box');
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
	bindEvent_input_cus:function(){
		var _this = this,
			outer = this.outer,
			timegroups_all = this.timegroups;

		this.dp_cal.addEventListener('click',function(){
			_this.hide();
		},false);
		this.dp_sure.addEventListener('click',function(){
			var obj = _this.obj,
				v = obj.format,
				v_full = 'y/m/d h:i:s';

			for(var i=0,len = timegroups_all.length;i<len;i++){
				var type = timegroups_all[i];
				var sel = _this.selects[type], vv = sel.value<10?'0'+sel.value:sel.value;
				v_full = v_full.replace(timegroups_all[i],vv);
			};
			var time = new Date(v_full.replace(/\-/ig,'/'));
			_this.obj.target.setAttribute('data-time',_this.timeformat(time,'y/m/d h:i:s'));
			if(_this.selected){
				_this.selected({
					target:_this.obj.target,
					time:time,
					timestr:_this.timeformat(time,v)
				})
			}
		},false)
	},
	bindEvent_input_click:function(){
		var _this = this,
			outer = this.outer,
			targets = this.targets,
			len = targets.length;
		
		for(var i=0;i<len;i++){
			(function(){
				var obj = {};
				obj.target = targets[i];
				obj.timegroups = obj.target.getAttribute('data-timegroup');
				obj.format = obj.target.getAttribute('data-format');
				obj.target.addEventListener('click',function(){
					_this.obj = obj;
					var val = obj.target.getAttribute('data-time'),
						timegroups = obj.timegroups;

					_this.dpls.className = "dpls dpls"+timegroups.split('-').length;
					_this.resetselect(val?new Date(val.replace(/\-/ig,'/')):new Date(),obj.timegroups)

					outer.setAttribute('class','dateselect_input_box dateselect_input_box_active');
				})
			})()
		}
	}
}

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



function botmore(num,callback){
    this.num = num;
    this.callback = callback;
    this.bindevent();
    this.stop = true;
    this.body = document.getElementById('J_html');
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
                        bodyh = _this.body.scrollHeight;
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


$(function(){
    $('#J_back').click(function(){
        window.history.go(-1);
    })
})