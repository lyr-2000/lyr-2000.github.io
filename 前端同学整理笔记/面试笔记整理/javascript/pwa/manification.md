# notification
在之前的博客中，我们已经做到了可以在离线的时候访问缓存的资源，这样做的目的是给用户带来更好的体验，但是，一般的用户并不知道他们现在访问的到底是缓存的资源还是最新的通过网络请求到的资源，这反而会给用户带来不好的体验，为了解决这个问题，我们采用notification来解决这个问题  
首先我们要了解notification是什么  
notification是用来配置和显示桌面的通知的一个API。

在pwa中，我们使用notification来通知用户当前访问的是什么资源

首先，桌面的通知可否发出，需要一定的用户权限，通过Notification.permission我们可以查看当前的用户权限，默认情况下为default 
* default：默认，未授权，可以通过请求授权来得到权限
* denied：拒绝的，如果已经拒绝了，无法再次请求授权，也无法弹窗提示
* granted：授权的，可以弹窗提醒
请求授权是通过Notification对象的requestPermission来请求的，我们直接在控制台调用该方法
![在这里插入图片描述](https://img-blog.csdnimg.cn/2019110921215853.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3plbXByb2dyYW0=,size_16,color_FFFFFF,t_70)
当原来为default时，调用该方法就会发出询问，此时点击允许就会变成granted，点击禁止就会变成denied  
当变成granted和denied后，requestPermission也就没用了。  
实际上在chrome中可以点击手动修改（其他的我没试过）
![在这里插入图片描述](https://img-blog.csdnimg.cn/20191109212505138.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3plbXByb2dyYW0=,size_16,color_FFFFFF,t_70)

当Notification.permission变成granted后，我们就可以来发出通知了。  
我们通过new一个Notification来发起请求，当Notification.permission变成granted后，试试在浏览器中执行下面这段代码
```javascript
new Notification('提示',{body:'我是一条桌面提示'})
```
![在这里插入图片描述](https://img-blog.csdnimg.cn/20191109213537185.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3plbXByb2dyYW0=,size_16,color_FFFFFF,t_70)

接下来就将这部分内容放到之前做的页面中  
代码如下
```javascript
if (Notification.permission === 'default') {
    Notification.requestPermission();
}
// 判断用户现在是否联网
if (!navigator.onLine) {
    // 提示用户当前访问的是离线缓存资源
    new Notification('提示', {
        body: '当前访问没有联网，访问的是缓存'
    })
}
// 联网的事件
window.addEventListener('online', () => {
    // 每当联网就提示用户现在已经联网了
    new Notification('提示', {
        body: '已经联网，请刷新访问新的数据'
    })
})
```