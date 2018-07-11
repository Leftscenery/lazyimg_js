document.write("<script src='utils.js'></script>");

~function(){
    var LazyImg = function (options) {
        //设置默认值
        var _default = {
            load_type: 'bottom',
            loading_img: 'http://img.lanrentuku.com/img/allimg/1212/5-121204193R0.gif',
            loading_time: 2
        };

        //给实例添加自定义属性
        for(var key in _default){
            (options!==undefined && options.hasOwnProperty(key)) ? this[key]=options[key] : this[key]=_default[key];
        }

        this.isCompatible = ('getComputedStyle' in window);
        this.holder = utils.getElementByClass('lazyImg');
        this.winHeight = document.documentElement.clientHeight || document.body.clientHeight;
        this.winWidth = document.documentElement.clientWidth || document.body.clientWidth;
        this.winScrollTop = document.documentElement.scrollTop || document.body.scrollTop;
        this.plan = [];
        this.init();
    };

    LazyImg.prototype = {
        constructor: LazyImg,

        //工具函数
        updateScroll:function(){
            this.winScrollTop = document.documentElement.scrollTop || document.body.scrollTop;
        },
        getTargetLine:function(ele){
            var baseLine = utils.offset(ele).top;
            var eleHeight = ele.offsetHeight;
            switch(this.load_type){
                case 'top':
                    break;
                case 'middle':
                    baseLine += eleHeight/2;
                    break;
                default:
                    baseLine += eleHeight;
                    break
            }
            return baseLine
        },
        addEvent:function addEvent(obj,type,fn){
            //IE兼容
            if(obj.attachEvent){
                obj.attachEvent('on'+type,function(){
                    fn.call(obj);
                })
            }else{
                obj.addEventListener(type,fn,false);
            }
        },

        //检测inline
        inlineDetect:function(){

        },
        //把img打包在div内部，替换默认加载图片，并把真实图片地址放到img-data属性下
        replaceImg:function(){
            for (var i = 0; i < this.holder.length; i++) {
                var imgList = this.holder[i].getElementsByTagName('img');
                //把resource替换成
                for (var j = 0; j < imgList.length; j++) {
                    var str = imgList[j].outerHTML;
                    if(str.search(/style/) !== -1){
                        str = str.replace(/src/,()=>{
                            return ('src="" img-data')
                        });
                        str = str.replace(/style="(.+)"/,(...arg)=>{
                            return ('style="background:url('+this.loading_img+ ') no-repeat center;'+arg[1]+'"')
                        });
                    }else{
                        str = str.replace(/src=/,()=>{
                            return ('src="" style="background:url('+this.loading_img+ ') no-repeat center" img-data=')
                        });
                    }
                    imgList[j].outerHTML = str;
                    this.plan.push(imgList[j]);
                }
            }
        },
        //懒加载实现
        lazyLoad:function(){
            var _this = this;
            this.updateScroll();
            for (let i = 0; i < this.plan.length; i++) {
                var targetLine = this.getTargetLine(this.plan[i]);
                if((this.winScrollTop+this.winHeight)>=targetLine){
                    var newImg = new Image();
                    newImg.setAttribute('src',this.plan[i].getAttribute('img-data'));
                    newImg.onload = (function(){
                        _this.plan[i].setAttribute('src',newImg.getAttribute('src'));
                        var str = _this.plan[i].outerHTML;
                        str = str.replace(/background:url\(.+center/,()=>{
                            return (' ');
                        });
                        _this.plan[i].outerHTML = str;
                        _this.plan[i].removeAttribute('img-data');
                    })();
                    newImg = null;
                    this.plan.splice(i,1);
                    i--;
                }
            }
        },
        //载入window onscroll函数
        loadEvent:function(){
            var _this = this;
            this.addEvent(window,'scroll',function(){
                _this.lazyLoad();
            });
        },
        //更改inline
        inlineDetect:function(){
            let imgSet = document.getElementsByTagName('img');
            for (let i = 0; i < imgSet.length; i++) {
                if(window.getComputedStyle(imgSet[i], null)['display']==='inline'){
                    imgSet[i].style.display='inline-block';
                }
            }
        },

        init:function () {
            this.inlineDetect();
            this.replaceImg();
            this.lazyLoad();
            this.loadEvent();
        }
    };

    window.LazyImgLoad = function (options) {
        return new LazyImg(options);
    };
}();