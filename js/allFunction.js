
//获取元素的函数封装：
function $(selector,content){  
    var firstChar = selector.charAt(0);
    var obj = content||document;
    if(firstChar === "#"){
        return document.getElementById(selector.slice(1));
    }else if(firstChar === "."){
        var allElement = obj.getElementsByTagName("*");
        var arr = [];
        for(var i = 0; i < allElement.length; i++){
            var classNames = allElement[i].className.split(" ");
            for(var j = 0; j < classNames.length; j++){
                if(selector.slice(1) === classNames[j]){
                    arr.push( allElement[i]);
                    break;
                }
            }
        }
        return arr;
    }else{
        return obj.getElementsByTagName(selector);
    }
}

//getStyle函数封装：
function getStyle( obj,attr ){
    return obj.currentStyle? obj.currentStyle[attr] : getComputedStyle(obj)[attr];
}
         


//定时器的封装（自己）：
function doMove(obj, attr,step,target,callBack){//step为步长
    if(obj.moveTimer) return;
    var step = parseFloat(getStyle(obj,attr)) < target ? step : -step;
    clearInterval(obj.moveTimer);
    obj.moveTimer = setInterval(function(){
        var speed = parseFloat(getStyle(obj,attr)) + step;//speed为走过的长度
        if(speed > target && step > 0 || speed < target && step < 0){
            speed = target;
            clearInterval(obj.moveTimer);
            obj.moveTimer = null;
            obj.style[attr] = speed + 'px';
            if(callBack){
                callBack();
            }
        }else{
            obj.style[attr] = speed + 'px';                                 
        }
    },30)
}  

function addZero(m){
    return m < 10 ? "0"+m : m;
}
               

//抖函数的封装：
function shake(obj,attr,step,callBack){
    if(obj.timer) return;//该句判断，如果定时器没有关，就不往下执行，如果关了为false就往下执行
    var arr = [];
    for(var i = step; i > 0 ; i-=2){
    arr.push(-i,i);
    }
    arr.push(0);   //往数组里面添加内容                   
    var n = 0;                        
    var l = parseFloat(getStyle(obj,attr));
    obj.timer = setInterval(function(){                        
        obj.style[attr] = l + arr[n] + "px";
        n++;
        if(n > arr.length - 1){
            clearInterval(obj.timer);
            obj.timer = null;  //清理完之后，obj.timer的值为数字（是开过的定时器），需要给它赋值为null，在上面判断时候才能转化成false
            // alert(timer)
            if(typeof callBack === "function"){
                callBack();
            } 
        }
    },30)
}   

function countDown(iTime){//countDown倒计时
    var now = new Date();
    var future = new Date(iTime);
    var differ = (future.getTime() - now.getTime())/1000;//difference差值
    var iDay = Math.floor(differ/86400);
    var iHour = Math.floor(differ%86400/3600);
    var iMin = Math.floor(differ%86400%3600/60);
    var iSic = Math.floor(differ%60);
    var onOff = true;
    //如果时间超过了未来设置的时间点，那么把开关关闭掉
    if( differ <= 0 ) onOff = false;
    var json = {
        D:iDay,
        H:iHour,
        M:iMin,
        S:iSic,
        onOff:onOff
    }
    return json;
}


//节点函数封装
function first(element){
    var firstElement = element.firstElementChild || element.firstChild;
    if( !firstElement || firstElement.nodeType !== 1 ){
        return null
    }else{
        return firstElement;
    }
};
function last(element){
    var lastElement = element.lastElementChild || element.lastChild;
    if( !lastElement || lastElement.nodeType !== 1 ){
        return null;
    }else{
        return lastElement;
    }
};
function next(element){
    var nextElement = element.nextElementSibling || element.nextSibling;
    if( !nextElement || nextElement.nodeType !== 1 ){
        return null;
    }else{
        return nextElement;
    }
};
function prev(element){
    var prevElement = element.previousElementSibling || element.previousSibling;
    if( !prevElement || prevElement.nodeType !== 1 ){
        return null
    }else{
        return prevElement;
    }
};

//获取元素距离最近定位父级的偏移量
function getOffset( obj ){
    var left = 0, top = 0;
    var borderLeft = parseInt( getStyle(obj,"borderLeftWidth") );
    var borderTop = parseInt( getStyle(obj,"borderTopWidth") );
    borderLeft = isNaN( borderLeft )? 0 : borderLeft;
    borderTop = isNaN( borderTop )? 0 : borderTop
    while( obj ){
        var borderL = parseInt( getStyle(obj,"borderLeftWidth") );
        var borderT = parseInt( getStyle(obj,"borderTopWidth") );
        borderL = isNaN( borderL )? 0 : borderL;
        borderT = isNaN( borderT )? 0 : borderT;
        left += obj.offsetLeft+borderL;
        top += obj.offsetTop+borderT;             
        obj = obj.offsetParent;
    }
    return {
        left:left-borderLeft,
        top:top-borderTop
    };
}