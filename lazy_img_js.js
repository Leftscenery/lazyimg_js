/*
使用方法：
    把需要加载的图片用<img src="../resource/10.jpg" alt="">方式加载到DOM中
    把需要延迟加载的图片放到class：lazyImg里
    激活
    LazyImg.load({
        loading_mode: 'range'
        loading_type:'bottom',
        loading_img: 'xxxx.jpg',
        loading_transition:false,
        loading_time: 500
    });

参数说明：
    loading_mode：使用模块化加载模式。
                    'range'：用于范围，把需要加载的图片包在class=lazyImg块内即可。
                    'global'：用于全局，把所有img标签都加载。
                    'img'：用于单张，需要把想要延迟加载的图片加上class=lazyImg即可。
    loading_type：加载位置，当图片进入到哪里时候开始加载图片。
                    'top'：只要图片即将进入到屏幕中就加载
                    'middle'：当图片的一半进入到屏幕中时候加载
                    'bottom'：当图片完全进入屏幕中时加载
    loading_img：加载图片地址
    loading_transition：是否开启渐变加载
    loading_time：渐变加载时间，毫秒为单位
*/

let LazyImg = (function () {
    var isCompatible;
    var holder;
    var winHeight;
    var winWidth;
    var winScrollTop;
    var plan;
    var _default;

    //--------------tools----------------
    //scroll detect
    function updateScroll() {
        winScrollTop = document.documentElement.scrollTop || document.body.scrollTop;
    }

    //calculate image value
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

    //DOM2 event
    function addEvent(obj, type, fn) {
        //IE
        if (obj.attachEvent) {
            obj.attachEvent('on' + type, function () {
                fn.call(obj);
            })
        } else {
            obj.addEventListener(type, fn, false);
        }
    }

    //image transition
    function fade(ele, src) {
        let op = Number(window.getComputedStyle(ele, null)['opacity']);
        let step = 0.8/(_default.loading_time/17);
        console.log(step);
        ele.style.opacity = op;
        let timer = setInterval(function () {
            if (ele.style.opacity <= 0.2) {
                clearInterval(timer);
                ele.setAttribute('src', src);
                ele.removeAttribute('img-data');
                ele.style.background = '';
                //fake change point
                ele.style.opacity = 0.2;
                //transition
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

    //calculate any element to whole page distance
    function offset(ele) {
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

    //GetByClassName（all platform）
    function getElementByClass(str, context) {
        context = context || document;
        if ('getElementsByClassName' in document) {
            return [...context.getElementsByClassName(str)];
        }
        //IE 6-8
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
    //--------------tools end----------------


    //init
    function initData() {
        isCompatible = ('getComputedStyle' in window);
        holder = getElementByClass('lazyImg');
        winHeight = document.documentElement.clientHeight || document.body.clientHeight;
        winWidth = document.documentElement.clientWidth || document.body.clientWidth;
        winScrollTop = document.documentElement.scrollTop || document.body.scrollTop;
        plan = [];
        _default = {
            loading_mode: 'range',
            loading_type: 'bottom',
            loading_img: 'https://img.zcool.cn/community/0142eb5992b0650000002129b61cfc.gif',
            loading_transition: true,
            loading_time: 500
        };
    }

    //set default attr
    function changeDefault(options) {
        //change default attr
        for (var key in _default) {
            (options !== undefined && options.hasOwnProperty(key)) ? _default[key] = options[key] : null;
        }
    }

    //put img in div, replace default loading img then put real image url to img-data attr.
    function replaceImg() {
        if(_default.loading_mode === 'range'){
            for (var i = 0; i < holder.length; i++) {
                var imgList = holder[i].getElementsByTagName('img');
                for (let j = 0; j < imgList.length; j++) {
                    //set attr
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
        }else if(_default.loading_mode === 'image'){
            for (var j = 0; j < holder.length; j++) {
                //set attr
                var item = holder[j];
                var src = holder[j].getAttribute('src');
                item.setAttribute('src', "");
                item.setAttribute('img-data', src);
                item.style.background = `url(${_default.loading_img}) no-repeat center`;
                item.style.backgroundSize = 'contain';
                holder[j].flg = false;
                plan.push(holder[j]);
            }
        }else if(_default.loading_mode === 'global'){
            holder = document.getElementsByTagName('img');
            for (var j = 0; j < holder.length; j++) {
                //set attr
                var item = holder[j];
                var src = holder[j].getAttribute('src');
                item.setAttribute('src', "");
                item.setAttribute('img-data', src);
                item.style.background = `url(${_default.loading_img}) no-repeat center`;
                item.style.backgroundSize = 'contain';
                holder[j].flg = false;
                plan.push(holder[j]);
            }
        }
    }

    //lazy image main function
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

    //window listener
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

    //change inline
    function inlineDetect() {
        let imgSet = document.getElementsByTagName('img');
        for (let i = 0; i < imgSet.length; i++) {
            if (window.getComputedStyle(imgSet[i], null)['display'] === 'inline') {
                imgSet[i].style.display = 'inline-block';
            }
        }
    }

    //export
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