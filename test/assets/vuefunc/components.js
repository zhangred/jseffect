// 通用方法-组件注册到body
function renderComponent(props, component, target) {
    target = target || document.body;
    let vm = new Vue({
        render(h) {
            return h(component, {props})
        }
    }).$mount()

    target.appendChild(vm.$el)
    const recom = vm.$children[0]
    recom.remove = function(){
        target.removeChild(vm.$el)
    }
    return recom
}

// 挂在方法
Vue.prototype.$renderComponent = renderComponent
// 输入框失去焦点时返回原位置
Vue.component('dxl-action-sheet', {
    props: { 
        data: Array,
        title: String
    },
    template: '<div class="cm-dxl-action-sheet">\
        <div class="das-title">{{title||""}}<div class="das-close" @click="cancel"></div></div>\
        <div class="das-alist">\
            <div class="das-item" v-for="(item, index) in data" :key="item.id" @click="onChoose(index, item)">\
                <div class="das-itil">{{item.title}}</div>\
            </div>\
            <div class="das-cancel" @click="cancel">取消</div>\
        </div>\
    </div>',
    methods: {
        // 取消
        cancel: function(){
            this.$emit('cancel')
        },
        // 选择
        onChoose: function(index, item) {
            this.$emit('cancel')
            this.$emit('select', index, item)
        }
    }
})

// 排序组件
Vue.component('dxl-sort', {
    props: {
        data: {
            type: Array,
            default: []
        },
        sortValue: {
            type: [String, Number],
            default: ''
        },
        sortType: {
            type: [String, Number],
            default: ''
        },
        showText: {
            type: [String, Number],
            default: ''
        },
        top: {
            type: Number,
            default: 0
        },
        bottom: {
            type: Number,
            default: 0
        },
        weight: {
            type: Boolean,
            default: false
        },
        mark: {
            type: [String,Number,Object],
            default: ''
        }
    },
    template: `<div ref="dom" :class="['cm-sort-wp', {weight: weight}]" @click="toggleSort">
        <div class="csw-tx">{{showText||"请选择排序"}}</div>
        <div :class="['cm-sort-arr',{desc: sortType=='desc', asc: sortType=='asc'}]"></div>
        <cus-pop :target="$refs.dom" :top="top" :bottom="bottom" v-model="show">
            <div class="cm-timesort-warp">
                <div
                    :class="['ctw-item', {active: sortValue==item.value}]"
                    v-for="(item, index) in data" :key="item.value"
                    @click="onChoose(item, index, data)"
                >
                    {{item.title}}
                    <img v-if="sortValue==item.value" src="./assets/images/check01.png" class="ctw-ck" />
                </div>
            </div>
        </cus-pop>
    </div>`,
    data: function() {
        return {
            activeValue: '',
            show: false
        }
    },
    watch: {
        sortValue: function(newv, oldv){
            if (newv!=this.activeValue) {
                this.activeValue = newv
            }
        }
    },
    mounted: function(){
        this.activeValue = this.sortValue||'';
    },
    methods: {
        toggleSort: function(){
            this.show = !this.show
        },
        onChoose: function(item, index, options){
            this.$emit('onselect', {mark: this.mark, data: item, index: index, options: options})
            this.show = false;
        },
        onChange: function(obj){
            for (let k in obj) {
                this[k] = obj[k]
            }
        }
    }
})

