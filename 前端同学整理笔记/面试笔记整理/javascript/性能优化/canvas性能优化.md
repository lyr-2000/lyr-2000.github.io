# 1. 离屏canvas渲染
2048小游戏时的应用：数字的出现其实就是2的n次方，每次某个数字第一次出现的时候，就在离屏的地方绘制一个数字，然后使用getImageData将其存放起来，在需要该数字的时候将其使用putImageData放进去
具体的做法是，实现一个对象如下
```javascript
// 初始化一个对象
var numsCanvas = {}
// 绘制的操作
if(!numsCanvas[num]){ // 判断之前是否有该属性
    // 在没有的情况下绘制该数字，将其存放在numsCanvas[num]中
    asCanvas.width = asCanvas.width // 清空离屏canvas
    asContext.drawText(num) // 在离屏canvas上绘制数字，drawText是我自己写的方法
    numsCanvas[num] = asContext.getImageData(0,0,asCanvas.width,asCanvas.height)
}
context.putImageData(numsCanvas[num],x,y) // 将存储起来的数字放到主canvas中
```

统计图的绘制应用：算是一个类似缓存的机制，会将当前绘制的canvas图通过getImageData保存为一个对象，加上相应的数组保存到sessionStorage中，如果此次刷新的时候数据未发生变化，就直接将保存起来的对象使用putImageData绘制到canvas上，减少了绘制的时间


# 2. 分层画布
2048小游戏时的应用：背景不变，数字经常发生变化，所以分成前后两个画布来渲染

# 3. 清空画布的选择  
经过实际的测试，性能的排序从低到高（消耗时间从多到少）应该是
```javascript
context.width = canvas.width
context.fillRect()
context.clearRect()
```
这是在我之前模仿慕课网上一个时间跳动小球的动画上测试的，我将清除画布的操作放在方法clear里面，然后通过chrome浏览器的performance分别测试三种方法各自的时间消耗，结果如图

![](https://user-gold-cdn.xitu.io/2020/3/4/170a5cd6fc200903?w=881&h=250&f=png&s=23206)

![](https://user-gold-cdn.xitu.io/2020/3/4/170a5cf6ff0c37e3?w=857&h=235&f=png&s=17722)

![](https://user-gold-cdn.xitu.io/2020/3/4/170a5ce57ac6e3e9?w=920&h=206&f=png&s=20170)

上图只是我测试的三次结果，实际上这里的时间还会受到电脑当前状态的影响，所以我实际上还测试了很多次，才得到了上面的性能消耗顺序的结论


# 4. 减少使用canvas的API
对于一些canvas绘制图案，如果需要放大缩小的，直接采用css的方式，而尽量不使用canvas的API

# 5. 使用requestAnimationFrame来代替setInterval和setTimeout
使用cancelAnimationFrame来取消调用
其用法是传入一个回调函数，在这个回调函数内部再次使用requestAnimationFrame
```javascript
function render(){
    if(someReason){
        cancelAnimationFrame(timer)
        return;
    }
    // ...
    timer = requestAnimationFrame(render)
}


let timer = requestAnimationFrame(render)
```
值得一提的是，requestAnimationFrame和setTimeout，setInterval一样，都在promise.then之后执行  
按照MDN的描述
> 希望执行一个动画，并且要求浏览器在下次重绘之前调用指定的回调函数更新动画

## 为什么使用requestAnimationFrame比定时器好
虽然经过测试，我们能看到requestAnimationFrame的性能会更好，但我们还需要知道原理是什么

首先，setTimeout会受到当前正在执行的任务的影响，如果当前执行的任务耗时过久，即使已经到了执行setTimeout回调函数的时间，也会等到当前任务执行完才执行，因此我们无法使动画真的按我们想要的精确时间去实现   
此外，我们知道，动画的间隔时间越短，渲染就会花更多的性能，而时间过长，又会使动画不流畅，我们很难去估计动画的合理时间

而requestAnimationFrame动画的帧数是由系统根据当前页面的CPU来决定的，可以最大化地利用性能


### 1. 页面隐藏时处理不同
setTimeout实现的动画，即使页面被隐藏或者最小化，仍然会继续执行相关的动画，但是这实际上是无意义的，而requestAnimationFrame就能做到，当页面被隐藏或最小化的时候，暂停执行动画，回到页面时，从暂停的位置继续执行  

此外，还要注意一点，在使用setTimeout时，我们如果离开标签页，那么为了优化后台页面的加载损耗以及降低耗电量，每次的执行间隔都会在1000ms以上，我自己测试了下面的代码
```html
<body>
    <button onclick="fn()">start</button>
    <button onclick="stop()">stop</button>
    <script>
        let timmer

        function fn() {
            let count = 0
            for (let i = 0; i < 1000; i++) {
                count += i
            }
            timmer = setTimeout(fn, 200)
        }

        function stop() {
            clearTimeout(timmer)
        }
    </script>
</body>
```
我是使用performance测试的，先打开监控，然后点击start开始执行计时器，在3s后离开页面，然会回来看前3秒和后面时间的区别  
结果如下图
![](https://user-gold-cdn.xitu.io/2020/3/30/1712a833c913384f?w=1683&h=489&f=png&s=53994)
从时间轴上可以看到，在离开页面之前和回到页面之后，时间间隔可以看出差不多是200ms，而在离开页面回到页面之前，可以看出时间间隔明显变大了，而且大概是1000ms
### 2. setTimeout会受当前任务阻塞影响
当我们使用setTimeout去设定在一段时间执行一个回调函数的时候，实际上并不会真的在那个时间刚好执行任务，因为setTimeout会受当前任务影响，在当前任务执行完且到时间了，才会去执行回调函数，这样我们无法通过设置时间去精准控制动画的执行。而且，时间过短，会造成CPU消耗过大，造成整个页面卡顿，而时间过长，又会导致动画不够流畅，所以很难控制时间。  
而使用requestAnimationFrame，我们可以直接将这个时间，交给系统来控制，系统根据当前浏览器绘制的时间，来决定什么时候去执行相应的动画画面更新，实现流畅的动画



# 6. 避免使用浮点数运算
可以使用下面的写法
```javascript
rounded = (0.5 + somenum) | 0;
rounded = ~~ (0.5 + somenum);
rounded = (0.5 + somenum) << 0;
```