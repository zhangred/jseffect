/**
 * A simple, efficent mobile slider solution
 * @file main.js
 * @author zhangred
 * @email 577056210@qq.com（low）
 *
 * @LICENSE https://github.com/zhangred/jseffect
 */

var touchScroll = function(option){
    var _this = this;
    this.elm = option.elm;
    this.fy = this.ly = this.ofy = 0;

    this.elm.addEventListener('touchstart',function(event){
        var touches = event.targetTouches;
        _this.fy = touches[0].pageY;
    },false);
    this.elm.addEventListener('touchmove',function(event){
        var touches = event.targetTouches;
         _this.ly = touches[0].pageY;
        var cy =  _this.fy -  _this.ly;
        _this.elm.scrollTop =  _this.ofy+cy;
        event.preventDefault();
    },false)
    this.elm.addEventListener('touchend',function(event){
        _this.ofy = _this.elm.scrollTop;
         _this.fy =  _this.ly = 0;
    },false)
}

