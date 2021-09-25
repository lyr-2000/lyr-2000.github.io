## VUEX

vue核心

1. state，用来存放公共数据
2. getter，像我们在vue中使用computed属性，getter 的返回值会根据它的依赖被缓存起来，且只有当它的依赖值发生了改变才会被重新计算。
3. mutation，可以用来修改store中的状态，比如我们要修改state中的数据，就可以使用store的commit方法，处理的是同步事务
4. action，和mutation类似，但是action提交的是mutation，而且可以包含异步操作，可以 通过dispatch方法

