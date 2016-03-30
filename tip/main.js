var CUES = {
	tip:function(options){
		var msg = options.msg;
		var type = options.type?options.type:'info';
		var time = options.time?options.time:1000;
		var elma = this.createdom({"tag":"div","classname":"tippop","msg":'<div class="text '+type+'">'+msg+'</div></div>'});
		document.body.appendChild(elma);
		setTimeout(function(){
	        elma.style.opacity = 0;
	        elma.style.webkitTransition = 'all 1s';
	        setTimeout(function(){
	        	options.callback && options.callback();
	        	elma.remove();
	        },1000);
		},time);
	},
	alert:function(options){
		var msg = options.msg;
		var elma = this.createdom({"tag":"div","classname":"tippop_alert"});
		var elmb = this.createdom({"tag":"p","classname":"tippop_alert_t","msg":options.msg});
		var elmc = this.createdom({"tag":"a","classname":"tippop_alert_b","msg":"确定"});
		elma.appendChild(elmb),elma.appendChild(elmc);
		document.body.appendChild(elma);

		var elm_bg = this.createdom({"tag":"div","classname":"tippop_bg"});
		document.body.appendChild(elm_bg);

		elmc.addEventListener('click',function(){
			elm_bg.remove();
			elma.remove();
			options.callback && options.callback();
		},false);
	},
	confirm:function(options){
		var msg = options.msg;
		var elma = this.createdom({"tag":"div","classname":"tippop_alert"});
		var elmb = this.createdom({"tag":"p","classname":"tippop_alert_t","msg":options.msg});
		var elmc = this.createdom({"tag":"p","classname":"tippop_alert_b"});
		var a_cal = this.createdom({"tag":"a","classname":"tippop_confirm_btn","msg":"取消"});
		var a_sure = this.createdom({"tag":"a","classname":"tippop_confirm_btn","msg":"确定"});
		elmc.appendChild(a_cal),elmc.appendChild(a_sure);
		elma.appendChild(elmb),elma.appendChild(elmc);
		document.body.appendChild(elma);
		var elm_bg = this.createdom({"tag":"div","classname":"tippop_bg"});
		document.body.appendChild(elm_bg);
		a_cal.addEventListener('click',function(){
			elm_bg.remove();
			elma.remove();
		},false);
		a_sure.addEventListener('click',function(){
			elm_bg.remove();
			elma.remove();
			options.callback && options.callback();
		},false);
	},
	createdom:function(options){
		var dom = document.createElement(options.tag);
		dom.className = options.classname;
		if(options.msg){
			dom.innerHTML = options.msg;
		}
		return dom;
	}
}