// 不定位置弹出框
Vue.component('cus-pop', {
    props: {
        className: {
            type: String,
            default: ''
        },
        value:{
            type :Boolean,
            default: false
        },
        target: {
            type: Node,
            default: false
        },
        top: {
            type: Number,
            default: 0
        },
        bottom: {
            type: Number,
            default: 0
        },
        mark: {
            type: [String,Number,Object],
            default: ''
        }
    },
    data: function(){
        return {
            popShow: null,
            randomName: 'top'+Math.ceil(Math.random()*9999999)
        }
    },
    template: `<div :class="['cm-cus-pop', className, {show: popShow===true}, {hide: popShow===false}]">
        <div class="ccp-top" ref="top" @click="onHide"></div>
        <div class="ccp-bot" ref="bot" @click="onHide"></div>
        <div class="ccp-cont" ref="cont"><slot></slot></div>
    </div>`,
    watch: {
        value: function(newv, oldv){
            if (newv!=this.popShow) {
                this.onToggleShow(newv)
            }
        }
    },
    mounted: function(){
        if (this.value) {
            this.onToggleShow(true)
        }
        let target = this.target || document.body;
        target.appendChild(this.$el)
        if (this.value) {
            setTimeout(()=>{
                this.onToggleShow(this.value)
            },200)
        }
    },
    beforeDestroy: function(){
        let target = this.target || document.body;
        target.removeChild(this.$el)
    },
    methods: {
        onToggleShow: function(state){
            if (!this.target) return;
            if (state) {
                let rect = this.target.getBoundingClientRect()
                this.$refs.top.style.height = rect.bottom - this.top;
                this.$refs.bot.style.top = rect.bottom + this.bottom;
                this.$refs.cont.style.top = rect.bottom;
                this.popShow = state;
                setBodyScroll(true, this.randomName)
                this.$emit('visible-change', {mark: this.mark, state: true})
            } else {
                this.popShow = state
                setBodyScroll(false, this.randomName)
                this.$emit('visible-change', {mark: this.mark, state: false})
            }
        },
        onHide: function(){
            this.$emit('input', false)
            this.$emit('close-with-click', {mark: this.mark, state: false, action:'click'})
        }
    }
})

// 加载效果 加载中  加载完成 空
Vue.component('loading', {
    props: {
        show:{
            type :Boolean,
            default: true
        },
        status: {
            type: String,
            default: 'loading'
        },
        className: {
            type: String,
            default: ''
        },
        emptyText: {
            type: String,
            default: ''
        },
        loadingText: {
            type: String,
            default: '正在加载更多···'
        }
    },
    template: `<div :class="['cm-loading',className]" v-if="show">
        <div class="cl-empty" v-if="status=='empty'"><img src="./assets/images/empty01.png" class="empty-ico" /><p class="empty-tx">{{emptyText||'暂无数据'}}</p></div>
        <p class="cl-text" v-if="status=='loading'"><img src="assets/images/loading.gif" class="cl-ico"><span class="load">{{loadingText}}</span></p>
        <p class="cl-text" v-if="status=='loadall'"><span class="done">数据已全部加载完毕</span></p>
    </div>`
})

// 单列文字提示效果 加粗加黑 单例箭头上下配置
Vue.component('down-arrow', {
    props: {
        text:{
            type :String,
            default: '--'
        },
        className: {
            type: String,
            default: ''
        },
        weight: {
            type: Boolean,
            default: false
        },
        up: {
            type: Boolean,
            default: false
        },
        mark: {
            type: [String,Number,Object],
            default: ''
        }
    },
    template: `<div :class="['cm-down-arrow', 'flex', className, {weight: weight}, {up: up}]" @click="onClick"><span class="cda-tx">{{text}}</span></div>`,
    methods: {
        onClick: function(){
            this.$emit('click', {mark: this.mark, text: this.text, up: this.up, weight: this.weight})
        }
    }
})

// 元素滚动加载
Vue.component('bottom-loading', {
    props: {
        locked: {
            type: Boolean,
            default: true
        },
        number: {
            type: Number,
            default: 400
        },
        className: {
            type: String,
            default: ''
        },
    },
    template: `<div ref="dom" @scroll.passive="elmScroll" :class="className"><slot></slot></div>`,
    created: function(){
        let _this = this
        this.elmScroll = CUES.throttle(()=>{
            let dom = _this.$refs.dom;
            if (!dom) return
            if (dom.offsetHeight+dom.scrollTop+_this.number>dom.scrollHeight && !_this.locked) {
                _this.$emit('callback')
            }
        },300)
    }
})

