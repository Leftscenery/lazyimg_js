var utils = (function () {
    // win：获取和设置可视窗口的属性
    var winBox = function winBox(attr,value){
        if(value == undefined){
            return document.documentElement[attr] || document.body[attr]
        }
        document.documentElement[attr]=value;
        document.body[attr]=value;
        return;
    }

    // offset:找到当前元素距离body的偏移量
    var offset = function offset (ele){
        let L = ele.offsetLeft;
        let T = ele.offsetTop;
        let parent = ele.offsetParent;
        while(parent){
            if(!/MSIE 8/.test(window.navigator.userAgent)){
                L+=parent.clientLeft;
                T+=parent.clientTop;
            }
            L+=parent.offsetLeft;
            T+=parent.offsetTop;
            parent= parent.offsetParent;
        }
        return {left:L,top:T}
    };

    // getCss：获取元素的CSS属性
    var getCss = function getCss(curEle, attr) {
        var value = null,
            reg = null;
        if ('getComputedStyle' in window) {
            value = window.getComputedStyle(curEle, null)[attr];
        } else {
            //处理IE中的opcatiy
            if (attr == 'opacity') {
                value = curEle.curentStyle['filter'];
                reg = /^alpha\(opacity = (.+)\)$/;
                reg.test(value) ? value = reg.exec(value)[1] / 100 : value = 1;
                return value
            } else {
                value = curEle.currentStyle[attr];
            }
        }

        //去除单位（复合值可用）
        reg = /^-?\d+(\.\d+)?(px|pt|rem|em)?$/i;
        reg.test(value) ? value = parseFloat(value) : null;
        return value
    }

    // setCss：设置CSS样式
    var setCss = function setCss(curEle,attr,value){
        //opacity属性
        if(attr == 'opacity'){
            curEle.style.opacity = value;
            curEle.style.filter = 'alpha(opacity=' + value * 100 + ')';
            return
        }
        //除了zIndex、zoom、lineheight、forWeight其他都要添加属性
        !isNaN(value) && !/zIndex|zoom|lineHeight|fontWeight/i.test(value) ? value += 'px' : null
        curEle['style'][attr] = value;
    }

    // setGroupCss：用键值对设置CSS样式
    var setGroupCss = function setGroupCss(curEle,options){
        //判断option是不是obj
        if(Object.prototype.toString.call(options) !== '[object Object]') return;
        for (key in options){
                //opacity属性
                if(key == 'opacity'){
                    curEle.style.opacity = options[key];
                    curEle.style.filter = 'alpha(opacity=' + options[key] * 100 + ')';
                    return
                }
                //除了zIndex、zoom、lineheight、forWeight其他都要添加属性
                !isNaN(options[key]) && !/zIndex|zoom|lineHeight|fontWeight/i.test(options[key]) ? options[key] += 'px' : null
                curEle['style'][key] = options[key];
        }
    }

    //CSS：总方法
    var css = function css(){
        switch(arguments.length){
            case 3:
                setCss.apply(null,arguments);
                break;
            case 2:
                if(Object.prototype.toString.call(arguments[1]) == '[object Object]'){
                    setGroupCss.apply(null,arguments);
                }else{
                    return getCss.apply(null,arguments)
                }
                break;
            default:
                break;
        }
    };

    //getRandom：获取随机数
    var getRandom = function getRandom (m,n) {
        n=Number(n);
        m=Number(m);
        if(!isNaN(n) && !isNaN(m)){
            m<n ? [m,n] = [n,m] : null;
            return Math.round(Math.random()*(m-n)+n);
        }
    };

    //GetByClassName
    var getElementByClass = function getElementByClass(str,context){
        context = context || document;
        if('getElementsByClassName' in document){
            return [...context.getElementsByClassName(str)];
        }
        //IE 6-8兼容
        str = str.trim().replace(/ +/g,'|');
        var result = []
        var childrenList = context.getElementsByTagName('*');
        reg = new RegExp('(^| +)('+str+')( +|$)');
        console.log(reg);
        for(var i=0 ; i < childrenList.length; i++){
            reg.test(childrenList[i].className) ? result.push(childrenList[i]) : null;
        }
        return result
    };


    return {
        winBox,
        offset,
        getCss,
        setCss,
        setGroupCss,
        css,
        getRandom,
        getElementByClass
    };
})();