这里要通过函数来实现new构造实例对象的功能，首先我们要明确一下new有什么作用
* 返回一个新的对象
* 把新对象的__proto__指向其后的函数/类的prototype
* 执行构造函数，传递参数，改变this的指向
* 如果函数有返回对象或者数组的话，应该返回相应的对象或者数组

这里来实现一下
```javascript
function _new(c,...args){
    if(typeof c !=="function"){
        throw new TypeError(`${c} is not a constructor`)
    }
    let obj = Object.create(c.prototype)
    let res = c.call(obj,...args)
    return typeof res === "object"?res:obj
}
```


```javascript
function Person(name,age){
    this.name = name
    this.age = age
    this.greet = function(){
        console.log(`Hello,my name is ${this.name},I am ${this.age} years old`)
    }
}
```