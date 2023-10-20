function fileToBase64(opts){
    let file = opts.file;
    let text = opts.text;
    let url = opts.url;
    let type = opts.type || 'text'; // text file url
    let rotate = opts.rotate === undefined ? - 30 : opts.rotate;
    let fontSize = opts.fontSize === undefined ? 28 : opts.fontSize;

    let dom = document.getElementById('FILETOBASE64');
    let canvas;
    let canvasContext;
    if (!dom) {
        dom = document.createElement('div');
        dom.innerHTML = '<canvas style="position: absolute; left:0; top: 0;"></canvas>'
        // dom.setAttribute('style', 'opacity:1; position: fixed; left: 0; top: 0; overflow: hidden;');
        document.body.append(dom);
    };
    canvas = dom.getElementsByTagName('canvas')[0];
    canvasContext = canvas.getContext("2d");

    if (type === 'text') {
        // 解析文本获取文本展示区域宽高
        let div = document.createElement('div');
        div.setAttribute('style', `white-space:nowrap;position: absolute; left:0; top: 0; z-index:2;font-size:${fontSize}px;line-height:${fontSize}px;transform:rotate(${rotate}deg)`);
        div.innerHTML = text;
        dom.append(div)
        let rect = div.getBoundingClientRect();
        canvas.setAttribute('width',rect.width + 80);
        canvas.setAttribute('height',rect.height + 80);
        canvasContext.font= fontSize+"px Arial";
        canvasContext.textBaseline = "top";
        canvasContext.fillStyle = '#ddd';
        canvasContext.save();
        canvasContext.translate(fontSize / 2, rect.height)
        canvasContext.rotate(rotate * Math.PI / 180)
        canvasContext.fillText(text, 0, -fontSize /2)
        canvasContext.restore();
        if (opts.success) {
            opts.success(canvas.toDataURL())
        }
    } else if (type === 'url') {
        let img = new Image();
        img.crossOrigin = 'anonymous';
        img.onload = function(){
            imgToBase64({
                img: this,
                width: this.width,
                height: this.height,
                success: function(res){
                    if (opts.success) {
                        opts.success(res)
                    }
                }
            })
        }
        img.src = url;
    } else if (type === 'file') {
        var reader = new FileReader(); 
        reader.readAsDataURL(file); 
        reader.onload=function(e){
            var ni = new Image;
            ni.src = this.result;
            ni.onload = function(){
                imgToBase64({
                    img: this,
                    width: this.width,
                    height: this.height,
                    success: function(res){
                        if (opts.success) {
                            opts.success(res)
                        }
                    }
                })
            }
        } 
    }
    // img转base64
    function imgToBase64(opts) {
        
        let canvas_width = opts.width, canvas_height = opts.height;// 画布大小
        let canvas_startX = 0, canvas_startY = 0; // 画布开始-结束坐标
        if (opts.width > opts.height && opts.width > 400) {
            canvas_width = 400;
            canvas_height = 400 * opts.height / opts.width;
            console.log(44445566)
        } else if (opts.height > opts.width && opts.height > 400) {
            canvas_height = 400;
            canvas_width = 400 * opts.width / opts.height;
            console.log(4444, canvas_height, canvas_width);
        }

        canvas.setAttribute('width', canvas_width);
        canvas.setAttribute('height', canvas_height);
        // 
        console.log(opts.width, opts.height)
        canvasContext.drawImage(opts.img,canvas_startX,canvas_startY,canvas_width,canvas_height); 
        setTimeout(() => {
            if (opts.success) {
                opts.success(canvas.toDataURL())
            }
        }, 100)
    }
}

window.fileToBase64 = fileToBase64;

