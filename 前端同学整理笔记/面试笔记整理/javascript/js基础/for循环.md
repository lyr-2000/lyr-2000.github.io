## for-in
for-in循环一般用于遍历对象中的key
```javascript
var arr = [1,2,3]
for(let i in arr){
    console.log(i)
}
// 0 1 2

var obj = {a:1,b:2}
for(let i in obj){
    console.log(i)
}
// a b
```
## for-of
for-of循环也可用于一个有Iterator的对象
```javascript
var arr = [1,2,3]
for(let i of arr){
    console.log(i)
}
// 1 2 3
```