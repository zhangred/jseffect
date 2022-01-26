
// 弹框筛选-标签类选择
Vue.component('screen-item-tag', {
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
        },
        leftTitle: {
            type: [String, Number],
            default: ''
        },
        rightText: {
            type: [String, Number],
            default: ''
        },
        multiple: {
            type: Boolean,
            default: false,
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
        tags: {
            type: Array,
            default: []
        },
        showType: {
            type: String,
            default: 'tiles'
        },
        showMore: {
            type: Boolean,
            default: false
        },
        showMoreText: {
            type: String,
            default: '查看全部'
        },
    },
    data: function(){
        return {
            inOpen: false,
            inValue: this.multiple ? this.value.concat([]) : this.value
        }
    },
    watch: {
        value: function(newv, oldv){
            this.inValue = this.multiple ? newv.concat([]) : newv
        }
    },
    computed: {
        chooseTags: function(){
            if (!this.tags || this.tags.length==0) return null
            if (this.inValue==undefined || this.inValue.length==0) return null
            let cvs = this.multiple ? this.inValue : [this.inValue]
            let rs = [];
            for (let i=0; i<this.tags.length; i++) {
                let it = this.tags[i];
                if (cvs.indexOf(it.value)>-1) {
                    rs.push(it)
                }
            }
            return this.multiple ? rs : rs[0]
        }
    },
    template: `<div>
        <div class="csp-toptil flex">
            <div class="csp-lefttil">{{leftTitle}}</div>
            <div class="csp-trig flex">
                <div class="csp-rtext">{{rightText||''}}</div>
                <div v-if="showType=='toggle'" @click="inOpen=!inOpen" :class="['csp-ropen', 'flex', {open: inOpen}]">
                    <span class="csp-ropen-ta">展开</span>
                    <span class="csp-ropen-tb">收起</span>
                    <img src="./assets/images/arr-d02.png" class="csp-ropen-arr" />    
                </div>
            </div>
        </div>
        <div :class="['csp-taglist', {hide: !inOpen && showType=='toggle'}]">
            <div
                :class="['csp-titem', {active: checkValue(item.value)}]"
                v-for="(item, index) in tags" :key="item.value"
                @click="onChoose(item, index, tags)"
            >
                {{item.title}}
            </div>
            <!--<div class="csp-tag-ep">暂无选项数据</div>-->
            <div class="csp-titem csp-more flex" v-if="showMore" @click="onMore">{{showMoreText}}</div>
        </div>
    </div>`,
    methods: {
        checkValue: function(val){
            if(this.multiple) {
                return this.inValue.indexOf(val) == -1 ? false : true
            } else  {
                return this.inValue==val
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
            this.$emit('value-change',{mark: this.mark, value: deepClone(this.inValue), name: this.name, multiple: this.multiple, tags: deepClone(this.chooseTags)})
        },
        onMore: function(){
            this.$emit('click-more',{mark: this.mark, value: deepClone(this.inValue), name: this.name, multiple: this.multiple, tags: deepClone(this.chooseTags)})
        }
    }
})

// 弹框筛选-选择类选择
Vue.component('screen-item-select', {
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
        },
        leftTitle: {
            type: [String, Number],
            default: ''
        },
        hide: {
            type: Boolean,
            default: false
        },
        rightText: {
            type: [String, Number],
            default: ''
        },
        value: {
            type: [String, Number, Array],
            default: undefined
        },
        placeholder: {
            type: String,
            default: '请选择'
        }, 
        options: {
            type: Array,
            default: []
        },
    },
    data: function(){
        return {
            inValue: this.multiple ? this.value.concat([]) : this.value
        }
    },
    watch: {
        value: function(newv, oldv){
            // console.log(4444,newv)
            this.inValue = this.multiple ? newv.concat([]) : newv;
        }
    },
    template: `<div :class="[{'csp-hide': hide}]">
            <div class="csp-toptil flex" @click="onClick">
                <div class="csp-lefttil">{{leftTitle}}</div>
                <div class="csp-trig flex">
                    <div :class="['csp-rtext', {'disalbed': (inValue==undefined||inValue.length==0)}]">{{rightText||placeholder}}</div>
                    <img src="./assets/images/arr-r02.png" class="csp-sel-arr" />
                </div>
            </div>
        </div>`,
    methods: {
        onClick: function(){
            this.$emit('click',{mark: this.mark, value: this.inValue, options: this.options, name: this.name})
        },
    }
})

