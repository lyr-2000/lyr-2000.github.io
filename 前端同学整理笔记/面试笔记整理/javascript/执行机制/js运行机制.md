# 单线程的JavaScript
正如我们所知，JavaScript是一个单线程的语言，之所以是单线程的，和其用途有关。我们知道，JavaScript主要是和用户交互的，那么如果JavaScript是多线程的，在操作DOM的时候，一个线程对DOM节点进行操作，而另一个线程删除DOM节点，那该按哪个线程的操作为准，所以JavaScript是单线程

# JavaScript中的任务执行
说完JavaScript为什么是单线程的，我们来说说JavaScript里面是如何运行的  
虽然JavaScript是单线程的，但是浏览器却是多线程的，一般来说，我们将执行我们同步任务代码的线程称为主线程   
我们知道，在JavaScript中有同步任务和异步任务，对于同步任务，在经过预编译后，会放在主线程中，形成一个执行栈，按顺序从上往下执行，而对于异步任务，会在异步调用的时候，被放入到任务队列中，当执行栈的任务执行完毕后，就将任务队列中的任务依次取出放到执行栈中执行，如此往复执行所有任务，这个过程叫做event loop  
看看下面的这道题目
```javascript
console.log(1)
setTimeout(function(){
    console.log(3)
},0)
console.log(2)
```
如果理解了上面的内容，就会明白为什么这里的输出顺序是123。  
在运行这段代码的时候，首先会将```console.log(1)```放入主线程，然后看到setTimeout，延迟时间是0s也即是当下（实际上在html5规范中小于4ms都变成4ms，但这不会影响本题答案），将```console.log(3)```放入到任务队列中，然后将```console.log(2)```放入到主线程中，按顺序执行
```javascript
console.log(1)
console.log(2)
```
然后此时，主线程中的任务已经执行完毕了，查看任务队列，发现还有个```console.log(3)```还没有执行，于是执行```console.log(3)```

# 异步任务过程详解
上面提及了，在我们遇到异步任务的时候，我们将console.log(3)放入了任务队列了，那么这段代码是什么呢，实际上是一段回调函数，有没有发现，任何异步的操作，最后都需要有一个回调函数。为什么？因为如果没有回调函数的话，我怎么知道这个异步操作完成了，所以回调函数其中一个作用就是告诉主线程异步操作已经完成  
一般情况下，我们会遇到以下几种异步操作
1. click，mousemove，keydown等这些操作
2. 加载事件，load
3. 定时器，setTimeout，setInterval
4. promise的状态发生改变
5. 发送异步请求等待响应到来

一个完整的异步操作，包括注册事件和等待事件被触发  
一开始，在执行时遇到异步操作，首先是主线程发起一个异步的请求，注册这个异步事件，异步任务接收到后告知主线程已经收到，然后主线程继续执行，在此同时，异步事件如果被触发，就会将相应的回调函数放到任务队列中，然后等到主线程中的任务执行完毕后，就会查看任务队列，将这些任务拿到执行栈执行。

# 微任务和宏任务
实际上，异步任务也被分为微任务和宏任务，这两种任务在最直观的区别在于**优先级**  
如上文所说，当我们在执行栈中将同步任务执行完了之后，我们会去查看任务队列中的任务，首先查看的是微任务，如果有微任务，将其拿到执行栈中执行，如果没有，则去查看宏任务，做一样的操作  
从上面的流程看出，微任务的优先级是大于宏任务的  
**微任务**
* promise

**宏任务**
* setTimeout
* setInterval
* xhr请求

知道了上面这个知识点，下面这道题目就能正确地做出来了
```javascript
setTimeout(()=>{
    console.log(1)
},0)
new Promise(resolve=>{
    console.log(2)
    resolve()
}).then(()=>{
    console.log(3)
})
console.log(4)
```
这里的答案是2431  
1. 遇到setTimeout，注册定时器事件，在0s（按规范是4ms，这里就先当做0s吧）后，即现在将```()=>{console.log(1)}```**推**到异步任务中的宏任务
2. 新建一个promise，执行```console.log(2)```，在这里输出第一个数字2，然后触发resolve，将```()=>{console.log(3)}```**推**到异步任务中的微任务
3. 遇到```console.log(4)```，输出数字4，这是第二个数字
4. 主线程的内容执行完了，接下来去异步任务里查看，首先查看微任务，发现了微任务中的```()=>{console.log(3)}```，将其放到主线程中的执行栈中执行，输出3，这是第三个数字
5. 微任务中已经没有别的任务了，此时去查看宏任务，发现了宏任务中的```()=>{console.log(1)}```，输出1，这是最后一个数字1