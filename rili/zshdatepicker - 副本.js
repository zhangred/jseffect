/*update  datepicker.JS - 2017-03-17
 * By ShaoHua zhang
 * 577056210@qq.com  (low)
 * freedom front-end engineer */

var datepicker = function(options){
	this.opt = options;
	this.setting();
}
datepicker.prototype.setting = function(){
	var opt = this.opt;
	
	if(opt.targettype=="input"){
		var _this = this;
		this.targetlist = opt.targets;
		this.targets =  {};

		this.outer = this.createdom({"tag":"div","classname":"datepicker_input_box"});
		this.timegroups = ["y","m","d","h","i","s"];
		document.body.appendChild(this.outer);
		this.setattr(this.outer,[["id","datepicker_input_box"]]);
		this.render_input();

		for(var i=0,len = this.targetlist.length;i<len;i++){
			(function(){

				var v = _this.targetlist[i],obj = {};
				obj.target = document.getElementById(v.target);
				obj.nowtime = v.defaultdate?new Date(v.defaultdate.replace(/\-/ig,'/')):new Date();
				obj.timegroup = v.timegroup;
				obj.format = v.format;
				obj.timegroup_arr = v.timegroup.split("-");
				_this.bindEvent_input_click(obj);

				_this.timeformat(obj.nowtime,obj.target,obj.format);

			})();
		};
		this.bindEvent_input_cus();
	}else{
		this.target = document.getElementById(opt.target);
		this.nowtime = opt.defaultdate?new Date(opt.defaultdate.replace(/\-/ig,'/')):new Date();
		this.curtime = new Date();
		this.curyear = this.curtime.getFullYear();
		this.curmonth = this.curtime.getMonth()+1;
		this.curdate = this.curtime.getDate();
		this.month = this.nowtime.getMonth()+1;
		this.year = this.nowtime.getFullYear();
		this.prevtext = opt.prevtext?opt.prevtext:"&lt;";
		this.nexttext = opt.nexttext?opt.nexttext:"&gt;";
		this.monthtext = opt.monthtext?opt.monthtext:['一月','二月','三月','四月','五月','六月','七月','八月','九月','十月','十一月','十二月'];
		this.weektext = opt.weektext?opt.weektext:["日","一","二","三","四","五","六"];
		this.render_div();
	}
};
datepicker.prototype.render_div = function(){
	this.outer = this.createdom({"tag":"div","classname":"datepicker_div"});
	this.topbar = this.createdom({"tag":"div","classname":"dp-top"});
	this.prev = this.createdom({"tag":"a","classname":"prev","msg":this.prevtext});
	this.next = this.createdom({"tag":"a","classname":"next","msg":this.nexttext});
	this.tils = this.createdom({"tag":"p","classname":"tils","msg":'<span class="m">'+this.monthtext[this.nowtime.getMonth()]+'</span><span class="year">'+this.nowtime.getFullYear()+'</span>'});
	this.topbar.appendChild(this.prev),this.topbar.appendChild(this.next),this.topbar.appendChild(this.tils);

	this.week = this.createdom({"tag":"ul","classname":"weekline","msg":this.renderweek()});

	this.tablebox = this.createdom({"tag":"div","classname":"dp_tablebox"});
	this.table = this.createdom({"tag":"table","classname":"dp_table","msg":this.renderday()});
	this.setattr(this.table,[["width","100%"],["cellspacing","0"],["cellpadding","0"]])

	this.outer.appendChild(this.topbar);
	this.outer.appendChild(this.week);
	this.tablebox.appendChild(this.table)
	this.outer.appendChild(this.tablebox);
	this.target.appendChild(this.outer);
	this.bindEvent_div();
};
datepicker.prototype.createdom = function(options){
    var dom = document.createElement(options.tag);
    dom.className = options.classname;
    if(options.msg){
        dom.innerHTML = options.msg;
    }
    return dom;
};

