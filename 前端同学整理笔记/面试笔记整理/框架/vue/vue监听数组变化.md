# 改变数组长度无法触发视图更新
在vue中，我们可能会有这种情况，修改了数组的长度，但是视图没有发生更新
```html
<template>
  <div id="app">
      <div v-for="(item,index) in arr" :key="index">
        {{index}}:{{item}}
      </div>
      <button @click="click">btn</button>
  </div>
</template>
```
```javascript
export default {
  name: 'app',
  data(){
    return{
      arr:[1,2,3,4,5]
    }
  },
  methods:{
    click:function(){
      this.arr.length=6
      console.log('this.arr: ', this.arr)
    }
  }
}
```
![在这里插入图片描述](https://img-blog.csdnimg.cn/20200913132329489.png#pic_center)
可以看到数组的长度已经变成了6，最后一个为empty，但是却没触发视图的更新
![在这里插入图片描述](https://img-blog.csdnimg.cn/20200913134135433.png#pic_center)

而当我们在点击方法后面添加一个push操作，就会触发视图的更新
```javascript
export default {
  name: 'app',
  data(){
    return{
      arr:[1,2,3,4,5]
    }
  },
  methods:{
    click:function(){
      this.arr.length=6
      console.log('this.arr: ', this.arr)
      this.arr.push(7)
      console.log('this.arr: ', this.arr)
    }
  }
}
```
![在这里插入图片描述](https://img-blog.csdnimg.cn/20200913134359481.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3plbXByb2dyYW0=,size_16,color_FFFFFF,t_70#pic_center)

可以看到，视图发生了更新，```this.arr.length=6```触发的数组变化

我们试着不用push，直接给arr上某个成员变量重新赋值
```javascript
export default {
  name: 'app',
  data(){
    return{
      arr:[1,2,3,4,5]
    }
  },
  methods:{
    click:function(){
      this.arr.length=6
      console.log('this.arr: ', this.arr)
      this.arr[0] = 2
      console.log('this.arr: ', this.arr)
    }
  }
}
```
点击发现视图也是没有发现变化

为什么使用push，数组会发生变化，但是改变长度和数组成员就无效呢，我们可以从源码去进行解析


# 源码解析
我们知道，在vue里面，其核心双向绑定的实现，是通过Object.defineProperty()（在vue3中使用了proxy）来劫持对象的，但Object.defineProperty()无法劫持数组成员的变化，而实际上，我们在使用vue的时候，当我们通过push，splice，pop等方法去修改数组的时候，是会触发响应式更新的，那么vue是怎么做到的呢

实际上，vue重写了这些方法

vue/src/core/observer/array.js
```javascript
/*
 * not type checking this file because flow doesn't play well with
 * dynamically accessing methods on Array prototype
 */

import { def } from '../util/index'

const arrayProto = Array.prototype
export const arrayMethods = Object.create(arrayProto)

const methodsToPatch = [ // 将要重写的方法放在一个数组中
  'push',
  'pop',
  'shift',
  'unshift',
  'splice',
  'sort',
  'reverse'
]

/**
 * Intercept mutating methods and emit events
 */
methodsToPatch.forEach(function (method) {
  // cache original method
  const original = arrayProto[method] // 得到原来的方法
  def(arrayMethods, method, function mutator (...args) { // 将重写的方法定义到arrayMethods上，mutator就是重写的方法
    const result = original.apply(this, args) // 执行原方法得到结果
    const ob = this.__ob__
    let inserted
    switch (method) {
      case 'push':
      case 'unshift':
        inserted = args
        break
      case 'splice':
        inserted = args.slice(2)
        break
    }
    if (inserted) ob.observeArray(inserted)
    // notify change
    ob.dep.notify() // 发布订阅，触发视图更新
    return result
  })
})
```

将这些方法重写到arrayMethods上之后，我们还需要将data上的数组对应的方法改成我们定义的方法，所以需要在Ovserver中对数组的监听做额外的处理
vue/src/core/observer/index.js
```javascript
import { arrayMethods } from './array' // 引入在array中我们重定义的方法
export class Observer {
  value: any;
  dep: Dep;
  vmCount: number; // number of vms that have this object as root $data

  constructor (value: any) {
    this.value = value
    this.dep = new Dep()
    this.vmCount = 0
    def(value, '__ob__', this)
    if (Array.isArray(value)) { // 判断为数组
      if (hasProto) { // 如果有__prop__，则将数组的__prop__指向arrayMethods
        protoAugment(value, arrayMethods)
      } else {
        copyAugment(value, arrayMethods, arrayKeys) // 否则直接把重写的方法写在数组上
      }
      this.observeArray(value) // 监听数组里的每个成员
    } else {
      this.walk(value)
    }
  }
  // ...
  observeArray (items: Array<any>) {
    for (let i = 0, l = items.length; i < l; i++) {
      observe(items[i])
    }
  }
}
// ...
function protoAugment (target, src: Object) {
  /* eslint-disable no-proto */
  target.__proto__ = src
  /* eslint-enable no-proto */
}

function copyAugment (target: Object, src: Object, keys: Array<string>) {
  for (let i = 0, l = keys.length; i < l; i++) {
    const key = keys[i]
    def(target, key, src[key])
  }
}
```

# 回到问题
现在我们可以知道，为什么用push可以，而直接修改length和数组成员不行了

vue对于数组的处理，是将push，pop，splice等多个数组操作的方法重写，在调用这些方法的时候就去触发视图的更新

所以就会出现这样的情况
当我们调用这个方法的时候，视图没有更新
```javascript
click:function(){
    this.arr.length=6
    console.log('this.arr: ', this.arr)
}
```
但是当我们调用push，即使我们没有push进任何东西，依然会引起视图的更新
```javascript
click:function(){
    this.arr.length=6
    console.log('this.arr: ', this.arr)
    this.arr.push()
    console.log('this.arr: ', this.arr)
}
```
![在这里插入图片描述](https://img-blog.csdnimg.cn/20200913142924136.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3plbXByb2dyYW0=,size_16,color_FFFFFF,t_70#pic_center)
