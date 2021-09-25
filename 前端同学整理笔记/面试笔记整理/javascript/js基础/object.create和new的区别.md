1. Object.create的参数可以为函数，也可以为对象，而new的话只能是函数
2. 使用new来构造时，构造出来的对象有构造函数的属性，而Object.create没有，要在其第二个参数来写明
3. 使用Object.create(null)可以实现一个没有继承的空对象，而new做不到