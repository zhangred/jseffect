/*update  datepicker.JS - 2016-04-1
 * By ShaoHua zhang
 * 577056210@qq.com  (low)
 * freedom front-end engineer */

var datepicker = function(options){
	this.opt = options;
	this.setting();
	this.render();
	this.bindEvent();
}
datepicker.prototype.setting = function(){
	var opt = this.opt;
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
};
datepicker.prototype.render = function(){
	this.outer = this.createdom({"tag":"div","classname":"datepicker"});
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
	var trs = Math.ceil((firstday-1+daynum)/7);
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
datepicker.prototype.bindEvent = function(){
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
	this.tablebox.addEventListener('click',function(event){
		var targ = event.target;
		if(targ.tagName == "A"){
			_this.opt.dateclick && _this.opt.dateclick(targ.getAttribute("data-year"),targ.getAttribute("data-month"),targ.getAttribute("data-date"));
			var is = !_this.hasClass(targ,"active");
			var ac = _this.table.getElementsByClassName('active')[0]
			if(ac) ac.className = ac.className.replace(/\s*active\s*/,' ');
			if(is){
				targ.className = targ.className+' active';
			}
		}
	});
};
datepicker.prototype.hasClass = function(ele,cls) {
    return ele.className.match(new RegExp('(\\s|^)'+cls+'(\\s|$)'));
}
