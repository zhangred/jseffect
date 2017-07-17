/**滚动插件*/
var ZSHscroll = function(options){
    var _this = this;
    this.opt = options;
    this.elm = options.elm;
    this.setting();
    this.axis();
    this.bindEvent();
    this.resize();
}
ZSHscroll.prototype.setting = function(){
    var _this = this,opt = this.opt;;
    this.outer = this.elm;
    var pt = opt.position?opt.position:'relative';
    this.dom = this.outer.children[0];
    this.outer.style.overflow = "hidden";
    this.outer.style.position = pt;
    this.bar = document.createElement("span");
    this.barp = document.createElement("p");
    this.barp.className = "apbar";
    this.barp.appendChild(this.bar);
    this.outer.appendChild(this.barp);
    this._axis =  opt.axis?opt.axis:'X';
    this.fixed = opt.fixed==undefined?false:opt.fixed;
    this.barshow = opt.barshow==undefined?false:opt.barshow;
    this.stylestr = '';
    this.o = this._axis=="X"?"scrollWidth":"scrollHeight";
    this.s = this._axis=="X"?"scrollLeft":"scrollTop";
    this.po = this._axis=="X"?"width":"height";
    if(!this.barshow){
        this.addClass(this.outer,'inhover');
    };
    if(opt.height){
        this.outer.style.height = opt.height+'px';
    };
};
ZSHscroll.prototype.axis = function(){
    var _this = this,outer = this.outer,dom = this.dom;
    var pxi = this._axis =="X"?dom.scrollWidth:dom.scrollHeight;
    this.pxo = this._axis == "X"?(this.opt.width?this.opt.width:dom.clientWidth):(this.opt.height?this.opt.height:dom.clientHeight);
    if(this.pxo>=pxi){
      this.none = true;
      this.removeClass(outer,'in');
    }else{
      this.none = false;
      this.addClass(outer,'in');
    };
    this.addClass(outer,'zshscroll'+this._axis);
    this.stylestr = this.po+':'+this.pxo/pxi*100+'%;';
    this.bar.setAttribute('style',this.stylestr);
};
ZSHscroll.prototype.bindEvent = function(){
    var _this = this;
    var mw = navigator.userAgent.indexOf("Firefox")>=0?"DOMMouseScroll":"mousewheel";
    var dt = navigator.userAgent.indexOf("Firefox")>=0?"detail":"wheelDelta";
    this.outer.addEventListener(mw,function(event){
        _this.anmgo(event,event[dt]);
    });
    this.bar.addEventListener("mousedown",function(){
        console.log('s')
    },false);
    this.bar.addEventListener("mouseup",function(){
        console.log('e')
    },false);
};
ZSHscroll.prototype.anmgo = function(e,num){
    if((e && !this.none) || this.fixed){ 
        e.stopPropagation();
        e.preventDefault();
    };
    var dom = this.dom,
        pxi = dom[this.o],
        part = num>0?-30:30,
        slt = dom[this.s];
    dom[this.s] = slt+part;
    var per = dom[this.s]/pxi*this.pxo;
    this.bar.style.cssText = this.po +':'+(this.pxo/pxi*100)+'%;-webkit-transition:-webkit-transform 300ms; transition:transform 300ms;-webkit-transform:translate'+this._axis+'('+(per)+'px); transform:translate'+this._axis+'('+(per)+'px)';
};

ZSHscroll.prototype.resize = function(){
  var _this = this,timeer;
  $(window).resize(function() {
    clearTimeout(timeer);
    timeer = setTimeout(function(){
      _this.axis();
      _this.anmgo();
    },300);
  });
};
ZSHscroll.prototype.hasClass = function(ele, cls){
  return ele.className.match(new RegExp('(\\s|^)' + cls + '(\\s|$)'));
};
ZSHscroll.prototype.addClass = function(ele, cls){
    if (!this.hasClass(ele, cls)) {
        ele.className += ' ' + cls;
    }
};
ZSHscroll.prototype.removeClass = function(ele, cls){
    if (this.hasClass(ele, cls)) {
        var reg = new RegExp('(\\s|^)' + cls + '(\\s|$)'),
            newClass = ele.className.replace(reg, ' ');
        ele.className = newClass.replace(/^\s+|\s+$/g, '');
    }
};