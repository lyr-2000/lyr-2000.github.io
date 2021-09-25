## hash路由和history路由

区别

1. hash路由在地址栏URL有#，而history路由是没有的，相对而言history路由会更好看
2. hash路由支持低版本的浏览器，而history路由是html5新增的API
3. hash的特点在于它虽然出现在了URL中，但是不包括在http请求中，所以对于后端是没有一点影响的，所以改变hash不会重新加载页面，所以这也是单页面应用（前端路由）的必备。
4. history运用了浏览器的历史记录栈，之前有back,forward,go方法，之后在HTML5中新增了pushState（）和replaceState（）方法（需要特定浏览器的支持）

