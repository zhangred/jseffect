/**
 * A simple, efficent mobile slider solution
 * @file main.js
 * @author zhangred
 * @email 577056210@qq.com（low）
 *
 * @LICENSE https://github.com/zhangred/jseffect
 */
 
var slider=function(options){
	this.opt = options;
	var opt = this.opt;
	if(opt.data.length<3){
		console.warn("数据必须至少三条");
		return false;
	}
	if(opt.pagefixed){
		document.body.addEventListener('touchmove',function(event){event.preventDefault()},false);
	}
	this.settings();
	this._renderouter();
	this.bindhandler();
	var _this = this;
	window.onresize=function(){
		_this.unit = _this.axis=="X"?opt.elm.clientWidth:opt.elm.clientHeight;
	}
}

slider.prototype.settings = function(){
	var opt = this.opt;
	this.data = opt.data;
	this.datalen = opt.data.length;
	this.isdown = false; // 是否从touchstart事件开始
	this.tabeq = 0; // tab高亮
	this.hold = false; // 是否终止操作
	this.moving = false; // 是否出发滚动
	this.axis = opt.axis?opt.axis:"X"; // 滚动方向
	this.autoplay = opt.autoplay?opt.autoplay:false; // 是否自动滚动
	this.isLoop = opt.isLoop?opt.isLoop:false; // 是否循环
	this.animation = opt.animation?opt.animation:"default"; // 设置动画类型
	this.dataIndex = opt.dataIndex?opt.dataIndex:0; // 动画初始数据索引
	this.poter = opt.poter==undefined?true:opt.poter; // 是否显示指针
	this.dire == null;  // 是否已判断方向
	this.f = {};
	this.l = {};
	this.unit = this.axis=="X"?opt.elm.clientWidth:opt.elm.clientHeight;
	this.classnames = ['slider_li prev','slider_li active','slider_li next'];
}

slider.prototype._renderouter = function(){
    var opt = this.opt;
    opt.elm.innerHTML = '';
    this.outer = document.createElement("ul");
    this.outer.className = 'slider_ul';
    this.elms = [];
    for(var i=0;i<3;i++){
        var li = document.createElement("li");
        li.className = this.classnames[i];
        this.elms.push(li);
        this._renderItem(li,i-1+this.dataIndex);
        this.outer.appendChild(li);
        this._animatioin[this.animation](i,li,this.unit,this.axis,0);
    };
    opt.elm.appendChild(this.outer);
    if(this.poter){
    	this.ptbox = document.createElement('ul');
    	this.ptbox.className = 'pos';
    	this.pts = [];
    	for(var i=0;i<this.datalen;i++){
    		var li = document.createElement('li');
    		li.className = "po";
    		this.pts.push(li);
    		this.ptbox.appendChild(li);
    	}
    	opt.elm.appendChild(this.ptbox);
    	this.settab(this.dataIndex);
    }
};

slider.prototype._renderItem = function(el,di){
    if(di<0 || di>=this.datalen){
    	if(this.isLoop){
        	el.innerHTML = di<0?this.data[this.datalen-1]:this.data[0];
    	}else{
    		el.innerHTML = "";
    	}
    }else{
        el.innerHTML = this.data[di];
    }
};

slider.prototype._animatioin = {
    "default":function(eq,dom,unit,axis,offset){
        dom.style.webkitTransform = 'translateZ(0) translate'+axis+'('+(offset + unit * (eq - 1)) + 'px)';
    }
};

slider.prototype.bindhandler=function(){
	var outer = this.outer;
	outer.addEventListener('touchstart',this);
	outer.addEventListener('touchmove',this);
	outer.addEventListener('touchend',this);
}

slider.prototype.handleEvent=function(event){
	switch (event.type){
		case "touchstart":this.starthandler(event);break;
		case "touchmove":this.movehandler(event);break;
		case "touchend":this.endhadnler(event);break;
	}
}

slider.prototype.starthandler = function(event){
	if(this.hold || this.isdown){return false;}
	this.isdown = true;
	this.f.X = event.targetTouches[0].pageX,this.f.Y = event.targetTouches[0].pageY; // 设置第一坐标点参数
	event.preventDefault();
}
slider.prototype.movehandler = function(event){
	if(!this.isdown || this.hold){return false;}
	this.moving = true;
	var touch = event.targetTouches[0],f = this.f,l = this.l;
	if(!this.pagefixed){
		if(this.dire){
			event.preventDefault();
		}else if(this.dire==null){
			var d = Math.abs(touch.pageX-this.f.X)>=Math.abs(touch.pageY-this.f.Y)?"X":"Y";
			this.dire = (d == this.axis)?true:false;
		}
	};
    l.X = touch.pageX-f.X,l.Y = touch.pageY-f.Y;
    for(var i=0;i<3;i++){
        var item = this.elms[i];
        item.style.webkitTransition = 'all 0s';
        this._animatioin[this.animation](i,item,this.unit,this.axis,l[this.axis]);
    }
}
slider.prototype.endhadnler = function(event){
	if(this.hold || !this.moving){return false;}
	var _this = this,b = this.dataIndex;
    this.hold = true;
    if(Math.abs(this.l[this.axis])>50){
        if(this.l[this.axis]<0){
            this.dataIndex++;
            this.po = 2;
        }else{
            this.dataIndex--;
            this.po = 0;
        }
    }else{
        this.po = 1;
    }
    this.swipeTo(this.dataIndex);
}
slider.prototype.settab=function(now){
	for(var i=0;i<this.datalen;i++){
		this.pts[i].className ='po';
	}
	this.pts[now].className = 'po active';
}

slider.prototype.swipeTo = function(sindex){
    var n = sindex-this.dataIndex;
    this.dataIndex = sindex;
    var elms = this.elms;
    var _this = this;
    if(Math.abs(n)>1){
        this._renderItem(elms[n>0?2:0],sindex);
        this.po = n>0?2:0;
        setTimeout(function(){
            n>0?_this._renderItem(elms[0],_this.dataIndex-1):_this._renderItem(elms[2],_this.dataIndex+1);
        },300);
    }
    if(this.dataIndex<0 || this.dataIndex>=this.datalen){
        this.dataIndex = this.isLoop?(this.dataIndex<0?this.datalen-1:0):(this.dataIndex<0?0:this.datalen-1);
        if(!this.isLoop) this.po = 1;
    }
    if(this.po==2){
        elms.push(elms.shift()),this._renderItem(elms[2],this.dataIndex+1);
    }else if(this.po==0){
        elms.unshift(elms.pop()),this._renderItem(elms[0],this.dataIndex-1);
    }
    this.setclassname();
    this.settab(this.dataIndex);
    for(var i=0;i<3;i++){
        var item = this.elms[i];
        if(this.po==i && this.po!=1){
            item.style.webkitTransition = 'all 0s';
        }else{
            item.style.webkitTransition = 'all .3s';
        }
        
        this._animatioin[this.animation](i,item,this.unit,this.axis,0);
    }
    this.backset();
    this.opt.datachange && this.opt.datachange(this.dataIndex);
};

slider.prototype.setclassname = function(){
    var elms = this.elms,classnames = this.classnames;
    setTimeout(function(){
        for(var i=0;i<3;i++){
            elms[i].className = classnames[i];
        }
    },300);
};
slider.prototype.backset = function(){
	var _this = this;
    this.fos = {"X":0,"Y":0};
    this.los = {"X":0,"Y":0}; //第一坐标(x,y)，最后坐标(x,y)
    this.moving = false;
    this.po = 'm';
    this.dire = null;
    this.isdown = false;
	setTimeout(function(){
		_this.hold = false;
	},310);
};