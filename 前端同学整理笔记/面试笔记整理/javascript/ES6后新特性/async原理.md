在了解async原理之前，我们要首先明白，async是generator的一个语法糖，所以首先，我们需要了解的是generator的原理

# generator
```javascript
function* genDemo() {
    console.log("开始执行第一段")
    yield 'generator 1'

    console.log("开始执行第二段")
    yield 'generator 2'

    console.log("开始执行第三段")
    yield 'generator 3'

    console.log("执行结束")
    return 'generator 4'
}
```
上面这段代码就是一段generator构造函数，我们通过yield来暂停执行，通过内置的next方法来使其继续执行，具体使用如下
```javascript
console.log('main 0')
let gen = genDemo()
console.log(gen.next().value)
//开始执行第一段
// generator 1
console.log(gen.next().value)
// 开始执行第二段
// generator 2
console.log(gen.next().value)
// 开始执行第三段
// generator 3
console.log(gen.next().value)
// 执行结束
// generator 4
```
这里之所以能进行一个暂停和继续执行，我们需要去了解协程的概念
## 协程
协程是一种比线程更加轻量级的存在。你可以把协程看成是跑在线程上的任务，**一个线程上可以存在多个协程，但是在线程上同时只能执行一个协程**，比如当前执行的是A协程，要启动B协程，那么A协程就需要将主线程的控制权交给B协程，这就体现在A协程暂停执行，B协程恢复执行；同样，也可以从B协程中启动A协程。通常，如果从A协程启动B协程，我们就把A协程称为B协程的父协程。

![](https://user-gold-cdn.xitu.io/2020/3/31/1712f8a8ba6fcb23?w=1193&h=605&f=png&s=171434)

从图中可以看出来协程的四点规则：

1. 通过调用生成器函数genDemo来创建一个**协程**gen，创建之后，gen协程并没有立即执行。
2. 要让gen协程执行，需要通过调用gen.next。
3. 当协程正在执行的时候，可以通过yield关键字来**暂停**gen协程的执行，并返回主要信息给父协程。
4. 如果协程在执行期间，遇到了return关键字，那么JavaScript引擎会结束当前协程，并将return后面的内容返回给父协程。

我们需要清楚，gen协程和主协程并不是同时执行的，而是在主线程执行的时候，通过gen.next，使主协程暂停执行，gen协程继续执行，在gen协程执行的时候，通过yield，使gen协程暂停执行，主协程继续执行，同时将yield表达式后面的内容通过返回对象的value属性返回给主协程

了解了generator构造器的原理，接下来开始分析async/await的工作原理

# async/await
其实async/await技术背后的秘密就是Promise和生成器应用，往底层说就是微任务和协程应用。要搞清楚async和await的工作原理，我们就得对async和await分开分析。

## async
根据MDN定义，async是一个通过**异步执行**并**隐式返回 Promise**作为结果的函数。

我们要关注的是如何实现**异步执行**和**隐式返回promise**

隐式返回promise，在我看来，就像是在返回的时候，对return返回的内容使用了一个Promise.resolve方法，返回的promise状态为resolve

看下面的例子
```javascript
async function fn(){
    return 1
}
fn()
// Promise {<resolved>: 1}
```

这和```Promise.resolve(1)```的结果是一样的，如果我们不返回任何内容，那么结果和```Promise.resolve()```一样
```javascript
async function fn(){

}
fn()
// Promise {<resolved>: undefined}
```
知道了async隐式返回promise，要知道异步执行，我们要结合await来分析

## await
```javascript
async function foo() {
    console.log(1)
    let a = await 100
    console.log(a)
    console.log(2)
}
console.log(0)
foo()
console.log(3)
```
这段代码的执行结果是
```javascript
// 0
// 1
// 3
// 100
// 2
```
我们结合下图来谈谈为何是这种结果
![](https://user-gold-cdn.xitu.io/2020/3/31/1712fad0767eb43c?w=1217&h=673&f=png&s=180796)
1. 执行```console.log(0)```，输出0
2. 执行foo方法，因为是async方法，所以暂停主协程，转为执行foo协程
3. 执行```console.log(1)```，输出1，遇到了await，创建了一个promise对象，如下
```javascript
let promise_ = new Promise((resolve,reject){
  resolve(100)
})
```
4. 创建了promise对象后，会执行传入promise的方法，即上面的```resolve(10)```，接着JavaScript引擎会将```promise_.then()```里的任务放到微任务队列，然后暂停foo协程，继续执行主协程
5. 在主协程遇到了```console.log(3)```，打印3
6. 主协程任务执行完，检查微任务队列，执行```_promise.then()```
```javascript
promise_.then((value)=>{
    // 回调函数被激活后
    // 暂停执行主协程，执行foo协程
    // 将resolve的内容通过这里的value，赋值给变量a
})
```
7. 依次执行foo函数后面的内容，依次打印出a和2，也就是100和2


```javascript
async function foo() {
    console.log('foo')
}
async function bar() {
    console.log('bar start')
    await foo()
    console.log('bar end')
}
console.log('script start')
setTimeout(function () {
    console.log('setTimeout')
}, 0)
bar();
new Promise(function (resolve) {
    console.log('promise executor')
    resolve();
}).then(function () {
    console.log('promise then')
})
console.log('script end')
```