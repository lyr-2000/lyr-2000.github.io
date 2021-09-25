# fetch
因为在service worker，web worker中，无法使用XMLHttpRequest，所以我们要采用别的方法来发起请求  
Fetch API提供了一个全局fetch方法，作为一个HTTP异步请求方式，通过返回一个promise来处理返回的内容。
举例：使用fetch访问同一目录下的manifest.json
```javascript
fetch('/manifest.json')
    .then(res => {
        return res.json();
    }).then(res => {
        console.log('res: ', res);
    })
```
```json
{
    "name": "myPWA-APP",
    "short_name": "myPWA",
    "start_url": "/index.html",
    "icons": [{
        "src": "img/logo.png",
        "sizes": "144x144",
        "type": "image/png"
    }],
    "background_color": "skyblue",
    "theme_color": "green",
    "display": "minimal-ui"
}
```
![在这里插入图片描述](https://img-blog.csdnimg.cn/20191109120254887.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3plbXByb2dyYW0=,size_16,color_FFFFFF,t_70)

在service worker中，我们通过fetch事件捕获发出的请求，判断当前是否存在缓存，如果网络中有最新的内容时，使用fetch发出这些请求
```javascript
// 判断资源是否请求成功
// 成功->响应成功的结果
// 失败->读取缓存的内容
self.addEventListener('fetch', event => {
    // 捕获的请求
   console.log(event.request.url)
   const req=event.request
   // 给浏览器响应
   event.respondWith(networkFirst(req))
});

// 网络优先
async function networkFirst(req){
    try{
        // 先从网络获取最新资源
        // 请求可能失败，放在try中
        // 有网络的情况下，请求成功，使用请求的数据
        const fresh=await fetch(req)
        return fresh
    }catch(e){
        // 没网络的情况下，请求失败，使用缓存的数据
        const cache =await caches.open(CACHE_NAME)
        // 在缓存中匹配req对应的结果
        const cached =await cache.match(req)
        console.log('cached: ', cached);
        return cached
    }
    
}
```

## fetch()方法
---
上面已经提及了，fetch()方法是用来发送请求的
### **参数**
第一个参数为url字符串或者一个request对象  
* 上面的例子中，请求manifest.json就是传入了url字符串，而在捕获请求那里则是传入了一个request对象  

第二个参数为一个配置对象，用来配置发送的请求  
常用的几个有
* method：请求使用的方法，如get,post
* headers：请求用的头信息，形式为 Headers 的对象或包含 ByteString 值的对象字面量。
* body: 请求的 body 信息：可能是一个 Blob、BufferSource、FormData、URLSearchParams 或者 USVString 对象。注意 GET 或 HEAD 方法的请求不能包含 body 信息。
* mode: 请求的模式，如 cors、 no-cors 或者 same-origin。
* credentials：用于让浏览器发送包含凭证的请求，设置include可以在请求时带上cookie，设置same-origin即表示请求的URL与请求源在同一域时发送凭证，设置成omit可以确保浏览器不在请求中包含凭证

使用fetch发起get请求
```javascript
fetch('url',{
    method:'GET'
}).then(res=>{

}).catch(err=>{

})
```
使用fetch发起post请求
```javascript
fetch('url',{
    method:'POST',
    body:'foo=1&bar=2'
}).then(res=>{

}).catch(err=>{

})

// 或者

let data={
    foo:1,
    bar:2
}

fetch('url',{
    method:'POST',
    body:JSON.stringify(data),
    headers:new Headers({
        'Content-Type':'application/json'
    })
}).then(res=>{

}).catch(err=>{

})
```
使用fetch发起表单的请求
```javascript
let form = new FormData(document.getElementById('form'));
fetch('url',{
    method:'POST',
    body:form
})
```
上传文件
```javascript
// 单个文件上传
// <input type="file" />
let formData = new FormData();
let fileField = document.querySelector("input[type='file']");

formData.append('name', 'Mike');
formData.append('img', fileField.files[0]);

fetch('url', {
  method: 'POST',
  body: formData
}).then(res => {

}).catch(err => {

})
```
```javascript
// 多文件上传
// <input type="file" mutiple/>
let formData = new FormData();
let fileFields = document.querySelector("input[type='file'][multiple]");

formData.append('name', 'Mike');
for(let i = 0;i<fileFields.length;i++){
    formData.append('img',fileFields.files[i]);
}

fetch('url', {
  method: 'POST',
  body: formData
}).then(res => {

}).catch(err => {

})
```

### **返回值**
fetch方法返回一个promise对象，当promise对象转为resolve状态时回传Response对象



## fetch与ajax的区别
---
1. 在fetch返回的promise对象中，即使返回的状态码为404，500这些表示请求失败的状态码，promise仍然会变为resolve状态，但是其中的ok属性变为false，只有当网络请求出现故障或者网络请求被阻止时才会变为reject  
所以如果我们要明确判断请求是否成功（即404，500这些为失败），我们还需要在得到响应后判断对应的ok属性
```javascript
fetch('url').then(res=>{
    if(res.ok){
        // 执行正常的操作
    }else{
        throw new Error('the request is error')
    }
}).catch(err=>{

})
```
2. 默认情况下，fetch不会从服务端发出或接受任何服务端的cookies
