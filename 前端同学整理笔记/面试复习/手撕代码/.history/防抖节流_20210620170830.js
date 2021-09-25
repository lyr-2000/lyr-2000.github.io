/*
 * @Author: army liu
 * @Date: 2021-06-20 16:20:24
 * @LastEditors: army liu
 * @LastEditTime: 2021-06-20 17:08:30
 * @FilePath: \手撕代码\防抖节流.js
 */
function throttle(fun, delay){
    let context, timer, args;
    let startTime = new Date().getTime()
    let run = (remain) => {
        timer = setTimeout(() => {
            let now = new Date().getTime() - startTime;
            if(now < remain){
                startTime = remain;
                run(wait - remain)
            }else{
                fun.apply(context, args)
                clearTimeout(timer)
                timer = null;
            }
        },remain)
    }
    return function() {
        context = this;
        args = arguments;
        if(!timer){
            run(wait)
        }
    }
}
function debounce(fun, delay){
    let timer, context, args;
    var run = () => {
        timer = setTimeout(() => {
            fun.apply(context, args)
            clearTimeout(timer);
            timer = null;
        })
    }
    return function () {
       context = this;
       args = arguments;
       if(!timer){
           run();
       }
    }
}