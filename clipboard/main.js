/*update  datepicker.JS - 2016-04-1
 * By ShaoHua zhang
 * 577056210@qq.com  (low)
 * freedom front-end engineer */

var preload = function(options){
	this.opt = options;
	this.setting();
	this.loadEvent();
    this.setInt();	
}
preload.prototype.setting = function(){
	var opt = this.opt;
	this.data = opt.data;
	this.canvas = opt.canvas;
	this.ctx = this.canvas.getContext('2d');
	this.width = opt.width;
	this.height = opt.height;
	this.complete = opt.complete;
	this.tolarr = [];
	this.loaded = [];
};
preload.prototype.drawcv = function(num){
    var ctx = this.ctx,rd = this.width/2,deg=Math.PI/180,per = Math.ceil(num*3.6);
    ctx.clearRect(0,0,this.width,this.width);
    ctx.beginPath();
    ctx.arc(rd,rd,rd-2,0,2*Math.PI);
    ctx.strokeStyle = "#696969";
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.closePath();
    ctx.beginPath();
    ctx.fillStyle = "#67d15b";
    ctx.moveTo(rd,rd);
    ctx.arc(rd,rd,rd-4,-90*deg,deg*(per-90),0);
    ctx.closePath();
    ctx.fill();
    ctx.beginPath();
    ctx.fillStyle = "#1b1b1b";
    ctx.arc(rd,rd,rd-8,0,2*Math.PI);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = "#a0a0a0";
    ctx.textAlign = "center";
    ctx.font = '14px Arial'; 
    ctx.fillText("loading···", rd, rd);
    ctx.fillText(num+"%", rd, rd+20);
};

preload.prototype.loadEvent = function(){
	var _this = this,opt = this.opt,data = opt.data,len = data.length;
	for(var i=0;i<len;i++){
		_this.loadimg(i,data[i]);
	};
};
preload.prototype.loadimg = function(i,src){
	var _this = this;
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.open("GET",src);
    xmlhttp.addEventListener("progress", function(evt){
    	_this.tolarr[i] = evt.total;
    	_this.loaded[i] = evt.loaded;
    }, false);
    xmlhttp.addEventListener("abort", function(evt){
    	_this.tolarr[i] = 0;
    }, false);
    xmlhttp.addEventListener("error", function(evt){
    	_this.tolarr[i] = 0;
    }, false);
    xmlhttp.addEventListener("timeout", function(evt){
    	_this.tolarr[i] = 0;
    }, false);
    xmlhttp.addEventListener("load", function(evt){
        console.log('donexx')
    }, false);
    xmlhttp.addEventListener("readystatechange", function(evt){
        if(xmlhttp.readyState==4){
            console.log(evt)
        }
    }, false);
    
    
    xmlhttp.send();
};
preload.prototype.setInt = function(){
    var _this = this;
    this.dn = 0;
    this.d = setInterval(function(){
        _this.dn += 2;
        _this.num = Math.ceil((_this.getall(_this.loaded)/_this.getall(_this.tolarr))*100);
        if(_this.dn >= _this.num){
            _this.dn = _this.num;
        };
       _this.drawcv(_this.dn);
       if(_this.dn >= 100){
            clearInterval(_this.d);
            _this.complete();
       };
    },50);
};
preload.prototype.getall = function(arr){
    var len = arr.length,all = 0;
    for(i=0;i<len;i++){
        all += arr[i];
    };
    return all;
};

