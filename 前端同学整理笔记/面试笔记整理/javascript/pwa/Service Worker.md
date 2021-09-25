# Service Worker

Service Worker本质上是一个与JavaScript线程分离的单独js文件，可以拦截网络请求，缓存资源或从缓存中检索资源，传递推送信息。  
与Web Worker不同，Service Worker是长期存在的，而Web Worker是临时的，计算的数据并不能保存起来。  
Service只能在HTTPS或者http://localhost下运行，前者是为了保证安全，后者是为了调试的方便。  
一旦Service Worker被install，就不会自动清除，除非手动unregister，用到的时候会自动唤醒，不用的时候会自动休眠。  
Service Worker是异步实现的，使用promise   
默认情况下，Service Worker激活后，会在下一次刷新的时候才生效  
Service Worker中无法通过XMLHTTPRequest来发送请求，只能通过fetch API来发送请求

## 注册Service Worker
文件目录  
![在这里插入图片描述](https://img-blog.csdnimg.cn/20191101224800925.png)  
注册Service Worker可以直接使用navigator对象的serviceWorker中的register来注册，要注意的是，为了兼容性处理，要首先判断当前浏览器是否支持Service Worker  
```javascript
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('worker.js')
}
```
这样就可以注册Service Worker，但是这样写存在一些问题，就是我们会在页面首次打开就去注册Service Worker，这样Service Worker线程在下载预存资源时，会占用部分主线程的带宽，对CPU和性能有一定的损耗，而且在刚打开页面时，很多资源都要加载，这个时候来注册Service Worker显然不是一个明智的决定，我们应该在页面加载完再注册Service Worker。  
```javascript
if ('serviceWorker' in navigator) {
    window.addEventListener('load',()=>{
        navigator.serviceWorker.register('worker.js')
    })
}
```
接下来，我们知道，Service Worker有拦截网络请求的作用，那么它会拦截哪些文件的网络请求，这里可以使用注册时返回的promise响应里面的registration.scope来获取拦截的内容
```javascript
if ('serviceWorker' in navigator) {
    window.addEventListener('load',()=>{
        navigator.serviceWorker.register('worker.js').then(registration=>{
            console.log(`register success , scope is ${registration.scope}`)
        }).catch(err=>{
            console.log(`register failed , err is ${err}`)
        })
    })
}
```
![在这里插入图片描述](https://img-blog.csdnimg.cn/20191027211111774.png)
这里我的worker.js放在根目录下，而默认情况下Service Worker文件会拦截文件所在的目录及以下的子目录，所以会拦截服务器下所有文件的请求  
当然，我们也可以在注册的时候传入其他参数来设置拦截的目录。
```javascript
if ('serviceWorker' in navigator) {
    window.addEventListener('load',()=>{
        navigator.serviceWorker.register('worker.js',{
            scope:'/js'
        }).then(registration=>{
            console.log(`register success , scope is ${registration.scope}`)
        }).catch(err=>{
            console.log(`register failed , err is ${err}`)
        })
    })
}
```
![在这里插入图片描述](https://img-blog.csdnimg.cn/20191027211557703.png)
这里设置在worker.js所在目录的js文件夹，因为worker.js在根文件夹，所以最后的拦截目录就是根目录下的js文件夹  
## Service Worker生命周期
install：在Service Worker注册成功的时候触发，主要用于缓存资源，在注册成功时就将一些不怎么会发生变化的资源缓存下来，一旦断网还可以通过缓存继续访问这些资源。如果worker.js发生了改变，就会触发install事件  
activate：在Service Worker激活的时候触发，主要用于清除旧的缓存。如果不进行清除的话，缓存会越来越多，最后空间不足。
fetch：在接收请求的时候触发，主要用于操作缓存和读取网络资源。fetch会捕获**所有**的请求，当读取网络资源失败时，就可以去操作缓存，将缓存中的资源渲染到页面上，这就是断网后还能看到一些资源的原因。

这里在worker.js中注册各个生命周期对应的事件
```javascript
self.addEventListener('install', event => {
    //
    console.log('install',event);
});

self.addEventListener('activate', event => {
    console.log('activate',event)
});

self.addEventListener('fetch', event => {
    console.log('fetch',event)
});
```
要怎么判断自己是否已经成功注册Service Worker呢，和manifest一样，可以在Application中看到Service Worker的相应信息  
![在这里插入图片描述](https://img-blog.csdnimg.cn/20191101225003877.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3plbXByb2dyYW0=,size_16,color_FFFFFF,t_70)
这里是我之前就注册了的Service Worker，为了看到打印的内容，这里将之前注册好的Service Worker unregister掉  
unregister后刷新查看控制台
![在这里插入图片描述](https://img-blog.csdnimg.cn/20191101225903183.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3plbXByb2dyYW0=,size_16,color_FFFFFF,t_70)
因为这里只是注册了Service Worker，还没有发送请求，所以没有触发fetch事件  
在这里当我们刷新时会发现控制台不再打印出install和active，这是因为原来的那个Service Worker已经存在了，要重新触发这两个事件，首先如上面所说，只要worker.js发生了改变，就会再次触发install事件，即使发生改变的只是添加一个注释  
修改worker.js如下
```javascript
self.addEventListener('install', event => {
    // install
    console.log('install',event);
});

self.addEventListener('activate', event => {
    console.log('activate',event)
});

self.addEventListener('fetch', event => {
    console.log('fetch',event)
});
```
![在这里插入图片描述](https://img-blog.csdnimg.cn/20191101230018385.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3plbXByb2dyYW0=,size_16,color_FFFFFF,t_70)
可以看到，install事件重新触发了，但是activate事件并没有触发，这是因为虽然worker.js修改了，导致注册了一个新的Service Worker，但是原来的那个Service Worker还在运行中，要在原来的那个Service Worker终止后，才会激活现在的这个新注册的Service Worker，在原来的终止之前，新注册的只能处于等待状态，无法激活activate事件，可以看看Application中的Service Worker的状态  
![在这里插入图片描述](https://img-blog.csdnimg.cn/20191101230345722.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3plbXByb2dyYW0=,size_16,color_FFFFFF,t_70)
可以看到新的Service Worker正在等待中，此时只要按下skipWaiting就可以跳过等待，触发activate事件，控制台也就会打印出相应的内容
![在这里插入图片描述](https://img-blog.csdnimg.cn/20191101230515905.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3plbXByb2dyYW0=,size_16,color_FFFFFF,t_70)  
一般情况下我们希望注册后就能直接跳过等待，但是我们不可能都来控制台手动跳过等待，Service Worker提供了一个skipWaiting方法来跳过等待，返回一个promise对象  
修改worker.js如下
```javascript
self.addEventListener('install', event => {
    // install
    console.log('install',event);
    // 跳过等待，进入激活状态，触发activate
    self.skipWaiting();
});

self.addEventListener('activate', event => {
    console.log('activate',event)
});

self.addEventListener('fetch', event => {
    console.log('fetch',event)
});
```
保存刷新页面，可以发现这次activate事件也打印出来了。
![在这里插入图片描述](https://img-blog.csdnimg.cn/2019110123093473.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3plbXByb2dyYW0=,size_16,color_FFFFFF,t_70)
但是这样写还存在一个问题，因为```self.skipWaiting()```返回的是一个promise对象，所以可能会存在promise对象中的内容还没执行完，就走到了activate生命周期中，为了避免这个问题，我们采用```event.waitUntil()```来接收这个方法返回的promise对象，该方法会在接收的promise结束后才进入下个生命周期，就避免了上面提到的问题。
修改worker.js如下
```javascript
self.addEventListener('install', event => {
    // install
    console.log('install',event);
    // 跳过等待，进入激活状态，触发activate
    // 等待skipWaiting返回的promise结束后才进入activate周期
    event.waitUntil(self.skipWaiting());
});

self.addEventListener('activate', event => {
    console.log('activate',event)
});

self.addEventListener('fetch', event => {
    console.log('fetch',event)
});
```
上面也已经提过了，Service Worker激活后，是在下一次刷新页面的时候才生效的，那么如果我们要让其立即生效，可以使用```self.clients.claim()```来立即获取控制权
修改worker.js如下
```javascript
self.addEventListener('install', event => {
    // install
    console.log('install',event);
    // 跳过等待，进入激活状态，触发activate
    // 等待skipWaiting返回的promise结束后才进入activate周期
    event.waitUntil(self.skipWaiting());
});

self.addEventListener('activate', event => {
    console.log('activate',event)
    // 表示Service Worker激活后，立即获取控制权
    // 在确定获得控制权后才让fetch得以触发
    event.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', event => {
    console.log('fetch',event)
});
```
接下来看看fetch，我们在index.html中引入一个新写的css
css文件如下
```css
body {
    background-color: aqua;
}
```
在html的head标签中引入css
```html
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Document</title>
    <link rel="stylesheet" href="index.css">
</head>
```
刷新后可以看到，fetch被触发了
![在这里插入图片描述](https://img-blog.csdnimg.cn/20191101232533856.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3plbXByb2dyYW0=,size_16,color_FFFFFF,t_70)  
而且看这里请求，是css文件的请求被Service Worker抓到了

上面已经提及了，在Service Worker中无法使用XMLHttpRequest请求，只能通过fetch API发送请求  
fetch(url,config)用于发送http请求，返回一个包含响应结果的的promise对象  
当我们配置完缓存后，我们要拦截请求，查看缓存中是否有相应的数据，如果没有数据的话，使用fetch发起请求，如果有就使用缓存中的数据
（关于fetch和缓存处理配置祥见另外的博客）