// 单个弹出框筛选配置 展示：按钮类  弹框类  多选、单选 
Vue.component('screen-single-pop', {
    props: {
        name: {
            type: [String, Number],
            default: ''
        },
        showText: {
            type: [String, Number],
            default: ''
        },
        placeholder: {
            type: [String, Number],
            default: '请选择'
        },
        top: {
            type: Number,
            default: 0
        },
        bottom: {
            type: Number,
            default: 0
        },
        multiple: {
            type: Boolean,
            default: false,
        },
        type: {
            type: String,
            default: 'select'
        },
        resetOnClose: {
            type: Boolean,
            default: false
        },
        value: {
            type: [String, Number, Array],
            default(){
                if (this.multiple) {
                    return []
                } else {
                    return undefined
                }
            }
        },
        options: {
            type: Array,
            default: []
        },
        mark: {
            type: [String,Number,Object],
            default: ''
        }        
    },
    data: function(){
        return {
            popShow: false,
            inValue: deepClone(this.value)
        }
    },
    watch: {
        value: function(newv, oldv){
            this.inValue = deepClone(newv)
        },
        active: function(newv, oldv){
            this.inActive = newv
        }
    },
    computed: {
        active: function(){
            if ((this.multiple && this.inValue.length) || (!this.multiple && this.inValue!=undefined)) {
                return true;
            } else {
                return false;
            }
        },
        chooseTags: function(){
            if (!this.options || this.options.length==0) return null
            if (this.inValue==undefined || this.inValue.length==0) return null
            let cvs = this.multiple ? this.inValue : [this.inValue]
            let rs = [];
            for (let i=0; i<this.options.length; i++) {
                let it = this.options[i];
                if (cvs.indexOf(it.value)>-1) {
                    rs.push(it)
                }
            }
            return this.multiple ? rs : rs[0]
        }
    },
    template: `<div class="cm-screen-single-pop flex" ref="dom">
            <div @click="onClick" :class="['csp-in', 'flex', 'csp-type-'+type, {'open': popShow}, {'active': !popShow && active}]">{{showText||placeholder}}</div>
            <cus-pop v-if="type=='select'" :target="$refs.dom" :top="top" :bottom="bottom" v-model="popShow" class-name="cm-screen-single-warp-pop">
                <div class="cm-screen-single-warp">
                    <div class="csw-list flex">
                        <div
                            :class="['csw-item', {active: checkValue(item.value)}]"
                            v-for="(item, index) in options" :key="item.value"
                            @click="onChoose(item, index, options)"
                        >
                            {{item.title}}
                            <img v-if="checkValue(item.value)" src="./assets/images/check01.png" class="csw-ck" />
                        </div>
                    </div>
                    <div class="cm-btns-group flex">
                        <div class="cbg-btn" @click="onReset">重置</div>
                        <div class="cbg-btn a" @click="onSave">确认</div>
                    </div>
                </div>
            </cus-pop>
        </div>`,
    methods: {
        checkValue: function(val){
            if(this.multiple) {
                return this.inValue.indexOf(val) == -1 ? false : true
            } else  {
                return this.inValue==val
            }
        },
        onClick: function(){
            if (this.type=='button') {
                this.inValue = this.inValue ? undefined : true;
                this.$emit('value-change',{mark: this.mark, value: this.inValue, name: this.name})
            } else if (this.type=='select') {
                this.popShow = !this.popShow;
                if (this.resetOnClose && this.popShow) {
                    this.onResetData()
                }
            }
        },
        onChoose: function(item){
            if (this.multiple) {
                let idx = this.inValue.indexOf(item.value);
                if (idx==-1) {
                    this.inValue.push(item.value)
                } else {
                    this.inValue.splice(idx, 1)
                }
            } else {
                this.inValue = item.value==this.inValue ? undefined : item.value
            }
            if (item.value==undefined) {
                this.inValue = this.multiple ? [] : undefined
            }
        },
        onReset: function(){
            this.inValue = this.multiple ? [] : undefined
        },
        onSave: function(){
            this.popShow = false
            this.$emit('value-change',{mark: this.mark, value: deepClone(this.inValue), name: this.name, multiple: this.multiple, options: deepClone(this.chooseTags)})
        },
        onResetData: function(){
            if (this.resetOnClose) {
                this.inValue = this.value
            }
        }
    }
})

