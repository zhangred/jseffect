var numback = function(options){
	this.opt = options;
	this.setting();
};
numback.prototype = {
	setting:function(){
		var opt = this.opt;
		this.elm = document.getElementById(opt.elm),
		this.nums = this.elm.getElementsByClassName('J_num'),
		this.dire = opt.dire||0;
		this.number = opt.number||0;
		this.length = this.nums.length;
		this.uh = opt.height;
		this.numberarr = [];
		for(var i=0;i<this.length;i++){
			this.numberarr.push(0);
		}
		if(this.dire){
			for(var i=0;i<this.length;i++){
				var dom = this.nums[i];
				dom.style.webkitTransition = 'all 0ms';
				dom.style.webkitTransform = 'translateZ(0) translateY(-'+(this.uh*10)+'px)';
			}
		};
		this.initnumber(this.number);
	},
	initnumber:function(number){
		var len = this.length,dire = this.dire,numberarr = this.numberarr,nums = this.nums,fixstr = '0000000000000',uh = this.uh;
		number = number.toString();
		if(number.length<len){
			number = fixstr.substr(0,len-number.length)+number;
		}else{
			number = number.substr(-len);
		};
		var newnumarr = number.split('');
		newnumarr = newnumarr.map(function(num){
			return parseInt(num);
		});
		if(dire){
			for(var i=0;i<len;i++){
				(function(){
					var cha = 0,goy = 0,dom = nums[i],ini = i,ispass = false;
					if(newnumarr[ini]<=numberarr[ini]){
						cha = numberarr[ini]-newnumarr[ini];
						goy = uh*(newnumarr[ini] + 10);
					}else{
						cha = numberarr[ini] + 10 - newnumarr[ini];
						goy = uh*newnumarr[ini];
						ispass = true;
					};
					dom.style.webkitTransition = 'all '+(cha*300)+'ms';
					setTimeout(function(){
						dom.style.webkitTransform = 'translateZ(0) translateY(-'+(goy)+ 'px)';
					},30);
					numberarr[ini] = newnumarr[ini];
					if(ispass){
						setTimeout(function(){
							dom.style.webkitTransition = 'all 0ms';
							dom.style.webkitTransform = 'translateZ(0) translateY(-'+(uh*(numberarr[ini]+10))+ 'px)';
						},cha*300+300);
					};

				})();
			}
		}else{
			for(var i=0;i<len;i++){
				(function(){
					var cha = 0,goy = 0,dom = nums[i],ini = i,ispass = false;
					if(newnumarr[ini]<numberarr[ini]){
						cha = newnumarr[ini] + 10 -numberarr[ini];
						goy = uh*(newnumarr[ini] + 10);
						ispass = true;
					}else{
						cha = newnumarr[ini] - numberarr[ini];
						goy = uh*newnumarr[ini];
					};
					dom.style.webkitTransition = 'all '+(cha*300)+'ms';
					setTimeout(function(){
						dom.style.webkitTransform = 'translateZ(0) translateY(-'+(goy)+ 'px)';
					},30);
					numberarr[ini] = newnumarr[ini];
					if(ispass){
						setTimeout(function(){
							dom.style.webkitTransition = 'all 0ms';
							dom.style.webkitTransform = 'translateZ(0) translateY(-'+(uh*numberarr[ini])+ 'px)';
						},cha*300+300);
					};

				})();
			}
		}
	}
}