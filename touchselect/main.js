/**
 * A simple, efficent mobile slider solution
 * @file main.js
 * @author zhangred
 * @email 577056210@qq.com（low）
 *
 * @LICENSE https://github.com/zhangred/jseffect
 */

function dataSelect(option){
    this.opt = option;
    this.setting();
    this.render();
    this.bindEvent();
    return this;
}
dataSelect.prototype = {
    setting:function(){
        var opt = this.opt;
        this.data = opt.data;
        this.fieldshow = opt.fieldshow;
        this.fieldvalue = opt.fieldvalue;
        this.default_v = opt.default_v?opt.default_v:null;
        this.unit = opt.unit?opt.unit:36;
        this.target = opt.target;
        this.title = opt.title?opt.title:'';
        this.maxY = -(this.data.length-3)*this.unit;
        this.Y = 3*this.unit;
        this.fy = this.ly = this.ofy = 0;
        this.v = null;
    },
    render:function(){
        this.outer = this.createdom({"tag":"div","classname":"select_data_box"});
        document.body.appendChild(this.outer);

        this.outer.innerHTML = '<a href="javascript:;" class="closebg"></a><div class="select_data"><p class="sc-btns"><a href="javascript:;" class="sc-btn sc-cal">取消</a><a href="javascript:;" class="sc-btn sc-btna sc-sure">确定</a><span class="sc-title">'+this.title+'</span></p><div class="scls"><div class="sclsbox"></div></div></div>';
        this.sclsbox = this.outer.getElementsByClassName("sclsbox")[0];
        this.sc_cal = this.outer.getElementsByClassName("sc-cal")[0];
        this.sc_sure = this.outer.getElementsByClassName("sc-sure")[0];
        this.closebg = this.outer.getElementsByClassName("closebg")[0];


        this.scul = this.createdom({"tag":"ul","classname":"sc-ul"});
        this.scul.style.webkitTransition = "all .3s";
        this.scul.style.webkitTransform = 'translateZ(0) translateY('+this.Y+'px)';
        this.rendersub();
        this.opt.initselected && this.opt.selected(this.v);
    },
    rendersub:function(){
        this.scul.innerHTML = '';
        var len = this.data.length,fieldshow = this.fieldshow,default_v = this.default_v,unit = this.unit,fieldvalue = this.fieldvalue;
        for(var i=0;i<len;i++){
            var v = this.data[i];
            var li = this.createdom({"tag":"li","classname":"sc-option","msg":v[fieldshow]});
            if(v[fieldvalue] == default_v){
                this.Y = (2-i)*unit;
                this.v = v;
                this.scul.style.webkitTransform = 'translateZ(0) translateY('+((2-i)*unit)+'px)';
            };
            this.scul.appendChild(li);
        }
        this.sclsbox.appendChild(this.scul);
    },
    createdom:function(options){
        var dom = document.createElement(options.tag);
        dom.className = options.classname;
        if(options.msg){
            dom.innerHTML = options.msg;
        }
        return dom;
    },
    bindEvent:function(){
        var _this = this,scul = this.scul,unit = this.unit,outer = this.outer,target = this.target,fieldshow = this.fieldshow;
        this.sclsbox.addEventListener('touchstart',function(event){
            scul.style.webkitTransition = "all 0s";
            var touches = event.targetTouches;
            _this.fy = touches[0].pageY;
        },false);
        this.sclsbox.addEventListener('touchmove',function(event){
            var touches = event.targetTouches;
             _this.ly = touches[0].pageY;
            var cy =  _this.ly-_this.fy;
            scul.style.webkitTransform = 'translateZ(0) translateY('+(_this.Y+cy)+'px)';
            event.preventDefault();
        },false)
        this.sclsbox.addEventListener('touchend',function(event){
            scul.style.webkitTransition = "all .3s";
            if(_this.ly==0){
                _this.fy =  _this.ly = 0;
                return false;
            }
            _this.Y = Math.round((_this.Y + _this.ly - _this.fy)/unit)*unit;
            if(_this.Y<=_this.maxY){
                _this.Y = _this.maxY;
            }else if(_this.Y>=2*unit){
                _this.Y = 2*unit;
            };

            scul.style.webkitTransform = 'translateZ(0) translateY('+(_this.Y)+'px)';
            _this.fy =  _this.ly = 0;

            var v = _this.data[2-Math.floor(_this.Y/unit)];
            if(v!=_this.v){
                _this.v = v;
                _this.opt.change && _this.opt.change(v); 
            }
        },false);

        this.sc_cal.addEventListener('click',function(){
            _this.hide();
        },false);
        this.target.addEventListener('click',function(){
            _this.show();
        },false);
        this.sc_sure.addEventListener('click',function(){
            _this.opt.selected && _this.opt.selected(_this.v)
            _this.hide();
        },false);
        this.closebg.addEventListener('click',function(){
            _this.hide();
        });
    },
    init:function(option){
        this.data = option.data?option.data:this.data;
        this.default_v = option.default_v!=null?option.default_v:null;
        this.maxY = -(this.data.length-3)*this.unit;
        this.Y = 3*this.unit;;
        this.scul.style.webkitTransform = 'translateZ(0) translateY('+(this.Y)+'px)';
        this.v = null;
        this.rendersub();
    },
    hide:function(){
        this.outer.style.display = "none";
        this.outer.setAttribute('class','select_data_box');
    },
    show:function(){
        var _this = this;
        this.outer.style.display = "block";
        setTimeout(function(){
            _this.outer.setAttribute('class','select_data_box select_data_box_active');
        },10);
    },
    empty:function(){
        this.data = [];
        this.v = null;
        this.default_v = null;
        this.scul.innerHTML = '';
    }
};