// 加载效果 加载中  加载完成 空
Vue.component('btn-group-save', {
    props: {
        name: {
            type: [String,Number],
            default: ''
        } ,
        className: {
            type: String,
            default: ''
        },
        mark: {
            type: [String,Number,Object],
            default: ''
        } 
    },
    template: `<div :class="['cm-btns-group', 'flex', className]">
            <div class="cbg-btn" @click="onReset">重置</div>
            <div class="cbg-btn a" @click="onSave">确认</div>
        </div>`,
    methods: {
        onReset: function(){
            this.$emit('reset', {mark: this.mark, name: this.name})
        },
        onSave: function(){
            this.$emit('save', {mark: this.mark, name: this.name})
        }
    }
})


// 炫富按钮控制器
Vue.component('over-touch', {
    props: {
        margin: {
            type: Number,
            default: 4
        },
        style: {
            type: String,
            default: 'right: 4px; bottom: 4px'
        }
    },
    data: function(){
        return {
            ftouch: null,
            ltouch: null,
            wdw: 0,
            wdh: 0,
            elm: null,
            locked: false,
            ismove: false,
            className: 'J_overtouch_'+Math.ceil(Math.random()*9999999)
        }
    },
    template: `<div ref="elm" :style="style" :class="['cm-over-touch', 'not-selected', className]"><slot></slot></div>`,
    mounted: function(){
        // console.log(this.$refs.elm)
        this.wdw = window.innerWidth;
        this.wdh = window.innerHeight;
        this.elm = this.$refs.elm
        window.addEventListener('touchstart', this.onTouchStart)       
    },
    beforeDestroy: function(){
        console.log('out')
        window.removeEventListener('touchstart', this.onTouchStart)
    },
    methods: {
        onTouchStart: function(event){
            if(checkClickTarget(event.target, this.elm)) {
                this.elm.style.webkitTransition = "all 0s";
                this.ftouch = event.targetTouches[0];
               document.body.addEventListener('touchmove', this.onTouchMove,{ passive: false })
               document.body.addEventListener('touchend', this.onTouchEnd)
               document.body.classList.add('noaction')
            }
        },
        onTouchMove: function(event){
            this.ismove = true
            var mtouch = event.targetTouches[0];
            let ftouch = this.ftouch
            this.elm.style.webkitTransform = 'translateZ(0) translate('+(mtouch.pageX - ftouch.pageX)+'px,'+(mtouch.pageY - ftouch.pageY)+'px)';
            event.preventDefault();
        },
        onTouchEnd: function(){
            document.body.classList.remove('noaction')
            document.body.removeEventListener('touchmove', this.onTouchMove)
            document.body.removeEventListener('touchend', this.onTouchEnd)
            if (!this.ismove) {
                this.ismove = false
                return
            }
            
            this.ismove = false
            this.elm.style.webkitTransition = "all .1s";
            var lbc = this.elm.getBoundingClientRect();

            let right = (lbc.left + lbc.width/2) > this.wdw/2 ? this.margin : this.wdw - this.margin - lbc.width
            let bottom = lbc.bottom > this.wdh - this.margin ? this.margin : (lbc.top<this.margin ? this.wdh - this.margin - lbc.height : this.wdh - lbc.bottom)
            let trans = this.elm.style.transform
            let arr = trans && trans.match(/-*\d+(.\d+)*/g)
            if (arr && arr.length==3) {
                let trs = arr.map(item=>{return parseFloat(item)})
                this.elm.style.webkitTransform = 'translateZ(0) translate('+(trs[1] + (this.wdw - lbc.right - right))+'px,'+(trs[2] + (this.wdh - lbc.bottom - bottom))+'px)';
            }

            setTimeout(() => {
                this.elm.style.webkitTransition = "all 0s";
                this.elm.style.webkitTransform = 'none'
                this.elm.style.right = right + 'px'
                this.elm.style.bottom = bottom + 'px'
                this.ftouch = null
                this.locked = false;
            },110);
        }
    }
})

