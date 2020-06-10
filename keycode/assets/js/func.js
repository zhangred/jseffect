function pcslider(options){
	this.opt = options;
	this.setting();
	this.bindhandler();
};
pcslider.prototype = {
	setting:function(){
		var opt = this.opt;
		this.outer = opt.elm;
		this.elms = this.outer.find('.fitem');
		this.datalen = this.elms.length;
		this.autoplay = opt.autoplay?opt.autoplay:false;
		this.spacetime = opt.spacetime?opt.spacetime:3000;
		this.dataeq = 0; // 动画初始数据索引
		this.isLoop = opt.isLoop==undefined?true:opt.isLoop; // 是否循环
		this.direction = opt.direction==undefined?"left":opt.direction;
		this.zindex = 2;
		this.timeer = '';

		this.elms.eq(0).css('z-index',this.zindex);
		var w = parseInt(opt.elm.attr('pro-width')),
			h = parseInt(opt.elm.attr('pro-height'));

		this.outer.css('height',Math.floor(opt.elm.width()*h/w));
		this.unit = this.direction=="left"?opt.elm.width():opt.elm.height();

		var str = '';
		for(var i=0;i<this.datalen;i++){
			str += '<span class="po"></span>';
		};
		this.outer.append('<div class="pos">'+str+'</div>');
		this.poter = this.outer.find('.po');
		this.poter.eq(0).addClass('po_active');
		this.autoplay && this.autoplayfunc();

		var rtime = '',_this = this;
		$(window).resize(function(){
			clearTimeout(rtime);
			rtime = setTimeout(function(){
				_this.outer.css('height',Math.floor(opt.elm.width()*h/w));
				_this.unit = _this.direction=="left"?opt.elm.width():opt.elm.height();
			},100);
		});

	},
	_animatioin:function(dom,unit,offset,time){
		var _this = this,direction = this.direction;
		this.settab(this.dataeq);
		if(this.direction=="left"){
			dom.css({"left":unit*offset,"z-index":this.zindex,"opacity":.3});
			dom.animate({"left":0,"opacity":1},600);
		}else{
			dom.css({"top":unit*offset,"z-index":this.zindex,"opacity":.3});
			dom.animate({"top":0,"opacity":1},300);
		};
	},
	bindhandler:function(){
		var _this = this;
		this.poter.each(function(i,n){
			$(this).click(function(){
				clearInterval(_this.timeer);
				_this.swipeTo(i,600);
				_this.autoplayfunc();
			});
		});
	},
	swipeTo:function(sindex,time,offset){
		this.zindex++;
		var time = (time==undefined)?600:time;
		var dom = this.elms.eq(sindex);
	    if(sindex>this.dataeq){
	    	this.dataeq = sindex;
	    	this._animatioin(dom,this.unit,offset==undefined?1:offset,time);
	    }else if(sindex<this.dataeq){
	    	this.dataeq = sindex;
	    	this._animatioin(dom,this.unit,offset==undefined?-1:offset,time);
	    }
	},
	settab:function(now){
		this.poter.removeClass('po_active').eq(now).addClass('po_active');
	},
	autoplayfunc:function(){
		var _this = this;
		this.timeer = setInterval(function(){
			var fadeeq = _this.dataeq+1;
			fadeeq =  (fadeeq>=_this.datalen)?(_this.isLoop?0:fadeeq):fadeeq;
			_this.swipeTo(fadeeq,600,1)
		},_this.spacetime);
	}
}

function Tabbox(opts){
	var elm = opts.elm;
	var idx = parseInt(elm.attr('data-active')||'0'),
		point = elm.find('.cm-tab-point'),
		cont = elm.find('.cm-tab-cont'),
		event = opts.event||'click',
		isfirst = false,
		that = this;

	
	if(event=='click'){
		point.click(function(){
			that.active($(this))
		})
	}else if(event=='mouseenter'){
		point.on(event,function(){
			that.active($(this))
		})
		
	}
	

	this.active = function(tar){
		var eq = point.index(tar);
		tar.addClass('active').siblings().removeClass('active');
		cont.eq(eq).show().siblings().hide();
		if(isfirst){
			opts.clickback&&opts.clickback({elm:elm,eq:eq})
		}else{
			isfirst = true
		}
	}

	if(elm.attr('data-active')){

	}else{
		this.active(point.eq(0))
	}

	this.init = function(eq){
		this.active(point.eq(eq))
	}

	return this;
}