var CUES = {
    throttle:function(fn,wait){
        var timeout,args;
        var later = function(){
            fn(args);
            timeout = null;
        }
        return function(){
            args = arguments.length ? arguments[0] : null
            if(!timeout){
                timeout = setTimeout(later,wait)
            }
        }
    },
    debounce:function(fn,wait,space){
        var timeout,timestamp,lastfunc;
        space = space||200;
        var later = function(){
            var now = new Date().getTime(),
                last = now - timestamp;
            if((last<wait&&last>0)||((lastfunc+space)>=now)){
                timeout = setTimeout(later,wait);
            }else{
                timeout = null;
                lastfunc = now;
                fn()
            }
        }
        return function(){
            timestamp = new Date().getTime();
            lastfunc = timestamp;
            if(!timeout){
                timeout = setTimeout(later,wait)
            }
        }
    },
    getType: function(val) {
        return Object.prototype.toString.call(val).toLowerCase().replace(/\[\w+\s(\w+)\]/, '$1');
    },
    // 检查数据类型
    checkType: function(val, typeList) {
        let type = CUES.getType(val);
        return (type == typeList || typeList.indexOf(type) > -1) ? true : false;
    },
    valueShort: function(value, len) {
        value = value.toString()
        return value.length >= len ? value : new Array(len-value.length+1).join('0') + value;
    },
};
function getUrlParams(){
    var url = window.location.search,
        theRequest = {},
        str = '',
        para = [];
    if (url.indexOf("?") != -1) {
        str = url.substr(1);
        strs = str.split("&");
        for(var i = 0, len = strs.length; i < len; i ++) {
            para = strs[i].split("=");
            theRequest[para[0]] = decodeURIComponent( (para.length>=2)?para[1]:"");
        }
    }
    return theRequest;
};
let bodyScrollTop = {};
window.setBodyScroll = function(state, name) {
    name = name || 'def'
    if (state) {
        bodyScrollTop[name] = document.body.scrollTop
        let body = document.body
        body.style.position = 'fixed'
        body.style.top = -bodyScrollTop[name];
    } else {
        let body = document.body
        body.style.position = 'relative'
        body.style.top = 0;
        body.scrollTop = bodyScrollTop[name]
    }
}


function scrollBottomMore(opts){
    var num = opts.num||200;
    this.callback = opts.callback;
    this.stop = opts.stop||false;

    var _this = this;
    var body = document.body||document.documentElement,
        win_h = body.offsetHeight;

    this.bodyscroll = CUES.throttle(function(){
        var scrolltop=document.documentElement.scrollTop||document.body.scrollTop,
            bodyh = body.scrollHeight;
        if(scrolltop+win_h+num>bodyh&&!_this.stop){
            _this.callback();
        }
    },300)

    window.addEventListener('scroll', _this.bodyscroll,false);

    this.unbindscroll = function(){
        window.removeEventListener('scroll',_this.bodyscroll,false);
    }
};

