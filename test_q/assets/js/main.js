function isIphoneX() {
  const useragent = window.navigator.userAgent;
  const isx = !!(useragent.match(/iphone/i) && window.screen.height === 812 && window.screen.width === 375)
  if (isx) {
    document.body.classList.add('iphonex');
  }
  return isx;
}
isIphoneX();

// 获取随机键值
const RANDOMSTRING = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('');
const RANDOMSTRINGNUMBER = '0123456789';
function getRandomKey(len, type) {
  const templen = len || 10;
  const keys = [];
  if (type === 'phone') {
    keys.push('1');
  }
  for (let i = 0; i < templen; i += 1) {
    if (type === 'phone') {
      keys.push(RANDOMSTRINGNUMBER[Math.floor(Math.random() * 10)]);
    } else {
      keys.push(RANDOMSTRING[Math.floor(Math.random() * 62)]);
    }
  }
  return keys.join('');
};

// 获取页面参数
function getRequest(){
  var url = window.location.search,
      theRequest = {},
      str = '',
      para = [];
  if (url.indexOf("?") != -1) {
      str = url.substring(1);
      strs = str.split("&");
      for(var i = 0, len = strs.length; i < len; i ++) {
          para = strs[i].split("=");
          theRequest[para[0]] = decodeURIComponent( (para.length>=2)?para[1]:"");
      }
  }
  return theRequest;
};

// 输入框增加清除事件
function bindInputClear({ dom, onBlur, onInput}) {
  if (!dom) return;
  const input = dom.getElementsByClassName('ciw-input')[0];
  const clear = dom.getElementsByClassName('ciw-clear')[0];
  let value = '';
  if (!input) return;
  input.addEventListener('blur', function(event){
    let val = input.value || '';
    val = val.trim();
    if (value != val) {
      value = val;
      onBlur && onBlur(val);
      dom.classList[val.length ? 'add' : 'remove']('has-value');
    };
    setTimeout(function(){
      $(window).scrollTop($(window).scrollTop())
    },10)
  })
  input.addEventListener('input', function(event){
    let val = input.value || '';
    val = val.trim();
    dom.classList[val.length ? 'add' : 'remove']('has-value')
    onInput && onInput(val);
  })
  if (clear) {
    clear.addEventListener('click', function(){
      if (value && onInput) {
        onInput('');
      } else if (value && onBlur) {
        onBlur('');
      }
      value = '';
      input.value = '';
      dom.classList.remove('has-value')
    })
  }
}

$(function(){
  $('#J_logout').click(function(){
    Eui.dialog({
      type:'confirm',
      btnType: 'round',
      title: "提示",
      content: '确认取消此订单吗？该操作无法撤销！',
      confirmBtnTextAsync: '退出中···',
      onAsyncConfirm: function(close){
        $.ajax({
          type: "GET",
          url: "api/callback.json?v="+(new Date().getTime()),
          data: {},
          dataType: "json",
          success: function(res){
            if(res.code==0){
              setTimeout(() => {
                close(true)
                Eui.toast({message: '退出成功', type: 'success', onClose: function(){
                  console.log('do somethings')
                }});
              }, 1000);
            }
          }
        });
      },
    })
  })
})