// 弹框筛选-时间范围类选择
Vue.component('screen-item-time-range', {
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
        },
        leftTitle: {
            type: [String, Number],
            default: ''
        },
        value: {
            type: Array,
            default: []
        },
        keys: {
            type: Array,
            default: []
        },
        format: {
            type: String,
            default: "YYYY-MM-DD"
        },
        placeholder: {
            type: Array,
            default: ['最小时间','最大时间']
        }, 
        quickTag: {
            type: Array,
            default: []
        },
    },
    data: function(){
        return {
            inValue: (CUES.getType(this.value)!='array' || this.value.length!=2) ? [] : deepClone(this.value)
        }
    },
    watch: {
        value: function(newv, oldv){
            this.inValue = (CUES.getType(newv)!='array') ? [] : deepClone(newv)
        }
    },
    template: `<div>
            <div class="csp-toptil flex">
                <div class="csp-lefttil">{{leftTitle}}</div>
            </div>
            <div class="csp-time-gp flex">
                <div :class="['csp-time-warp', {'csp-time-canclear': inValue[0]}]">
                    <div class="csp-time-cover" @click="onClick(0,keys[0])"></div>
                    <div class="csp-time-clear" @click="onClear(0,keys[0])"></div>
                    <input class="csp-time-input" :value="inValue[0]" :placeholder="placeholder[0]||'最小时间'" />
                </div>
                <div class="csp-time-sp"></div>
                <div :class="['csp-time-warp', {'csp-time-canclear': inValue[1]}]">
                    <div class="csp-time-cover" @click="onClick(1,keys[1])"></div>
                    <div class="csp-time-clear" @click="onClear(1,keys[1])"></div>
                    <input class="csp-time-input" :value="inValue[1]"  :placeholder="placeholder[1]||'最小时间'" />
                </div>
            </div>
            <div v-if="quickTag && quickTag.length" class="csp-taglist csp-tm">
                <div
                    class="csp-titem"
                    v-for="(item, index) in quickTag" :key="item.value"
                    @click="onChoose(item)"
                >
                    {{item.title}}
                </div>
            </div>
        </div>`,
    methods: {
        onClick: function(idx, key){
            this.$emit('click',{
                mark: this.mark,
                value: deepClone(this.inValue),
                format: this.format,
                name: this.name,
                keys: this.keys,
                rangeIdx: idx,
                rangeKey: key
            })
        },
        onClear: function(idx, key){
            this.$emit('clear',{
                mark: this.mark,
                value: deepClone(this.inValue),
                format: this.format,
                name: this.name,
                keys: this.keys,
                rangeIdx: idx,
                rangeKey: key
            })
        },
        onChoose: function(item){
            this.$emit('click-quick',{mark: this.mark, quick: deepClone(item),keys: this.keys, value: deepClone(this.inValue), format: this.format, name: this.name})
        },
    }
})

// 弹框筛选-数字区间类选择
Vue.component('screen-item-number-range', {
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
        },
        keys: {
            type: Array,
            default: []
        },
        leftTitle: {
            type: [String, Number],
            default: ''
        },
        value: {
            type: Array,
            default: []
        },
        placeholder: {
            type: Array,
            default: ['最小值','最大值']
        }, 
    },
    data: function(){
        return {
            inValue: (CUES.getType(this.value)!='array' || this.value.length!=2) ? [] : deepClone(this.value)
        }
    },
    watch: {
        value: function(newv, oldv){
            this.inValue = (CUES.getType(newv)!='array' || newv.length!=2) ? [] : deepClone(newv)
        }
    },
    template: `<div>
            <div class="csp-toptil flex">
                <div class="csp-lefttil">{{leftTitle}}</div>
            </div>
            <div class="csp-time-gp flex">
                <div class="csp-time-warp"><input type="number" class="csp-time-input" v-model="inValue[0]" @input="onInput(0)" @blur="onBlur(0)" :placeholder="placeholder[0]||'最小时间'" /></div>
                <div class="csp-time-sp"></div>
                <div class="csp-time-warp"><input type="number" class="csp-time-input" v-model="inValue[1]" @input="onInput(1)" @blur="onBlur(1)" :placeholder="placeholder[1]||'最小时间'" /></div>
            </div>
        </div>`,
    methods: {
        onInput: function(idx){
            let val = this.inValue.map(item=>{return parseFloat(item)})
            val = val.map(item=>{
                return isNaN(item) ? undefined : item
            })
            this.$emit('input',{mark: this.mark, value: val, name: this.name, rangeIdx: idx, rangeKey: this.keys[idx],keys: this.keys})
        },
        onBlur: function(idx){
            let val = this.inValue.map(item=>{return parseFloat(item)})
            val = val.map(item=>{
                return isNaN(item) ? undefined : item
            })
            if (val[0]!=undefined && val[1]!=undefined && val[0]>val[1]) {
                if (idx==0) {
                    val[0] = val[1]
                } else if (idx==1) {
                    val[1] = val[0]
                }
                this.inValue = deepClone(val);
            }
            this.$emit('blur',{mark: this.mark, value: val, name: this.name, rangeIdx: idx, rangeKey: this.keys[idx],keys: this.keys})
        },
    }
})