// 弹层排序弹框
Vue.component('pop-over-sort', {
    props: {
        data: {
            type: Array,
            default: []
        },
        sortValue: {
            type: [String, Number],
            default: ''
        },
        sortType: {
            type: [String, Number],
            default: ''
        },
        showText: {
            type: [String, Number],
            default: ''
        },
        weight: {
            type: Boolean,
            default: false
        },
        mark: {
            type: [String,Number,Object],
            default: ''
        }
    },
    template: `<div ref="dom" :class="['cm-sort-wp', {weight: weight}]" @click="toggleSort">
        <div class="csw-tx">{{showText||"请选择排序"}}</div>
        <div :class="['cm-sort-arr',{desc: sortType=='desc', asc: sortType=='asc'}]"></div>
        <pop-over :target="$refs.dom" v-model="show">
            <div class="cm-timesort-warp-ov">
                <div
                    :class="['ctw-item', 'after05', {active: sortValue==item.value}]"
                    v-for="(item, index) in data" :key="item.value"
                    @click="onChoose(item, index, data)"
                >
                    {{item.title}}
                </div>
            </div>
        </pop-over>
    </div>`,
    data: function() {
        return {
            activeValue: '',
            show: false
        }
    },
    watch: {
        sortValue: function(newv, oldv){
            if (newv!=this.activeValue) {
                this.activeValue = newv
            }
        }
    },
    mounted: function(){
        this.activeValue = this.sortValue||'';
    },
    methods: {
        toggleSort: function(){
            this.show = !this.show
        },
        onChoose: function(item, index, options){
            this.$emit('onselect', {mark: this.mark, data: item.value==this.activeValue ? undefined : item, index: index, options: options})
            this.show = false;
        },
        onChange: function(obj){
            for (let k in obj) {
                this[k] = obj[k]
            }
        }
    }
})

// pop-over 弹框定位
Vue.component('pop-over', {
    props: {
        className: {
            type: String,
            default: ''
        },
        value:{
            type :Boolean,
            default: false
        },
        target: {
            type: Node,
            default: false
        },
        mark: {
            type: [String,Number,Object],
            default: ''
        }
    },
    data: function(){
        return {
            popShow: null,
            randomName: 'top'+Math.ceil(Math.random()*9999999),
            wdw: 0,
            wdh: 0,
        }
    },
    template: `<div :class="['cm-pop-over', className, {show: popShow===true}]">
        <div class="cpo-bg" ref="top" @click="onHide"></div>
        <div class="cpo-cont" ref="cont">
            <div class="cpo-arr" ref="arr"></div>
            <slot></slot>
        </div>
    </div>`,
    watch: {
        value: function(newv, oldv){
            if (newv!=this.popShow) {
                this.onToggleShow(newv)
            }
        }
    },
    mounted: function(){
        this.wdw = window.innerWidth;
        this.wdh = window.innerHeight;
        if (this.value) {
            this.onToggleShow(true)
        }
        let target = this.target || document.body;
        target.appendChild(this.$el)
        if (this.value) {
            setTimeout(()=>{
                this.onToggleShow(this.value)
            },200)
        }
    },
    beforeDestroy: function(){
        let target = this.target || document.body;
        target.removeChild(this.$el)
    },
    methods: {
        onToggleShow: function(state){
            if (!this.target) return;
            if (state) {
                let rect = this.target.getBoundingClientRect()
                let contRect = this.$refs.cont.getBoundingClientRect();
                let margin = window.rem ? window.rem*.1 : 10;
                let isleft = rect.left + contRect.width < this.wdw
                let left = isleft ? rect.left : rect.left + rect.width - contRect.width
                let arrLeft = isleft ? rect.width/2 : contRect.width - rect.width/2

                let istop = rect.bottom + contRect.height + margin < this.wdh
                let top = istop ? rect.bottom + margin : rect.top - margin - contRect.height
                this.$refs.cont.classList[istop ? 'remove' : 'add']('abot')
                this.$refs.cont.style.left = left+ 'px';
                this.$refs.cont.style.top = top+ 'px';
                this.$refs.arr.style.left = arrLeft+ 'px';
                this.popShow = state;
                setBodyScroll(true, this.randomName)
                this.$emit('visible-change', {mark: this.mark, state: true})
            } else {
                this.popShow = state
                setBodyScroll(false, this.randomName)
                this.$emit('visible-change', {mark: this.mark, state: false})
            }
        },
        onHide: function(){
            this.$emit('input', false)
            this.$emit('close-with-click', {mark: this.mark, state: false, action:'click'})
        }
    }
})

