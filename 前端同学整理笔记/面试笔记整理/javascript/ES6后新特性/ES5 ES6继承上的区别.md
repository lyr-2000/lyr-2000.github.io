在ES5中，我们是通过function来实现类和类的继承，而在ES6中，我们多了class这个语法糖，除了看起来更像一个类外，在很多方面class做到了比function更加严格
## 1. 写法上
在ES5中，我们是通过prototype和Object.create()来实现类和继承
```javascript
function Person(){}
function Student(){}
Student.prototype = new Person()
```
而在ES6中，我们使用class语法，通过extends来实现类和继承，但实际原理还是通过原型链实现的
```javascript
class Person{}
class Student extends Person{}
```

## 2. 提升上的区别
在ES5中的function是可以提升的，如下代码是没问题的
```javascript
var foo = new Foo()
function Foo(){
    this.foo = 42
}
```

在JavaScript引擎扫描代码发现变量声明的时候，如果遇到变量声明的时候，如果是为var或者没有声明符直接使用赋值，又或者是使用function的时候，就会提升到作用域顶部，而如果遇到let，const时，会将变量声明放到暂时性死区TDZ中，如果访问TDZ中的变量就会导致错误，直到我们执行到这句声明的时候，才会将其从TDZ中拿出来

而class和let，const一样，所以在下面两种情况中会报错
```javascript
var foo = new Foo()
class Foo{
    constructor(){
        this.foo = 42
    }
}
// Uncaught ReferenceError: Foo is not defined
```
```javascript
function Foo(){
    this.foo = 42
}
{
    var foo = new Foo()
    class Foo{
        constructor(){
            this.foo = 42
        }
    }
}
// Uncaught SyntaxError: Identifier 'Foo' has already been declared
```
之所以再举下面这个例子，就是为了说明class和let，const一样具有块级作用域的概念，这里的new Foo()不会去找到块级作用域外的Foo，就是因为当前块级作用域中的暂时性死区里面已经有Foo了

## 3.class内部会采用严格模式
在ES5中的function中，默认是使用非严格模式的，如下
```javascript
function Foo(){
    foo = 42
}
```
而在ES6的class中，因为使用了严格模式，所以下面的写法是错误的
```javascript
class Foo{
    constructor(){
        fo = 42
    }
}
var foo = new Foo() 
// Uncaught ReferenceError: fo is not defined
```

## 4. class的方法无法被枚举
在ES5的function中的方法，可以被枚举出来
```javascript
function Foo(){
    this.foo = 42
}
Foo.fn = function(){}
Foo.prototype.pro = function(){}
Object.keys(Foo)
// ["fn"]
Object.keys(Foo.prototype)
// ["pro"]
```

在ES6的class中的方法，无法被枚举出来
```javascript
class Foo{
    constructor(){
        this.foo = 42
    }
    fn(){}
    static sfn(){}
}
Object.keys(Foo)
// []
Object.keys(Foo.prototype)
// []
```

## 5. class的方法没有原型对象，无法使用new来调用
在ES5中，我们在function上和其原型对象上建立的函数，都是有原型对象的，因此可以通过new来构造一个对象
```javascript
function Foo(){
    this.foo = 42
}
Foo.fn = function(){}
var fn = new Foo.fn()
Foo.pro = function(){}
var pro = new Foo.pro()
```
但在class中的方法，是不能通过new来构造一个对象的
```javascript
class Foo{
    constructor(){
        this.foo = 42
    }
    static sFn(){}
    fn(){}
}
var foo = new Foo()
var fn = new foo.fn()
// Uncaught TypeError: foo.fn is not a constructor
var sFn = new foo.sFn()
// Uncaught TypeError: foo.sFn is not a constructor
```

## 6. class必须使用new来调用
在ES5中，我们使用function来模拟类的，但实际上，function仍然是一个函数，所以我们还是可以直接调用函数
```javascript
function Foo(){
    this.foo = 42
}
Foo()
```
而对于class，我们不能直接调用，因为它不是一个方法
```javascript
class Foo{
    constructor(){
        this.foo = 42
    }
}
Foo()
// Uncaught TypeError: Class constructor Foo cannot be invoked without 'new'
```

## 7. class内部无法重写类名
对于function，只要当前函数作用域里面没有和当前函数名相同的变量，我们就可以直接在function内部对当前function的变量名做一个新的指向，
```javascript
function Foo(){
    this.foo = 42
    Foo = 'new Foo'
}
var f = new Foo()
console.log(Foo)
// new Foo
```
而对于class来说，这是行不通的
```javascript
class Foo{
    constructor(){
        this.foo = 42
        Foo = 'new Foo'
    }
}
var f = new Foo()
// Uncaught TypeError: Assignment to constant variable.
```
从报错里面我们可以看到，class是被当作一个const声明的值来看待的，它不允许被修改

## 8. 实现继承时的__proto__的指向不同
我们在ES5使用function实现继承时，是通过改变prototype指向做到的，如下
```javascript
function Fa(){}
function Ch(){}
Ch.prototype = new Fa()
```
此时，Ch的__proto__并没有指向父类Fa，而是指向了Function.prototype
```javascript
Ch.__proto__ === Function.prototype
// true
```
而使用ES6中的class实现类的继承的时候，__proto__是指向父类的
```javascript
class Fa{}
class Ch extends Fa{}
Ch.__proto__===Fa
// true
```