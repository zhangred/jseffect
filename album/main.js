var swipe=function(options){
  this.opt = options;
	this.elms = options.elm.children;
  if(this.elms.length<3){
	console.warn("数据必须至少三条");
	return false;
  };
  this.setting();
  this._renderouter();
  this.bindhandler();
  var _this = this;
  window.onresize=function(){
	_this.unit = _this.axis=="X"?opt.elm.clientWidth:opt.elm.clientHeight;
  };
};

swipe.prototype = {
	setting : function(){
		var opt = this.opt;
		this.elm = opt.elm;
		this.isdown = false; // 是否从touchstart事件开始
		this.hold = false; // 是否终止操作
		this.moving = false; // 是否出发滚动
		this.datalen = this.elms.length;
		this.axis = opt.axis?opt.axis:"X"; // 滚动方向
		this.dataIndex = opt.dataIndex?opt.dataIndex:0; // 动画初始数据索引
		// this.dire == null;  // 是否已判断方向
		this.f = {};
		this.l = {};
		this.unit = (this.axis=="X")?opt.elm.clientWidth:opt.elm.clientHeight;
		this.autoplay = opt.autoplay==undefined?false:opt.autoplay; // 是否自动滚动
		this.elmarr = [];
		this.callback = opt.callback==undefined?true:opt.callback;
	},
	_renderouter : function(){
		for(var i=0;i<this.datalen;i++){
			this._animatioin(2,this.elms[i],this.unit,this.axis,0);
		};
		this._animatioin(1,this.elms[0],this.unit,this.axis,0);
		this._animatioin(0,this.elms[this.datalen-1],this.unit,this.axis,0);
		this.elm.style.visibility = 'visible';
		if(this.autoplay){
			this.autoplayfuc();
		};
	},
	_animatioin : function(eq,dom,unit,axis,offset,time){
		dom.style.cssText = '-webkit-transition:-webkit-transform '+time+'ms; transition:transform: '+time+'ms;transform:translate'+axis+'('+(offset + unit * (eq - 1)) + 'px) translateZ(0);-webkit-transform:translate'+axis+'('+(offset + unit * (eq - 1)) + 'px) translateZ(0);';
	},
	bindhandler : function(){
		var outer = this.elm;
		outer.addEventListener('touchstart',this);
		outer.addEventListener('touchmove',this);
		outer.addEventListener('touchend',this);
	},
	swipeTo:function(eq){
		for(var i=0;i<3;i++){
			var neq = eq-1+i;
			if(neq<0){
				neq = this.datalen-1;
			}else if(neq>=this.datalen){
				neq = 0;
			};
			var item = this.elms[neq];
			if(this.po==i && this.po!=1){
				// item.style.webkitTransition = 'all 0s';
				this._animatioin(i,item,this.unit,this.axis,0,0);
			}else{
			  // item.style.webkitTransition = 'all .3s';
			  this._animatioin(i,item,this.unit,this.axis,0,300);
			};
		};
		this.backset();
	},
	autoplayfuc : function(){
		if(!this.autoplay){return false;};
		var _this = this;
		this.timer = setInterval(function(){
			_this.dataIndex++;
			if(_this.dataIndex>=_this.datalen){
				_this.dataIndex = 0;
			};
			_this.po = 2;
			_this.swipeTo(_this.dataIndex);
			_this.callback && _this.callback(_this.dataIndex);
		},this.autoplay);
	},
	handleEvent : function(event){
		switch (event.type){
			case "touchstart":this.starthandler(event);break;
			case "touchmove":this.movehandler(event);break;
			case "touchend":this.endhadnler(event);break;
		}
	},
	starthandler : function(event){
		clearInterval(this.timer);
		if(this.hold || this.isdown){return false;};
		this.isdown = true;
		this.f.X = event.targetTouches[0].pageX,this.f.Y = event.targetTouches[0].pageY; // 设置第一坐标点参数
		if(this.dire){event.preventDefault();};
		for(var i=0;i<3;i++){
			var neq = this.dataIndex-1+i;
			if(neq<0){
				neq = this.datalen-1;
			}else if(neq>=this.datalen){
				neq = 0;
			};
			this.elmarr.push(this.elms[neq]);
		};
	},
	movehandler : function(event){
		var touch = event.targetTouches[0],f = this.f,l = this.l;
		if(this.dire==null){
			var d = Math.abs(touch.pageX-this.f.X)>=Math.abs(touch.pageY-this.f.Y)?"X":"Y";
			this.dire = (d == this.axis)?true:false;
		};
		if(this.dire){
			if(!this.isdown || this.hold){return false;};
			this.moving = true;
			event.preventDefault();
			
			l.X = touch.pageX-f.X,l.Y = touch.pageY-f.Y;
			for(var i=0;i<3;i++){
				var item = this.elmarr[i];
				this._animatioin(i,item,this.unit,this.axis,l[this.axis],0);
			};
		};
	},
	endhadnler : function(event){
		this.autoplayfuc();
		if(this.hold || !this.moving){
			this.backset();
			return false;
		};
		if(Math.abs(this.l[this.axis])>50){
			if(this.l[this.axis]<0){
				this.dataIndex++;
				if(this.dataIndex>=this.datalen){
					this.dataIndex = 0;
				};
				this.po = 2;
				this.callback && this.callback(this.dataIndex);
			}else{
				this.dataIndex--;
				if(this.dataIndex<0){
					this.dataIndex = this.datalen-1;
				};
				this.po = 0;
				this.callback && this.callback(this.dataIndex);
			};
		}else{
			this.po = 1;
		};
		this.swipeTo(this.dataIndex);
		this.backset();
	},
	backset : function(){
		var _this = this;
		this.fos = {"X":0,"Y":0};
		this.los = {"X":0,"Y":0}; //第一坐标(x,y)，最后坐标(x,y)
		this.moving = false;
		this.dire = null;
		this.isdown = false;
		this.hold = false;
		this.elmarr = [];
	}

};

console.log(1110)