window.SwipeCellPrev = null;
Vue.component('swipe-cell', {
    props: {
        className: {
            type: String,
            default: ''
        },
        mark: {
            type: [String,Number,Object],
            default: ''
        }

    },
    data: function() {
        return {
            hasBind: false,
            isDirey: null,
            start: null,
            isMove: false,
            canDragLeft: false,
            canDragRight: false,
            range: 0,
            old_range: 0,
            locked: false,
            randomKey: Math.ceil(Math.random()*100000000)
        }
    },
    template: `<div :class="['cm-swipe-cell',className]" ref="cell">
            <div class="csc-left flex" ref="left"><slot name="left"></slot></div>
            <div class="csc-middle" ref="swipe"><slot></slot></div>
            <div class="csc-right flex" ref="right"><slot name="right"></slot></div>
        </div>`,
    mounted: function(params) {
        let _this = this;
        if (!this.hasBind) {
            this.$refs.cell.addEventListener('touchstart',function(event) {
                if (_this.locked) return
                let touch = event.touches[0]
                _this.start = {x: touch.pageX, y: touch.pageY};
                if (window.SwipeCellPrev && window.SwipeCellPrev.key!=_this.randomKey) {
                    window.SwipeCellPrev.close()
                }
                _this.canDragLeft = _this.$slots.left ? true : false
                _this.canDragRight = _this.$slots.right ? true : false
                _this.$refs.swipe.style.webkitTransition = "all 0s";
                document.body.addEventListener('touchmove',_this.onTouchMove,{ passive: false })
                document.body.addEventListener('touchend',_this.onTouchEnd)
            })
            this.hasBind = true
        }
    },
    methods: {
        onTouchMove: function (event) {
            // console.log(event)
            let touch = event.touches[0]
            
            if (this.isDirey==null) {
                this.isDirey = Math.abs(touch.pageX - this.start.x) > Math.abs(touch.pageY - this.start.y) ? true : false
            }
            if (this.isDirey) {
                this.isMove = true
                event.preventDefault();
                this.range = touch.pageX - this.start.x
                let range = this.old_range + this.range
                if (range>0 && !this.canDragLeft) {
                    range = 0
                }
                if (range<0 && !this.canDragRight) {
                    range = 0
                }
                this.$refs.swipe.style.webkitTransform = 'translateZ(0) translate('+(range)+'px,0)';
            }
        },
        onTouchEnd: function (event) {
            document.body.removeEventListener('touchmove', this.onTouchMove)
            document.body.removeEventListener('touchend', this.onTouchEnd)

            if (this.isMove) {
                this.$refs.swipe.style.webkitTransition = "all .2s";
                this.isMove = false;
                this.locked = true;
                let range = this.old_range + this.range
                // 向右移动
                if (range>=0) {
                    if (range<30) {
                        // 关闭
                        this.old_range = 0;
                        window.SwipeCellPrev = null
                    } else {
                        window.SwipeCellPrev = {key: this.randomKey, close: this.onClose}
                        // 计算宽度
                        this.old_range = this.$refs.left.offsetWidth
                    }
                } else if (range<0) {
                    // 向左移动
                    if (range>-30) {
                        // 关闭
                        this.old_range = 0;
                        window.SwipeCellPrev = null
                    } else {
                        window.SwipeCellPrev = {key: this.randomKey, close: this.onClose}
                        // 计算宽度
                        this.old_range = -this.$refs.right.offsetWidth
                    }
                }
                this.$refs.swipe.style.webkitTransform = 'translateZ(0) translate('+(this.old_range)+'px,0)';
                setTimeout(()=>{
                    this.locked = false
                },220)
            }

            setTimeout(()=>{
                this.isDirey = null
                this.start = null
            },220)
        },
        onClose: function() {
            window.SwipeCellPrev = null;
            this.old_range = 0;
            this.locked = true;
            if (this.$refs.swipe && this.$refs.swipe.style) {
                this.$refs.swipe.style.webkitTransform = 'translateZ(0) translate(0,0)';
            }
            setTimeout(()=>{
                this.locked = false
            },220)
        }
    }
})