datepicker.prototype.renderweek = function(){
	var str = '';
	for(k in this.weektext){
		str += '<li class="week_li">'+this.weektext[k]+'</li>';
	};
	return str;
};
datepicker.prototype.setattr = function(dom,attrs){
    for(k in attrs){
        dom.setAttribute([attrs[k][0]],attrs[k][1]);
    }
};
datepicker.prototype.renderday = function(){
	var newdate = new Date(this.year+'/'+this.month+'/1');
	var firstday = newdate.getDay();
	var m = newdate.getMonth()+1,y = newdate.getFullYear();
	var cm = this.curmonth,cy = this.curyear,cd = this.curdate;
	var daynum = new Date(y,m,0).getDate();
	var trs = Math.ceil((firstday+daynum)/7);
	var str = '';
	for(var i=0;i<trs;i++){
		var stra = '';
		for(var ii=1;ii<=7;ii++){
			var cdstr = y==cy?(m==cm?((i*7+ii-firstday)==cd?'today':''):''):'';
			if((i*7+ii>firstday) && (i*7+ii<=daynum+firstday)){
				stra += '<td class="td"><a href="javascript:;" data-month="'+m+'" data-year="'+y+'" data-date="'+(i*7+ii-firstday)+'" class="a '+cdstr+'">'+(i*7+ii-firstday)+'</a></td>';
			}else{
				stra += '<td class="td"></td>';
			}
		}
		str += '<tr>'+stra+'</tr>';
	}
	return str;
};
datepicker.prototype.bindEvent_div = function(){
	var _this = this;
	this.prev.addEventListener('click',function(){
		_this.month--;
		if(_this.month<1){
			_this.year--,_this.month = 12;
		}
		_this.tils.innerHTML = '<span class="m">'+_this.monthtext[_this.month-1]+'</span><span class="year">'+_this.year+'</span>';
		_this.table.innerHTML = _this.renderday();
		_this.opt.monthchange && _this.opt.monthchange(_this.month);
	});
	this.next.addEventListener('click',function(){
		_this.month++;
		if(_this.month>12){
			_this.year++,_this.month = 1;
		}
		_this.tils.innerHTML = '<span class="m">'+_this.monthtext[_this.month-1]+'</span><span class="year">'+_this.year+'</span>';
		_this.table.innerHTML = _this.renderday();
		_this.opt.monthchange && _this.opt.monthchange(_this.month);
	});
};
datepicker.prototype.render_input = function(){
	this.outer.innerHTML = '<div class="datepicker_input"><div class="dpls"></div><p class="dp-btns"><a href="javascript:;" class="dp-btn dp-cal">取消</a><a href="javascript:;" class="dp-btn dp-sure">确定</a></p></div>';
	this.dpls = this.outer.getElementsByClassName("dpls")[0];
	this.dp_cal = this.outer.getElementsByClassName("dp-cal")[0];
	this.dp_sure = this.outer.getElementsByClassName("dp-sure")[0];
	// this.dpls.className = "dpls dpls"+this.timegroup_arr.length;
	this.selects = {};
	for(var i=0;i<6;i++){
		this.createselect(this.timegroups[i]);
	};

	// var self = this;
	// this.dp_cal.addEventListener('click',function(){
	// 	console.log(self.opt.timegroup)
	// },false)
};
datepicker.prototype.createselect = function(type){
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
datepicker.prototype.bindEvent_input = function(type,obj){
	var _this = this,
		box = obj.box,
		ul = obj.ul;
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
    	obj.y = Math.round(obj.y/24)*24;
    	if(type=='y'){
    		if(obj.y<-648){obj.y = -648;}else if(obj.y>48){obj.y = 48;};
    		obj.value = 2002 - obj.y/24;
    		_this.changeym();
    	}else if(type=='m'){
    		if(obj.y<-216){obj.y = -216;}else if(obj.y>48){obj.y = 48;};
    		obj.value = 3 - obj.y/24;
    		_this.changeym();
    	}else if(type=='d'){
    		if(obj.y<-obj.maxy){obj.y = -obj.maxy;}else if(obj.y>48){obj.y = 48;};
    		obj.value = 3 - obj.y/24;
    	}else if(type=='h'){
    		if(obj.y<-504){obj.y = -504;}else if(obj.y>48){obj.y = 48;};
    		obj.value = 2 - obj.y/24;
    	}else if(type=='i'){
    		if(obj.y<-216){obj.y = -216;}else if(obj.y>48){obj.y = 48;};
    		obj.value = 10 - obj.y*5/24;
    	}else if(type=='s'){
    		if(obj.y<-216){obj.y = -216;}else if(obj.y>48){obj.y = 48;};
    		obj.value = 10 - obj.y*5/24;
    	};
    	ul.style.cssText = "-webkit-transform:translate3d(0,"+(obj.y)+"px,0);transform:translate3d(0,"+(obj.y)+"px,0);-webkit-transition: -webkit-transform 0.4s;transition:transform 0.4s;"
    	obj.ly = 0;
    },false);
};
datepicker.prototype.changeym = function(){
	var dmax = 28,
		valy = this.selects['y'].value,
		valm = this.selects['m'].value,
		sd = this.selects['d'],
		vald = sd.value,
		dul = sd.ul,
		dlis = sd.li;
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
	sd.maxy = dmax*24;
	if(vald>dmax){
		sd.value = dmax;
		sd.y = -sd.maxy;
		dul.style.cssText = "-webkit-transform:translate3d(0,-"+(dmax*24)+"px,0);transform:translate3d(0,-"+(dmax*24)+"px,0)";
	};
};
datepicker.prototype.bindEvent_input_click = function(obj){
	var _this = this,
		outer = this.outer,
		target = obj.target,
		timegroups = _this.timegroups;
	obj.target.addEventListener('click',function(){
		_this.obj = obj;
		_this.dpls.className = "dpls dpls"+obj.timegroup_arr.length;
		_this.nowtime = new Date(target.value.replace(/\-/ig,'/'));
		for(var i=0;i<6;i++){
			var type = timegroups[i];
			if(obj.timegroup.indexOf(type)>=0){
				var s = _this.selects[type];
				s.box.style.display = "block";
		    	if(type=='y'){
		    		s.value = _this.nowtime.getFullYear();
					s.y = (2002 - _this.nowtime.getFullYear())*24
		    	}else if(type=='m'){
		    		s.value = _this.nowtime.getMonth()+1;
					s.y = (2 - _this.nowtime.getMonth())*24
		    	}else if(type=='d'){
		    		s.value = _this.nowtime.getDate();
					s.y = (3 - _this.nowtime.getDate())*24
		    	}else if(type=='h'){
		    		s.value = _this.nowtime.getHours();
					s.y = (2 - _this.nowtime.getHours())*24
		    	}else if(type=='i'){
		    		s.value = _this.nowtime.getMinutes();
					s.y = (2 - _this.nowtime.getMinutes()/5)*24
		    	}else if(type=='s'){
		    		s.value = _this.nowtime.getSeconds();
					s.y = (2 - _this.nowtime.getSeconds()/5)*24
		    	};
		    	s.ul.style.cssText = "-webkit-transform:translate3d(0,"+(s.y)+"px,0);transform:translate3d(0,"+(s.y)+"px,0);"
			}else{
				_this.selects[type].box.style.display = "none";
			};
		};
		outer.style.display = "block";
	},false);
	
};