const eTimeConfig = {
    timeTypes:{
        year: {get: 'getFullYear', set: 'setFullYear',},
        month: {get: 'getMonth', set: 'setMonth'},
        date: {get: 'getDate', set: 'setDate'},
        hours: {get: 'getHours', set: 'setHours'},
        minutes: {get: 'getMinutes', set: 'setMinutes'},
        seconds: {get: 'getSeconds', set: 'setSeconds'},
        milliseconds: {get: 'getMilliseconds', set: 'setMilliseconds'},
        time: {get: 'getTime', set: 'setTime'},
        day: {get: 'getDay', set: ''},
        weekdays:"Sunday_Monday_Tuesday_Wednesday_Thursday_Friday_Saturday".split("_"),
        weekdaysCh:"日_一_二_三_四_五_六".split("_"),
        months:"January_February_March_April_May_June_July_August_September_October_November_December".split("_"),
        monthsCh:"一月_二月_三月_四月_五月_六月_七月_八月_九月_十月_十一月_十二月".split("_")
    },
    timeAction: {
        YYYY: function(time){ return time[eTimeConfig.timeTypes.year.get]()},
        YY: function(time){ return time[eTimeConfig.timeTypes.year.get]().toString().substr(2)},
        M: function(time){ return time[eTimeConfig.timeTypes.month.get]()+1},
        MM: function(time){ return CUES.valueShort(time[eTimeConfig.timeTypes.month.get]()+1,2)},
        MMM: function(time){ return eTimeConfig.timeTypes.months[time[eTimeConfig.timeTypes.month.get]()].substr(0,3)},
        MMMM: function(time){ return eTimeConfig.timeTypes.months[time[eTimeConfig.timeTypes.month.get]()]},
        D: function(time){ return time[eTimeConfig.timeTypes.date.get]()},
        DD: function(time){ return CUES.valueShort(time[eTimeConfig.timeTypes.date.get](),2)},
        H: function(time){ return time[eTimeConfig.timeTypes.hours.get]()},
        HH: function(time){ return CUES.valueShort(time[eTimeConfig.timeTypes.hours.get](),2)},
        h: function(time){ return time[eTimeConfig.timeTypes.hours.get]()%12},
        hh: function(time){ return CUES.valueShort(time[eTimeConfig.timeTypes.hours.get]()%12,2)},
        a: function(time){ return time[eTimeConfig.timeTypes.hours.get]() > 12 ? 'pm' : 'am'},
        A: function(time){ return time[eTimeConfig.timeTypes.hours.get]() > 12 ? 'PM' : 'AM'},
        aC: function(time){ return time[eTimeConfig.timeTypes.hours.get]() > 12 ? '下午' : '上午'},
        m: function(time){ return time[eTimeConfig.timeTypes.minutes.get]()},
        mm: function(time){ return CUES.valueShort(time[eTimeConfig.timeTypes.minutes.get](),2)},
        s: function(time){ return time[eTimeConfig.timeTypes.seconds.get]()},
        ss: function(time){ return CUES.valueShort(time[eTimeConfig.timeTypes.seconds.get](),2)},
        SSS: function(time){ return time[eTimeConfig.timeTypes.milliseconds.get]()},
        w: function(time){ return eTimeConfig.timeTypes.weekdays[time[eTimeConfig.timeTypes.day.get]()].substr(0,3)},
        ww: function(time){ return eTimeConfig.timeTypes.weekdays[time[eTimeConfig.timeTypes.day.get]()]},
        wC: function(time){ return eTimeConfig.timeTypes.weekdaysCh[time[eTimeConfig.timeTypes.day.get]()]},
    },
}
const eTime = function(timestr) {
    // 定义时间赞载体
    this.EUITIME = true;
    this.data = {
        time: null,
        isValid: false
    }
    let type = CUES.getType(timestr)
    if (['string','number'].indexOf(type)>-1) {
        this.data.time = new Date(timestr)
        if (this.data.time.toString()=='Invalid Date') {
            this.data.time = new Date(this.initStr(timestr))
        }
    } else if(type=='date') {
        this.data.time = new Date(timestr.getTime())
    } else {
        this.data.time = new Date()
    }
    this.data.isValid = this.isValid()

    this.fixedInfo()
}

