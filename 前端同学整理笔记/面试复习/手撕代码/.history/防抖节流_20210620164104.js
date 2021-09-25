/*
 * @Author: army liu
 * @Date: 2021-06-20 16:20:24
 * @LastEditors: army liu
 * @LastEditTime: 2021-06-20 16:41:04
 * @FilePath: \手撕代码\防抖节流.js
 */
function throttle(fun, delay){
    let timer = null;
    let nowTime = new Date().getTime();
    return function(){
        let curTime = new Date().getTime();
        let remain = delay - (curTime - nowTime);
        let context = this;
        let args = arguments;
        clearTimeout(timer);
        if(remain <= 0){
            fun.apply(context, args)
            nowTime = new Date().getTime();
        }else{
            timer = setTimeout(fun, remain);
        }
    }
}
function debounce(fun, delay){
    let timer = null;
    let args = arguments;
    let context = this
    return function () {
        clearTimeout(timer)
        timer = setTimeout(function () { 
            fun.apply(context, args);
        }, delay)
    }
}