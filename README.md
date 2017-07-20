20170719

1.json遍历
var json = {a:1,b:2};
        for(var attr in json) {
            console.log(attr);//属性
            console.log(json[attr]);//属性值
        }

2.封装运动基本函数（多个属性）（传入一个属性对象json）
function animation(obj, json, fn) {
    //定时器timer绑定在对象obj上，清除定时器时不会互相影响
    clearInterval(obj.timer);
    obj.timer = setInterval(function () {
        var flag = true;//判断是否所有属性都到达目标值的标志
        var currentAttr;
        for (var attr in json) {
              /*若属性为透明度opacity，由于getStyle(obj, 'opacity')是小数，所以需要乘以100,由于parseFloat取值                 精度不准确，所以要用Math.round()四舍五入*/
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
	//若属性为透明度opacity,由于兼容性问题，且传入来的目标值为整数，需要写成以下两种方式
                obj.style.opacity = (currentAttr + speed)/100;//由于需要得到小数，所以需要除以100
                obj.style.filter = "alpha(opacity="+(currentAttr + speed)+")";
            }else if(attr == 'zIndex') {
	/*若属性值为z-index，则如果样式中没写，getStyle(obj,zIndex )得到是空值，parseInt后
	   得到是NaN，所以需要加以判断，如果为NaN，直接赋予目标值*/
                if(isNaN(currentAttr)){
                    obj.style.zIndex =  json[attr];
                }else{
                    obj.style.zIndex = (currentAttr + speed);
                }
            }else {
	//后面有单位“px”的
                obj.style[attr] = currentAttr + speed + "px";
            }
            /*    console.log(parseInt(getStyle(obj, "width")));*/
           //只要有一个属性没到达目标点，就不能停止定时器
            if (json[attr] != currentAttr) {
                flag = false;
            }
        }
        if (flag) {
            clearInterval(obj.timer);
           /*   alert("到位置了！");*/
           //当所有属性到达位置是，可以重新调用新的函数，如果存在才执行
            if (fn) {
                fn();
            }
        }
    }, 50)
}

3.多物体运动
//定时器timer绑定在对象obj上，只启动跟清除一个物体的定时器，其他物体的定时器不受影响
    clearInterval(obj.timer);

4.开机动画
链式动画，直接调用封装运动基本函数（多个属性）animation(obj, json, fn)可以实现

5.手风琴
box-sizing: border-box;//将边框设置在内部，不会增大宽度
先将每个li的宽度设置好，再把当前的li的宽度设置为（ul的宽度 - 其他li是数量*设置好的宽度）
  for (var i = 0; i < oLi.length; i++) {
        animation(oLi[i], {width: 50});
  }
   animation(this, {width: 800});

6.响应式（刷新时可看到图片在排版，同时调整屏幕大小时会改变每行的图片个数）
//设置偶数位li的样式
  ul li:nth-child(2n) {
            background: #999;
  }
//用json对象数组存取获取到的排好版之后每个li的位置（left跟top）
 var oPos = [];
for (var i = 0; i < oLi.length; i++) {
     oPos[i] = {left: oLi[i].offsetLeft, top: oLi[i].offsetTop};
}
//对每个li绝对定位，再运动到对应的位置去（若先绝对定位，会获取不到目标位置）
for (var i = 0; i < oLi.length; i++) {
     /*  alert();*/
    oLi[i].style.position = "absolute";
    animation(oLi[i], {left: oPos[i].left, top: oPos[i].top});
 }
//获取屏幕宽度
  var X = document.body.clientWidth || document.documentElement.clientWidth;
//根据屏幕宽度，设置每一行要放置多少个li
  for (var i = 0; i < oLi.length; i++) {
          //将定位改为"static"，移动屏幕时li间不会有空隙
          oLi[i].style.position = "static";
          if(X<640){//手机一行3个
               oLi[i].style.width = "33.333333%";
           }else if (X < 900) {//平板一行4个
               oLi[i].style.width = "25%";
           }else{//电脑一行6个
               oLi[i].style.width = "16.66666%";
           }
  }
改变宽度后，需要重新获取li的目标位置，在重新绝对定位，重新排版。

7.轮播
先将所有的图放在一个溢出隐藏的盒子的右边 left: 500px;，再把第一个放到盒子中  aLi[0].style.left = "0px";
切换到下一个方法：
将当前的图片向左移，把下一张图片放到盒子右边，再移到盒子中，由于动画实现慢，所以实际上，一开始当前图片向左移的时候，下一张图片就会立即跳到盒子右边再一起移到中间。
 oNextBtn.onclick = function () {
                animation(aLi[key],{left:-oBox.clientWidth});
                key++;//实现下一张图片运动
                key= key>= aLi.length ? 0 : key;//若超过图片个数，则下一张即为第一张
 	 aLi[key].style.left = oBox.clientWidth+"px";
                animation(aLi[key],{left:0});
     };