// 全部品牌筛选
Vue.component('brand-list', {
    props: {
        value:{
            type :Boolean,
            default: false
        },
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
        },
        multiple: {
            type: Boolean,
            default: false,
        },
        list: {
            type: Array,
            default: []
        },
        values: {
            type: Array,
            default: []
        },
    },
    data: function(){
        return {
            inValue: (CUES.getType(this.values)!='array') ? [] : deepClone(this.values),
            key: '',
            showList: [],
            originData: [],
            elmList: [],
            elmListAo: [],
            aoData: {hasBind: false},
        }
    },
    watch: {
        values: function(newv, oldv){
            this.inValue = (CUES.getType(newv)!='array') ? [] : deepClone(newv)
        },
        list: function(newv) {
            let rs = newv.map(item=>{
                return {
                    ao: /[a-zA-Z]/.test(item[0]) ? item[0] : 'star',
                    title: item[0],
                    list: item[1]
                }
            })

            this.showList = deepClone(rs)
            this.originData = deepClone(rs)
            setTimeout(()=>{
                this.elmList = this.$refs.warp.getElementsByClassName('J_cm_p_item')
                this.elmListAo = this.$refs.warp.getElementsByClassName('J_cm_p_item_ao')
            },50)
        }
    },
    computed: {
        chooseTags: function(){
            if (!this.originData || this.originData.length==0) return null
            if (this.inValue==undefined || this.inValue.length==0) return null
            let cvs = this.multiple ? this.inValue : [this.inValue]
            let rs = [];
            for (let i=0; i<this.originData.length; i++) {
                if (!/^[a-zA-Z]{1}$/.test(this.originData[i].ao)){
                    continue
                }
                let list = this.originData[i].list;
                for (let k=0; k<list.length; k++) {
                    if (cvs.indexOf(list[k].value)>-1) {
                        rs.push(list[k])
                    }
                }
            }
            return this.multiple ? rs : rs[0]
        }
    },
    template: `<div class="cm-pinpai-pop flex" ref="warp">
                <div class="cpp-search">
                    <div class="cm-input-cont">
                        <input type="text" class="J_blurscroll cpp-ctrol" v-inputblur v-model="key" @change="onChange" placeholder="品牌关键字">
                        <a href="javascript:;" :class="['cm-ic-clear', {'focused': key.length}]" @click="onClear"></a>
                    </div>
                </div>
                <div class="cpp-list" ref="cont">
                    <div v-for="(item, index) in showList" :key="index" class="J_cm_p_item" :id="'J_pp_list_ao_'+(item.ao)">
                        <div :class="['cpp-aotil','cpp-aotil-'+item.ao]">{{item.title}}</div>
                        <div class="cpp-slist">
                            <div :class="['cpp-sitem', 'after05', {active: checkValue(sitem.id)}]" v-for="sitem in item.list" @click="onChooseItem(sitem)">{{sitem.name}}</div>
                        </div>
                    </div>
                    <loading :show="showList.length==0" status="empty"></loading>
                </div>
                <div class="cpp-aos flex">
                    <div ref="ao">
                        <div :class="['cpp-az','J_cm_p_item_ao','cpp-az-'+item.ao]" v-for="(item, index) in showList" :key="index" @click="onInview(item.ao)">{{item.ao}}</div>
                    </div>
                </div>
                <div class="cpp-bot-btn">
                    <btn-group-save v-on:reset="onScreenReset" v-on:save="onScreenSave"></btn-group-save>
                    <div class="pd-b20"></div>
                </div>
            </div>`,
    mounted: function(){
        // console.log(this.$refs.cont)
        let _this = this;
        let cont = this.$refs.cont
        setTimeout(()=>{
            this.elmList = this.$refs.warp.getElementsByClassName('J_cm_p_item')
            this.elmListAo = this.$refs.warp.getElementsByClassName('J_cm_p_item_ao')
        },50)
        this.$refs.cont.addEventListener('scroll',CUES.throttle(function(){
            let scrolltop = cont.scrollTop
            let idx = 0;
            let count = 0;
            if(!_this.elmList || _this.elmList.length==0) return
            for (let i=0; i<_this.elmList.length; i++) {
                let height = _this.elmList[i].scrollHeight
                count += height;
                if (count>scrolltop) {
                    idx = i;
                    break
                }
            }
            for (let i=0; i<_this.elmListAo.length; i++) {
                if (idx==i) {
                    _this.elmListAo[i].classList.add('active')
                } else {
                    _this.elmListAo[i].classList.remove('active')
                }
            }
        },200))

        this.$refs.ao.addEventListener('touchstart', ontouchstart)
        if (!this.aoData.hasBind) {
            this.$refs.ao.addEventListener('touchstart',function(event) {

                let touch = event.touches[0]
                let rect = _this.$refs.ao.getBoundingClientRect()
                _this.aoData.y = touch.pageY;
                _this.aoData.height = rect.height
                _this.aoData.top = rect.top
                
                document.body.addEventListener('touchmove',_this.onTouchMove,{ passive: false })
                document.body.addEventListener('touchend',_this.onTouchEnd)
            })
            this.aoData.hasBind = true
        }
    },
    methods: {
        checkValue: function(val){
            // val+=''
            if(this.multiple) {
                return this.inValue.indexOf(val) == -1 ? false : true
            } else  {
                return this.inValue==val
            }
        },
        onInview: function(id){
            let tar = document.getElementById('J_pp_list_ao_'+id)
            tar.scrollIntoView()
        },
        onChooseItem: function(item){
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
        // 搜索
        onChange: function(){
            // console.log(this.originData)
            let key = this.key;
            let list = [];

            for (let i=0; i<this.originData.length; i++) {
                let item = this.originData[i]
                let rs = {}
                rs.ao = item.ao
                rs.title = item.title
                rs.list = []

                for (let k=0; k<item.list.length; k++) {
                    if (item.list[k].title.toUpperCase().indexOf(key.toUpperCase())>-1) {
                        rs.list.push(item.list[k])
                    }
                }
                if (rs.list.length) {
                    list.push(rs)
                }
            }

            this.showList = list
        },
        onClear: function(){
            this.key = ''
            this.showList = this.originData
        },
        // 重置弹框筛选
        onScreenReset: function(){
            this.inValue = this.multiple ? [] : undefined;
        },
        // 保存筛选管理
        onScreenSave: function(){
            this.$emit('value-change',{mark: this.mark, value: deepClone(this.inValue), name: this.name, multiple: this.multiple, tags: deepClone(this.chooseTags)})
            this.$emit('input', false)
        },
        onTouchMove: function(event){
            let touch = event.touches[0]
            event.preventDefault();
            let range =  touch.pageY - this.aoData.top
            if(range<0) {
                range = 0
            }
            let u = this.aoData.height / this.showList.length
            let idx = Math.floor(range/u)
            if (idx>this.showList.length-1) {
                idx = this.showList.length-1;
            }
            if (this.showList[idx].ao!=this.aoData.ao) {
                this.aoData.ao = this.showList[idx].ao
                let tar = document.getElementById('J_pp_list_ao_'+this.aoData.ao)
                if (tar) {
                    tar.scrollIntoView()
                }
            }
        },
        onTouchEnd: function(){
            document.body.removeEventListener('touchmove', this.onTouchMove)
            document.body.removeEventListener('touchend', this.onTouchEnd)
        }
    }
})

