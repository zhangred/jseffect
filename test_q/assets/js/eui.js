"use strict";
const Eui = (function () { 
    // 配置相关
    const EuiConfig = {
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
            YYYY: function(time){ return time[EuiConfig.timeTypes.year.get]()},
            YY: function(time){ return time[EuiConfig.timeTypes.year.get]().toString().substr(2)},
            M: function(time){ return time[EuiConfig.timeTypes.month.get]()+1},
            MM: function(time){ return EuiCommon.valueShort(time[EuiConfig.timeTypes.month.get]()+1,2)},
            MMM: function(time){ return EuiConfig.timeTypes.months[time[EuiConfig.timeTypes.month.get]()].substr(0,3)},
            MMMM: function(time){ return EuiConfig.timeTypes.months[time[EuiConfig.timeTypes.month.get]()]},
            D: function(time){ return time[EuiConfig.timeTypes.date.get]()},
            DD: function(time){ return EuiCommon.valueShort(time[EuiConfig.timeTypes.date.get](),2)},
            H: function(time){ return time[EuiConfig.timeTypes.hours.get]()},
            HH: function(time){ return EuiCommon.valueShort(time[EuiConfig.timeTypes.hours.get](),2)},
            h: function(time){ return time[EuiConfig.timeTypes.hours.get]()%12},
            hh: function(time){ return EuiCommon.valueShort(time[EuiConfig.timeTypes.hours.get]()%12,2)},
            a: function(time){ return time[EuiConfig.timeTypes.hours.get]() > 12 ? 'pm' : 'am'},
            A: function(time){ return time[EuiConfig.timeTypes.hours.get]() > 12 ? 'PM' : 'AM'},
            aC: function(time){ return time[EuiConfig.timeTypes.hours.get]() > 12 ? '下午' : '上午'},
            m: function(time){ return time[EuiConfig.timeTypes.minutes.get]()},
            mm: function(time){ return EuiCommon.valueShort(time[EuiConfig.timeTypes.minutes.get](),2)},
            s: function(time){ return time[EuiConfig.timeTypes.seconds.get]()},
            ss: function(time){ return EuiCommon.valueShort(time[EuiConfig.timeTypes.seconds.get](),2)},
            SSS: function(time){ return time[EuiConfig.timeTypes.milliseconds.get]()},
            w: function(time){ return EuiConfig.timeTypes.weekdays[time[EuiConfig.timeTypes.day.get]()].substr(0,3)},
            ww: function(time){ return EuiConfig.timeTypes.weekdays[time[EuiConfig.timeTypes.day.get]()]},
            wC: function(time){ return EuiConfig.timeTypes.weekdaysCh[time[EuiConfig.timeTypes.day.get]()]},
        },
        cloneLiteralType: ['string','number','null','undefined','boolean','function','htmldivelement','htmlcollection']
    }

    // 通用方法
    const EuiCommon = {
        createDom:function(options){
            options.innerHTML = options.innerHTML || ''
            var dom = document.createElement(options.tag);
            dom.className = options.className;
            EuiCommon.setInnerHtml(dom, options.innerHTML)
            for (let k in (options.style||{})) {
                dom.style[k] = options.style[k]
            }
            for (let k in (options.attr||{})) {
                dom.setAttribute(k,options.attr[k])
            }
            return dom;
        },
        // 获取数据类型
        getType: function(val) {
            return Object.prototype.toString.call(val).toLowerCase().replace(/\[\w+\s(\w+)\]/, '$1');
        },
        // 检查数据类型
        checkType: function(val, typeList) {
            let type = EuiCommon.getType(val);
            return (type == typeList || typeList.indexOf(type) > -1) ? true : false;
        },
        // dom元素添加扩展自定义方法
        bindEvent: function(dom, elist) {
            for (let i=0; i<elist.length; i++) {
                dom[elist[i]] = EuiCustomEvent[elist[i]]
            }
        },
        bindTrigger: function(dom,action,cb) {
            if (dom && dom.length==undefined) {
                EuiCommon.bindEvent(dom,['attr'])
                dom.addEventListener(action,function(){cb(dom)})
            }else if (dom && dom.length) {
                for (let i=0;i<dom.length;i++) {
                    EuiCommon.bindEvent(dom[i],['attr'])
                    dom[i].addEventListener(action,function(){cb(dom[i])})
                }
            }
        },
        valueShort: function(value, len) {
            value = value.toString()
            return value.length >= len ? value : new Array(len-value.length+1).join('0') + value;
        },
        setInnerHtml: function(elm, node) {
            let type = EuiCommon.getType(node);
            (type==='string'||type=='number') ? elm.innerHTML = node : elm.appendChild(node)
        },
        createNode: function(text) {
            let tempNode = document.createElement('div');
            tempNode.innerHTML = text;
            return tempNode.firstChild;
        },
        getNodeByClassName(target, className) {
            if (target.classList.contains(className)){
                return target
            } else {
                return target.parentElement ? EuiCommon.getNodeByClassName(target.parentElement, className) : null
            }
        },
        setClass(target,values){
            for (let i=0; i<values.length; i++) {
                target.classList[values[i][0]](values[i][2]===false ? 'e-e':values[i][1])
            }
            return target
        },
        setStyles(target, values, value, disabled) {
            let type = EuiCommon.getType(values);
            if (type=='string') {
                target.style[values] = disabled===false ? '' : value
            } else if(type=='array'){
                for (let i=0; i<values.length; i++) {
                    target.style[values[i][0]] = values[i][2]===false ? '' : values[i][1]
                }
            }
            return target
        },
        append(target, node, ishtml) {
            if (!node) return
            let type = EuiCommon.getType(node);
            if (['string','number'].indexOf(type)>-1) {
                node = EuiCommon.createNode(node)
            }
            if (ishtml) target.innerHTML = ''
            target.appendChild(node)
        },
        stopBodyScroll(conf) {
            let top = window.pageYOffset || document.documentElement.scrollTop;
            if (conf) {
                if (document.body.classList.contains('eui-body-no-scroll')) {
                    conf.can = false;
                    return;
                }
                conf.can = true;
            }
            EuiLocal.setItem('eui-scrolltop', top)
            document.body.classList.add('eui-body-no-scroll');
            document.body.style.top = `-${top}px`;
            window.scrollTo(0, top)
            setTimeout(() => {
                window.scrollTo(0, top)
            }, 100)
        },
        resetBodyScroll (conf) {
            if (conf && conf.can === false) return;
            let top = EuiLocal.getItem('eui-scrolltop')
            document.body.classList.remove('eui-body-no-scroll')
            document.body.style.removeProperty('top');
            window.scrollTo(0, top)
        }
    }
    // 工具类方法
    const RANDOMSTRING = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('');
    const EuiTools = {
        cloneDeep: function(data){
            let type = EuiCommon.getType(data)
            if (EuiConfig.cloneLiteralType.indexOf(type)>-1) {
                return data
            } else if (type=='date') {
                return new Date(data.getTime())
            } else if(type=='array' || type == 'object') {
                let rs = type=='array' ? [] : {}
                for(let k in data) {
                    rs[k] = EuiTools.cloneDeep(data[k])
                }
                return rs
            }
            console.warn("unknow type of this data", data, type)
            throw new Error("Unable to clone obj! Its type isn't supported.");
        },
        getType: function (value) {
            return EuiCommon.getType(value)
        },
        checkType: function (value, list) {
            return EuiCommon.getType(value, list)
        },
        throttle:function(fn,wait,space){
            var timeout,args;
            space = space||200;
            var later = function(){
                fn(args);
                setTimeout(function(){
                    timeout = null
                },space)
            }
            return function(arg){
                args = arg
                if(!timeout){
                    timeout = setTimeout(later,wait)
                }
            }
        },
        debounce:function(fn,wait){
            var timeout,timestamp,args;
            var later = function(){
                var now = new Date().getTime(),
                    last = now - timestamp;
                    timestamp = now;
                if(last<wait&&last>0){
                    timeout = setTimeout(later,wait);
                }else{
                    timeout = null;
                    fn(args)
                }
            }
            return function(event){
                args = event
                timestamp = new Date().getTime();
                if(!timeout){
                    timeout = setTimeout(later,wait)
                }
            }
        },
        uuid: function(p){
            p = p || 5
            return Math.ceil(Math.random()*Math.pow(10,p))
        },
        getRandomKey: function(len){
            const templen = len || 10;
            const keys = [];
            for (let i = 0; i < templen; i += 1) {
                keys.push(RANDOMSTRING[Math.floor(Math.random() * 62)]);
            }
            return keys.join('');
        }
    }

    const EuiLocal = {
        isInit: false,
        data: {},
        setItem: function (key, value, time) {
            EuiLocal.data[key] = {data: value, expire: time ? time : 0}
            localStorage.setItem('EUILOCAL', JSON.stringify(EuiLocal.data))
        },
        getItem: function (key) {
            if (!EuiLocal.isInit) {
                EuiLocal.data = JSON.parse(localStorage.getItem('EUILOCAL') || '{}')
                EuiLocal.isInit = true
            }
            if (!EuiLocal.data[key] && EuiLocal.data[key].expire < new Date().getTime()) {
                return null
            } else {
                return EuiLocal.data[key].data
            }
        },
        removeItem: function (key) {
            delete EuiLocal.data[key]
            localStorage.setItem('EUILOCAL', JSON.stringify(EuiLocal.data))
        }
    }

    // 自定义事件
    const EuiCustomEvent = {
        addClass: function(name){
            this.classList.add(name)
            return this
        },
        removeClass: function(name){
            this.classList.remove(name)
            return this
        },
        hasClass: function(name){
            return this.classList.contains(name)
        },
        show: function(time, isflex) {
            let that = this;
            setTimeout(function(){that.style.display = isflex ? 'flex':'block'},time||0)
            return this
        },
        hide: function(time) {
            let that = this;
            setTimeout(function(){that.style.display = 'none'},time||0)
            return this
        },
        toggle: function(time,isflex) {
            let that = this;
            setTimeout(function(){that.style.display = (that.style.display == 'none' ? (isflex ? 'flex':'block') : 'none')},time||0)
            return this
        },
        css: function(cssObj){
            for(let k in cssObj) {
                this.style[k] = cssObj[k]
            }
            return this
        },
        html: function(node) {
            this.innerHTML = '';
            EuiCommon.setInnerHtml(this, node)
            return this
        },
        attr: function(attr,value) {
            if (value) {
                this.setAttribute(attr,value)
                return this;
            } else {
                return this.getAttribute(attr)
            }
        },
        append: function(node) {
            let type = EuiCommon.getType(node);
            if (['string','number'].indexOf(type)>-1) {
                node = EuiCommon.createNode(node)
            }
            this.appendChild(node)
            // EuiCommon.getType(node)==='string' ? this.innerHTML = ( nodethis.innerHTML+node) : this.appendChild(node)
            return this
        }
    }

    // render
    const EuiRender = {
        _renderPickerIframe: function(options, config) {
            let iframe = {}
            // 初始化dom
            let elmTopline = EuiCommon.createDom({tag:'div', className:'eui-popup-topline eui-flex'})
            let elmTopTitle = EuiCommon.createDom({tag:'div', className:'eui-popup-topline-title ellipsis'})
            let elmTopBtnCancel = EuiCommon.createDom({tag:'div', className:'eui-popup-topline-btn eui-popup-topline-btn-cancel'})
            let elmTopBtnClear = EuiCommon.createDom({tag:'div', className:'eui-popup-topline-btn eui-popup-topline-btn-cancel'})
            let elmTopBtnConfirm = EuiCommon.createDom({tag:'div', className:'eui-popup-topline-btn eui-popup-topline-btn-confirm'})
            elmTopline.appendChild(elmTopBtnCancel)
            elmTopline.appendChild(elmTopTitle)
            elmTopline.appendChild(elmTopBtnConfirm)
            elmTopline.appendChild(elmTopBtnClear)
            iframe.node = EuiCommon.createDom({tag: 'div', className:`${config.className||''} ${options.className||''}`, innerHTML: elmTopline})

            let elmLoading = EuiCommon.createDom({tag: 'div', className: `eui-cover-loading`})
            iframe.node.appendChild(elmLoading)

            // 组件变量
            let showBtn = options.showBtn==undefined ? true : options.showBtn;
            let showClearBtn = options.showClearBtn || false
            let title = options.title==undefined ? '' : options.title;
            let cancelBtnText = options.cancelBtnText || '取消';
            let cancelBtnColor = options.cancelBtnColor || '#222';
            let clearBtnText = options.clearBtnText || '清除';
            let clearBtnColor = options.clearBtnColor || '#222';
            let confirmBtnText = options.confirmBtnText || '确认';
            let confirmBtnColor = options.confirmBtnColor || EuiConfig.primary;

            let locked = false;

            // 绑定自定事件
            EuiCommon.bindEvent(elmTopBtnCancel,['css', 'html'])
            EuiCommon.bindEvent(elmTopBtnConfirm,['css', 'html'])
            EuiCommon.bindEvent(elmTopBtnClear,['css', 'html'])
            EuiCommon.bindEvent(elmTopTitle,['html'])
            EuiCommon.bindEvent(iframe.node,['append','addClass','removeClass'])

            function setTopLine(type){
                // elmTopline.setAttribute('style',!showBtn && !title ? 'display: none;' : 'height: 48px;')
                elmTopline.classList[(!showBtn && !title) ? 'add' : 'remove']('eui-hide')
                if (type=='title' || type=='all') {
                    elmTopTitle.html(title || '')
                }
                if (type=='btn' || type=='all'){
                    elmTopBtnCancel.css({color:cancelBtnColor, display: (showBtn && !showClearBtn) ? 'block' : 'none'}).html(cancelBtnText)
                    elmTopBtnConfirm.css({color:confirmBtnColor, display: showBtn ? 'block' : 'none'}).html(confirmBtnText)
                    elmTopBtnClear.css({color:clearBtnColor, display: (showBtn && showClearBtn) ? 'block' : 'none'}).html(clearBtnText)
                }

            }
            setTopLine('all')

            elmTopBtnCancel.addEventListener('click',function(){
                if (locked) return
                locked = true
                iframe.callback('maskstate', false)
                if (options.onAsyncCancel) {
                    iframe.setLoading(true)
                    iframe.callback('poplocked',true)
                    options.onAsyncCancel((bol)=>{
                        locked = false;
                        iframe.callback('maskstate', true)
                        iframe.callback('poplocked',false)
                        iframe.setLoading(false)
                        if (bol) {
                            iframe.callback('maskstate', false)
                            iframe.callback('pophide')
                        }
                    })
                } else {
                    locked = false
                    options.onCancel && options.onCancel()
                    iframe.callback('pophide')
                }
            })

            elmTopBtnClear.addEventListener('click',function(){
                if (locked) return
                locked = true
                iframe.callback('maskstate', false)
                if (options.onAsyncClear) {
                    iframe.setLoading(true)
                    iframe.callback('poplocked',true)
                    options.onAsyncClear((bol)=>{
                        locked = false;
                        iframe.callback('maskstate', true)
                        iframe.callback('poplocked',false)
                        iframe.setLoading(false)
                        if (bol) {
                            iframe.callback('popclear', bol)
                        }
                    })
                } else {
                    locked = false
                    iframe.callback('popclear', true)
                }
            })

            elmTopBtnConfirm.addEventListener('click',function(){
                if (locked) return
                let value = iframe.callback('getvalue')
                if(!value) return
                locked = true
                iframe.callback('maskstate', false)
                if (options.onAsyncConfirm) {
                    iframe.callback('poplocked',true)
                    iframe.setLoading(true)
                    options.onAsyncConfirm(value,(bol)=>{
                        iframe.callback('maskstate', true)
                        locked = false;
                        iframe.callback('poplocked',false)
                        iframe.setLoading(false)
                        if (bol) {
                            iframe.callback('setvalue', value)
                            iframe.callback('maskstate', false)
                            iframe.callback('pophide')
                        }
                    })
                } else {
                    locked = false;
                    iframe.callback('setvalue', value)
                    options.onConfirm && options.onConfirm(value)
                    iframe.callback('pophide')
                }
            })

            iframe.setLoading = function(state) {
                state ? elmLoading.classList.add('show') : elmLoading.classList.remove('show')
            }
            iframe.resetTitle = function(val) {
                title = val!=undefined ? val : title;
                setTopLine('title')
            }
            iframe.resetButton = function(opt) {
                showBtn = opt.showBtn!=undefined ? opt.showBtn : showBtn;
                showClearBtn = opt.showClearBtn!=undefined ? opt.showClearBtn : showClearBtn;
                cancelBtnText = opt.cancelBtnText!=undefined ? opt.cancelBtnText : cancelBtnText;
                cancelBtnColor = opt.cancelBtnColor!=undefined ? opt.cancelBtnColor : cancelBtnColor;
                confirmBtnText = opt.confirmBtnText!=undefined ? opt.confirmBtnText : confirmBtnText;
                confirmBtnColor = opt.confirmBtnColor!=undefined ? opt.confirmBtnColor : confirmBtnColor;
                clearBtnText = opt.clearBtnText!=undefined ? opt.clearBtnText : clearBtnText;
                clearBtnColor = opt.clearBtnColor!=undefined ? opt.clearBtnColor : clearBtnColor;
                setTopLine('btn')
            }

            iframe.confirm = function(){
                elmTopBtnConfirm.click()
            }

            return iframe;
        },
    }

    // popup组件
    const EuiPopup = function(options) {
        let that = this;
        let container;
        let locked = false;
        if (!options.insetDom) {
            if (!options.containerId) {
                console.warn('未配置容器id，参数->',options)
                return
            }
            container = document.getElementById(options.containerId)
            if (!container) {
                console.warn('页面未有对应的容器id，参数->',options)
                return
            }
        }
        
        let zIndex = options.zIndex!=undefined ? options.zIndex : 9000;
        let elmMask = EuiCommon.createDom({tag: 'div', className: `eui-pack eui-mask`})
        let closeOnMask = options.closeOnMask!=undefined ? !!options.closeOnMask : true;
        const bodyStop = {};

        // 定义容器
        let elmPopup = EuiCommon.createDom({
            tag: 'div',
            style: {zIndex: zIndex},
            className: `eui-pack eui-popup ${options.className || ''} ${options.maskTransparent ? 'eui-popup-transparent' : ''} eui-position-${options.position || 'center'}`
        })
        let elmPopupContent = EuiCommon.createDom({tag:'div', className:`eui-pop-content ${options.className ? (options.className.split(' ')[0])+'-content' : ''}`})
        elmPopup.appendChild(elmMask)
        elmPopup.appendChild(elmPopupContent)
        document.body.appendChild(elmPopup)
        
        EuiCommon.bindEvent(elmPopup,['addClass','removeClass','hasClass','show','hide'])
        EuiCommon.bindEvent(elmPopupContent,['addClass','removeClass','html'])
        // 转移元素
        if (options.insetDom!==undefined) {
            options.insetDom = options.insetDom || options.placeholder || ''
            elmPopupContent.html(options.insetDom)
        } else {
            elmPopupContent.appendChild(container)
        }

        // 事件
        this.show = function(){
            if (locked) return
            EuiCommon.stopBodyScroll(bodyStop)
            options.onOpen && options.onOpen(options.mark)
            elmPopup.show().removeClass('eui-popup-hide').addClass('eui-popup-show')
        } 
        this.hide = function(opts){
            if (locked) return
            if (options.onAsyncClose) {
                this.setLocked(true, true)
                options.onAsyncClose(options.mark, (bol)=>{
                    locked = false;
                    this.setLocked(false, true)
                    bol && this.realHide()
                })
                return
            }
            this.realHide(opts)
        }
        this.realHide = function(opts) {
            EuiCommon.resetBodyScroll(bodyStop)
            opts = opts || {}
            opts.mark = options.mark
            options.onClose && options.onClose(opts)
            elmPopup.hide(400).removeClass('eui-popup-show').addClass('eui-popup-hide')
        }
        this.destory = function(){
            if (locked) return
            this.hide = this.show = this.setLocked = this.setInnerHtml = null
            elmPopup.remove()
        }
        this.setLocked = function(status, covered) {
            covered && (status ? elmPopupContent.addClass('covered') : elmPopupContent.removeClass('covered'))
            locked = status
        }
        this.setInnerHtml = function(node){
            EuiCommon.setInnerHtml(elmPopupContent, node)
        }

        // 是否默认展开
        if (options.show) {
            this.show()
        }
        // 绑定事件
        elmMask.addEventListener('click',function(){closeOnMask && that.hide({type:'mask'})})
        if (options.trigger) {
            EuiCommon.bindTrigger(options.trigger,'click',()=>{that.show && that.show()})
        }
        if (options.triggerClose) {
            EuiCommon.bindTrigger(options.triggerClose,'click',()=>{that.hide && that.hide()})
        }
    }

    // toast组件
    const EuiToast = function(options){
        let that = this;
        let type = options.type || '';
        let mask = options.mask || false;
        let zIndex = options.zIndex!=undefined ? options.zIndex : 9999;
        let className = options.className || '';
        let duration = options.duration || 2000;
        let animateIn = options.animateIn || 'eui-fadeIn';
        let animateOut = options.animateOut || 'eui-fadeOut';
        let backgroundColor = options.color || '';

        const bodyStop = {};

        let elmMask;
        if (mask) {
            elmMask = EuiCommon.createDom({tag: 'div', className: `eui-pack eui-mask`, style: {zIndex: zIndex - 1}})
            document.body.appendChild(elmMask)
            EuiCommon.stopBodyScroll(bodyStop)
        }
        let typeStr = type ? `<div class="eui-toast-type ${type}"></div>` : ''
        let elmToast= EuiCommon.createDom({tag: 'div', className: `eui-pack eui-toast ${animateIn} eui-flex ${className} ${type}`, innerHTML: `<div class="eui-toast-content" style="background:${backgroundColor}">${typeStr}<div class="eui-toast-message">${options.message||''}</div></div>`, style: {zIndex: zIndex}})
        document.body.appendChild(elmToast)
        
        let elmMsg = elmToast.getElementsByClassName('eui-toast-message')[0]
       
        this.hide = function(time){
            time = time || 0
            setTimeout(()=>{
                if (mask) {
                    EuiCommon.resetBodyScroll(bodyStop);
                }
                elmToast.classList.remove(animateIn)
                elmToast.classList.add(animateOut)
            }, time)
            setTimeout(()=>{
                elmMask && elmMask.remove()
                elmToast.remove()
                options.onClose && options.onClose()
                that.distory()
            }, time+310)
        }
        this.setMessage = function(text){
            elmMsg.innerHTML = text
        }
        this.distory =function (){
            this.hide = null
            this.setMessage = null
        }
        // 默认自动关闭
        if (options.duration!==0) {
            this.hide(duration)
        }
    }

    // notify组件
    const EuiNotify = function(options){
        if (EuiCommon.getType(options)=='string') {
            options = {message: options}
        }
        options.duration = options.duration!=undefined ? options.duration : 3000
        options.className = 'eui-notify '+ (options.className||'')
        options.animateIn = 'eui-fadeInDown'
        options.animateOut = 'eui-fadeOutDown'
        return new eui.toast(options)
    }

    // time组件
    const EuiTime = function(timestr) {
        // 定义时间赞载体
        this.EUITIME = true;
        this.data = {
            time: null,
            isValid: false
        }
        let type = EuiCommon.getType(timestr)
        if (['string','number'].indexOf(type)>-1) {
            this.data.time = new Date(this.initStr(timestr))
        } else {
            this.data.time = new Date()
        }
        this.data.isValid = this.isValid()

        this.fixedInfo()
    }

    EuiTime.prototype = {
        initStr: function(str) {
            return EuiCommon.getType(str)=='string' ? str.replace(/-/g,'\/') : str;
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
                if (EuiConfig.timeTypes[type]) {
                    this.data.time[EuiConfig.timeTypes[type].set](this.data.time[EuiConfig.timeTypes[type].get]()+value)
                }
            } else {
                console.warn('更新值必须是数字',type, value)
            }
            return this
        },
        set: function(value, type){
            if (!this.data.isValid) return this
            if (type) {
                let time = this.clone();
                time.data.time[EuiConfig.timeTypes[type].set](value)
                if (this.isValid(time.data.time)) {
                    this.data.time[EuiConfig.timeTypes[type].set](value)
                } else {
                    console.warn('日期值不正确', type, value)
                }
            } else {
                let time = new EuiTime(value)
                if (time.data.isValid) {
                    this.data.time.setTime(time.data.time.getTime())
                } else {
                    console.warn('日期值不正确',value)
                }
            }
            this.fixedInfo()
            return this
        },
        get: function(type){
            return !this.data.isValid ? 'Invalid Date' : (type ? this.data.time[EuiConfig.timeTypes[type].get]() : this.data.time)
        },
        format: function(format){
            if (!this.data.isValid) return 'Invalid Date'
            let that = this;
            let val = format.replace(/\[[^(\[|\])]+\]|Y{1,4}|M{1,4}|D{1,2}|wC|w{1,2}|H{1,2}|h{1,2}|aC|a|A|m{1,2}|s{1,2}|SSS/g, function(a){
                return EuiConfig.timeAction[a] ? EuiConfig.timeAction[a](that.data.time) : a
            })
            return val
        },
        toLocal: function(){
            return !this.data.isValid ? 'Invalid Date' : this.data.time.toISOString()
        },
        isBefore:function(value, type) {
            let rs = this.isBeforeSameAfter(value, type)
            return EuiCommon.getType(rs)=='string' ? rs : rs[0] < rs[1];
        },
        isafter:function(value, type){
            let rs = this.isBeforeSameAfter(value, type)
            return EuiCommon.getType(rs)=='string' ? rs : rs[0] > rs[1];
        },
        issame: function(value, type) {
            let rs = this.isBeforeSameAfter(value, type)
            return EuiCommon.getType(rs)=='string' ? rs : rs[0] == rs[1];
        },
        isBeforeSameAfter: function(value, type){
            let err = 'Invalid Date'+ '，type:'+type+'，value:'+value;
            if (!this.data.isValid) return err
            let rs;
            let time = this.isEuiTime(value) ? value : new EuiTime(this.initStr(value))
            if (type) {
                rs = time.data.isValid ? [this.data.time[EuiConfig.timeTypes[type].get](),time.data.time[EuiConfig.timeTypes[type].get]()] : err
            } else {
                rs = time.data.isValid ? [this.data.time.getTime(),time.data.time.getTime()] : err
            }
            return rs
        },
        isbetween: function(valuea,valueb,type){
            if (!this.data.isValid) return 'Invalid Date'
            let timea = this.isEuiTime(valuea) ? valuea : new EuiTime(this.initStr(valuea))
            let timeb = this.isEuiTime(valueb) ? valueb : new EuiTime(this.initStr(valueb))
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
            return !this.data.isValid ? new EuiTime() : new EuiTime(this.data.time.getTime())
        },
        getMonthLength: function(val){
            let d = this.clone()
            return d.set(1,'date').set((val!=undefined?val:d.get('month')+1),'month').set(0,'date').get('date')
        }
    }

    // actionSheet 组件
    const EuiActionSheet = function(options){
        if (!options.actions || options.actions.length==0) {
            console.warn('必须配置选项',options)
            return
        }
        let locked = false;
        let zIndex = options.zIndex!=undefined ? options.zIndex : EuiConfig.zIndex;

        let elmAction = EuiCommon.createDom({tag: 'div', className: `eui-pack eui-actionSheet-container ${options.className ? options.className+'-container' : ''}`})
        if (options.title) {
            elmAction.appendChild(EuiCommon.createDom({tag: 'div', className: `eui-actionSheet-line eui-actionSheet-title`, innerHTML: options.title}))
        }
        const actions = options.actions;
        for (let i=0; i<actions.length;i++) {
            let item
            if (EuiCommon.getType(actions[i])=='string') {
                item = EuiCommon.createDom({tag: 'div', className: `eui-actionSheet-line eui-actionSheet-item i${i}`, innerHTML: actions[i]})
            } else {
                item = EuiCommon.createDom({
                    tag: 'div',
                    className: `eui-actionSheet-line eui-actionSheet-item ${actions[i].className || ''} ${actions[i].disabled ? 'disabled' : ''}`,
                    innerHTML: `
                        <div>${actions[i].name}</div>
                        ${actions[i].subname ? `<div class="eui-actioinSheet-subname">${actions[i].subname}</div>` : ''}
                    `,
                    style: actions[i].color ? {color: actions[i].color} : {}
                })
            }
            item.setAttribute('data-index',i)
            elmAction.appendChild(item)
        }

        if (options.showCancel) {
            elmAction.appendChild(EuiCommon.createDom({tag: 'div', className: `eui-actionSheet-line eui-actionSheet-cancel`, innerHTML: EuiCommon.getType(options.showCancel)=='string' ? options.showCancel : '取消'}))
        }

        let pop = Eui.popup({
            insetDom: elmAction,
            zIndex: zIndex,
            show: true,
            position: 'bottom',
            className: `eui-actionSheet ${options.showBtnType ? 'eui-actionSheet-btntype' : ''}`,
            closeOnMask: options.closeOnMask || false,
            onClose: function(opts){
                if (opts && opts.type === 'mask') {
                    options.onCancel && options.onCancel()
                }
                setTimeout(()=>{
                    pop.destory()
                },350)
            }
        })

        elmAction.addEventListener('click', function(e){
            if (locked) return
            let target = EuiCommon.getNodeByClassName(e.target,'eui-actionSheet-line')
            if (target.classList.contains('eui-actionSheet-cancel')) {
                options.onCancel && options.onCancel()
                pop.hide()
            } else if (target.classList.contains('eui-actionSheet-item')) {
                let idx = parseInt(target.getAttribute('data-index'))
                if (!target.classList.contains('disabled')) {
                    if (options.onAsyncSelect) {
                        locked = true
                        pop.setLocked(true, true)
                        options.onAsyncSelect({index: idx, data: options.actions[idx]}, (bol)=>{
                            locked = false;
                            pop.setLocked(false, true)
                            bol && pop.hide()
                        })
                    } else if (options.onSelect) {
                        options.onSelect({index: idx, data: options.actions[idx]})
                        pop.hide()
                    }
                }
            }
        })
    }

    // dialog 组件
    const EuiDialog = function (options) {
        options.content = options.content || '暂无内容'
        options.type = options.type!='confirm' ? 'alert' : 'confirm';
        options.btnType = options.btnType!='round' ? '' : 'round';
        let that = this;
        let locked = false;
        let isMaskClose = true;
        let zIndex = options.zIndex!=undefined ? options.zIndex : EuiConfig.zIndex;
        let elmDialog = EuiCommon.createDom({tag: 'div', className: `eui-pack eui-dialog-container ${options.className ? (options.className.split(' ')[0])+'-container' : ''}`})
        let title;
        if (options.title) {
            title = EuiCommon.createDom({tag: 'div', className: `eui-dialog-title`, innerHTML: options.title})
            elmDialog.appendChild(title)
        }

        let content = EuiCommon.createDom({tag: 'div', className: `eui-dialog-conttext`, innerHTML: options.content})
        elmDialog.appendChild(content)

        let elmBtn = EuiCommon.createDom({tag: 'div', className: `eui-dialog-btnrow eui-flex ${options.btnType==='round' ? 'eui-dialog-btnrow-round' : ''}`})

        const bodyStop = {};
        
        let btnCancel;
        if (options.type==='confirm') {
            elmBtn.classList.add('eui-dialog-btnrow-showcancel');
            btnCancel = EuiCommon.createDom({
                tag: 'a',
                className: 'eui-flex eui-dialog-btn eui-dialog-btn-cancel',
                innerHTML: options.cancelBtnText || '取消',
                attr:{'href':'javascript:;'},
                style: options.styleCancel || {}
            })
            elmBtn.appendChild(btnCancel)
        }

        let btnConfirm = EuiCommon.createDom({
            tag: 'a',
            className:'eui-flex eui-dialog-btn eui-dialog-btn-confirm',
            innerHTML: options.confirmBtnText || '确认',
            attr:{'href': (options.href || 'javascript:;')},
            style: options.styleOk || {}
        })

        EuiCommon.stopBodyScroll(bodyStop);

        elmBtn.appendChild(btnConfirm)

        elmDialog.appendChild(elmBtn)

        let popProps = {};
        if (options.onAsyncClose) {
            popProps.onAsyncClose = options.onAsyncClose
        } else {
            popProps.onClose = function(){
                isMaskClose && options.onClose && options.onClose()
                setTimeout(()=>{
                    pop.destory()
                    that.destory()
                },350)
            }
        }

        let pop = Eui.popup({
            insetDom: elmDialog,
            zIndex: zIndex,
            show: true,
            className: `eui-dialog ${options.className||''}`,
            ...popProps,
        })

        this.hide = function(){
            pop.hide()
        }
        this.setMessage = function(text){
            EuiCommon.setInnerHtml(content,text)
        }
        this.setTitle = function(text){
            EuiCommon.setInnerHtml(title,text)
        }
         this.setLocked = function(status) {
            pop.setLocked(status)
            locked = status
        }
        this.destory = function(){
            EuiCommon.resetBodyScroll(bodyStop);
            this.hide = null
            this.setMessage = null
            this.setLocked = null
        }

        btnConfirm.addEventListener('click', function(){
            if (locked ) return
            if (options.href) {
                isMaskClose = false
                pop.hide()
                return;
            }
            if (options.onAsyncConfirm) {
                locked = true
                pop.setLocked(true)
                btnConfirm.classList.add('eui-dialog-btn-loading')
                btnConfirm.innerHTML = options.confirmBtnTextAsync || options.confirmBtnText || '确认'
                options.onAsyncConfirm((bol)=>{
                    btnConfirm.innerHTML = options.confirmBtnText || '确认'
                    locked = false;
                    pop.setLocked(false)
                    isMaskClose = true
                    btnConfirm.classList.remove('eui-dialog-btn-loading')
                    bol && pop.hide()
                })
            } else {
                options.onConfirm && options.onConfirm()
                isMaskClose = false
                pop.hide()
            }
        })
        if (btnCancel) {
            btnCancel.addEventListener('click',function(){
                if (locked) return
                if (options.onAsyncCancel) {
                    locked = true
                    pop.setLocked(true)
                    btnCancel.classList.add('eui-dialog-btn-loading')
                    options.onAsyncCancel((bol)=>{
                        locked = false;
                        pop.setLocked(false)
                        isMaskClose = true
                        btnCancel.classList.remove('eui-dialog-btn-loading')
                        bol && pop.hide()
                    })
                } else {
                    options.onCancel && options.onCancel()
                    isMaskClose = false
                    pop.hide()
                }
            })
        }
    }

    // 组件 selecter
    const EuiSelecter = function(options){
        if (!options.containerId && !options.container) {
            console.warn('请配置容易id或者容器node节点->',options)
            return
        }
        let container;
        if (options.containerId) {
            container = document.getElementById(options.containerId)
            if (!container) {
                console.warn('未配置容器id，参数->',options)
                return
            }
        }
        container = container || options.container;

        // 设置变量
        let that = this;
        let fieldValueName = options.fieldValueName || 'id'
        let fieldLabelName = options.fieldLabelName || 'name'
        let required = options.required!=undefined ? options.required : true;
        this.options = options.options || [];
        let defaultValue = options.defaultValue

        if (defaultValue==undefined && required && this.options.length) {
            defaultValue = this.options[0][fieldValueName]
        }

        function renderOption(list,val) {
            let str = ''
            let idx = -1;
            for (let i=0; i<list.length; i++) {
                str += `<div class="eui-selecter-option">${list[i][fieldLabelName]}</div>`
                if (val === list[i][fieldValueName]) {
                    idx = i;
                }
            }
            return {text: str, index: idx}
        }
        
        let elmSelecter = EuiCommon.createDom({tag: 'div', className: `eui-pack eui-selecter ${options.className || ''}`})
        this.node = elmSelecter;
        container.appendChild(elmSelecter)
        let elmTitle;
        if (options.title) {
            elmTitle = EuiCommon.createDom({tag: 'div', className: `eui-selecter-title`, innerHTML: options.title})
            elmSelecter.appendChild(elmTitle)
        }

        let renderdom = renderOption(that.options, defaultValue);
        let elmLoading = EuiCommon.createDom({tag: 'div', className: `eui-cover-loading`})
        let elmScroller = EuiCommon.createDom({tag: 'div', className: `eui-selecter-scroller`, innerHTML: renderdom.text})
        let elmScrollWarp = EuiCommon.createDom({tag: 'div', className: `eui-selecter-warp`})
        elmScrollWarp.appendChild(elmScroller)
        elmSelecter.appendChild(elmLoading)
        elmSelecter.appendChild(elmScrollWarp)

        let unit = 40;
        let sy = (-1-renderdom.index)*unit;
        let fy = 0;
        let ly = 0;
        let minY = -options.options.length*unit;
        let maxY = required ? -unit : 0;

        this.value = {}
        elmScroller.style.webkitTransform = 'translateZ(0) translateY('+sy+'px)';

        elmScrollWarp.addEventListener('touchstart',function(event){
            elmScroller.style.webkitTransition = "all 0s";
            var touches = event.targetTouches;
            fy = touches[0].pageY;
        },false);
        elmScrollWarp.addEventListener('touchmove',function(event){
            var touches = event.targetTouches;
            ly = touches[0].pageY;
            var cy =  ly - fy;
            elmScroller.style.webkitTransform = 'translateZ(0) translateY('+(sy+cy)+'px)';
            event.preventDefault();
        },false)
        elmScrollWarp.addEventListener('touchend',function(event){
            elmScroller.style.webkitTransition = "all .3s";
            if(ly==0){
                fy = ly = 0;
                return false;
            }
            sy = Math.round((sy + ly - fy)/unit)*unit;
            sy = sy<=minY ? minY : (sy>=maxY ? maxY : sy)

            elmScroller.style.webkitTransform = 'translateZ(0) translateY('+(sy)+'px)';
            fy =  ly = 0;

            let idx = Math.abs(sy/unit) - 1
            if (idx!=that.value.index) {
                that.setValue(idx)
                options.onSelect && options.onSelect(that.value)
            }
        },false);

        this.setValue = function(idx, first){
            this.value.index = idx;
            this.value.value = idx >= 0 ? this.options[idx][fieldValueName] : null
            this.value.data = idx >= 0 ? this.options[idx] : null;
        }
        this.getValue = function () {
            return this.value
        }
        // 绑定初始值
        this.setValue(renderdom.index, true)

        this.setLoading = function(state) {
            state ? elmLoading.classList.add('show') : elmLoading.classList.remove('show')
        }

        this.reset = function(opt) {
            if (opt.options) {
                that.value = {}
                that.options = opt.options;
                minY = -that.options.length*unit;
            }
            defaultValue = opt.defaultValue ==undefined ? that.value.value : opt.defaultValue

            if (defaultValue==undefined && required && that.options.length) {
                defaultValue = that.options[0][fieldValueName]
            }

            if(opt.title!=undefined) {
                if (!elmTitle && opt.title) {
                    elmTitle = EuiCommon.createDom({tag: 'div', className: `eui-selecter-title`, innerHTML: opt.title})
                    elmSelecter.insertBefore(elmTitle, elmScrollWarp)
                }
                if (opt.title) {
                    elmTitle.innerHTML = opt.title
                } else if (elmTitle) {
                    elmTitle.remove()
                    elmTitle = null
                }
            }

            fieldLabelName = opt.fieldLabelName ==undefined ? fieldLabelName : opt.fieldLabelName
            let renderdom = renderOption(that.options, defaultValue);
            elmScroller.innerHTML = renderdom.text
            sy = (-1-renderdom.index)*unit;
            that.setValue(renderdom.index)
            elmScroller.style.webkitTransform = 'translateZ(0) translateY('+sy+'px)';
        }
    }

    // picker
    const EuiPicker = function(options){
        let that =this;
        let optionList = options.options || []
        let showType = (options.containerId && document.getElementById(options.containerId)) ? 'page' : 'popup';
        let zIndex = options.zIndex!=undefined ? options.zIndex : EuiConfig.zIndex;
        let required = options.required!=undefined ? options.required : true;
        let isMaskClose = true;

        let elmPickerIframe,container,elmSelecter,pop;
        let pickerValue = {}
        let pickerValueTemp = {}

        // 初始化组件
        function initPicker(className){
            elmPickerIframe = EuiRender._renderPickerIframe(options,{className: className})
            elmSelecter = new EuiSelecter({
                container: elmPickerIframe.node,
                options: optionList,
                fieldValueName: options.fieldValueName || 'id',
                fieldLabelName: options.fieldLabelName || 'name',
                required: required,
                defaultValue: options.defaultValue,
                onSelect: function(rs){
                    let nrs = eui._cloneDeep(rs)
                    pickerValueTemp = nrs;
                    options.onSelect && options.onSelect(nrs)
                }
            })
            pickerValue = eui._cloneDeep(elmSelecter.value)
            pickerValueTemp = eui._cloneDeep(elmSelecter.value)
        }

        let popProps = {};
        if (options.onAsyncClose) {
            popProps.onAsyncClose = options.onAsyncClose
        } else {
            popProps.onClose = function(){
                isMaskClose && options.onClose && options.onClose()
            }
        }

        function initPopup(){
            initPicker(`eui-picker-container`)
            bindIframeCallback()
            pop = Eui.popup({
                insetDom: elmPickerIframe.node,
                zIndex: zIndex,
                className: `eui-picker ${options.className||''}`,
                position: 'bottom',
                ...popProps
            })
        }

        function bindIframeCallback(){
            elmPickerIframe.callback = function(type, params){
                if (type=='maskstate') {
                    isMaskClose = params
                }else if (type=='pophide') {
                    pop && pop.hide()
                } else if (type=='poplocked') {
                    pop && pop.setLocked(params)
                } else if (type=='getvalue') {
                    return eui._cloneDeep(pickerValueTemp)
                } else if (type=='setvalue') {
                    pickerValue = eui._cloneDeep(pickerValueTemp)
                } else if (type == 'popclear') {
                    elmSelecter.reset({defaultValue: ''})
                    pickerValueTemp = eui._cloneDeep(elmSelecter.value)
                }
            }
        }

        if (showType=='page') {
            container = document.getElementById(options.containerId)
            initPicker(`eui-pack eui-picker`)
            bindIframeCallback()
            container.appendChild(elmPickerIframe.node)
        } else {
            if (options.trigger) {
                EuiCommon.bindTrigger(options.trigger,'click',()=>{that.show && that.show()})
            }
        }
        
        this.setLoading = function(state) {
            if (!pop && showType=='popup') {initPopup();}
            elmPickerIframe.setLoading(state)
        }
        this.resetTitle = function(val) {
            if (!pop && showType=='popup') {initPopup();}
            elmPickerIframe.resetTitle(val)
        }
        this.resetButton = function(opt) {
            if (!pop && showType=='popup') {initPopup();}
            elmPickerIframe.resetButton(opt)
        }
        this.resetPicker = function(opt){
            if (!pop && showType=='popup') {initPopup();}
            elmSelecter.reset(opt)
            pickerValueTemp = eui._cloneDeep(elmSelecter.value)
            let nval = eui._cloneDeep(elmSelecter.value)
            pickerValue = nval
            pickerValueTemp = nval
        }
        this.getValue = function(){
            if (!pop && showType=='popup') {initPopup();}
            return options.beforeGetValue ? options.beforeGetValue(eui._cloneDeep(pickerValue)) : eui._cloneDeep(pickerValue)
        }

        this.show = function(){
            if (!pop && showType=='popup') {initPopup();}
            options.onOpen && options.onOpen()
            if (pickerValue.value !== pickerValueTemp.value) {
                elmSelecter.reset({defaultValue: pickerValue.value})
                pickerValueTemp = eui._cloneDeep(pickerValue)
            }
            pop.show()
            isMaskClose = true
        }
        
        this.destory = function(){
            pop.destory()
            this.setLoading = this.resetTitle = this.resetButton = this.resetPicker = this.getValue = this.show = null
        }
    }

    const EuiCascader = function(options) {
        options = eui._cloneDeep(options)
        if (!options.columnsList || options.columnsList.length==0) {
            console.warn('未设置联级数据，参数->',options)
            return
        }
        let that =this;
        let showType = (options.containerId && document.getElementById(options.containerId)) ? 'page' : 'popup';
        let zIndex = options.zIndex!=undefined ? options.zIndex : EuiConfig.zIndex;
        let isMaskClose = true;

        let elmPickerIframe,container,pop,elmCascaderVessel;
        let pickerValue = {}
        let pickerValueTemp = {}
        let elmSelecter = {}
        let tempOptionList = {}
        let currentOptionList = {}

        // 渲染组件
        function initCascader(className){
            elmPickerIframe = EuiRender._renderPickerIframe(options,{className: className})
            elmCascaderVessel = EuiCommon.createDom({tag: 'div', className: `eui-cascader-vessel eui-flex`})
            elmPickerIframe.node.appendChild(elmCascaderVessel)
            renderColumns()
        }

        function renderColumns(){
            for (let i=0; i<options.columnsList.length;i++){
                let column = options.columnsList[i]
                let required = column.required!=undefined ? column.required : true;
                let key = column.key;
                tempOptionList[key] = column.options
                currentOptionList[key] = column.options
                elmSelecter[key] = {}
                elmSelecter[key].key = key;
                elmSelecter[key].required = required;
                elmSelecter[key].elmSelecter = new EuiSelecter({
                    className: 'eui-cascader-item',
                    container: elmCascaderVessel,
                    options: column.options,
                    title: column.title||'',
                    fieldValueName: column.fieldValueName || options.fieldValueName || 'id',
                    fieldLabelName: column.fieldLabelName || options.fieldLabelName || 'name',
                    defaultValue: column.defaultValue||'',
                    required: required,
                    onSelect: function(rs){
                        let nrs = eui._cloneDeep(rs)
                        onCascaderSelect(key,nrs)
                        column.onSelect && column.onSelect(nrs)
                    }
                })
                onCascaderSelect(key,elmSelecter[key].elmSelecter.value)
            }
            pickerValue = eui._cloneDeep(pickerValueTemp)
        }

        function bindIframeCallback(){
            elmPickerIframe.callback = function(type, params){
                if (type=='maskstate') {
                    isMaskClose = params
                }else if (type=='pophide') {
                    pop && pop.hide()
                } else if (type=='poplocked') {
                    pop && pop.setLocked(params)
                } else if (type=='getvalue') {
                    // if (!checkRequired()){
                    //     eui.toast({type: 'fail', message: '请选择完整',})
                    //     return null
                    // }
                    return that.getValue()
                } else if (type=='setvalue') {
                    tempOptionList = eui._cloneDeep(currentOptionList)
                    pickerValue = eui._cloneDeep(pickerValueTemp)
                } else if (type == 'popclear') {
                    if (options.onClear) {
                        options.onClear()
                    } else {
                        for (let k in elmSelecter) {
                            elmSelecter[k].elmSelecter.reset({defaultValue: ''})
                            onCascaderSelect(k,elmSelecter[k].elmSelecter.value)
                        }
                    }
                }
            }
        }

        // 初始化组件
        if (showType=='page') {
            container = document.getElementById(options.containerId)
            initCascader(`eui-pack eui-cascader ${options.className||''}`)
            bindIframeCallback()
            container.appendChild(elmPickerIframe.node)
        } else {
            if (options.trigger) {
                EuiCommon.bindTrigger(options.trigger,'click',()=>{that.show()})
            }
        }

        function initPopup(){
            initCascader('eui-cascader-container')
            bindIframeCallback()
            pop = Eui.popup({
                insetDom: elmPickerIframe.node,
                zIndex: zIndex,
                className: `eui-cascader ${options.className||''}`,
                position: 'bottom',
                onClose: function(){
                    isMaskClose && options.onClose && options.onClose()
                }
            })
        }

        function onCascaderSelect(key, value){
            pickerValueTemp[key] = eui._cloneDeep(value);
        }

        this.setLoading = function(state) {
            if (!pop && showType=='popup') {initPopup();}
            elmPickerIframe.setLoading(state)
        }
        this.resetTitle = function(val) {
            if (!pop && showType=='popup') {initPopup();}
            elmPickerIframe.resetTitle(val)
        }
        this.resetButton = function(opt) {
            if (!pop && showType=='popup') {initPopup();}
            elmPickerIframe.resetButton(opt)
        }
        this.getValue =  options.getValue || function(){
            if (!pop && showType=='popup') {initPopup();}
            return options.beforeGetValue ? options.beforeGetValue(eui._cloneDeep(pickerValueTemp)) : eui._cloneDeep(pickerValueTemp)
        }

        this.toggleColumn = function(key, status){
            if (!pop && showType=='popup') {initPopup();}
            elmSelecter[key].elmSelecter.node.style.display = status ? 'block':'none'
        }

        this.resetColumn = function(key, opt) {
            if (elmSelecter[key]) {
                let rs = {}
                if (opt.options) rs.options = opt.options
                if (opt.defaultValue!=undefined) rs.defaultValue = opt.defaultValue
                if (opt.options) {
                    currentOptionList[key] = eui._cloneDeep(opt.options)
                }
                elmSelecter[key].elmSelecter.reset(rs)
                onCascaderSelect(key,elmSelecter[key].elmSelecter.value)
            } else {
                console.warn('重置key值有误，参数->',key, opt)
            }
        }
        this.show = function(){
            if (!pop && showType=='popup') {initPopup();}
            options.onOpen && options.onOpen()
            for (let k in pickerValue) {
                if (pickerValue[k].value !== pickerValueTemp[k].value) {
                    elmSelecter[k].elmSelecter.reset({defaultValue: pickerValue[k].value, options: tempOptionList[k]})
                }
            }
            pickerValueTemp = eui._cloneDeep(pickerValue)
            pop && pop.show()
            isMaskClose = true
        }
    }

    const EuiDatetimePicker = function(options){
        options = eui._cloneDeep(options)
        let columnsList = [];
        let spaceHours = options.spaceHours || 1; // 小时间隔
        let spaceMinutes = options.spaceMinutes || 1; // 分钟间隔
        let spaceSeconds = options.spaceSeconds || 1; // 秒间隔
        let columns = options.columns || ['year','month','date'];
        let format = options.format || 'YYYY-MM-DD';
        let defaultTime = options.defaultTime || null;
        let yearStart = options.yearStart || 2000
        let yearEnd = options.yearEnd || 2040  
        let lang = options.lang || 'ch'

        let monthMaxLength = 0;
        let pickerValue = null
        let pickerValueTemp = null

        let curtime = defaultTime ? eui.time(defaultTime) : eui.time()
        if (!curtime.data.isValid) {
            console.warn('默认日期格式有误，参数->',options)
            curtime = eui.time()
        } else {
            pickerValue = curtime.clone()
            pickerValueTemp = curtime.clone()
        }

        let minTime = checkTime(options.minTime)
        let maxTime = checkTime(options.maxTime)

        let tempH =  parseInt(curtime.get('hours')/spaceHours)*spaceHours;
        let tempm =  parseInt(curtime.get('minutes')/spaceMinutes)*spaceMinutes;
        let temps =  parseInt(curtime.get('seconds')/spaceSeconds)*spaceSeconds;

        function batchList(start, end, space, label, ofs) {
            let list = []
            for(let i=start;i<end;i+=space) {
                list.push({id: i, name: (i+(ofs?ofs:0))+label})
            }
            return list;
        }

        function checkTime(timeval){
            if (!timeval) return null
            let temp = eui.time(timeval);
            if (!temp.data.isValid) {
                temp = null;
                console.warn('时间格式有误，参数->',timeval)
            }
            return temp
        }

        function checkMaxMin(time,label){
            if (minTime && time.isBefore(minTime)) {
                eui.toast({message: `${label}不应小于${minTime.format(format)}`,type:'fail'})
                return false
            }
            if (maxTime && time.isafter(maxTime)) {
                eui.toast({message: `${label}不应大于${maxTime.format(format)}`,type:'fail'})
                return false
            }
            return true
        }

        function checkMonthDayList(type,val){
            let tempmax = pickerValueTemp.clone().set(1,'date').set(val.value, type).getMonthLength();
            let time = pickerValueTemp.clone()
            if (tempmax<pickerValueTemp.getMonthLength()) {
                time = pickerValueTemp.clone().set(tempmax, 'date').set(val.value, type)
            } else {
                time.set(val.value, type)
            }
            if (!checkMaxMin(time,'所选时间')) {
                // 超出最大或最小时间
                PICKER.resetColumn(type,{defaultValue: pickerValueTemp.get(type)})
                return;
            }
            pickerValueTemp = time.clone();
            let tempmaxlen = time.getMonthLength()
            if (tempmaxlen!=monthMaxLength) {
                PICKER.resetColumn('date',{
                    options: batchList(1,tempmaxlen+1,1,`<span class="eui-cascader-timelabel">${lang=='ch'?'日':'D'}</span>`),
                    defaultValue: time.data.date
                })
                monthMaxLength = tempmaxlen
            }
        }

        curtime.set(tempH,'hours').set(tempm,'minutes').set(temps,'seconds')
        // 记录当前月份最大天数
        monthMaxLength = curtime.getMonthLength()

        columnsList[0] = {key: 'year', options: [], defaultValue: curtime.get('year'),options: batchList(yearStart,yearEnd,1,`<span class="eui-cascader-timelabel">${lang=='ch'?'年':'Y'}</span>`),onSelect:function(v){checkMonthDayList('year',v)}}
        columnsList[1] = {key: 'month', options: [], defaultValue: curtime.get('month'),options: batchList(0,12,1,`<span class="eui-cascader-timelabel">${lang=='ch'?'月':'M'}</span>`,1),onSelect:function(v){checkMonthDayList('month',v)}}
        columnsList[2] = {key: 'date', options: [], defaultValue: curtime.get('date'),options: batchList(1,curtime.getMonthLength()+1,1,`<span class="eui-cascader-timelabel">${lang=='ch'?'日':'D'}</span>`),onSelect:function(v){checkMonthDayList('date',v)}}
        columnsList[3] = {key: 'hours', options: [], defaultValue: curtime.get('hours'),options: batchList(0,24,spaceHours,`<span class="eui-cascader-timelabel">${lang=='ch'?'时':'H'}</span>`),onSelect:function(v){checkMonthDayList('hours',v)}}
        columnsList[4] = {key: 'minutes', options: [], defaultValue: curtime.get('minutes'),options: batchList(0,60,spaceMinutes,`<span class="eui-cascader-timelabel">${lang=='ch'?'分':'m'}</span>`),onSelect:function(v){checkMonthDayList('minutes',v)}}
        columnsList[5] = {key: 'seconds', options: [], defaultValue: curtime.get('seconds'),options: batchList(0,60,spaceSeconds,`<span class="eui-cascader-timelabel">${lang=='ch'?'秒':'s'}</span>`),onSelect:function(v){checkMonthDayList('seconds',v)}}
        
        options.columnsList = columnsList;
        options.className = (options.className ||'') + ' eui-cascader-datetime'
        options.fieldValueName = 'id'
        options.fieldLabelName = 'name'

        let newopt = {}
        for (let k in options){
            newopt[k] = eui._cloneDeep(options[k])
        }
        newopt.trigger = null;
        newopt.beforeGetValue = function(data){
            return {time: pickerValueTemp.data.time, timeString: pickerValueTemp.format(format)}
        }
        newopt.getValue = function(){
            return {time: pickerValue.data.time, timeString: pickerValue.format(format)}
        }

        if (options.trigger) {
            EuiCommon.bindTrigger(options.trigger,'click',(dom)=>{
                format = dom.attr('data-format') || format;
                columns = dom.attr('data-columns') ? dom.attr('data-columns').split('-') : columns;
                let tempvalue = dom.attr('data-value')
                if (tempvalue) {
                    let temptime = eui.time(tempvalue);
                    if (temptime.data.isValid) {
                        if (!checkMaxMin(temptime,'设置时间')) return
                        pickerValue = temptime.clone();
                        pickerValueTemp = temptime.clone();
                    }
                    resetColumn()
                    filterColumn()
                }
                PICKER.show()
            })
        }

        newopt.onAsyncConfirm = function(data,close) {
            let val = {time: pickerValueTemp.data.time, timeString: pickerValueTemp.format(format)}
            if (options.onAsyncConfirm) {
                options.onAsyncConfirm(val,(rs)=>{
                    if (rs) pickerValue.set(pickerValueTemp.get('time'))
                    close(rs)
                })
            } else if (options.onConfirm) {
                pickerValue.set(pickerValueTemp.get('time'))
                options.onConfirm(val)
                close(true)
            }
        }
        // 过滤展示
        function filterColumn(){
            for(let i=0;i<columnsList.length;i++){
                let key = columnsList[i].key
                PICKER.toggleColumn(key, columns.indexOf(key)>-1 ? true : false)
            }
        }
        function resetColumn(){
            for(let i=0;i<columnsList.length;i++){
                let key = columnsList[i].key
                let opt = {defaultValue: pickerValue.get(key)}
                if (key=='date') {
                    let maxlen = pickerValue.getMonthLength()
                    if (maxlen!=monthMaxLength) {
                        opt.options = batchList(1,maxlen+1,1,`<span class="eui-cascader-timelabel">${lang=='ch'?'日':'D'}</span>`)
                        monthMaxLength = maxlen
                    }
                }
                PICKER.resetColumn(key,opt)
            }
        }
        let PICKER = new eui.cascader(newopt)

        PICKER.resetMinTime = function(val){
            minTime = checkTime(val)
        }
        PICKER.resetMaxTime = function(val){
            maxTime = checkTime(val)
        }

        filterColumn()

        return PICKER
    }

    const EuiDataMapPicker = function(options) {
        options = eui._cloneDeep(options)
        let that =this;
        if (!options.data || options.data.length==0) {
            console.warn('未设置选择数据，参数->',options)
            return
        }
        let data = options.data;
        let showType = (options.containerId && document.getElementById(options.containerId)) ? 'page' : 'popup';
        let zIndex = options.zIndex!=undefined ? options.zIndex : EuiConfig.zIndex;
        let fieldValueName = options.fieldValueName || 'id'
        let fieldLabelName = options.fieldLabelName || 'name'
        let fieldChildrenName = options.fieldChildrenName || 'children'
        let multiple = options.multiple || false;
        let isMaskClose = true;

        let defaultValue = options.defaultValue || [];

        let elmPickerIframe,container,elmTopPath,elmMidWarp,elmBotWarp,pop,elmBotWarpBtn,elmBotWarpList,elmBotWarpBtnText,elmBotWarpBtnNum;
        this.value = {}
        this.tempValue = {}
        let curWarpIdx = 0;
        let warpList = []
        let pathList = [{id: '', name: '根目录'}]
        let pathListElm = []

        let keyData = {}
        function mapData(list, pid){
            for(let i=0; i<list.length;i++) {
                list[i].pid = pid
                keyData[list[i][fieldValueName]] = list[i]
                if (list[i][fieldChildrenName]&&list[i][fieldChildrenName].length) {
                    mapData(list[i][fieldChildrenName],list[i][fieldValueName])
                }
            }
        }

        mapData(data,null)
        
        // 初始化组件
        function initPicker(className){
            elmPickerIframe = EuiRender._renderPickerIframe(options,{className: className})
            // 渲染中心组件
            elmTopPath = EuiCommon.createDom({tag:'div', className:`eui-toppath eui-flex`})
            elmMidWarp = EuiCommon.createDom({tag:'div', className:`eui-midwarp`})
            elmBotWarp = EuiCommon.createDom({tag:'div', className:`eui-botwarp`, style:{display:'none'}})
            elmBotWarpBtn = EuiCommon.createDom({tag:'div', className:`eui-botwarpbtn`, innerHTML: '<span class="eui-dmp-ao">点击查看已选</span>(<span class="eui-dmp-num">0</span>)<div></div>'})
            elmBotWarpList = EuiCommon.createDom({tag:'div', className:`eui-botwarplist`})
            elmBotWarp.appendChild(elmBotWarpBtn)
            elmBotWarp.appendChild(elmBotWarpList)

            elmPickerIframe.node.append(elmTopPath).append(elmMidWarp).append(elmBotWarp)

            elmBotWarpBtnText = elmBotWarpBtn.getElementsByClassName('eui-dmp-ao')[0]
            elmBotWarpBtnNum = elmBotWarpBtn.getElementsByClassName('eui-dmp-num')[0]

            checkMultiple()

            for (let i=0;i<8;i++){
                let warp = EuiCommon.createDom({tag:'div', className:`eui-dmpwarp eui-dmp-right`})
                EuiCommon.bindEvent(warp,['html','addClass','removeClass','attr'])
                warpList.push(warp)
                elmMidWarp.appendChild(warp)
            }

            elmTopPath.addEventListener('click',function(e){
                let node = EuiCommon.getNodeByClassName(e.target,'eui-dmp-pathitem')
                if(node) {
                    let idx = parseInt(node.getAttribute('data-index'))
                    if (idx==curWarpIdx) return
                    for(let i=0;i<warpList.length;i++) {
                        if (i==idx) {
                            warpList[i].attr('class','eui-dmpwarp eui-dmp-ani eui-dmp-center')
                        } else if (i==curWarpIdx) {
                            warpList[i].attr('class',`eui-dmpwarp eui-dmp-ani ${idx>curWarpIdx ? 'eui-dmp-left' : 'eui-dmp-right'}`)
                        } else {
                            warpList[i].attr('class',`eui-dmpwarp ${idx>i ? 'eui-dmp-left' : 'eui-dmp-right'}`)
                        }
                    }
                    pathListElm[idx].classList.add('active')
                    pathListElm[curWarpIdx].classList.remove('active')

                    curWarpIdx = idx
                }
            })

            elmMidWarp.addEventListener('click',function(e){
                let node = EuiCommon.getNodeByClassName(e.target, 'eui-dmp-item')
                if (node) {
                    checkNodeData(keyData[node.getAttribute('data-key')], node);
                }
            })

            elmBotWarpBtn.addEventListener('click',function(){
                if (elmBotWarp.classList.contains('eui-dmp-open')) {
                    elmBotWarp.classList.remove('eui-dmp-open')
                    elmBotWarpBtnText.innerHTML = '点击查看已选'
                } else {
                    elmBotWarp.classList.add('eui-dmp-open')
                    elmBotWarpBtnText.innerHTML = '点击关闭已选'
                }
            })
            elmBotWarpList.addEventListener('click', function(e){
                let node = EuiCommon.getNodeByClassName(e.target, 'eui-botwarpitem')
                if (node) {
                    let key = node.getAttribute('data-key')
                    delete that.tempValue[key]
                    let elms = elmMidWarp.querySelectorAll(`.eui-dmp-item[data-key="${key}"]`)
                    if (elms && elms[0]) elms[0].classList.remove('active')
                    renderChooseItem()
                }
            })
        }

        function checkNodeData(data, node){
            if (data[fieldChildrenName]) {
                pathList.splice(curWarpIdx+1)
                pathList.push(data)
                warpList[curWarpIdx].attr('class','eui-dmpwarp eui-dmp-ani eui-dmp-left')
                renderData(data[fieldChildrenName],curWarpIdx+1,'eui-dmp-center eui-dmp-ani')
                renderPath()
                curWarpIdx++
                activePath()
            }else if (!multiple) {
                that.tempValue = {}
                that.tempValue[data[fieldValueName]] = data;
                elmPickerIframe.confirm()
            } else {
                if (that.tempValue[data[fieldValueName]]) {
                    delete that.tempValue[data[fieldValueName]]
                    node.classList.remove('active')
                } else {
                    that.tempValue[data[fieldValueName]] = data;
                    node.classList.add('active')
                }
                renderChooseItem()
            }
        }

        function checkMultiple() {
            elmPickerIframe.resetButton({showBtn: multiple ? true : false})
            elmBotWarp.style.display = multiple ? 'flex' : 'none'
            multiple ? elmPickerIframe.node.addClass('eui-multiple') : elmPickerIframe.node.removeClass('eui-multiple')
        }
        
        function initPopup(){
            initPicker(`eui-datamappicker-container`)
            bindIframeCallback()
            pop = Eui.popup({
                insetDom: elmPickerIframe.node,
                zIndex: zIndex,
                className: `eui-picker eui-datamappicker ${options.className||''}`,
                position: 'bottom',
                onClose: function(){
                    isMaskClose && options.onClose && options.onClose()
                }
            })
            renderPath(true)
            if (defaultValue.length==0) {
                renderData(data,0,'eui-dmp-center')
            }
        }

        function bindIframeCallback(){
            elmPickerIframe.callback = function(type, params){
                if (type=='maskstate') {
                    isMaskClose = params
                }else if (type=='pophide') {
                    pop && pop.hide()
                } else if (type=='poplocked') {
                    pop && pop.setLocked(params)
                } else if (type=='getvalue') {
                    return that.getValue()
                } else if (type =='setvalue') {
                    that.value = eui._cloneDeep(that.tempValue)
                } else if (type == 'popclear') {
                    that.tempValue = {}
                    renderChooseItem()
                    if (multiple) {
                        defaultValue = []
                        resetDefaultValue()
                    }
                }
            }
        }

        // 渲染选择路径
        function renderPath(isactive){
            pathListElm = []
            elmTopPath.innerHTML = ''
            for (let i=0; i<pathList.length; i++) {
                let pathnode = EuiCommon.createDom({tag:'div', className: 'eui-dmp-pathitem', innerHTML: pathList[i][fieldLabelName], attr: {'data-index': i, 'data-key': pathList[i][fieldValueName]}})
                pathListElm.push(pathnode)
                elmTopPath.appendChild(pathnode)
            }
            isactive && activePath()
        }
        function activePath(){
            pathListElm[curWarpIdx].classList.add('active')
        }

        // 渲染warp
        function renderData(list, warpIdx, className) {
            let str = ''
            for (let i=0; i<list.length; i++) {
                str += `<div class="eui-dmp-item ${that.tempValue[list[i][fieldValueName]] ? 'active' : ''} ${list[i][fieldChildrenName]!=undefined ?'eui-dmp-haschild':''}" data-key="${list[i][fieldValueName]}">${list[i][fieldLabelName]}</div>`
            }
            warpList[warpIdx].attr('class',`eui-dmpwarp ${className||''}`).html(str)
        }

        // 渲染已选
        function renderChooseItem(){
            let count = 0;
            let str = ''
            for (let k in that.tempValue) {
                count++;
                str += `<div class="eui-botwarpitem" data-key="${that.tempValue[k][fieldValueName]}">${that.tempValue[k][fieldLabelName]}</div>`
            }
            elmBotWarpList.innerHTML = str;
            elmBotWarpBtnNum.innerHTML = count
        }

        // 重设初始值
        function resetDefaultValue(){
            let elms = elmMidWarp.querySelectorAll(`.eui-dmp-item.active`)
            for (let i=0; i<elms.length; i++){
                elms[i].classList.remove('active')
            }
            that.tempValue = {}
            for (let i=0;i<defaultValue.length; i++) {
                that.tempValue[defaultValue[i]] = keyData[defaultValue[i]]
                let elms = elmMidWarp.querySelectorAll(`.eui-dmp-item[data-key="${defaultValue[i]}"]`)
                if (elms && elms[0]) elms[0].classList.add('active')
            }
            renderChooseItem()
        }

        if (showType=='page') {
            container = document.getElementById(options.containerId)
            initPicker(`eui-pack eui-datamappicker`)
            bindIframeCallback()
            container.appendChild(elmPickerIframe.node)

            renderPath(true)
            renderData(data,0,'eui-dmp-center')
            multiple && resetDefaultValue()
        } else {
            options.trigger && EuiCommon.bindTrigger(options.trigger,'click',()=>{that.show()})
        }
        
        this.setLoading = function(state) {
            if (!pop && showType=='popup') {initPopup();}
            elmPickerIframe.setLoading(state)
        }
        this.resetTitle = function(val) {
            if (!pop && showType=='popup') {initPopup();}
            elmPickerIframe.resetTitle(val)
        }
        this.resetButton = function(opt) {
            if (!pop && showType=='popup') {initPopup();}
            elmPickerIframe.resetButton(opt)
        }
        this.getValue = function(){
            if (!pop && showType=='popup') {initPopup();}
            let rs = [];
            for (let k in that.tempValue) {
                rs.push(that.tempValue[k])
            }
            return eui._cloneDeep({value: multiple ? rs : rs[0], map: keyData})
        }
        this.reset = function(opt) {
            if (!pop && showType=='popup') {initPopup();}
            if (opt.defaultValue!=undefined) {
                defaultValue = opt.defaultValue;
                resetDefaultValue()
            }
            if (opt.multiple!=undefined) {
                multiple = opt.multiple
                checkMultiple()
            }
        }

        this.show = function(){
            if (!pop && showType=='popup') {initPopup();}
            options.onOpen && options.onOpen()
            that.tempValue = eui._cloneDeep(that.value)
            renderChooseItem()
            if (multiple) {
                defaultValue = []
                for(let k in that.value) {
                    defaultValue.push(that.value[k][fieldValueName])
                }
                resetDefaultValue()
            }
            pop.show()
            isMaskClose = true
        }
        this.distory = function(){
            this.value = null
            this.tempValue = null
            this.setLoading = this.resetTitle = this.resetButton = this.resetPicker = this.getValue = this.show = null;
            pop.remove()
        }
    }

    const EuiCalendar = function(options) {
        options = eui._cloneDeep(options)
        let that = this;
        let showType = (options.containerId && document.getElementById(options.containerId)) ? 'page' : 'popup';
        let zIndex = options.zIndex!=undefined ? options.zIndex : EuiConfig.zIndex;
        let pickerType = options.type || 'date' // date  multiple  range
        let format = options.format || 'YYYY-MM-DD';
        let minTime =  options.minTime ? checkTime(options.minTime) : null;
        let maxTime =  options.maxTime ? checkTime(options.maxTime) : null;
        let defaultTime = options.defaultTime || null;
        let lang = options.lang || 'ch'
        let startYear = options.startYear|| 0
        let endYear = options.endYear || 0
        let rangeMax = (!options.rangeMax || options.rangeMax<2) ? null : options.rangeMax
        let isMaskClose = true;
        let nodesGather = {}
        let dateMultiple = []
        let required = options.required!=undefined ? options.required : false;

        function checkTime(timeval){
            let temp = eui.time(timeval);
            if (!temp.data.isValid) {
                temp = null;
                console.warn('时间格式有误，参数->',timeval)
            }
            return temp ? eui.time(temp.format('YYYY/MM/DD')) : null
        }

        let elmPickerIframe,container,pop,elmYearAo,elmMonthAo,elmDateWarp,elmYearWarp,elmMonthWarp,elmYearTrigger,elmMonthTrigger;
        let today = eui.time(eui.time(null,'YYYY/MM/DD'))
        let renderTime = today.clone()
        let monthMaxLength = today.getMonthLength()
        this.value = []

        startYear = startYear || today.get('year') - 10
        endYear = endYear || today.get('year') + 10

        // 设置初始化时间
        function setDefaultTime(){
            if (!defaultTime) {
                if (pickerType=='date'){
                    dateMultiple = [today.format('YYYY-M-D')]
                }
                return
            }
            if (pickerType=='date') {
                let time = eui.time(defaultTime)
                if (time.data.isValid) {
                    renderTime = time.clone()
                    dateMultiple = [time.format('YYYY-M-D')]
                } else {
                    console.warn('时间格式有误，参数->',defaultTime)
                }
            } else if(pickerType=='multiple') {
                if (EuiCommon.getType(defaultTime)!='array') {
                    console.warn('时间格式有误，必须为数组，参数->',defaultTime)
                } else {
                    let rs = []
                    for(let i=0; i<defaultTime.length;i++){
                        let t = eui.time(defaultTime[i])
                        if (t.data.isValid) {
                            rs.push(t)
                        } else {
                            console.warn('时间格式有误，参数->',defaultTime[i])
                        }
                    }
                    rs.sort((a,b)=>{return a.data.milli - b.data.milli})
                    if (rs[0]) {
                        renderTime = rs[0].clone()
                    }
                    rs = rs.map(item=>{return item.format('YYYY-M-D')})
                    dateMultiple = rs;
                }
            } else {
                let pass = (EuiCommon.getType(defaultTime)=='array' && defaultTime.length==2) ? true : false
                if (pass) {
                    let rs = [checkTime(defaultTime[0]),checkTime(defaultTime[1])]
                    if (rs[0] && rs[1]) {
                        rs.sort((a,b)=>{return a.data.milli - b.data.milli})
                        renderTime = rs[0]
                        dateMultiple = getBetweenDate(rs[0].format('YYYY-M-D'),rs[1].format('YYYY-M-D'))
                    } else {
                        pass = false
                    }
                }
                if (!pass) {
                    console.warn('时间格式有误，必须为数组,且长度为2的有效时间格式，参数->',defaultTime)
                }
            }
            monthMaxLength = renderTime.getMonthLength()
            that.value = eui._cloneDeep(dateMultiple)
        }
        setDefaultTime()

        function checkTime(timeval){
            if (!timeval) return null
            let temp = eui.time(timeval);
            if (!temp.data.isValid) {
                temp = null;
                console.warn('时间格式有误，参数->',timeval)
            }
            return temp
        }

        // 初始化组件
        function initPicker(className){
            elmPickerIframe = EuiRender._renderPickerIframe(options,{className: className})
            renderYearMonthLine()
            renderWeekLabel()
            renderDateWarp()
            renderMonthData()
            renderYMWarp()
        }
        // 渲染月年
        function renderYearMonthLine(){
            let str = `<div class="eui-cal-y eui-calendar-ym-item eui-flex"><span class="eui-calendar-ym-y">--</span><span class="eui-calendar-ym-o">${lang=='eg'?'Year':'年'}</span><span class="eui-arr-d01"></span></div>`
            str+= `<div class="eui-cal-m eui-calendar-ym-item eui-flex"><span class="eui-calendar-ym-m">--</span><span class="eui-calendar-ym-o">${lang=='eg'?'Month':'月'}</span><span class="eui-arr-d01"></span></div>`
            let dom = EuiCommon.createDom({tag: 'div', className: 'eui-calendar-ymline eui-flex', innerHTML:str})
            elmPickerIframe.node.appendChild(dom)
            elmYearAo = dom.getElementsByClassName('eui-calendar-ym-y')[0]
            elmMonthAo = dom.getElementsByClassName('eui-calendar-ym-m')[0]
            elmYearTrigger = dom.getElementsByClassName('eui-cal-y')[0]
            elmMonthTrigger = dom.getElementsByClassName('eui-cal-m')[0]
        }
        // 渲染weeklabel
        function renderWeekLabel(){
            let weeklist = lang=='eg' ? EuiConfig.timeTypes.weekdays.map(item=>{return item.substr(0,3)}) : EuiConfig.timeTypes.weekdaysCh
            let str = ''
            for(let i=0; i<weeklist.length; i++) {
                str += `<div class="eui-calendar-wkitem">${weeklist[i]}</div>`
            }
            elmPickerIframe.node.appendChild(EuiCommon.createDom({tag: 'div', className: `eui-calendar-weeks eui-flex`, innerHTML: str}))
        }
        function renderDateWarp(){
            elmDateWarp = EuiCommon.createDom({tag: 'div', className: `eui-calendar-dlist`})
            elmPickerIframe.node.appendChild(elmDateWarp)
            elmDateWarp.addEventListener('click',function(e){
                let node = EuiCommon.getNodeByClassName(e.target, 'eui-calendar-ditem')
                if (node) {
                    let rs = getNodeAttr(node)
                    let tdnode = nodesGather[rs.timestr];
                    if (tdnode.disabled) return
                    checkNewTime({type: 'date', value: rs.date, checkType: 'date'}).then(time=>{
                        chooseTimeAction(time,tdnode)
                    })
                }
            })
        }

        function renderMonthDataItem(opt){
            let str = ''
            for(let i=opt.start;i<=opt.end;i++) {
                str += `<div class="eui-calendar-ditem ${opt.className}" data-year="${opt.year}" data-month="${opt.month+1}" data-date="${i}">${i}</div>`
            }
            return str
        }
        // 渲染月份数据
        function renderMonthData(){
            setRenderTime()
            let str = ''
            let bnum = renderTime.set(1,'date').get('day')
            let tempMonth = renderTime.clone().set(renderTime.get('month')-1,'month')
            let prevmax = tempMonth.getMonthLength()

            str += renderMonthDataItem({start: prevmax-bnum+1,end: prevmax,year:tempMonth.data.year,month: tempMonth.data.month, className:'disabled'})
            str += renderMonthDataItem({start: 1,end: monthMaxLength,year:renderTime.data.year,month: renderTime.data.month, className:''})
            let textstart = 7-tempMonth.set(tempMonth.get('month')+2,'month').get('day')
            if (textstart<7) {
                str += renderMonthDataItem({start: 1,end: textstart,year:tempMonth.data.year,month: tempMonth.data.month, className:'disabled'})
            }
            str += `<div class="eui-calendar-mbg eui-flex">${renderTime.get('month')+1}</div>`
            elmDateWarp.innerHTML = str;
            // 获取当前日期node
            let nodes = elmDateWarp.getElementsByClassName('eui-calendar-ditem');
            nodesGather = {}
            for (let i=0; i<nodes.length; i++) {
                let y = parseInt(nodes[i].getAttribute('data-year')),m = parseInt(nodes[i].getAttribute('data-month')),d = parseInt(nodes[i].getAttribute('data-date'))
                nodesGather[y+'-'+m+'-'+d] = {
                    node: nodes[i],
                    disabled: nodes[i].classList.contains('disabled'),
                    year: y,
                    month: m,
                    date: d,
                    timestr: y+'-'+m+'-'+d
                }
            }
            activeMultipleNodes()
        }
        // 渲染选择年份
        function renderYMWarp(){
            let str = '';
            for( let i=startYear;i<=endYear;i++) {
                str += `<div class="eui-calendar-yitem eui-cy${i}" data-year="${i}">${i}</div>`
            }
            elmYearWarp = EuiCommon.createDom({tag: 'div', className: `eui-calendar-ywarp eui-flex`, innerHTML: str})
            EuiCommon.bindEvent(elmYearWarp,['addClass','removeClass','show','hide'])
            elmPickerIframe.node.appendChild(elmYearWarp)
            str = ''
            for( let i=1;i<=12;i++) {
                str += `<div class="eui-calendar-mitem eui-cm${i-1}" data-month="${i-1}">${i}${lang=='eg' ?'Month':'月'}</div>`
            }
            elmMonthWarp = EuiCommon.createDom({tag: 'div', className: `eui-calendar-ywarp eui-flex`, innerHTML: str})
            EuiCommon.bindEvent(elmMonthWarp,['addClass','removeClass','show','hide'])
            elmPickerIframe.node.appendChild(elmMonthWarp)

            elmYearTrigger.addEventListener('click',function(){
                elmYearWarp.show(0,true).removeClass('eui-cal-hide').addClass('eui-cal-open')
            })
            elmYearWarp.addEventListener('click',function(e){
                let node = EuiCommon.getNodeByClassName(e.target, 'eui-calendar-yitem')
                if (node) {
                    let rs = getNodeAttr(node)
                    checkNewTime({type: 'year', value: rs.year, checkType: 'year'}).then(time=>{
                        elmYearWarp.hide(300).removeClass('eui-cal-open').addClass('eui-cal-hide')
                        if(time.data.year==renderTime.data.year) return
                        renderTime.set(rs.year, 'year')
                        monthMaxLength = renderTime.getMonthLength()
                        renderMonthData()
                        activeCurYM()
                    })
                }
            })
            elmMonthTrigger.addEventListener('click',function(){
                elmMonthWarp.show(0,true).removeClass('eui-cal-hide').addClass('eui-cal-open')
            })
            elmMonthWarp.addEventListener('click',function(e){
                let node = EuiCommon.getNodeByClassName(e.target, 'eui-calendar-mitem')
                if (node) {
                    let rs = getNodeAttr(node)
                    checkNewTime({type: 'month', value: rs.month, checkType: 'month'}).then(time=>{
                        elmMonthWarp.hide(300).removeClass('eui-cal-open').addClass('eui-cal-hide')
                        if(time.data.month==renderTime.data.month) return
                        renderTime.set(rs.month, 'month')
                        monthMaxLength = renderTime.getMonthLength()
                        renderMonthData()
                        activeCurYM()
                    })
                }
            })

            activeCurYM()
        }
        // 激活当前日期
        function activeCurYM(){
            let elm = elmYearWarp.getElementsByClassName('eui-calendar-yitem active')[0]
            if (elm) {
                elm.classList.remove('active')
            }
            elm = elmYearWarp.getElementsByClassName('eui-calendar-yitem eui-cy'+renderTime.data.year)[0]
            if (elm) {
                elm.classList.add('active')
            }
            elm = elmMonthWarp.getElementsByClassName('eui-calendar-mitem active')[0]
            if (elm) {
                elm.classList.remove('active')
            }
            elm = elmMonthWarp.getElementsByClassName('eui-calendar-mitem eui-cm'+renderTime.data.month)[0]
            if (elm) {
                elm.classList.add('active')
            }

        }
        // 设置渲染日期
        function setRenderTime(){
            elmYearAo.innerHTML = renderTime.get('year')
            elmMonthAo.innerHTML = renderTime.get('month')+1
        }

        function getNodeAttr(node) {
            let rs = {}
            let y = parseInt(node.getAttribute('data-year')||0),m = parseInt(node.getAttribute('data-month')||0),d = parseInt(node.getAttribute('data-date')||0)
            rs.year = y;
            rs.month = m;
            rs.date = d;
            rs.timestr = y+'-'+m+'-'+d
            return rs;
        }

        function checkNewTime(opt) {
            return new Promise(reslove=>{
                let ntime = renderTime.clone().set(opt.value,opt.type);
                let pass = true
                if (['year','month'].indexOf(opt.checkType)>-1) {
                    if (minTime && (ntime.data.year*12+ntime.data.month) < (minTime.data.year*12 + minTime.data.month)) {
                        pass = false;
                        eui.toast({message: `所选时间不应小于${minTime.format('YYYY年MM月')}`})
                    }
                    if (maxTime && (ntime.data.year*12+ntime.data.month) > (maxTime.data.year*12 + maxTime.data.month)) {
                        pass = false;
                        eui.toast({message: `所选时间不应大于${maxTime.format('YYYY年MM月')}`})
                    }
                } else {
                    if (minTime && ntime.data.milli < minTime.data.milli) {
                        pass = false;
                        eui.toast({message: `所选时间不应小于${minTime.format('YYYY年MM月DD日')}`})
                    }
                    if (maxTime && ntime.data.milli > maxTime.data.milli) {
                        pass = false;
                        eui.toast({message: `所选时间不应大于${maxTime.format('YYYY年MM月DD日')}`})
                    }
                }
                if (pass) { reslove(ntime)}
            })
        }

        // 选择正确时间处理
        function chooseTimeAction(time,tdnode) {
            if (pickerType=='date') {
                if (tdnode.timestr==dateMultiple[0]) return
                let elm = elmDateWarp.getElementsByClassName('active')[0]
                if (elm) activeMultipleNodesItem(elm, false, {className: 'active'})
                dateMultiple = [tdnode.timestr]
                // 单选事件
                activeMultipleNodesItem(tdnode.node, true, {className: 'active'})
                // that.value = {time: time.data.time, format: time.format(format)}
                // elmPickerIframe.confirm()
            } else if (pickerType=='multiple') {
                // 多选事件
                let idx = dateMultiple.indexOf(tdnode.timestr)
                activeMultipleNodesItem(tdnode.node, idx>-1 ? false : true, {className: 'active'})
                if (idx>-1) {
                    dateMultiple.splice(dateMultiple.indexOf(tdnode.timestr),1)
                } else {
                    dateMultiple.push(tdnode.timestr)
                }
            } else if (pickerType=='range') {
                // 选择时间段
                if (dateMultiple.length>1 || dateMultiple.length==0) {
                    dateMultiple = [tdnode.timestr]
                    activeMultipleNodes()
                    activeRangeSe(dateMultiple.length)
                }
                if (dateMultiple.length==1 && dateMultiple[0]!=tdnode.timestr) {
                    // 获取间隔数组
                    let list = getBetweenDate(dateMultiple[0],tdnode.timestr)
                    // 判断是否大约最大可选
                    if (rangeMax && rangeMax<list.length) {
                        eui.toast({message: `所选时间段不可超过${rangeMax}天`})
                    } else {
                        dateMultiple = list;
                        activeMultipleNodes()
                        activeRangeSe(dateMultiple.length)
                    }
                }
            }
        }

        // 激活日期间距节点
        function activeMultipleNodes(){
            let len = dateMultiple.length;
            let opt = pickerType=='range' ? {className: 'range-active'} : {className: 'active'};
            for (let k in nodesGather) {
                let idx = dateMultiple.indexOf(k);
                activeMultipleNodesItem(nodesGather[k].node,idx>-1,opt)
                pickerType=='range' && activeRangeSe(len)
            }
        }
        function activeMultipleNodesItem(node, state, opt) {
            if (state) {
                node.classList.add(opt.className)
            } else {
                EuiCommon.setClass(node,[['remove',opt.className],['remove','range-active-first',pickerType=='range'],['remove','range-active-end',pickerType=='range']])
                EuiCommon.setStyles(node,[['backgroundColor',''],['color','',pickerType=='range']])
            }
        }
        // 获取两个日期之间的日期数组
        function getBetweenDate(timea, timeb) {
            let timelist = [eui.time(timea),eui.time(timeb)].sort((a,b)=>{
                return a.data.milli - b.data.milli
            })
            let list = []
            while(timelist[0].data.milli <=timelist[1].data.milli) {
                list.push(timelist[0].format("YYYY-M-D"))
                timelist[0].set(timelist[0].get('date')+1, 'date')
            }
            return list
        }
        // 激活间距选择头尾
        function activeRangeSe(len){
            if (dateMultiple.length) {
                if (nodesGather[dateMultiple[0]]) {
                    EuiCommon.setClass(nodesGather[dateMultiple[0]].node,[['add','range-active-first'],['remove','range-active-end',dateMultiple.length > 1]])
                }
                if (nodesGather[dateMultiple[len-1]]) {
                    EuiCommon.setClass(nodesGather[dateMultiple[len-1]].node,[['add','range-active-end'],['remove','range-active-first',dateMultiple.length > 1]])
                }

            }
        }

        function initPopup(){
            initPicker(`eui-calendar-container`)
            bindIframeCallback()
            pop = Eui.popup({
                insetDom: elmPickerIframe.node,
                zIndex: zIndex,
                className: `eui-calendar ${options.className||''}`,
                position: 'bottom',
                onClose: function(){
                    isMaskClose && options.onClose && options.onClose()
                }
            })
        }

        function bindIframeCallback(){
            elmPickerIframe.callback = function(type, params){
                if (type=='maskstate') {
                    isMaskClose = params
                }else if (type=='pophide') {
                    pop && pop.hide()
                } else if (type=='poplocked') {
                    pop && pop.setLocked(params)
                } else if (type=='getvalue') {
                    return that.getValue()
                } else if (type =='popclear') {
                    if (pickerType == 'multiple') {
                        dateMultiple = []
                        renderMonthData()
                    } else if (pickerType == 'range') {
                        defaultTime = null;
                        dateMultiple = [];
                        renderMonthData()
                    }
                } else if (type =='setvalue') {
                    that.value = eui._cloneDeep(dateMultiple)
                }
            }
        }


        
        if (showType=='page') {
            container = document.getElementById(options.containerId)
            initPicker(`eui-pack eui-calendar`)
            bindIframeCallback()
            container.appendChild(elmPickerIframe.node)
            // renderActiveNodes()
        } else {
            if (options.trigger) {
                EuiCommon.bindTrigger(options.trigger,'click',()=>{that.show()})
            }
        }
        
        this.setLoading = function(state) {
            if (!pop && showType=='popup') {initPopup();}
            elmPickerIframe.setLoading(state)
        }
        this.resetTitle = function(val) {
            if (!pop && showType=='popup') {initPopup();}
            elmPickerIframe.resetTitle(val)
        }
        this.resetButton = function(opt) {
            if (!pop && showType=='popup') {initPopup();}
            elmPickerIframe.resetButton(opt)
        }
        this.getValue = function(){
            if (!pop && showType=='popup') {initPopup();}

            let value;
            if (pickerType=='date') {
                if (dateMultiple[0]) {
                    let tm = eui.time(dateMultiple[0])
                    value = {time: tm.data.time, format: tm.format(format)}
                }
            } else if (pickerType=='multiple') {
                if (required && dateMultiple.length==0) {
                    eui.toast({message: `请选择日期`})
                    return null
                }
                let list = []
                for (let i=0;i<dateMultiple.length; i++) {
                    let tm = eui.time(dateMultiple[i])
                    list.push({time: tm.data.time, format: tm.format(format)})
                }
                value = list
            } else if (pickerType=='range') {
                if (required && dateMultiple.length<2) {
                    eui.toast({message: `请选择日期`})
                    return null
                }
                if (dateMultiple.length<2) {
                    value = []
                } else {
                    let timelist = [eui.time(dateMultiple[0]),eui.time(dateMultiple[dateMultiple.length-1])].sort((a,b)=>{
                        return a.data.milli - b.data.milli
                    })
                    value = [
                        {time: timelist[0].data.time, format: timelist[0].format(format)},
                        {time: timelist[1].data.time, format: timelist[1].format(format)}
                    ]
                }
            }
            return value
        }

        this.show = function(){
            if (!pop && showType=='popup') {initPopup();}
            options.onOpen && options.onOpen()
            dateMultiple = eui._cloneDeep(this.value)
            renderMonthData()
            pop.show()
            isMaskClose = true
        }

        this.resetMinTime = function(val){
            minTime = checkTime(val)
        }
        this.resetMaxTime = function(val){
            maxTime = checkTime(val)
        }

        this.resetDefaultTime = function(value){
            if (!pop && showType=='popup') {initPopup();}
            defaultTime = value
            if (!value || (EuiCommon.getType(value)=='array' && value.length == 0)) {
                defaultTime = null;
                dateMultiple = [];
                that.value = [];
            }
            setDefaultTime()
            renderMonthData()
            activeCurYM()
        }
        this.destory = function(){
            this.setLoading = this.resetTitle = this.resetButton = this.getValue = this.show = this.resetMinTime = this.resetMaxTime = this.resetDefaultTime = this.renderDate = null
        }
        this.renderDate = function(render,dates){
            if (!pop && showType=='popup') {initPopup();}
            if (EuiCommon.getType(dates)=='array') {
                for (let i=0;i<dates.length;i++) {
                    let tm = eui.time(dates[i])
                    if (tm.data.isValid) {
                        let k = `${tm.data.year}-${tm.data.month}-${tm.data.date}`
                        EuiCommon.append(nodesGather[k].node,(render(nodesGather[k])||nodesGather[k].date),true)
                    }
                }
            } else {
                for (let k in nodesGather) {
                    EuiCommon.append(nodesGather[k].node,(render(nodesGather[k])||nodesGather[k].date),true)
                }
            }
        }
    }

    const EuiSwipe = function(options){
        let that = this;
        let container = options.containerId ? document.getElementById(options.containerId) : null;
        if (!container) {
            console.warn('未找到容器id -->',options)
            return
        }
        let items = container.getElementsByClassName('eui-swipe-item')
        if (!items || items.length==0) {
            console.warn('未设置容器切换元素 -->',options)
            return
        }
        let indicatorLen = items.length;

        if (items.length===1) {
            items[0].style.cssText = 'transform: translateX(0)'
            return
        }
        if (items.length===2) {
            container.innerHTML += container.innerHTML
            items = container.getElementsByClassName('eui-swipe-item')
        }
        
        let index = 0;
        let touchS = 0;
        let touchL = 0;
        let isDire = -1;
        let direction = (options.direction||'x').toUpperCase() || 'X'
        let space = options.space||3000;
        let maxLength = items.length - 1;
        let fullRange = direction==='X' ? container.offsetWidth : container.offsetHeight;
        let figs = [items[maxLength], items[0], items[1]];
        let elmIndicators = []
        let elmIndicatorNum;
        let timer;
        let pageXY = 'page'+direction
        let indicatorType = options.indicatorType || ''
        let autoPlay = options.autoPlay!=undefined ? options.autoPlay : true;
        
        if (direction==='Y') {
            container.classList.add('directionY')
        }

        function styletransform(style,transform,transition){
            if(transition){
                style.webkitTransition = transition;
                style.transition = transition;
            };
            style.webkitTransform = transform;
            style.transform = transform;
        }
        
        function goAutoPlay(){
            if (autoPlay===false) return
            timer = setInterval(function() {
                goNext();
            }, space);
        }
        
        styletransform(figs[0].style, `translateZ(0) translate${direction}(-${fullRange}px)`);
        styletransform(figs[1].style, `translateZ(0) translate${direction}(0)`);
        styletransform(figs[2].style, `translateZ(0) translate${direction}(${fullRange}px)`);
        
        if (options.indicatorShow!==false) {
            if (indicatorType=='number') {
                let elmind = EuiCommon.createDom({tag: 'div', className: 'eui-indicator-num', innerHTML: `<span class="eui-indicator-curnum">1</span>/${indicatorLen}`})
                container.appendChild(elmind)
                elmIndicatorNum = elmind.getElementsByClassName('eui-indicator-curnum')[0];
            } else {
                var pos = '';
                for(var i=0;i<indicatorLen;i++){
                    pos += '<span class="eui-indicator-item"></span>';
                }
                let elmind = EuiCommon.createDom({tag: 'div', className: 'eui-indicator-dot', innerHTML: pos})
                container.appendChild(elmind)
                elmIndicators = container.getElementsByClassName('eui-indicator-item');
                elmIndicators[0].classList.add('active')
            }
        }
    
        function handstart(event){
            clearInterval(timer);
            clearTimeout(timer)
            for (var i = 0; i < 3; i++) {
                styletransform(figs[i].style,`translateZ(0) translate${direction}(${(i - 1) * fullRange}px)`,'all 0s')
            };
            touchS = event.touches[0];
        }
        function handmove(event){
            if (isDire===true||(isDire===-1 && direction==='Y')) {
                event.stopPropagation();
                event.preventDefault();
            }
            
            touchL = event.touches[0];
            if(isDire===true){
                var c = touchL[pageXY] - touchS[pageXY];
                for (var i = 0; i < 3; i++) {
                    styletransform(figs[i].style,`translateZ(0) translate${direction}(${(i - 1) * fullRange + c}px)`)
                };
            };
            if(isDire===-1){
                let xy = Math.abs(touchL.pageY-touchS.pageY)>Math.abs(touchL.pageX-touchS.pageX)?'Y':'X';
                isDire = xy==direction ? true : false
            };
        }
        function handend(event){
            if(isDire){
                event.stopPropagation();
            };
            timer = setTimeout(() => {
                goAutoPlay()
            }, 300);

            if (!touchL || !touchL.pageX) {
                return false;
            };
            if(touchL[pageXY]-touchS[pageXY]<=-(fullRange/10)){
                goNext();
            }else if(touchL[pageXY]-touchS[pageXY]>=(fullRange/10)){
                var s = index;
                index--;
                if (index < 0) {
                    index = maxLength;
                };
                changepo(s, index);
                figs.pop();
                var o = items[(index - 1) < 0 ? maxLength : index - 1];
                styletransform(o.style,`translateZ(0) translate${direction}(-${fullRange}px)`,'all 0s');
                figs.unshift(o);
                styletransform(figs[1].style,`translateZ(0) translate${direction}(0)`,'all .3s');
                styletransform(figs[2].style,`translateZ(0) translate${direction}(${fullRange}px)`,'all .3s');
            }else{
                for (var i = 0; i < 3; i++) {
                    styletransform(figs[i].style,`translateZ(0) translate${direction}(${(i - 1) * fullRange}px)`,'all 0.3s')
                };
            }

            isDire = -1;
            touchS = null;
            touchL = null;
            }

        container.addEventListener('touchstart',handstart);
        container.addEventListener('touchmove',handmove);
        container.addEventListener('touchend',handend);

            function goNext(){
            var s = index;
            index++;
            if (index > maxLength) {
                index = 0;
            };
            changepo(s, index);
            figs.shift();
            var o = items[(index + 1) > maxLength ? 0 : index + 1];
            styletransform(o.style,`translateZ(0) translate${direction}(${fullRange}px)`,'all 0s');
            figs.push(o);

            styletransform(figs[0].style,`translateZ(0) translate${direction}(-${fullRange}px)`,'all .3s');
            styletransform(figs[1].style,`translateZ(0) translate${direction}(0)`,'all .3s');
        };

        function changepo(f, t) {
            if (indicatorType=='number') {
                elmIndicatorNum.innerHTML = t % indicatorLen + 1;
            } else {
                options.swipeend&&options.swipeend({idx:t%indicatorLen,node:items[t%indicatorLen]})
                elmIndicators[f % indicatorLen]&&elmIndicators[f % indicatorLen].classList.remove('active');
                elmIndicators[t % indicatorLen]&&elmIndicators[t % indicatorLen].classList.add('active');
            }
        };
        
        goAutoPlay()

        this.stopAutoPlay = function(rest){
            if (!rest) {
                autoPlay = false;
            }
            clearTimeout(timer)
            clearInterval(timer)
        }
        this.startAutoPlay = function(rest){
            if (!rest) {
                autoPlay = true;
            }
            goAutoPlay()
        }
        this.swipeNext = function(){
            this.stopAutoPlay(true)
            goNext()
            setTimeout(()=>{
                that.startAutoPlay(true)
            },320)
        }
        this.swipeTo = function(idx){
            if(idx>maxLength) {
                console.warn('指定跳转内容不存在')
                return
            }
            if (idx==index) {
                return
            }
            this.stopAutoPlay(true)
            figs[2] = items[idx >= maxLength ? 0 : idx]
            styletransform(figs[2].style,`translateZ(0) translate${direction}(${fullRange}px)`,'all 0s');
            index = (idx - 1) < 0 ? maxLength : idx - 1
            setTimeout(()=>{goNext()},0)
            setTimeout(()=>{
                figs[0] = items[(index - 1) < 0 ? maxLength : index - 1]
                styletransform(figs[0].style,`translateZ(0) translate${direction}(-${fullRange}px)`,'all 0s');
                styletransform(figs[2].style,`translateZ(0) translate${direction}(${fullRange}px)`,'all 0s');
                that.startAutoPlay(true)
            },320)
        }

        this.destory = function(){
            this.startAutoPlay = null;
            this.stopAutoPlay = null;
            this.swipeTo = null;
            this.swipeNext = null;
            container.remove()
        }
    }

    const EuiScrollBottom = function (options) {
        const num = options.rangeBottom || 240
        this.stop = options.stop === undefined ? true : options.stop
        const timeSpace = options.timeSpace || 400
        const that = this
        let body = document.body||document.documentElement
        let window_height = window.innerHeight
        let inter

        function checkHeight () {
            var scrolltop = document.documentElement.scrollTop||document.body.scrollTop;
            if(scrolltop + window_height + num > body.scrollHeight && !that.stop){
                options.callback && options.callback();
            }
        }

        this.bodyscroll = EuiTools.throttle(function(){
            clearTimeout(inter)
            checkHeight()
        }, timeSpace)

        window.addEventListener('scroll', this.bodyscroll,false);

        this.unBindScroll = function (){
            window.removeEventListener('scroll',that.bodyscroll,false);
        }
        this.toggleStop = function (st, check){
            that.stop = st;
            if (check) {
                checkHeight()
            }
        }
    }

    const EuiDomScrollBottom = function (options) {
        const num = options.rangeBottom || 240
        this.stop = options.stop === undefined ? true : options.stop
        const timeSpace = options.timeSpace || 400
        const that = this
        if (!options.target) {
            console.warn('未设置滚动对象，参数->',options)
            return
        }
        let body = options.target
        let window_height = options.target.offsetHeight
        let inter

        function checkHeight () {
            var scrolltop = body.scrollTop
            window_height = options.target.offsetHeight
            if(scrolltop + window_height + num > body.scrollHeight && !that.stop){
                options.callback && options.callback();
            }
        }
        this.bodyscroll = EuiTools.throttle(function(){
            clearTimeout(inter)
            checkHeight()
        }, timeSpace)

        options.target.addEventListener('scroll', that.bodyscroll,false);

        this.unBindScroll = function (){
            options.target.removeEventListener('scroll',that.bodyscroll,false);
        }
        this.toggleStop = function (st, check){
            that.stop = st;
            if (check) {
                checkHeight()
            }
        }
    }

    const EuiOverTouch = function (options) {
        if (!options || !options.elm){
            console.warn('悬浮对象不存在')
            return;
        }
        let that = this
        let elm = options.elm
        let body = document.body||document.documentElement
        let edge = options.edge == undefined ? 2 : options.edge

        let rect = elm.getBoundingClientRect()
        let touch_first = {pageX: 0, pageY: 0}
        let touch_last = {pageX: 0, pageY: 0}
        let window_height = window.innerHeight
        let window_width = window.innerWidth

        elm.style.cssText = "position:fixed; left:0; top:0; bottom:auto;";
        elm.style.webkitTransform = 'translateZ(0) translate('+rect.left+'px,'+rect.top+'px)';

        elm.addEventListener('touchstart',function(event){
            elm.style.webkitTransition = "all 0s";
            touch_first = event.targetTouches[0];
            body.addEventListener('touchmove', that.onTouchMove,{ passive: false })
            body.addEventListener('touchend', that.onTouchEnd,{ passive: false })

        },false);

        this.onTouchMove = function(event) {
            var mtouch = event.targetTouches[0];
            elm.style.webkitTransform = 'translateZ(0) translate('+(mtouch.pageX - touch_first.pageX + touch_last.pageX)+'px,'+(mtouch.pageY - touch_first.pageY + touch_last.pageY)+'px)';
            event.preventDefault()
            event.stopPropagation()
        }
        this.onTouchEnd = function(event) {
            body.removeEventListener('touchmove',that.onTouchMove)
            body.removeEventListener('touchend',that.onTouchEnd)
            reset(.2)
        }

        function reset (time) {
            elm.style.webkitTransition = `all ${time||0}s`
            rect = elm.getBoundingClientRect()
            let cx = rect.left + rect.width/2
            let ragex = cx < window_width/2 ? cx : window_width - cx
            let cy = rect.top + rect.height/2
            let ragey = cy < window_height/2 ? cy : window_height - cy
            let egy = cy < window_height/2 ? rect.top : window_height - rect.bottom
            if (ragex > ragey && egy < 40) {
                touch_last.pageX = rect.left < edge ? edge : (rect.left + rect.width + edge > window_width ? window_width - edge - rect.width : rect.left)
                touch_last.pageY = (rect.top + rect.height/2) <= window_height/2 ? edge : (window_height - edge - rect.height)
            } else {
                touch_last.pageX = (rect.left + rect.width/2) <= window_width/2 ? edge : (window_width - edge - rect.width)
                touch_last.pageY = rect.top < edge ? edge : (rect.top + rect.height + edge > window_height ? window_height - edge - rect.height : rect.top)
            }
            elm.style.webkitTransform = 'translateZ(0) translate('+(touch_last.pageX)+'px,'+(touch_last.pageY)+'px)';
        }

        reset()
    }

    const eui = {}
    eui.storage = EuiLocal

    for (let k in EuiTools) {
        eui['_'+k] = EuiTools[k]
    }
    eui.popup = function(options) {
        return new EuiPopup(options)
    }
    eui.toast = function(options) {
        return new EuiToast(options)
    }
    eui.notify = function(options) {
        return new EuiNotify(options)
    }
    eui.time = function(timestr, format) {
        return format ? new EuiTime(timestr).format(format) : new EuiTime(timestr)
    }
    eui.actionSheet = function(options) {
        return new EuiActionSheet(options)
    }
    eui.dialog = function(options) {
        return new EuiDialog(options)
    }
    eui.selecter = function(options) {
        return new EuiSelecter(options)
    }
    eui.picker = function(options) {
        return new EuiPicker(options)
    }
    eui.cascader = function(options) {
        return new EuiCascader(options)
    }
    eui.datetimePicker = function(options) {
        return new EuiDatetimePicker(options)
    }
    eui.dataMapPicker = function(options) {
        return new EuiDataMapPicker(options)
    }
    eui.calendar = function(options) {
        return new EuiCalendar(options)
    }
    eui.swipe = function(options) {
        return new EuiSwipe(options)
    }
    eui.scrollBottom = function(options) {
        return new EuiScrollBottom(options)
    }
    eui.domScrollBottom = function(options) {
        return new EuiDomScrollBottom(options)
    }
    eui.overTouch = function (options) {
        return new EuiOverTouch(options)
    }
    return eui
 } ());
