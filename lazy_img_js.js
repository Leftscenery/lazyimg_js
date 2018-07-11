/*
使用方法：
    把需要加载的图片用<img src="../resource/10.jpg" alt="">方式加载到DOM中
    把需要延迟加载的图片放到class：lazyImg里
    激活
    LazyImg.load({
        loading_type:'bottom',
        loading_img: 'xxxx.jpg',
        loading_transition:false,
        loading_time: 500
    });

参数说明：
    loading_type：加载位置，当图片进入到哪里时候开始加载图片，有三个参数：bottom,top,middle
    loading_img：加载图片地址
    loading_transition：是否开启渐变加载
    loading_time：渐变加载时间，毫秒
*/

let LazyImg = (function () {
    var isCompatible;
    var holder;
    var winHeight;
    var winWidth;
    var winScrollTop;
    var plan;
    var _default;

    //函数赋值
    function initData() {
        isCompatible = ('getComputedStyle' in window);
        holder = getElementByClass('lazyImg');
        winHeight = document.documentElement.clientHeight || document.body.clientHeight;
        winWidth = document.documentElement.clientWidth || document.body.clientWidth;
        winScrollTop = document.documentElement.scrollTop || document.body.scrollTop;
        plan = [];
        _default = {
            loading_type: 'bottom',
            loading_img: 'https://img.zcool.cn/community/0142eb5992b0650000002129b61cfc.gif',
            loading_transition: true,
            loading_time: 500
        };
    }

    //设置默认值
    function changeDefault(options) {
        //更改默认值
        for (var key in _default) {
            (options !== undefined && options.hasOwnProperty(key)) ? _default[key] = options[key] : null;
        }
    }


    //工具函数
    function updateScroll() {
        winScrollTop = document.documentElement.scrollTop || document.body.scrollTop;
    }

    function getTargetLine(ele) {
        var baseLine = offset(ele).top;
        var eleHeight = ele.offsetHeight;
        switch (_default.loading_type) {
            case 'top':
                break;
            case 'middle':
                baseLine += eleHeight / 2;
                break;
            default:
                baseLine += eleHeight;
                break
        }
        return baseLine
    }

    function addEvent(obj, type, fn) {
        //IE兼容
        if (obj.attachEvent) {
            obj.attachEvent('on' + type, function () {
                fn.call(obj);
            })
        } else {
            obj.addEventListener(type, fn, false);
        }
    }

    function fade(ele, src) {
        let op = Number(window.getComputedStyle(ele, null)['opacity']);
        let step = 1/(_default.loading_time/17);
        console.log(step);
        ele.style.opacity = op;
        let timer = setInterval(function () {
            if (ele.style.opacity <= 0) {
                clearInterval(timer);
                ele.setAttribute('src', src);
                ele.removeAttribute('img-data');
                ele.style.background = '';
                ele.style.opacity = 0;
                //渐显
                let timer1 = setInterval(function () {
                    if (ele.style.opacity >= 1) {
                        ele.style.opacity = 1;
                        clearInterval(timer1);
                    }else{
                        ele.style.opacity = Number(ele.style.opacity) + step;
                    }
                }, 17);
            } else {
                ele.style.opacity -= 0.2;
            }
        }, 17)
    }


    var offset = function offset(ele) {
        let L = ele.offsetLeft;
        let T = ele.offsetTop;
        let parent = ele.offsetParent;
        while (parent) {
            if (!/MSIE 8/.test(window.navigator.userAgent)) {
                L += parent.clientLeft;
                T += parent.clientTop;
            }
            L += parent.offsetLeft;
            T += parent.offsetTop;
            parent = parent.offsetParent;
        }
        return {left: L, top: T}
    };

    //GetByClassName
    var getElementByClass = function getElementByClass(str, context) {
        context = context || document;
        if ('getElementsByClassName' in document) {
            return [...context.getElementsByClassName(str)];
        }
        //IE 6-8兼容
        str = str.trim().replace(/ +/g, '|');
        var result = []
        var childrenList = context.getElementsByTagName('*');
        reg = new RegExp('(^| +)(' + str + ')( +|$)');
        console.log(reg);
        for (var i = 0; i < childrenList.length; i++) {
            reg.test(childrenList[i].className) ? result.push(childrenList[i]) : null;
        }
        return result
    };

    //把img打包在div内部，替换默认加载图片，并把真实图片地址放到img-data属性下
    function replaceImg() {
        for (var i = 0; i < holder.length; i++) {
            var imgList = holder[i].getElementsByTagName('img');
            for (let j = 0; j < imgList.length; j++) {
                //设置属性
                var item = imgList[j];
                var src = imgList[j].getAttribute('src');
                item.setAttribute('src', "");
                item.setAttribute('img-data', src);
                item.style.background = `url(${_default.loading_img}) no-repeat center`;
                item.style.backgroundSize = 'contain';
                imgList[j].flg = false;
                plan.push(imgList[j]);
            }

        }
    }

    //懒加载实现
    function lazyLoad() {
        updateScroll();
        for (let i = 0; i < plan.length; i++) {
            if (!plan[i].flg) {
                var targetLine = getTargetLine(plan[i]);
                if ((winScrollTop + winHeight) >= targetLine) {
                    let newImg = new Image();
                    let src = plan[i].getAttribute('img-data');
                    newImg.src = src;
                    newImg.onload = function () {
                        plan[i].flg = true;
                        if (_default.loading_transition) {
                            fade(plan[i], src);
                        } else {
                            plan[i].setAttribute('src', src);
                            plan[i].removeAttribute('img-data');
                            plan[i].style.background = '';
                        }
                    };
                    newImg = null;
                }
            }
        }
    }

    //载入window 监听
    function loadEvent() {
        addEvent(window, 'scroll', function () {
            lazyLoad();
        });
        addEvent(window, 'resize', function () {
            lazyLoad();
        });
        addEvent(window, 'load', function () {
            lazyLoad();
        })
    }

    //更改inline
    function inlineDetect() {
        let imgSet = document.getElementsByTagName('img');
        for (let i = 0; i < imgSet.length; i++) {
            if (window.getComputedStyle(imgSet[i], null)['display'] === 'inline') {
                imgSet[i].style.display = 'inline-block';
            }
        }
    }

    //返回
    return {
        load: function (options) {
            initData();
            changeDefault(options);
            inlineDetect();
            replaceImg();
            loadEvent();
        }
    }
})();