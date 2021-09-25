1. link是XHTML标签，除了加载css之外，还可以加载其他内容，像favico图标，manifest这些，而@import只能用在css里
2. link引用css是在页面加载时同时引入，而@import是在页面加载完毕后引入
3. link是XHTML标签，无兼容问题，而@import是css2.1提出来的，低版本的浏览器不支持
4. link支持使用Javascript控制DOM去改变样式；而@import不支持。