function dataSelectNt(option){
    this.opt = option;
    this.setting();
    this.render();
    this.bindEvent();
    return this;
}
dataSelectNt.prototype = {
    setting:function(){
        var opt = this.opt;
        this.data = opt.data;
        this.fieldshow = opt.fieldshow;
        this.fieldvalue = opt.fieldvalue;
        this.default_v = opt.default_v?opt.default_v:null;
        this.unit = opt.unit?opt.unit:36;
        this.target = opt.target;
        this.maxY = -(this.data.length-3)*this.unit;
        this.Y = 3*this.unit;
        this.fy = this.ly = this.ofy = 0;
        this.v = null;  
    },
    render:function(){
        this.outer = this.createdom({"tag":"div","classname":"zshsclsbox"});
        this.target.appendChild(this.outer);

        this.scul = this.createdom({"tag":"ul","classname":"sc-ul"});
        this.scul.style.webkitTransition = "all .3s";
        this.scul.style.webkitTransform = 'translateZ(0) translateY('+(this.Y)+'px)';
        this.rendersub();
        this.opt.initchange && this.opt.change && this.opt.change(this.v);
    },
    rendersub:function(){
        this.scul.innerHTML = '';
        var len = this.data.length,fieldshow = this.fieldshow,default_v = this.default_v,unit = this.unit,fieldvalue = this.fieldvalue;
        this.maxY = -(this.data.length-3)*this.unit;
        for(var i=0;i<len;i++){
            var v = this.data[i];
            var li = this.createdom({"tag":"li","classname":"sc-option","msg":v[fieldshow]});
            if(v[fieldvalue] == default_v){
                this.Y = (2-i)*unit;
                this.v = v;
                this.scul.style.webkitTransform = 'translateZ(0) translateY('+((2-i)*unit)+'px)';
            };
            this.scul.appendChild(li);
        }
        this.outer.appendChild(this.scul);
    },
    createdom:function(options){
        var dom = document.createElement(options.tag);
        dom.className = options.classname;
        if(options.msg){
            dom.innerHTML = options.msg;
        }
        return dom;
    },
    bindEvent:function(){
        var _this = this,scul = this.scul,unit = this.unit,outer = this.outer,fieldshow = this.fieldshow;
        outer.addEventListener('touchstart',function(event){
            scul.style.webkitTransition = "all 0s";
            var touches = event.targetTouches;
            _this.fy = touches[0].pageY;
        },false);
        outer.addEventListener('touchmove',function(event){
            var touches = event.targetTouches;
             _this.ly = touches[0].pageY;
            var cy =  _this.ly-_this.fy;
            scul.style.webkitTransform = 'translateZ(0) translateY('+(_this.Y+cy)+'px)';
            event.preventDefault();
        },false)
        outer.addEventListener('touchend',function(event){
            scul.style.webkitTransition = "all .3s";
            if(_this.ly==0){
                _this.fy =  _this.ly = 0;
                return false;
            }
            _this.Y = Math.round((_this.Y + _this.ly - _this.fy)/unit)*unit;
            if(_this.Y<=_this.maxY){
                _this.Y = _this.maxY;
            }else if(_this.Y>=2*unit){
                _this.Y = 2*unit;
            };
            scul.style.webkitTransform = 'translateZ(0) translateY('+(_this.Y)+'px)';
            _this.fy =  _this.ly = 0;

            var v = _this.data[2-Math.floor(_this.Y/unit)];
            if(v!=_this.v){
                _this.v = v;
                _this.opt.change && _this.opt.change(v); 
            }
        },false);
    },
    init:function(option){
        this.data = option.data?option.data:[];
        this.default_v = option.default_v!=null?option.default_v:null;
        // console.log(444,this.default_v)
        this.maxY = (this.data.length-1)*this.unit;
        this.Y = 3*this.unit;
        this.v = null;
        this.scul.style.webkitTransform = 'translateZ(0) translateY('+(this.Y)+'px)';
        this.rendersub();
    },
    empty:function(){
        this.data = [];
        this.v = null;
        this.default_v = null;
        this.scul.innerHTML = '';
    }
};
