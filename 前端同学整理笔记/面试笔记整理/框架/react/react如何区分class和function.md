在React中，支持使用class和function来声明一个组件，而实际上，我们在使用这个组件时，因为class和function的不同，所以我们的使用也存在不同

我们知道，function是可以直接调用的，但是class是需要通过new去创建一个实例来使用的

function
```javascript
// 你的代码
function Greeting() {
  return <p>Hello</p>;
}

// React 内部
const result = Greeting(props); // <p>Hello</p>
```
class
```javascript
// 你的代码
class Greeting extends React.Component {
  render() {
    return <p>Hello</p>;
  }
}

// React 内部
const instance = new Greeting(props); // Greeting {}
const result = instance.render(); // <p>Hello</p>
```
虽然使用时不一样，但实际上我们的目标都是去获取渲染后的节点


首先，理解为什么要将function和class区分开很重要，我们需要先理解new的使用，下面是我自己实现的一个new
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
我们知道，new是通过创建一个新的对象，然后将方法中的this绑定在这个对象上，然后执行方法，如果方法返回的是原始类型，那么就返回新创建的这个对象，如果返回的是一个引用类型诸如对象和数组，那么就会返回这个引用类型

实际上，如果我们允许不采用new来调用一个类，那么很可能导致的结果是，创建的新实例的this会指向undefined或者window，甚至会创建了window.name这种属性

而我们也要清楚，当我们在使用React的时候，实际上经常会用到babel进行一个编译的操作，而在babel中，虽然早期类不加new也可以被调用，但现在已经被修复了，通过添加了额外的代码来实现修复
```javascript
function Person(name) {
  // 稍微简化了一下 Babel 的输出：
  if (!(this instanceof Person)) {
    throw new TypeError("Cannot call a class as a function");
  }
  // Our code:
  this.name = name;
}

new Person('Fred'); // ✅ OK
Person('George');   // 🔴 无法把类当做函数来调用
```

那么，现在的问题在于，我们在使用class的时候需要使用new去调用，而使用function不用，虽然在js里面我们可以对class和function进行一个区分，但是对于babel编译后的类，在浏览器看来，它和function只是不同的函数。

## 我们可以在每次调用前都添加一个new吗
虽然即使是常规函数，我们通过new来进行一个调用也不会有问题。在没有class之前我们也会采用function来模拟一个类，但实际上，函数组件是不可取的

我们可以看以下两个理由

首先，箭头函数，我们知道，箭头函数本身没有自己的this，箭头函数内部的this，指向了箭头函数所在的那个作用域的this，因此，我们无法对一个箭头函数使用new来构造，而函数组件却是允许我们采用箭头函数

此外，上面已经提到过，new在使用时，本身函数如果返回了一个原始类型的话，最终会返回的是一个新创建的对象，而我们在使用函数组件的时候，有的时候是会返回一个纯文本的，因此直接添加一个new，会使得我们无法直接返回一个纯文本

## 判断方法
看过别人的博客，才理解到，实际上上面我们考虑的，是对于所有的函数和类，去做一个判断区分，这是一个笼统的问题，但实际上，我们是可以去解决一个具体的问题，区分一个组件是class或者function

如何去区分，我们可以想到的是，当我们使用function的时候，我们是直接声明一个function，那，我们使用class的时候呢，会去**继承**一个React.Component

看到继承我想你应该有思路了，我们可以通过判断原型链上是否有React.Component去判断我们用了class还是function

谈到原型链，我们可以先看看下面这段代码
```javascript
class A {}
class B extends A {}

console.log(B.prototype instanceof A); // true
```
这段代码咋一看，好像没什么问题，但仔细想想，```class B extends A {}```这段代码，是什么继承了A，是B这个类吗？不是啊，是B的实例，那么为什么，```B.prototype instanceof A```会返回true，这里就要扯一下__proto__和prototype了

首先有一个问题，下面这段代码，会打印什么
```javascript
function Person(){}
console.log(Person.prototype === Person.__proto__)
console.log(Person.prototype === new Person().__proto__)
```
答案是false true

这里就说明了Person.prototype实际上指的不是Person的原型（我感觉这个误导了很多人），而是指向了它创建的实例的原型，当然，如果这里的Person返回了一个引用类型的话，那第二个console也会返回一个false

通过上面的代码和描述，我们也明白了，原型链实际上，更像是obj.__proto__.__proto__.__proto__这种形式

知道原型链的继承方式后，我们来看看class的extends，看起来似乎是一种新的继承方式，但实际上，还是基于原型链实现的继承,因此，我们可以通过原型链，来判断一个组件function还是class

方便的是，instanceof就是通过原型链来进行类型判断的,因此我们可以直接采用instanceof来进行判断

然而React并不是这么做的，具体可见https://overreacted.io/zh-hans/how-does-react-tell-a-class-from-a-function/

本文亦参考https://overreacted.io/zh-hans/how-does-react-tell-a-class-from-a-function/