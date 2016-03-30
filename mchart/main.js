/**
 * A simple, efficent mobile slider solution
 * @file main.js
 * @author zhangred
 * @email 577056210@qq.com（low）
 *
 * @LICENSE https://github.com/zhangred/jseffect
 */
window.chart = function(element,options){
	if (!element) return null;
    var ca = document.getElementById(element);
	this.width = ca.clientWidth;
	this.height = ca.clientHeight;
	ca.setAttribute("width",this.width);
	ca.setAttribute("height",this.height);
	
	this.options = options;
	this.container = ca.getContext('2d');

	this.ch = this.width>=this.height?this.height:this.width;
	switch (options.type){
		case 'pie':
			this.oldv = this.options.dataset.values;
			this.newv = this.oldv.concat(0);
			this.newv.cgv();
			var that = this;
			;(function(){
				that.pie();
			})()
			break;
		case 'doughnut':
			this.oldv = this.options.dataset.values;
			this.newv = this.oldv.concat(0);
			this.newv.cgv();
			var that = this;
			;(function(){
				that.dough();
			})()
			break;
		case 'parea':
			this.oldv = this.options.dataset.values;
			this.newv = this.oldv.concat(0);
			this.newv.cgv();
			var that = this;
			;(function(){
				that.container.translate(that.width/2,that.height/2);
				var sp = (that.ch/2-10)/that.options.dataset.scale.length;
				that.container.save()
				for(var i=0;i<that.options.dataset.scale.length;i++){
					that.container.beginPath();
					that.container.arc(0,0,sp*(i+1),0,Math.PI*2);
					that.container.globalAlpha=0.2;
					that.container.stroke();
				}
				that.container.restore();
				that.parea();
			})()
			break;
		case 'bar':
			var that=this;
			;(function(){
				that.bar();
			})()
			break;
	}
}

chart.prototype={
	pie:function(){
		this.container.translate(this.width/2,this.height/2);
		this.drawpie(this.newv,this.options.dataset.bgcolor);
	},
	dough:function(){
		this.container.translate(this.width/2,this.height/2);
		this.drawpie(this.newv,this.options.dataset.bgcolor);
		this.container.fillStyle="#fff";
		this.container.arc(0,0,this.options.dhw,0,Math.PI*2);
		this.container.fill();
	},
	parea:function(){
		this.drawparea(this.oldv,this.options.dataset.bgcolor);
	},
	drawpie:function(v,c){
		var bge = 0;
		var deg = Math.PI/180;
		for(var i=0;i<v.length;i++){
			this.container.fillStyle=c[i];
			this.container.beginPath();
			this.container.arc(0,0,this.ch/2,bge*deg,(v[i]+bge)*deg);
			this.container.lineTo(0,0);
			this.container.fill();
			this.container.closePath();
			bge+=v[i];
		}
		for(var i=0;i<v.length;i++){
			bge+=v[i];
			this.container.save();
			this.container.rotate(bge*deg);
			this.container.beginPath();
			this.container.moveTo(0,0);
			this.container.lineTo(this.ch/2,0);
			this.container.lineWidth=2;
			this.container.strokeStyle="#fff";
			this.container.stroke();
			this.container.restore();
		}
	},
	drawparea:function(v,c){
		var bge = 0;
		var deg = Math.PI/180;
		var max = this.options.dataset.scale[this.options.dataset.scale.length-1];
		this.container.globalAlpha=0.7;
		for(var i=0;i<v.length;i++){
			this.container.fillStyle=c[i];
			this.container.beginPath();
			this.container.arc(0,0,v[i]/max*(this.ch/2-10),(360/this.options.dataset.values.length)*i*deg,(360/this.options.dataset.values.length)*(i+1)*deg);
			this.container.lineTo(0,0);
			this.container.fill();
			this.container.closePath();
		};
		this.container.globalAlpha=1;
		for(var i=0;i<v.length;i++){
			this.container.save();
			this.container.rotate((360/this.options.dataset.values.length)*i*deg);
			this.container.beginPath();
			this.container.moveTo(0,0);
			this.container.lineTo(v[i]/max*(this.ch/2-10),0);
			this.container.lineWidth=1;
			this.container.strokeStyle="#fff";
			this.container.stroke();
			this.container.restore();
		};
		var sp = (this.ch/2-10)/this.options.dataset.scale.length;
		this.container.shadowBlur=3;
		this.container.shadowColor="#fff";
		this.container.font="12px Arial";
		this.container.fillStyle='#111';
		for(var i=1;i<=this.options.dataset.scale.length;i++){
			this.container.fillText(this.options.dataset.scale[i-1],-10,5-sp*i);
		}
	},
	bar:function(){
		this.xline().yline();
		this.setbar();
	},
	xline:function(){
		var sp = this.options.longsp;
		var lines = (this.height-30)/sp;
		this.options.unit?this.options.unit:this.options.unit='';

		this.container.strokeStyle="rgba(0,0,0,0.1)";
		this.container.textAlign="right";
		this.container.fillStyle="#666";
		for(var i=0;i<lines;i++){
			this.container.beginPath();
			this.container.moveTo(45,this.height-30-i*sp);
			this.container.lineTo(this.width,this.height-30-i*sp);
			if(i!=0){
				this.container.fillText(this.options.degrees*i+this.options.unit,40,this.height-27-i*sp);
			}
			this.container.stroke();
			this.container.closePath();
		}
		return this;
	},
	yline:function(){
		this.xsp = (this.width-50)/(this.options.lebels.length);
		this.container.strokeStyle="rgba(0,0,0,0.1)";
		this.container.textAlign="center";
		this.container.fillStyle="#666";
		for(var i=0;i<=this.options.lebels.length;i++){
			this.container.beginPath();
			this.container.moveTo(45+i*this.xsp,0);
			this.container.lineTo(45+i*this.xsp,this.height-30);
			if(i!=this.options.lebels.length){
				this.container.fillText(this.options.lebels[i],45+(i+0.5)*this.xsp,this.height-10);
			}
			this.container.stroke();
			this.container.closePath();
		}
	},
	setbar:function(){
		this.barw=(this.xsp-15)/this.options.dataset.length-5;
		var sc = this.options.longsp/this.options.degrees;
		this.container.lineWidth=2;
		for(var n=0;n<this.options.dataset.length;n++){
			for(var i=0;i<this.options.lebels.length;i++){
				this.container.fillStyle=this.options.dataset[n].bgcolor;
				this.container.strokeStyle=this.options.dataset[n].bdcolor;
				var bh = this.options.dataset[n].data[i]*sc;
				this.container.strokeRect(45+i*this.xsp+10+n*(this.barw+5),this.height-30-bh,this.barw,bh);
				this.container.fillRect(45+i*this.xsp+10+n*(this.barw+5),this.height-30-bh,this.barw,bh);
			}	
		}
	}
}

Array.prototype.cgv=function(){
	var allv = this.getall();
	for(var i=0;i<this.length;i++){
		this[i]= this[i]/allv*360;
	}
	return this;
}
Array.prototype.getall=function(){
	var al = 0;
	for(var i=0;i<this.length;i++){
		al+=this[i];
	}
	return al;
}
