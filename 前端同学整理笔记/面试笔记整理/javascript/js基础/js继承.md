```javascript
function Person(name){
    this.name = name;
    this.greet=function(){
        console.log(`Hello , I am ${this.name}`)
    }
}
function Student(){

}
```

1. 原型链继承
```javascript
Student.prototype = new Person();
Student.prototype.name = 'Bob';
var s1 = new Student();
s1.greet(); // Hello , I am Bob
```

2. 借用构造函数
```javascript
function Student(){
    Person.call(this,'Bob');
}
var s1 = new Student();
console.log(s1.name); // Bob
```

3. 组合继承
```javascript
function Student(name){
    Person.call(this,name);
}
Student.prototype = new Person();
var s1 = new Student('Bob');
s1.greet(); // Hello , I am Bob
```

4. 原型式继承
```javascript
function Student(obj){
    function F(){}
    F.prototype = obj;
    return new F();
}
var s1 = Student(new Person('Bob'));
s1.greet(); // Hello , I am Bob
```
原型式继承和Object.create实现继承的原理一样

5. 寄生式继承  
给原型式继承套上一个壳子
```javascript
function content(obj){
    function F(){}
    F.prototype = obj;
    return new F();
}
function Student(obj){
    var s = content(obj);
    s.age = 18;
    return s;
}
var s1 = Student(new Person('Bob'));
s1.greet(); // Hello , I am Bob
```

6. 寄生组合式继承
```javascript

```