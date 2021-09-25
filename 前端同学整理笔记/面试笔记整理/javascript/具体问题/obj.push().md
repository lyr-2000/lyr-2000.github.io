问：以下代码会输出什么
```javascript
var obj = {
    '2': 3,
    '3': 4,
    'length': 2,
    'splice': Array.prototype.splice,
    'push': Array.prototype.push
}
obj.push(1)
obj.push(2)
console.log(obj)
```
结果微
```javascript
Object(4) [empty × 2, 1, 2, splice: ƒ, push: ƒ]
```

这里要明确的首先是push的用法，我们知道，push的作用是在数组尾部插入数值，而这个尾部的具体位置，实际上就取决于数组的length值，所以在上面的代码中，length等于2，我们使用push的时候会在key为2的位置插入一个数值且length值加1即
```javascript
obj[2] = 1
obj.length += 1
```
所以就会把原来的```obj['2']```替换掉，后面的```obj.push(2)```也是一样的道理
```javascript
obj[3] = 1
obj.length += 1
```
所以我们在上面执行完后，打印```obj.length```，得到的会是4

这就解释了，为什么最后返回的数组key为2的值为1，key为3的值为2，接下来的问题是，为什么会返回一个类数组

在一个对象有length属性和splice方法的时候，打印出这个对象就可以变为类数组

而这里的length属性的值必须为数字，splice只需要为一个方法即可，不需要一定使用数组的splice方法
这里可以看到控制台的相关代码[https://github.com/ChromeDevTools/devtools-frontend/blob/master/front_end/event_listeners/EventListenersUtils.js#L12]
![](https://user-gold-cdn.xitu.io/2020/3/20/170f85e78240a213?w=917&h=337&f=png&s=32266)