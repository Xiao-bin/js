/**
 * Created by 123 on 2017/2/15.
 */



//封装滚屏scroll
function scroll() {
    //谷歌浏览器
    if(document.body.scrollTop || document.body.scrollLeft){
        return{
            top:document.body.scrollTop,
            left:document.body.scrollLeft
        }
    }
    //其他浏览器
    else{
        return{
            top:document.documentElement.scrollTop,
            left:document.documentElement.scrollLeft
        }
    }
}
//封装可视区宽高
function client() {
    if(document.body.clientWidth){
        return {
            clientWidth:document.body.clientWidth,
            clientHeight:document.body.clientHeight
        }
    }else{
        return {
            clientWidth:document.documentElement.clientWidth,
            clientHeight:document.documentElement.clientHeight
        }
    }
}
//封装id选择器
function $(id) {
    return document.getElementById(id);
}

/* oBox.style.background="red";*/
/* var oLi=oBox.getElementsByClassName("box1");*/
//封装className选择器
function getClassName(classname,father) {
    if(document.getElementsByClassName){//判断浏览器是否兼容
        return document.getElementsByClassName(classname);//不兼容ie8以下
    }
    else{
        var dom=father.getElementsByTagName("*");//获取父类中所有标签
        var arr=[];
        //不足：只能获取className完全等于classname的标签
        /* for(var i=0; i<dom.length; i++){
         if(dom[i].className == classname)
         arr.push(dom[i]);//将符合条件的标签推进我们想要的数组里
         }*/
        for(var i=0; i<dom.length; i++){
            var textArr=dom[i].className.split(" ");//对获取到的标签的className通过" "分开成数组
            for(var j=0; j<textArr.length; j++){
                if(textArr[j] == classname)//只要className分割后的数组中含有classname,就将这个标签推进我们想要的数组里
                {
                    arr.push(dom[i]);
                    break;
                }
            }
        }
        return arr;
    }
}
//封装轮播图初始化
function init(oLi,olLi) {
    for(var j=0; j<olLi.length; j++){
        oLi[j].style.display="";
        olLi[j].className="";
    }
    oLi[num].style.display="block";
    olLi[num].className="cur";
}
//隐藏对象
function hide(obj) {
    obj.style.display="none";
}
//显示对象
function show(obj) {
    obj.style.display="block";
}

//缓冲运动
function buffer(obj,iTarget,attr,offset){
    clearInterval(obj.timer);
    obj.timer = setInterval(function(){
        var speed = (iTarget - obj[offset])/10;

        speed = speed>0 ? Math.ceil(speed) : Math.floor(speed);
        /*  console.log(speed);*/
        if(speed == 0){
            clearInterval(obj.timer);
            return;
        }
        obj.style[attr]= obj[offset] + speed + "px";
    },30)
}

//获取任意样式
function getStyle(obj, attr) {
    if (obj.currentStyle) {//ie
        return obj.currentStyle[attr];
    } else {//谷歌
        return getComputedStyle(obj, null)[attr];
    }
}

//物体运动基本函数
function animation(obj, json, fn) {
    clearInterval(obj.timer);

    obj.timer = setInterval(function () {
        var flag = true;
        var currentAttr;
        for (var attr in json) {
            if (attr == 'opacity'){
                currentAttr = Math.round(parseFloat(getStyle(obj, attr)) * 100);
            }else
            {
                currentAttr = parseInt(getStyle(obj, attr));
            }


            iTarget = json[attr];
            speed = (iTarget - currentAttr) /10;
            /* console.log(iTarget-currentAttr);*/
            speed = speed > 0 ? Math.ceil(speed) : Math.floor(speed);

            if (attr == 'opacity'){
                /*  currentAttr =  json[attr];*/
                obj.style.opacity = (currentAttr + speed)/100;
                obj.style.filter = "alpha(opacity="+(currentAttr + speed)+")";
            }else if(attr == 'zIndex') {
                if(isNaN(currentAttr)){
                    obj.style.zIndex =  json[attr];
                }else{
                    obj.style.zIndex = (currentAttr + speed);
                }
            }else {
                obj.style[attr] = currentAttr + speed + "px";
            }
            /*    console.log(parseInt(getStyle(obj, "width")));*/
            if (json[attr] != currentAttr) {
                flag = false;
            }
        }
        if (flag) {
            clearInterval(obj.timer);
           /*   alert("到位置了！");*/
            if (fn) {
                fn();
            }
        }
    }, 50)
}