// 二级分类弹框数据
Vue.component('product-category', {
    props: {
        value:{
            type :Boolean,
            default: false
        },
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
        },
        multiple: {
            type: Boolean,
            default: false,
        },
        list: {
            type: Array,
            default: []
        },
        values: {
            type: Array,
            default: []
        },
    },
    data: function(){
        return {
            inValue: this.multiple ? ((CUES.getType(this.values)!='array') ? [] : deepClone(this.values)) : this.values,
            key: '',
            subList: [],
            cateIdx: 0,
        }
    },
    watch: {
        values: function(newv, oldv){
            this.inValue = this.multiple ? ((CUES.getType(newv)!='array') ? [] : deepClone(newv)) : newv
        },
        list:function(){
            this.cateIdx = 0;
            if (this.list[0]) {
                this.subList = this.list[0][1]
            } else {
                this.subList = []
            }
        }
    },
    computed: {
        chooseTags: function(){
            if (!this.list || this.list.length==0) return null
            if (this.inValue==undefined || this.inValue.length==0) return null
            let cvs = this.multiple ? this.inValue : [this.inValue]
            let rs = [];
            let ided = [];
            for (let i=0; i<this.list.length; i++) {
                let list = this.list[i][1];
                for (let k=0; k<list.length; k++) {
                    if (cvs.indexOf(list[k].value)>-1 && ided.indexOf(list[k].value)==-1) {
                        ided.push(list[k].value)
                        rs.push(list[k])
                    }
                }
            }
            return this.multiple ? rs : rs[0]
        }
    },
    template: `<div class="cm-product-cate-pop flex">
                <div class="cpc-warp flex">
                    <div class="cpc-left">
                        <div :class="['cpc-l-item', {active: index==cateIdx}]" v-for="(item, index) in list" @click="onToggleCate(item, index)">{{item[0]}}</div>
                    </div>
                    <div class="cpc-right">
                        <div :class="['cpc-r-item', {active: checkValue(item.value)}]" v-for="item in subList" @click="onChooseItem(item)">{{item.title}}</div>
                    </div>
                </div>
                <div class="sp-bot-btn">
                    <btn-group-save v-on:reset="onScreenReset" v-on:save="onScreenSave"></btn-group-save>
                    <div class="pd-b20"></div>
                </div>
            </div>`,
    methods: {
        checkValue: function(val){
            if(this.multiple) {
                return this.inValue.indexOf(val) == -1 ? false : true
            } else  {
                return this.inValue==val
            }
        },
        onToggleCate: function(item, index){
            this.cateIdx = index
            this.subList = item[1]
        },
        onChooseItem: function(item){
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
        // 重置弹框筛选
        onScreenReset: function(){
            this.inValue = this.multiple ? [] : undefined;
        },
        // 保存筛选管理
        onScreenSave: function(){
            this.$emit('confirm',{mark: this.mark, value: deepClone(this.inValue), name: this.name, multiple: this.multiple, tags: deepClone(this.chooseTags)})
            this.$emit('input', false)
        },
    }
})

