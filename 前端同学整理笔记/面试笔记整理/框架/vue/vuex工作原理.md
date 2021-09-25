vuex中的store本质就是没有template的隐藏着的vue组件

https://www.jianshu.com/p/d95a7b8afa06


vuex只能在vue中使用，而redux是可以在react，jq，angular等使用

store.js中的
```javascript
Vue.use(Vuex)
```
会默认去执行vuex的install方法

在vuex中，mutations和actions中存在同名的话，即使在不同的模块中，也会同时触发

所以在vuex中，应该遍历所有的模块的mutations和actions，建立一个数组来存储同名方法，采用发布订阅的方式，该数组则为订阅方，而在commit方法中，发布mutations，在dispatch方法中，发布actions