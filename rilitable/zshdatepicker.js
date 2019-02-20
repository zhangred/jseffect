var datetablepicker = function(options){
	this.opt = options;
    this.setting();
}
datetablepicker.prototype = {
	setting:function(){
		var that = this,
			opt = this.opt;

		this.targets = opt.targets;
		var gt = this.opt.defaultdate?new Date(this.opt.defaultdate.replace(/\-/ig,'/')):new Date();
		this.settime(gt);
		this.prevtext = opt.prevtext?opt.prevtext:"&lt;";
		this.nexttext = opt.nexttext?opt.nexttext:"&gt;";
		this.monthtext = opt.monthtext?opt.monthtext:['一月','二月','三月','四月','五月','六月','七月','八月','九月','十月','十一月','十二月'];
		this.weektext = opt.weektext?opt.weektext:["日","一","二","三","四","五","六"];

		if(!opt.outer){
			this.outer = this.createdom({"tag":"div","classname":"dateselect_table_box"});
			this.outer.innerHTML = '<div class="dateselect_table">\
				<p class="dp-btns">\
					<a href="javascript:;" class="dp-btn dp-cal">取消</a>\
					<a href="javascript:;" class="dp-til">选择时间</a>\
					<a href="javascript:;" class="dp-btn dp-sure">确定</a>\
				</p>\
				<div class="dateselect_cont">\
					<div class="cont-month cont-pop"></div>\
					<div class="cont-year cont-pop">\
						<div class="cont-yl"><p class="cont-ylrm">&lt;</p></div>\
						<div class="cont-yr"><p class="cont-ylrm">&gt;</p></div>\
						<div class="cont-yc"></div>\
						<div class="cont-yx">取消年份选择</div>\
					</div>\
				</div>\
			</div>';

			this.cont = this.outer.getElementsByClassName("dateselect_cont")[0];
			this.dp_cal = this.outer.getElementsByClassName("dp-cal")[0];
			this.dp_til = this.outer.getElementsByClassName('dp-til')[0];
			this.dp_sure = this.outer.getElementsByClassName("dp-sure")[0];
			this.cont_month = this.outer.getElementsByClassName('cont-month')[0];
			this.cont_year = this.outer.getElementsByClassName('cont-year')[0];
			this.cont_year_c = this.outer.getElementsByClassName('cont-yc')[0];
			this.cont_year_l = this.outer.getElementsByClassName('cont-yl')[0];
			this.cont_year_r = this.outer.getElementsByClassName('cont-yr')[0];
			this.cont_year_x = this.outer.getElementsByClassName('cont-yx')[0];

			// setTimeout(function(){
			// 	that.setattr(that.outer,[['class','dateselect_table_box dateselect_table_box_active']]);
			// },300)
			
			document.body.appendChild(this.outer);
		}
		
		this.render_div();
		this.bindEvent_input_click();
		this.bindEvent_input_cus();
	},
	createdom:function(options){
		var dom = document.createElement(options.tag);
		dom.className = options.classname;
		if(options.msg){
			dom.innerHTML = options.msg;
		}
		return dom;
	},
	settime(time){
		this.selectdate = new Date(time.getTime());
		this.nowtime = new Date(time.getTime());
		this.month = this.nowtime.getMonth()+1;
		this.year = this.nowtime.getFullYear();
		this.date = this.nowtime.getDate();
	},
	setattr:function(dom,attrs){
		for(k in attrs){
			dom.setAttribute([attrs[k][0]],attrs[k][1]);
		}
	},
	render_div:function(){ //yes
		var that = this;
		
		//月份内容填充
		var str_m = '';
		for(var i=1;i<=12;i++){
			str_m += '<p class="cont-mls" data-value="'+i+'">'+this.monthtext[i-1]+'</p>';
		};
		this.cont_month.innerHTML = str_m;

		//年份填充
		this.year_copy = this.year;
		this.yearset()

		this.topbar = this.createdom({"tag":"div","classname":"dp-top"});
		this.prev = this.createdom({"tag":"a","classname":"prev","msg":this.prevtext});
		this.next = this.createdom({"tag":"a","classname":"next","msg":this.nexttext});
		this.tils = this.createdom({"tag":"p","classname":"tils","msg":'<span class="tils_m tils-ls">'+this.monthtext[this.nowtime.getMonth()]+'</span><span class="tils_y tils-ls">'+this.nowtime.getFullYear()+'</span>'});
		this.topbar.appendChild(this.prev),this.topbar.appendChild(this.next),this.topbar.appendChild(this.tils);
		this.week = this.createdom({"tag":"ul","classname":"weekline","msg":this.renderweek()});
		this.tablebox = this.createdom({"tag":"div","classname":"dp_tablebox"});
		this.table = this.createdom({"tag":"table","classname":"dp_table","msg":this.renderday()});
		this.setattr(this.table,[["width","100%"],["cellspacing","0"],["cellpadding","0"]])

		this.cont.appendChild(this.topbar);
		this.cont.appendChild(this.week);
		this.tablebox.appendChild(this.table)
		this.cont.appendChild(this.tablebox);
		this.bindEvent_table();
	},
	bindEvent_table:function(){ //yes
		this.text_month = this.outer.getElementsByClassName('tils_m')[0];
		this.text_year = this.outer.getElementsByClassName('tils_y')[0];
		//前一个月
		var _this = this;
		this.prev.addEventListener('click',function(){
			_this.month--;
			if(_this.month<1){
				_this.year--,_this.month = 12;
			}
			_this.text_month.innerHTML = _this.monthtext[_this.month-1];
			_this.text_year.innerHTML = _this.year
			
			_this.table.innerHTML = _this.renderday();
			_this.opt.monthchange && _this.opt.monthchange(_this.month);
		});

		// 往后一个月
		this.next.addEventListener('click',function(){
			_this.month++;
			if(_this.month>12){
				_this.year++,_this.month = 1;
			}
			_this.text_month.innerHTML = _this.monthtext[_this.month-1];
			_this.text_year.innerHTML = _this.year
			
			_this.table.innerHTML = _this.renderday();
			_this.opt.monthchange && _this.opt.monthchange(_this.month);
		});

		// 弹出月份选择
		this.text_month.addEventListener('click',function(e){
			_this.showpop(_this.cont_month);
		})

		//选择月份
		this.cont_month.addEventListener('click',function(e){
			var tar = e.target;
			if(tar.className!='cont-mls') return;
			_this.month = parseInt(tar.getAttribute('data-value'));
			_this.hidepop(_this.cont_month);
			_this.text_month.innerHTML = _this.monthtext[_this.month-1];
			_this.table.innerHTML = _this.renderday();
			_this.opt.monthchange && _this.opt.monthchange(_this.month);
		})

		// 弹出年份选择
		this.text_year.addEventListener('click',function(e){
			_this.year_copy = _this.year;
			_this.yearset()
			_this.showpop(_this.cont_year);
		})

		//上一轮年份
		this.cont_year_l.addEventListener('click',function(){
			_this.year_copy -= 9;
			_this.yearset();
		})
		//下一轮年份
		this.cont_year_r.addEventListener('click',function(){
			_this.year_copy += 9;
			_this.yearset();
		})
		//取消选择
		this.cont_year_x.addEventListener('click',function(){
			_this.hidepop(_this.cont_year);
		})

		//选择年份
		this.cont_year.addEventListener('click',function(e){
			var tar = e.target;
			if(tar.className!='cont-yls') return;
			_this.year = parseInt(tar.getAttribute('data-value'));
			_this.hidepop(_this.cont_year);
			_this.text_year.innerHTML = _this.year;
			_this.table.innerHTML = _this.renderday();
			_this.opt.monthchange && _this.opt.monthchange(_this.month);
		})

		//选择日期
		this.table.addEventListener('click',function(e){
			if(e.target.nodeName!="A") return;
			if(_this.active){
				_this.active.classList.remove('active');
			}
			_this.active = e.target;
			e.target.classList.add('active');
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
	yearset:function(){
		var st = this.year_copy - 4,
			str = '';
		for(var i=st;i<this.year_copy+5;i++){
			str += '<p class="cont-yls" data-value="'+i+'">'+i+'</p>';
		}
		this.cont_year_c.innerHTML = str;
	},
	renderweek:function(){ //yes
		var str = '';
		for(k in this.weektext){
			str += '<li class="week_li">'+this.weektext[k]+'</li>';
		};
		return str;
	},
	renderday:function(){
		var newdate = new Date(this.year+'/'+this.month+'/1');
		var firstday = newdate.getDay();
		var m = newdate.getMonth()+1,y = newdate.getFullYear();
		var cm = this.selectdate.getMonth()+1,cy = this.selectdate.getFullYear(),cd = this.selectdate.getDate();
		var daynum = new Date(y,m,0).getDate();
		var trs = Math.ceil((firstday+daynum)/7);
		var str = '';
		for(var i=0;i<trs;i++){
			var stra = '';
			for(var ii=1;ii<=7;ii++){
				var cdstr = (y==cy&&m==cm&&(i*7+ii-firstday)==cd)?'selected':'';
				if((i*7+ii>firstday) && (i*7+ii<=daynum+firstday)){
					stra += '<td class="td"><a href="javascript:;" data-month="'+m+'" data-year="'+y+'" data-date="'+(i*7+ii-firstday)+'" class="a '+cdstr+'">'+(i*7+ii-firstday)+'</a></td>';
				}else{
					stra += '<td class="td"></td>';
				}
			}
			str += '<tr>'+stra+'</tr>';
		}
		return str;
	},
	resettable(time){
		this.settime(time);
		this.text_month.innerHTML = this.monthtext[this.month-1];
		this.text_year.innerHTML = this.year;
		this.table.innerHTML = this.renderday();
	},
	inittime:function(time){
    	// var i = parseInt(time.getMinutes()/5)*5;
    	// var s = parseInt(time.getSeconds()/5)*5;
    	// return new Date(time.getFullYear()+'/'+(time.getMonth()+1)+'/'+time.getDate()+' '+time.getHours()+':'+i+':'+s);
	},
	hide:function(){
		this.outer.setAttribute('class','dateselect_table_box');
		this.active = null;
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
				v = obj.format;

			if(!_this.active){
				CUES.tip({msg:'请选择日期'});
				return;
			}
			var time = new Date(_this.active.getAttribute('data-year')+'/'+_this.active.getAttribute('data-month')+'/'+_this.active.getAttribute('data-date'));
			_this.obj.target.setAttribute('data-time',_this.timeformat(time,'y/m/d h:i:s'));
			if(_this.opt.selected){
				_this.opt.selected({
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
				obj.format = obj.target.getAttribute('data-format');
				obj.target.addEventListener('click',function(){
					_this.obj = obj;
					var val = obj.target.getAttribute('data-time');
					_this.dp_til.innerHTML = obj.target.getAttribute('data-title')||'选择时间';
					_this.resettable(val?new Date(val.replace(/\-/ig,'/')):new Date())
					outer.setAttribute('class','dateselect_table_box dateselect_table_box_active');
				})
			})()
		}
	}
}