// 标签分类弹框数据
Vue.component('mark-list', {
    props: {
        value:{
            type :Boolean,
            default: false
        },
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
        },
        multiple: {
            type: Boolean,
            default: false,
        },
        list: {
            type: Array,
            default: []
        },
        values: {
            type: Array,
            default: []
        },
        showType: {
            type: String,
            default: 'toggleIn'
        },
        showCount: {
            type: Boolean,
            default: true
        }
    },
    data: function(){
        return {
            originData: deepClone(this.list),
            showList: deepClone(this.list),
            markNotIn: [],
            markIn: [],
            markChecked: [],
            key: ''
        }
    },
    watch: {
        values: function(newv, oldv){
            this.resetValue()
        },
        list:function(){
            this.showList = deepClone(this.list)
            this.originData = deepClone(this.list)
        }
    },
    mounted: function(){
        this.resetValue()
    },
    computed: {
        chooseTags: function(){
            if (!this.list || this.list.length==0) return null
            let rs;
            if (this.showType=='toggleIn') {
                rs = {marks_id_not_in: [], marks_id_in: []}
                if (this.markNotIn.length==0 && this.markIn.length==0) return null
                for (let i=0; i<this.list.length; i++) {
                    let item = this.list[i]
                    if (this.markNotIn.indexOf(item.value)>-1) {
                        rs.marks_id_not_in.push(item)
                    } else if (this.markIn.indexOf(item.value)>-1) {
                        rs.marks_id_in.push(item)
                    }
                }
            }
            if (this.showType=='checkbox') {
                rs = []
                for (let i=0; i<this.list.length; i++) {
                    let item = this.list[i]
                    if (this.markChecked.indexOf(item.value)>-1) {
                        rs.push(item)
                    }
                }
            }
            return rs
        }
    },
    template: `<div class="cm-marks-pop flex">
            <div class="cpp-search">
                <div class="cm-input-cont">
                    <input type="text" class="J_blurscroll cpp-ctrol" v-inputblur v-model="key" @change="onChange" placeholder="请输入标签名称">
                    <a href="javascript:;" :class="['cm-ic-clear', {'focused': key.length}]" @click="onClear"></a>
                </div>
            </div>
            <div class="cmp-warp">
                <div class="cmp-item after05 flex" v-for="item in showList" :key="item.value">
                    <div class="cmp-itil">{{item.title}}<span v-if="showCount">({{item.count||0}})</span></div>
                    <div v-if="showType=='toggleIn'" class="cmp-tog flex">
                        <div :class="['cmp-tbtn', {'active': checkValue(item.value, markNotIn)}]" @click="onToggleIn(item, false)">不看</div>
                        <div :class="['cmp-tbtn', {'active': checkValue(item.value, markIn)}]" @click="onToggleIn(item, true)">看</div>
                    </div>
                    <div v-if="showType=='checkbox'" class="cmp-check flex" @click="onToggleCheck(item)">
                        <div :class="['cmp-ckbtn', {'active': checkValue(item.value, markIn)}]"></div>
                    </div>
                </div>
            </div>
            <div class="sp-bot-btn">
                <btn-group-save v-on:reset="onScreenReset" v-on:save="onScreenSave"></btn-group-save>
                <div class="pd-b20"></div>
            </div>
        </div>`,
    methods: {
        resetValue: function(){
            let marknotin = []
            let markin = []
            let checked = []
            if (this.values && this.values.length) {
                for (let i=0; i<this.values.length; i++) {
                    if (this.values[i].not_in) {
                        marknotin.push(this.values[i].value)
                    } else if (this.values[i].in) {
                        markin.push(this.values[i].value)
                    } else if (this.values[i].checked) {
                        checked.push(this.values[i].value)
                    }
                }
            }
            this.markNotIn = marknotin
            this.markIn = markin
            this.markChecked = checked
        },
        checkValue: function(val, list){
            return list.indexOf(val) == -1 ? false : true
        },
        // 搜索
        onChange: function(){
            let key = this.key;
            let list = [];

            for (let i=0; i<this.originData.length; i++) {
                let item = this.originData[i]
                let rs = []
                if (item.title.toUpperCase().indexOf(key.toUpperCase())>-1) {
                    list.push(item)
                }
            }

            this.showList = list
        },
        onClear: function(){
            this.key = ''
            this.showList = this.originData
        },
        onToggleIn: function(item, state){
            let tarls = state ? this.markIn : this.markNotIn
            let othls = state ? this.markNotIn : this.markIn
            let idx = tarls.indexOf(item.value)
            if (idx==-1) {
                tarls.push(item.value)
            } else {
                tarls.splice(idx, 1)
            }
            let oidx = othls.indexOf(item.value)
            if (oidx>-1) {
                othls.splice(oidx, 1)
            }
        },
        onToggleCheck: function(item){
            let idx = this.markChecked.indexOf(item.value)
            if (idx==-1) {
                this.markChecked.push(item.value)
            } else {
                this.markChecked.splice(idx, 1)
            }
        },
        // 重置弹框筛选
        onScreenReset: function(){
            this.markNotIn = []
            this.markIn = []
            this.markChecked = []
        },
        // 保存筛选管理
        onScreenSave: function(){
            let tags = this.chooseTags
            if (this.showType=='toggleIn') {
                this.$emit('confirm',{
                    mark: this.mark, 
                    value: deepClone({
                        marks_id_not_in: this.markNotIn, 
                        marks_id_in: this.markIn
                    }), 
                    name: this.name, 
                    multiple: this.multiple, 
                    tags: deepClone({marks_id_not_in: tags.marks_id_not_in, marks_id_in: tags.marks_id_in})
                })
            } else if (this.showType=='checkbox') {
                this.$emit('confirm',{
                    mark: this.mark, 
                    value: deepClone(this.markChecked), 
                    name: this.name, 
                    multiple: this.multiple, 
                    tags: deepClone(tags)
                })
            }
            this.$emit('input', false)
        },
    }
})

