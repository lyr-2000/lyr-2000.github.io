```javascript
for(var i=0;i<5;i++){
    setTimeout(function(){
        console.log(i)
    },1000*i)
}
// 5 5 5 5 5
```

闭包解决
```javascript
function fn(i){
    setTimeout(function(){
        console.log(i)
    },1000*i)
}
for(var i=0;i<5;i++){
    fn(i)
}
// 0 1 2 3 4
```
立即执行函数解决
```javascript
for(var i=0;i<5;i++){
    setTimeout(function(j){
        return function(){
            console.log(j)
        }
    }(i),1000*i)
}
// 0 1 2 3 4
```
let解决
```javascript
for(let i=0;i<5;i++){
    setTimeout(function(){
        console.log(i)
    },1000*i)
}
// 0 1 2 3 4
```