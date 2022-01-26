// 过滤器和指令放在一个文件
// [过滤器] 格式化时间格式
Vue.filter('timeFormat', function(value, opts){
    let time = new eTime(value)
    return time.isValid() ? time.format(opts.format||'YYYY/MM/DD') : '--'
})

// [指令]输入框失去焦点时返回原位置
Vue.directive('inputblur',{
    bind: (el, binding, vnode)=>{
        let st = 0;
        el.addEventListener('focus',()=>{
            st = document.body.scrollTop
        })
        el.addEventListener('blur',()=>{
            setTimeout(()=>{
                window.scrollTo(0, st)
            },10)
        })
    }
})

// [指令]点击返回时触发
Vue.directive('back',{
    bind: (el, binding, vnode)=>{
        let st = 0;
        el.addEventListener('click',()=>{
            window.history.go(-1)
        })
    }
})
