const IMGUPLOAD = {
    data: {
        token: '',
        domain: ''
    },
    getToken: async function(){
        if (this.data.token) {
            return {token: this.data.token, domain: this.data.domain}
        } else {
            rs = await axios.get('http://shop.dingyutech.com/api/mobile/token.json')
            if (rs && rs.data && rs.data.data && rs.data.errcode==200) {
                this.data.token = rs.data.data.token||''
                this.data.domain = rs.data.data.domain || ''
            }
            return {token: this.data.token, domain: this.data.domain}
        }
    },
    fileToBase64: function(file) {
        const reader = new FileReader();
        return new Promise((resolve, reject) => {
            reader.addEventListener("load", () => resolve(reader.result));
            reader.readAsDataURL(file);
        });
    },
    getRandomKey: function(len){
        var chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('');
        len = len||20;
        let keys = []
        for (let i=0; i<len;i++) {
            keys.push(chars[Math.floor(Math.random()*62)])
        }
        return keys.join('')
    },
    upload: async function(opts){
        let updata
        let ise = false
        try {
            updata = await this.getToken();
        } catch {
            ise = true
            opts.onError && opts.onError()
        }
        if (ise) return
        let file = opts.file
        let key = opts.key || this.getRandomKey()
        const observable = qiniu.upload(file, key, updata.token);
        const next = function(response) {
            let val = response.total.percent || 0;
            val = Math.floor(val)
            opts.onProgress && opts.onProgress(val)
        };
        const error = async function(error) {
            opts.onError && opts.onError()
        };
        const complete = function(response) {
            response.domain = updata.domain
            opts.onComplete && opts.onComplete(response)
        };
        observable.subscribe(next, error, complete);
    }
}