// 少量数据类弹框数据
Vue.component('list-few', {
    props: {
        value:{
            type :Boolean,
            default: false
        },
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
        },
        multiple: {
            type: Boolean,
            default: false,
        },
        list: {
            type: Array,
            default: []
        },
        values: {
            type: Array,
            default: []
        },
        searchPlaceholder: {
            type: String,
            default: '搜索关键字'
        }
    },
    data: function(){
        return {
            originData: deepClone(this.list),
            showList: deepClone(this.list),
            inValue: this.inValue = this.multiple ? ((CUES.getType(this.values)!='array') ? [] : deepClone(this.values)) : this.values,
            key: ''
        }
    },
    watch: {
        values: function(newv, oldv){
            this.inValue = this.multiple ? ((CUES.getType(newv)!='array') ? [] : deepClone(newv)) : newv
        },
        list:function(){
            this.showList = deepClone(this.list)
            this.originData = deepClone(this.list)
        }
    },
    computed: {
        chooseTags: function(){
            if (!this.list || this.list.length==0) return null
            let rs=[];
            for (let i=0; i<this.list.length; i++) {
                let item = this.list[i]
                if (this.inValue.indexOf(item.value)>-1) {
                    rs.push(item)
                }
            }
            return rs;
        }
    },
    template: `<div class="cm-marks-pop flex">
            <div class="cpp-search">
                <div class="cm-input-cont">
                    <input type="text" class="J_blurscroll cpp-ctrol" v-inputblur v-model="key" @change="onChange" :placeholder="searchPlaceholder">
                    <a href="javascript:;" :class="['cm-ic-clear', {'focused': key.length}]" @click="onClear"></a>
                </div>
            </div>
            <div class="cmp-warp">
                <div :class="['cmp-item', 'cmp-item-few','after05', 'flex', {active: checkValue(item.value)}]" @click="onChooseItem(item)" v-for="item in showList" :key="item.value">
                    <div class="cmp-itil">{{item.title}}</div>
                    <div v-if="item.status==-1" class="cmp-forzen">冻结</div>
                    <img v-if="checkValue(item.value)" src="./assets/images/check01.png" class="cmp-ck" />
                </div>
                <loading :show="showList.length==0" status="empty"></loading>
            </div>
            <div class="sp-bot-btn">
                <btn-group-save v-on:reset="onScreenReset" v-on:save="onScreenSave"></btn-group-save>
                <div class="pd-b20"></div>
            </div>
        </div>`,
    methods: {
        checkValue: function(val){
            return this.inValue.indexOf(val) == -1 ? false : true
        },
        // 搜索
        onChange: function(){
            let key = this.key;
            let list = [];

            for (let i=0; i<this.originData.length; i++) {
                let item = this.originData[i]
                let rs = []
                if ((item.val || item.title).toUpperCase().indexOf(key.toUpperCase())>-1) {
                    list.push(item)
                }
            }
            this.showList = list
        },
        onClear: function(){
            this.key = ''
            this.showList = this.originData
        },
        onChooseItem: function(item){
            let idx = this.inValue.indexOf(item.value)
            if (idx==-1) {
                this.inValue.push(item.value)
            } else {
                this.inValue.splice(idx, 1)
            }
        },
        // 重置弹框筛选
        onScreenReset: function(){
            this.inValue = []
        },
        // 保存筛选管理
        onScreenSave: function(){
            this.$emit('confirm',{
                mark: this.mark, 
                value: deepClone(this.inValue), 
                name: this.name, 
                multiple: this.multiple, 
                tags: deepClone(this.chooseTags)
            })
            this.$emit('input', false)
        },
    }
})