eTime.prototype = {
    initStr: function(str) {
        return CUES.getType(str)=='string' ? str.replace(/-/g,'\/') : str;
    },
    fixedInfo: function(){
        if (!this.data.isValid) {
            this.data.year = this.data.month = this.data.date = this.data.hours = this.data.minutes = this.data.seconds = null;
        } else {
            this.data.year = this.get('year');
            this.data.month = this.get('month');
            this.data.date = this.get('date');
            this.data.hours = this.get('hours');
            this.data.minutes = this.get('minutes');
            this.data.seconds = this.get('seconds');
            this.data.milli = this.get('time');
        }
    },
    shifting: function(type, value) {
        if (!this.data.isValid) return this
        if (/\d+/g.test(value)) {
            value = Math.ceil(parseFloat(value))
            if (eTimeConfig.timeTypes[type]) {
                this.data.time[eTimeConfig.timeTypes[type].set](this.data.time[eTimeConfig.timeTypes[type].get]()+value)
            }
        } else {
            console.error('更新值必须是数字',type, value)
        }
        return this
    },
    set: function(value, type){
        if (!this.data.isValid) return this
        if (type) {
            let time = this.clone();
            time.data.time[eTimeConfig.timeTypes[type].set](value)
            if (this.isValid(time.data.time)) {
                this.data.time[eTimeConfig.timeTypes[type].set](value)
            } else {
                console.error('日期值不正确', type, value)
            }
        } else {
            let time = new eTime(value)
            if (time.data.isValid) {
                this.data.time.setTime(time.data.time.getTime())
            } else {
                console.error('日期值不正确',value)
            }
        }
        this.fixedInfo()
        return this
    },
    get: function(type){
        return !this.data.isValid ? 'Invalid Date' : (type ? this.data.time[eTimeConfig.timeTypes[type].get]() : this.data.time)
    },
    format: function(format){
        if (!this.data.isValid) return 'Invalid Date'
        let that = this;
        let val = format.replace(/\[[^(\[|\])]+\]|Y{1,4}|M{1,4}|D{1,2}|wC|w{1,2}|H{1,2}|h{1,2}|aC|a|A|m{1,2}|s{1,2}|SSS/g, function(a){
            return eTimeConfig.timeAction[a] ? eTimeConfig.timeAction[a](that.data.time) : a
        })
        return val
    },
    toLocal: function(){
        return !this.data.isValid ? 'Invalid Date' : this.data.time.toISOString()
    },
    isBefore:function(value, type) {
        let rs = this.isBeforeSameAfter(value, type)
        return CUES.getType(rs)=='string' ? rs : rs[0] < rs[1];
    },
    isafter:function(value, type){
        let rs = this.isBeforeSameAfter(value, type)
        return CUES.getType(rs)=='string' ? rs : rs[0] > rs[1];
    },
    issame: function(value, type) {
        let rs = this.isBeforeSameAfter(value, type)
        return CUES.getType(rs)=='string' ? rs : rs[0] == rs[1];
    },
    isBeforeSameAfter: function(value, type){
        let err = 'Invalid Date'+ '，type:'+type+'，value:'+value;
        if (!this.data.isValid) return err
        let rs;
        let time = this.isEuiTime(value) ? value : new eTime(this.initStr(value))
        if (type) {
            rs = time.data.isValid ? [this.data.time[eTimeConfig.timeTypes[type].get](),time.data.time[eTimeConfig.timeTypes[type].get]()] : err
        } else {
            rs = time.data.isValid ? [this.data.time.getTime(),time.data.time.getTime()] : err
        }
        return rs
    },
    isbetween: function(valuea,valueb,type){
        if (!this.data.isValid) return 'Invalid Date'
        let timea = this.isEuiTime(valuea) ? valuea : new eTime(this.initStr(valuea))
        let timeb = this.isEuiTime(valueb) ? valueb : new eTime(this.initStr(valueb))
        if (!timea.data.isValid) return 'Invalid Date，第一参数'
        if (!timeb.data.isValid) return 'Invalid Date，第二参数'
        return ((this.isBefore(valuea, type) && this.isafter(valueb, type))||(this.isafter(valuea, type) && this.isBefore(valueb, type))) ? true : false
    },
    isEuiTime: function(value){
        return (value && value.EUITIME) ? true : false
    },
    isValid: function(time){
        return time ? time.toString()!='Invalid Date' : this.data.time.toString()!='Invalid Date'
    },
    clone: function(){
        return !this.data.isValid ? new eTime() : new eTime(this.data.time.getTime())
    },
    getMonthLength: function(val){
        let d = this.clone()
        return d.set(1,'date').set((val!=undefined?val:d.get('month')+1),'month').set(0,'date').get('date')
    }
}

function deepClone(obj) {
    // Handle the 3 simple types, and null or undefined or function
    if (null == obj || "object" != typeof obj) return obj;

    // Handle Date
    if (obj instanceof Date) {
        var copy = new Date();
        copy.setTime(obj.getTime());
        return copy;
    }
    // Handle Array or Object
    if (obj instanceof Array | obj instanceof Object) {
        var copy = (obj instanceof Array)?[]:{};
        for (var attr in obj) {
            if (obj.hasOwnProperty(attr))
                copy[attr] = deepClone(obj[attr]);
        }
        return copy;
    }
    throw new Error("Unable to deepClone obj! Its type isn't supported.");
}

function duplicate(list, key) {
    let rs = [];
    let keys = [];
    for (let i=0; i<list.length; i++) {
        if (keys.indexOf(list[i][key])==-1) {
            keys.push(list[i][key])
            rs.push(list[i])
        }
    }
    return rs;
}


// 获取路径node
function hasPathClassName(event, classList) {
    let path = getEventPath(event);
    let rs = { node: null };
    for (let i = 0; i < path.length; i++) {
      if (rs.node) break;
      if (path[i].nodeName === 'BODY') {
        break;
      } else {
        for (let k = 0; k < classList.length; k++) {
          if (
            path[i] &&
            path[i].classList &&
            path[i].classList.contains(classList[k])
          ) {
            rs.node = path[i];
            rs.class = classList[k];
            break;
          }
        }
      }
    }
    return rs;
  }
  
  // 获取path
function getEventPath(evt) {
    const path = evt.path || (evt.composedPath && evt.composedPath()),
      target = evt.target;
  
    if (path != null && path.length > 0) {
      return path;
    }
  
    if (target === window) {
      return [window];
    }
    function getParents(node, memo) {
      memo = memo || [];
      const parentNode = node.parentNode;
  
      if (!parentNode) {
        return memo;
      } else {
        return getParents(parentNode, memo.concat(parentNode));
      }
    }
    return [target].concat(getParents(target, null), window);
}


function checkClickTarget(node, target) {
    if (node!=target) {
        if (node.parentNode && node.parentNode.nodeName!='BODY') {
            return checkClickTarget(node.parentNode, target)
        } else {
            return false
        }
    } else {
        return true;
    }
}