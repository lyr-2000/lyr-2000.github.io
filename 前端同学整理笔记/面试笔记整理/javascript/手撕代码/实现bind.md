# 要注意的点
1. bind在绑定时，第一个参数是绑定的对象，后面的参数会是传入的参数
```javascript
var foo = {
    value: 1
};

function bar(name, age) {
    console.log(this.value);
    console.log(name);
    console.log(age);

}

var bindFoo = bar.bind(foo, 'daisy');
bindFoo('18');
// 1
// daisy
// 18
```

2. 当 bind 返回的函数作为构造函数的时候，bind 时指定的 this 值会失效，但传入的参数依然生效
```javascript
var value = 2;

var foo = {
    value: 1
};

function bar(name, age) {
    this.habit = 'shopping';
    console.log(this.value);
    console.log(name);
    console.log(age);
}

bar.prototype.friend = 'kevin';

var bindFoo = bar.bind(foo, 'daisy');

var obj = new bindFoo('18');
// undefined
// daisy
// 18
console.log(obj.habit);
console.log(obj.friend);
// shopping
// kevin
```


```javascript
Function.prototype.bind2 = function (context) {

    if (typeof this !== "function") {
      throw new Error("Function.prototype.bind - what is trying to be bound is not callable");
    }

    var self = this;
    var args = Array.prototype.slice.call(arguments, 1);

    var fNOP = function () {};

    var fBound = function () {
        var bindArgs = Array.prototype.slice.call(arguments);
        self.apply(this instanceof fNOP ? this : context, args.concat(bindArgs));
    }

    fNOP.prototype = this.prototype;
    fBound.prototype = new fNOP();
    return fBound;
}
```

```javascript
Function.prototype.bind2 = function(context,...rest){
    if(typeof this !== "function"){
        throw new TypeError("Uncaught TypeError: Bind must be called on a function") // 不是函数时抛出错误
    }
    var self = this // 保存这个方法
    var Fn = function () {} // 使用一个空函数做为继承的中间函数
    var fBound = function (...inRest){
        self.apply(this instanceof Fn ? this : context, rest.concat(inRest))
    }
    
    // 本来可以通过fBound.prototype = self.prototype实现原型链绑定
    // 但是这也当我们改变fBound.prototype时，因为和self也就是原函数使用了同一个引用，所以会修改原函数的prototype

    Fn.prototype = self.prototype
    fBound.prototype = new Fn()
    return fBound
}
```