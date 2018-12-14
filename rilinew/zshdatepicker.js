
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