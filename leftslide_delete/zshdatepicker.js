function leftslide(opt){
	this.opt = opt;
	this.setting();
	return this;
};
leftslide.prototype = {
	setting:function(){
		var opt = this.opt;
		this.elms = opt.elms;
		this.devi = opt.devi || 100;
		this.len = this.elms.length;
		for(var i=0;i<this.len;i++){
			// console.log(this.elms[i],i)
			this.bindevent(this.elms[i],i);
		}
	},
	bindevent:function(elm,eq){
		var fy = 0,
			ly = 0,
			sy = 0,
			isd = -1,
			ft = {},
			devi = this.devi;
		elm.addEventListener('touchstart',function(event){
            elm.style.webkitTransition = "all 0s";
            ft = event.targetTouches[0];
            fy = ft.pageX;
        },false);
        elm.addEventListener('touchmove',function(event){
        	if(isd==0){
        		return false;
        	}else if(isd==1){
	            var touches = event.targetTouches;
	            ly = touches[0].pageX;
	            var cy =  ly-fy;
	            elm.style.webkitTransform = 'translateZ(0) translateX('+(sy+cy)+'px)';
	            event.preventDefault();
        	}else{
        		var touches = event.targetTouches;
        		isd = Math.abs(ft.pageX-touches[0].pageX)>Math.abs(ft.pageY-touches[0].pageY)?1:0;
        	}
        },false)
        elm.addEventListener('touchend',function(event){
            elm.style.webkitTransition = "all .3s";
            if(ly==0){
                fy =  ly = 0;
                isd = -1;
                return false;
            };
            if(ly-fy+sy<-devi){
            	sy = -devi;
            	elm.style.webkitTransform = 'translateZ(0) translateX('+(-devi)+'px)';
            }else{
            	sy = 0;
            	elm.style.webkitTransform = 'translateZ(0) translateX(0)';
            };
            fy =  ly = 0;
            isd = -1;
        },false);
	}
}