Vue.component('number-format', {
    props: {
        value: {
            type: [Number, String],
            default: 0
        },
        fixed: {
            type: Number,
            default: undefined
        },
        carryBit: {
            type: String,
            default: 'round'
        },
        separation: {
            type: Boolean,
            default: false
        },
        fixedUp: {
            type: Boolean,
            default: false
        },
        placeholder: {
            type: [String, Number],
            default: undefined
        }
    },
    template: `<template>{{result}}</template>`,
    mounted: function(){
        this.onResetNumber(this.value)
    },
    data: function(){
        return {
            result: ''
        }
    },
    watch: {
        value: function(newv, oldv){
            this.onResetNumber(newv)
        }
    },
    methods: {
        onResetNumber: function (value) {
            if (value==undefined) {
                // 未定义
                this.result = this.placeholder==undefined ? 0 : this.placeholder
            } else if (/^\*+$/g.test(value)) {
                // 无权限
                this.result = value
            } else {
                value = parseFloat(value);
                let carryBit = this.carryBit || 'round';
                let fixed = this.fixed==undefined ? 2 : this.fixed
                let separation = this.separation || false
                let fixedUp = this.fixedUp || false
                value = Math.floor(value * Math.pow(10, fixed + 1)) / Math.pow(10, fixed + 1);
                value = Math[carryBit](value * Math.pow(10, fixed)) / Math.pow(10, fixed);
                value = value + '';
                value = value.replace(/(\d{1,})((\.)(\d*))*/, function (origin, a, b, c, d) {
                    if (a && separation) {
                      // 千分位分割整数部分
                      a = a.replace(/\B(?=((\d{3})+\b))/g, ',');
                    }
                    if (fixedUp) {
                        !d ? d = new Array(fixed + 1).join('0') : d += new Array(fixed - d.length + 1).join('0')
                    }
                    return a + (d ? '.' + d : '');
                  },
                );
                this.result = value
            }
        }
    }
})

Vue.component('dxl-data-select', {
    props: { 
        data: Array,
        title: String,
        value: [String, Number],
        mode: {
            type: [String],
            default: 'single'
        }
    },
    template: `<div class="cm-dxl-action-sheet">
        <div class="das-title">{{title||""}}<div class="das-close" @click="cancel"></div></div>
        <div class="das-alist">
            <div :class="['das-item', {active: item.value==value}]" v-for="(item, index) in data" :key="item.id" @click="onChoose(index, item)">
                <div class="das-itil">{{item.title}}</div>
                <img src="./assets/images/check.png" class="das-check" v-if="item.value==value" />
            </div>
        </div>
    </div>`,
    methods: {
        // 取消
        cancel: function(){
            this.$emit('cancel')
        },
        // 选择
        onChoose: function(index, item) {
            if (this.mode=='single') {
                this.$emit('cancel')
                this.$emit('select', item, index)
            }
        }
    }
})