datepicker.prototype.timeformat = function(time,target,format){
	format = format.replace("y",time.getFullYear());
	format = format.replace("m",(time.getMonth()+1)<10?'0'+(time.getMonth()+1):(time.getMonth()+1));
	format = format.replace("d",time.getDate()<10?'0'+time.getDate():time.getDate());
	format = format.replace("h",time.getHours()<10?'0'+time.getHours():time.getHours());
	format = format.replace("i",time.getMinutes()<10?'0'+time.getMinutes():time.getMinutes());
	format = format.replace("s",time.getSeconds()<10?'0'+time.getSeconds():time.getSeconds());
	target.value = format ;
};
datepicker.prototype.bindEvent_input_cus = function(){
	var _this = this,
		outer = this.outer;
	this.dp_cal.addEventListener('click',function(){
		outer.style.display = "none";
	},false);
	this.dp_sure.addEventListener('click',function(){
		var obj = _this.obj,
			v = obj.format,
			timegroups = _this.timegroups;
		for(var i=0;i<6;i++){
			var type = timegroups[i];
			if(v.indexOf(type)>=0){
				var sel = _this.selects[type], vv = sel.value<10?'0'+sel.value:sel.value;
				v = v.replace(timegroups[i],vv);
			};
		};
		obj.target.value = v;
		outer.style.display = 'none';
	},false)
}