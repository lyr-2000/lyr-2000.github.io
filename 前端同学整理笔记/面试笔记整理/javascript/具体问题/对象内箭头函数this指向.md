```javascript
var name = "global";
function Person(name) {
    this.name  = name;
    this.sayName = () => {
        console.log(this.name)
    }
}
const personA = new Person('aaa');
const personB = new Person('bbb');
personA.sayName();
personB.sayName();
```

```
aaa
bbb
```

此处是因为使用了new 在new的执行原理中，会用到bind操作来绑定this的指向