// 少量数据类弹框数据
Vue.component('list-lot', {
    props: {
        value:{
            type :Boolean,
            default: false
        },
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
        },
        multiple: {
            type: Boolean,
            default: false,
        },
        list: {
            type: Array,
            default: []
        },
        recent: {
            type: Array,
            default: []
        },
        values: {
            type: Array,
            default: []
        },
        locked: {
            type: Boolean,
            default: true
        },
        recentLabel: {
            type: String,
            default: '最近使用'
        },
        normalLabel: {
            type: String,
            default: '全部'
        },
        searchPlaceholder: {
            type: String,
            default: '搜索关键字'
        },
    },
    data: function(){
        return {
            inList: deepClone(this.list),
            inRecent: deepClone(this.recent),
            inValue: this.inValue = this.multiple ? ((CUES.getType(this.values)!='array') ? [] : deepClone(this.values)) : this.values,
            key: '',
            oldKey: '',
            inLocked: true,
            isfirst: false
        }
    },
    watch: {
        values: function(newv, oldv){
            this.inValue = this.multiple ? ((CUES.getType(newv)!='array') ? [] : deepClone(newv)) : newv
        },
        list:function(){
            this.inList = deepClone(this.list)
        },
        recent: function(){
            this.inRecent = deepClone(this.recent)
        },
        locked: function(){
            this.inLocked = this.locked
        }
    },
    mounted: function(){
        if (this.inList && this.inList.length && !this.locked) {
            setTimeout(()=>{
                this.inLocked = false
            },50)
        }
    },
    computed: {
        chooseTags: function(){
            if (!this.list || this.list.length==0) return null
            let rs=[];
            let keys = []
            let list = this.inList.concat(this.inRecent)
            for (let i=0; i<list.length; i++) {
                let item = list[i]
                if (this.inValue.indexOf(item.value)>-1 && keys.indexOf(item.value)==-1) {
                    rs.push(item)
                    keys.push(item.value)
                }
            }
            return rs;
        }
    },
    template: `<div class="cm-marks-pop flex">
            <div class="cpp-search">
                <div class="cm-input-cont">
                    <input type="text" class="J_blurscroll cpp-ctrol" v-inputblur v-model="key" @change="onChange" :placeholder="searchPlaceholder">
                    <a href="javascript:;" :class="['cm-ic-clear', {'focused': key.length}]" @click="onClear"></a>
                </div>
            </div>
            <bottom-loading ref="dom" class-name="cmp-warp cmp-warp-cus" :locked="inLocked" v-on:callback="onGetBottom">
                <div>
                    <div class="cmp-tlabel cmp-used">{{recentLabel||"最近使用"}}</div>
                    <div class="cmp-empt" v-if="inRecent.length==0">暂无数据</div>
                    <div class="cmp-glist">
                        <div :class="['cmp-item', 'cmp-item-few','after05', 'flex', {active: checkValue(item.value)}]" @click="onChooseItem(item)" v-for="item in inRecent" :key="item.value">
                            <div class="cmp-itil">{{item.title}}</div>
                            <div v-if="item.status==-1" class="cmp-forzen">冻结</div>
                            <img v-if="checkValue(item.value)" src="./assets/images/check01.png" class="cmp-ck" />
                        </div>
                    </div>
                </div>
                <div>
                    <div class="cmp-tlabel">{{normalLabel||"全部"}}</div>
                    <div class="cmp-empt" v-if="inList.length==0">暂无数据</div>
                    <div class="cmp-glist b">
                        <div :class="['cmp-item', 'cmp-item-few','after05', 'flex', {active: checkValue(item.value)}]" @click="onChooseItem(item)" v-for="item in inList" :key="item.value">
                            <div class="cmp-itil">{{item.title}}</div>
                            <div v-if="item.status==-1" class="cmp-forzen">冻结</div>
                            <img v-if="checkValue(item.value)" src="./assets/images/check01.png" class="cmp-ck" />
                        </div>
                    </div>
                </div>
            </bottom-loading>
            <div class="sp-bot-btn">
                <btn-group-save v-on:reset="onScreenReset" v-on:save="onScreenSave"></btn-group-save>
                <div class="pd-b20"></div>
            </div>
        </div>`,
    methods: {
        checkValue: function(val){
            return this.inValue.indexOf(val) == -1 ? false : true
        },
        // 搜索
        onChange: function(){
            let key = this.key;
            if (key!=this.oldKey) {
                this.oldKey = key
                if (this.$refs.dom.$el) {
                    this.$refs.dom.$el.scrollTop = 0+'px'
                }
                this.$emit('loadevent',{isfirst: true, key: key})
            }
        },
        onClear: function(){
            this.key = ''
            this.oldKey = ''
            this.$refs.dom.$el.scrollTop = 0+'px'
            this.$emit('loadevent',{isfirst: true})
        },
        onChooseItem: function(item){
            let idx = this.inValue.indexOf(item.value)
            if (idx==-1) {
                this.inValue.push(item.value)
            } else {
                this.inValue.splice(idx, 1)
            }
        },
        // 重置弹框筛选
        onScreenReset: function(){
            this.inValue = []
        },
        // 保存筛选管理
        onScreenSave: function(){
            this.$emit('confirm',{
                mark: this.mark, 
                value: deepClone(this.inValue), 
                name: this.name, 
                multiple: this.multiple, 
                tags: deepClone(this.chooseTags)
            })
            this.$emit('input', false)
        },
        onGetBottom: function(){
            this.$emit('loadevent',{isfirst: false})
        }
    }
})