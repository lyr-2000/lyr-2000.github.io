https://www.cnblogs.com/cengjingdeshuige/p/12568404.html

https://www.cnblogs.com/gaosirs/p/10595326.html

```javascript
click:function() {
  console.log('start')
  setTimeout(()=>{
    console.log('setTimeout1')
  },0)
  this.$nextTick(()=>{
    console.log('$nextTick1')
    setTimeout(()=>{
      console.log('setTimeout2')
    },0)
    this.$nextTick(()=>{
      console.log('$nextTick2')
    })
  })
  console.log('end')
}
```
打印出来的顺序是
```
start
end
nextTick1
nextTick2
setTimeout1
setTimeout2
```

$nextTick源码
```javascript
export const nextTick = (function () {
  const callbacks = []
  let pending = false
  let timerFunc

  function nextTickHandler () {
    pending = false
    const copies = callbacks.slice(0)
    callbacks.length = 0
    for (let i = 0; i < copies.length; i++) {
      copies[i]()
    }
  }
  if (typeof Promise !== 'undefined' && isNative(Promise)) {
    var p = Promise.resolve()
    var logError = err => { console.error(err) }
    timerFunc = () => {
      p.then(nextTickHandler).catch(logError)
      if (isIOS) setTimeout(noop)
    }
  } else if (!isIE && typeof MutationObserver !== 'undefined' && (
    isNative(MutationObserver) ||
    MutationObserver.toString() === '[object MutationObserverConstructor]'
  )) {
    var counter = 1
    var observer = new MutationObserver(nextTickHandler)
    var textNode = document.createTextNode(String(counter))
    observer.observe(textNode, {
      characterData: true
    })
    timerFunc = () => {
      counter = (counter + 1) % 2
      textNode.data = String(counter)
    }
  } else {
    timerFunc = () => {
      setTimeout(nextTickHandler, 0)
    }
  }

  return function queueNextTick (cb?: Function, ctx?: Object) {
    let _resolve
    callbacks.push(() => {
      if (cb) {
        try {
          cb.call(ctx)
        } catch (e) {
          handleError(e, ctx, 'nextTick')
        }
      } else if (_resolve) {
        _resolve(ctx)
      }
    })
    if (!pending) {
      pending = true
      timerFunc()
    }
    if (!cb && typeof Promise !== 'undefined') {
      return new Promise((resolve, reject) => {
        _resolve = resolve
      })
    }
  }
})()
```

当使用MutationObserver时，会创建一个文本节点，使用MutationObserver监听这个文本节点的变化。通过在内部写一个方法timerFunc来触发这个文本节点的变化，在调用$nextTick时，通过去调用timerFunc方法，来触发这个MutationObserver对应的回调函数，而因为DOM的改变是在同步代码执行完后执行，所以这样可以达到异步执行回调方法的目的

该方法为微任务的回调，所以会在setTimeout之前执行

```javascript
var counter = 1
var observer = new MutationObserver(function(){
    console.log(111)
})
var textNode = document.createTextNode(String(counter))
observer.observe(textNode, {
    characterData: true
})
var timerFunc = () => {
    counter = (counter + 1) % 2
    textNode.data = String(counter)
}
```