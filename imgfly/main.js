function imgfly(option){
    var elm = option.elm;
    var tag = option.tag;
    var px = option.px?option.px:0;
    var py = option.px?option.py:0;
    var scale = option.scale?option.scale:0.1;
    var time = option.time?option.time:2;
    var opacity = option.opacity?option.opacity:0;
    var img = new Image;
    img.className = 'addflyimg';
    img.src = elm.getAttribute('src');
    var ofs = elm.getBoundingClientRect();
    var topf = tag.getBoundingClientRect();
    img.style.cssText = 'height:'+ofs.height+'px;width:'+ofs.width+'px; left:'+ofs.left+'px; top:'+ofs.top+'px; position:fixed; z-index:99;';
    document.getElementsByTagName("body")[0].appendChild(img);
    setTimeout(function(){
        var nimg = document.getElementsByClassName('addflyimg')[0];
        nimg.style.left = (topf.left+px)+'px';
        nimg.style.top = (topf.top+py)+'px';
        nimg.style.opacity = opacity;
        nimg.style.transform = "scale("+scale+","+scale+")";
        nimg.style.transformOrigin = "0% 0%";
        nimg.style.webkitTransition = 'all '+time+'s';
        setTimeout(function(){
            option.callback && option.callback();
        },time*1000);
    },500)
}