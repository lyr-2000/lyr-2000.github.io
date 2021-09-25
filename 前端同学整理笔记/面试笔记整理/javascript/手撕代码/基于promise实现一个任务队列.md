基于promise实现一个并发数为N的队列


```javascript
// @params n number 并发数
// @params arr 任务数组
// @params time 延迟执行时间
// @params fn 执行的方法
function Handle(n,arr){
    this.arr = arr
    while(n--){
        this.next()
    }
}

Handle.prototype.next = function(){
    if(this.arr.length>0){
        let task = this.arr.shift()
        setTimeout(function(){
            task.fn()
            this.next()
        },task.time)
    }
}

new Handle(3,arr)
```

```javascript
function queueHandle(n,arr){
    if(n < 1 || !Array.isArray(arr)) {
        return
    }
    let a = Array.from(arr)
    function next() {
        if(a.length>0) {
            let task = a.shift()
            setTimeout(function() {
                typeof task.fn === "function"?task.fn():""
                next()
            }, task.time)
        }
    }
    while(n--) {
        Promise.resolve().then(() => {
            next()
        })
    }
}
```