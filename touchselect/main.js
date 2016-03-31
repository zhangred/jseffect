/**
 * A simple, efficent mobile slider solution
 * @file main.js
 * @author zhangred
 * @email 577056210@qq.com（low）
 *
 * @LICENSE https://github.com/zhangred/jseffect
 */

var touchSelect = function(option){
    this.opt = option;
    this.setting();
    this.render();
    this.bindEvent();
}
touchSelect.prototype = {
    setting:function(){
        var opt = this.opt;
        this.data = opt.data;
        this.default_v = opt.default_v?opt.default_v:null;
        this.sizenum = opt.sizenum?opt.sizenum:5;
        this.unit = opt.unit?opt.unit:36;
        this.ruler = "px";
        this.elm = opt.elm;
        this.maxY = (this.data.length-1)*this.unit;
        this.Y = 0;
        this.fy = this.ly = this.ofy = 0;
        this.v = this.data[0];
    },
    render:function(){
        this.elm.style.height = this.sizenum*this.unit+this.ruler;
        this.elm.style.lineHeight =this.unit+this.ruler;
        this.elm.innerHTML = "";

        this.outer = this.createdom({"tag":"ul","classname":"t_select_ul"});
        var per = Math.floor(this.sizenum/2)/this.sizenum*100+"%"
        this.outer.style.top = per;
        this.outer.style.webkitTransition = "all .3s";

        var spa = this.createdom({"tag":"span","classname":"coa"});
        var spb = this.createdom({"tag":"span","classname":"cob"});
        spa.style.height = per,spb.style.height = per;
        this.elm.appendChild(spa),this.elm.appendChild(spb);

        for(k in this.data){
            var v = this.data[k];
            var li = this.createdom({"tag":"li","classname":"t_select_li","msg":v.name});
            if(v.value == this.default_v){
                this.Y = k*this.unit;
                this.v = v;
                this.outer.style.webkitTransform = 'translateZ(0) translateY(-'+(k*this.unit+this.ruler)+')';
            };
            this.outer.appendChild(li);
        }
        this.elm.appendChild(this.outer);
    },
    setstyle:function(dom,styles){
        for(k in styles){
            dom.style[styles[k][0]] = styles[k][1];
        }
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
        var _this = this;
        this.elm.addEventListener('touchstart',function(event){
            _this.outer.style.webkitTransition = "all 0s";
            var touches = event.targetTouches;
            _this.fy = touches[0].pageY;
        },false);
        this.elm.addEventListener('touchmove',function(event){
            var touches = event.targetTouches;
             _this.ly = touches[0].pageY;
            var cy =  _this.fy -  _this.ly;
            _this.outer.style.webkitTransform = 'translateZ(0) translateY(-'+((_this.Y+cy)+_this.ruler)+')';
            event.preventDefault();
        },false)
        this.elm.addEventListener('touchend',function(event){
            _this.outer.style.webkitTransition = "all .3s";
            if(_this.ly==0){
                _this.fy =  _this.ly = 0;
                return false;
            }
            _this.Y = Math.round((_this.Y + _this.fy - _this.ly)/_this.unit)*_this.unit;
            if(_this.Y>=_this.maxY){
                _this.Y = _this.maxY;
            }else if(_this.Y<=0){
                _this.Y = 0;
            };
            _this.outer.style.webkitTransform = 'translateZ(0) translateY(-'+(_this.Y+_this.ruler)+')';
            _this.fy =  _this.ly = 0;
            var v = _this.data[Math.floor(_this.Y/_this.unit)];
            if(v!=_this.v){
                _this.v = v;
                _this.opt.change && _this.opt.change(v); 
            }
        },false)
    },
    init:function(option){
        this.data = option.data?option.data:this.data;
        this.default_v = option.default_v?option.default_v:this.default_v;
        this.maxY = (this.data.length-1)*this.unit;
        this.Y = 0;
        this.v = this.data[0];
        this.render();
    }
}