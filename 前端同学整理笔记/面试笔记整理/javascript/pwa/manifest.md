# mainfest

manifest作为渐进式Web应用程序pwa中的一个核心技术，通过manifest.json来配置，实现了将Web应用程序添加到设备的主屏幕，为用户提供更快的访问和更丰富的体验。  
更快体现在放在主屏幕，而更丰富体现在在打开添加到主屏幕的一个缓冲界面及一个自定义的图标。  

## 部署manifest
---
部署manifest非常容易，首先我们新建一个文件夹，在该文件夹中创建如下目录  
![在这里插入图片描述](https://img-blog.csdnimg.cn/20191101200554544.png)  
index.html为我们要展示的页面  
img中的logo.png是待会要配置成目标logo的图片  
manifest.json是配置文件

编写html文件如下
```html
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>PWA-TEST</title>
    <link rel="manifest" href="/manifest.json">
</head>

<body>
    <h1>hello pwa</h1>
</body>

</html>
```
上面的代码中，```<link rel="manifest" href="/manifest.json">```就是用来部署manifest的  
配置一个最简单的manifest.json如下
```json
{
    "name": "myPWA-APP"
}
```
控制台当前根目录下运行http-server打开服务器，在浏览器中的控制台的application中可以看到  
![在这里插入图片描述](https://img-blog.csdnimg.cn/2019110120114447.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3plbXByb2dyYW0=,size_16,color_FFFFFF,t_70)

这样就说明manifest已经配置好了，但是我们现在看不到任何效果，因为只是配置了一个名字

（假如没有配置manifest，application就会如下）  

![在这里插入图片描述](https://img-blog.csdnimg.cn/20191101201149626.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3plbXByb2dyYW0=,size_16,color_FFFFFF,t_70)

接下来配置一个较为完整的manifest.json
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
    "display": "standalone"
}
```

![在这里插入图片描述](https://img-blog.csdnimg.cn/20191101201904723.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3plbXByb2dyYW0=,size_16,color_FFFFFF,t_70)  
这里已经能看到我配置的所有东西了，这只皮卡丘就是我的logo.png。  
然而在这里我们还是无法看到具体的效果，即使使用控制台上的手机按钮，所以这里我用到了Android studio的虚拟机来调试。  
![在这里插入图片描述](https://img-blog.csdnimg.cn/20191101202358309.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3plbXByb2dyYW0=,size_16,color_FFFFFF,t_70)
首先将部署manifest的link标签注释掉，将页面添加到主屏幕  
![在这里插入图片描述](https://img-blog.csdnimg.cn/20191101202532408.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3plbXByb2dyYW0=,size_16,color_FFFFFF,t_70)
![在这里插入图片描述](https://img-blog.csdnimg.cn/20191101202537661.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3plbXByb2dyYW0=,size_16,color_FFFFFF,t_70)
![在这里插入图片描述](https://img-blog.csdnimg.cn/20191101202542788.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3plbXByb2dyYW0=,size_16,color_FFFFFF,t_70)
![在这里插入图片描述](https://img-blog.csdnimg.cn/20191101202547907.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3plbXByb2dyYW0=,size_16,color_FFFFFF,t_70)
可以看到这里是只有一个方块图，而当我们使用了manifest后  
![在这里插入图片描述
](https://img-blog.csdnimg.cn/20191101204904460.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3plbXByb2dyYW0=,size_16,color_FFFFFF,t_70)
![在这里插入图片描述](https://img-blog.csdnimg.cn/20191101204911913.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3plbXByb2dyYW0=,size_16,color_FFFFFF,t_70) 
![在这里插入图片描述](https://img-blog.csdnimg.cn/20191101204919758.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3plbXByb2dyYW0=,size_16,color_FFFFFF,t_70)
打开桌面的这个图标，可以看到一个缓冲界面
![在这里插入图片描述](https://img-blog.csdnimg.cn/20191101205010983.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3plbXByb2dyYW0=,size_16,color_FFFFFF,t_70)
进入后的顶部背景也变成了绿色了
![在这里插入图片描述](https://img-blog.csdnimg.cn/20191101205105526.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3plbXByb2dyYW0=,size_16,color_FFFFFF,t_70)

## manifest的属性意义
接下来将上面的属性设置对应图片中的显示
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
    "display": "standalone"
}
```
name就是在进入的缓冲界面时，下面的那个长的名字
![在这里插入图片描述](https://img-blog.csdnimg.cn/20191101205400161.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3plbXByb2dyYW0=,size_16,color_FFFFFF,t_70)
short_name为主屏幕图标的名字
![在这里插入图片描述](https://img-blog.csdnimg.cn/20191101212158793.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3plbXByb2dyYW0=,size_16,color_FFFFFF,t_70)  
start_url为打开的页面，这里就是index.html  
icons是用来设置Web程序的图标的，这个图标就是在缓冲界面和主屏幕出现的图标  
在icons的值为一个数组，数组中的每个成员变量有三个属性
* src：图片的地址
* sizes：界面接近什么尺寸时使用该图片，icons中只有一个成员，那么就直接使用这个
* type：图片的格式  

background_color：缓冲界面的背景色  
theme_color：顶部的背景颜色  

display为Web程序展示的形式，一般情况下会设置成standalone,这种设置让应用看起来像一个独立的应用程序。在这个模式中，我们可以看到上面的图中，连输入网址的导航栏都没了，只剩下一个状态栏
![在这里插入图片描述](https://img-blog.csdnimg.cn/2019110121413442.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3plbXByb2dyYW0=,size_16,color_FFFFFF,t_70)
除了standalone外，还有几个属性
fullscreen，该属性让整个应用程序覆盖全屏，连状态栏都不显示，从缓冲界面就没有状态栏
![在这里插入图片描述](https://img-blog.csdnimg.cn/20191101214810456.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3plbXByb2dyYW0=,size_16,color_FFFFFF,t_70)
![在这里插入图片描述](https://img-blog.csdnimg.cn/20191101214452584.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3plbXByb2dyYW0=,size_16,color_FFFFFF,t_70)
minimal-ui也让Web程序看起来像是一个独立的应用程序，与standalone不同的是，会显示浏览器的地址，显示的样式受设置的影响
![在这里插入图片描述](https://img-blog.csdnimg.cn/20191101215054864.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3plbXByb2dyYW0=,size_16,color_FFFFFF,t_70)


在配置service worker后甚至可以在电脑上安装“应用”（我只在chrome上测试成功）  
这里直接贴出配置service worker的代码，具体的内容详见另一篇博客  
```html
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Document</title>
    <link rel="stylesheet" href="index.css">
    <link rel="manifest" href="manifest.json">
</head>

<body>
    <script>
        if ('serviceWorker' in navigator) {
            window.addEventListener('load', () => {
                navigator.serviceWorker.register('worker.js').then(registration => {
                    console.log(`register success , scope is ${registration.scope}`)
                }).catch(err => {
                    console.log(`register failed , err is ${err}`)
                })
            })
        }
    </script>
</body>

</html>
```
```javascript
// worker.js
self.addEventListener('install', event => {
    console.log('install',event);
    event.waitUntil(self.skipWaiting());
});

self.addEventListener('activate', event => {
    console.log('activate',event)
    event.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', event => {
    console.log('fetch',event)
});
```

此时刷新浏览器会出现下面这个按钮，点击会询问用户是否添加该应用
![在这里插入图片描述](https://img-blog.csdnimg.cn/20191109110936805.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3plbXByb2dyYW0=,size_16,color_FFFFFF,t_70)

![在这里插入图片描述](https://img-blog.csdnimg.cn/20191109111104801.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3plbXByb2dyYW0=,size_16,color_FFFFFF,t_70)

然后会自动弹出界面，且桌面会出现应用
![在这里插入图片描述](https://img-blog.csdnimg.cn/20191109111410539.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3plbXByb2dyYW0=,size_16,color_FFFFFF,t_70)

![在这里插入图片描述](https://img-blog.csdnimg.cn/20191109111434503.png)  
当我们再次打开页面时，图标就不再是加号了，点击会让我们打开已经安装了的“应用”
![在这里插入图片描述](https://img-blog.csdnimg.cn/20191109114306306.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3plbXByb2dyYW0=,size_16,color_FFFFFF,t_70)  
如果要将该应用删除的话，只删除桌面的快捷方式是不行的，需要在程序中删除
![在这里插入图片描述](https://img-blog.csdnimg.cn/20191109114933944.png)