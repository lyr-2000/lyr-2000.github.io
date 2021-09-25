# Web Worker
在JavaScript中，因为是单线程执行，所以如果在执行过程中遇到一个运算量很大的代码块时，就可能会出现阻塞代码的情况。为了解决这个问题，我们可以采用异步来实现这部分代码，此外，也可以采用Web Worker来解决这个问题。  
Web Worker通过将代码放在后台来实现，避免了阻塞的问题。浏览器实现Web Worker的形式很多，如多线程，后台进程或运行在其他处理器核心上的进程。  
实际上，在页面中新建的Web Worker与原页面的作用域不为同一个作用域，这正是与加载其他js文件不同的地方。

## 创建
Web Worker可以直接使用new操作符创建，传入要作为worker对象的js文件作为参数
```javascript
let worker = new Worker('worker.js')
```

## 监听发送的数据和回调函数
在使用Web Worker时，我们通过使用postMessage来传输数据，为onmessage设置回调函数来对发送的数据做响应处理。  
```html
<!-- index.html -->
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Document</title>
</head>

<body>
    <script>
        let worker = new Worker("worker.js")
        // 往worker对象发送一个对象数据
        worker.postMessage({
            msg: 'here is index.html'
        })
    </script>
</body>

</html>
```
```javascript
// worker.js
self.onmessage=event=>{
    // 数据放在响应对象的data属性中
    console.log(event.data)
}
```
在Web Worker中，全局对象是self，所以这里通过给self的onmessage设置回调函数来监听原页面的作用域发送的数据，当然，这里也可以通过this来设置，因为默认情况下this指向全局对象（非严格模式下）  
同样的，在worker中也通过postMessage来向原页面的作用域发送数据，在原页面的作用域中通过worker对象的onmessage来监听发送到当前作用域的数据

```html
<!-- index.html -->
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Document</title>
</head>

<body>
    <script>
        let worker = new Worker("worker.js")
        // 往worker对象发送一个对象数据
        worker.postMessage({
            msg: 'here is index.html'
        })
        worker.onmessage=event=>{
            console.log(event.data)
        }
    </script>
</body>

</html>
```


```javascript
// worker.js
self.onmessage=event=>{
    // 数据放在响应对象的data属性中
    console.log(event.data)
}
self.postMessage({
    msg:'here is worker.js'
})
```
![在这里插入图片描述](https://img-blog.csdnimg.cn/20191026225059487.png)

## Worker线程的关闭
Web Worker给我们带来便利性的同时，也带来了一些问题，如果开启过多的Web Worker，无疑会对性能造成不小的损耗，所以我们必须在Worker线程失去作用时手动关闭Worker线程。  

Worker线程的关闭可以在创建Web Worker的地方关闭，也可以在其作用域中关闭

在原页面中，通过terminate方法关闭
```javascript
worker.terminate()
```
而在Worker的作用域中，通过调用close方法来关闭
```javascript
self.close()
```

## 在Web Worker引入脚本
如果我们在Web Worker中要引入其他脚本，可以通过importScripts来引入，该方法传入多个参数，每个参数代表要引入的脚本的url，以字符串形式传入  
```javascript
// worker.js
importScripts('file1.js','file2.js');
```

```javascript
// file1.js
console.log('file1.js')
```

```javascript
// file2.js
console.log('file2.js')
```

这样就会在页面中输出“file1.js”和“file2.js”，引入脚本的执行严格按照传入参数的先后顺序，即使后面的脚本先于前面的脚本加载完，也依然会按先后顺序来执行脚本。  

要注意的是，Web Worker中引入的脚本所在的作用域是**Web Worker的作用域**，即是说，Web Worker引入脚本实际上等同于我们在页面中引入脚本一样，将脚本带到当前的作用域。  


## Web Worker的全局作用域
在Web Worker中，全局对象指向self对象，而实际上，这个self指向的是worker对象。我们要清楚的是，Web Worker所执行的JavaScript代码的作用域与当前网页中的代码不共享作用域。  
Web Worker只提供了一个“最小”的运行环境，在Web Worker中
* 无法访问DOM，localStorage，sessionStorage
* location对象变为只读
* 最小化的navigator对象，包括onLine,appName,appVersion,userAgent,platform属性  
Web Worker中的navigator对象
![在这里插入图片描述](https://img-blog.csdnimg.cn/2019102623031989.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3plbXByb2dyYW0=,size_16,color_FFFFFF,t_70)
原页面中的navigator对象
![在这里插入图片描述](https://img-blog.csdnimg.cn/20191026230325183.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3plbXByb2dyYW0=,size_16,color_FFFFFF,t_70)
* XMLHttpRequest构造函数

## 微信小程序中的Worker对象
微信小程序中同样也有Worker对象  
使用createWorker来创建对象，onMessage来监听其他线程发送到当前线程的信息，使用postMessage来向其他线程发送信息，使用terminate来关闭线程  
详情见[小程序官方文档](https://developers.weixin.qq.com/miniprogram/dev/api/worker/wx.createWorker.html)