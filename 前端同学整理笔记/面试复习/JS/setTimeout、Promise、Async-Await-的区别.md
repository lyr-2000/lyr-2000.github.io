---
title: setTimeout、Promise、Async/Await 的区别
date: 2020-08-13 11:10:02
tags:
	- 前端
	- JavaScript
categories: 前端
---

主要是考察这三者在事件循环中的区别，事件循环中分为宏任务队列和微任务队列。
其中settimeout的回调函数放到宏任务队列里，等到执行栈清空以后执行；
promise.then里的回调函数会放到相应宏任务的微任务队列里，等宏任务里面的同步代码执行完再执行；async函数表示函数里面可能会有异步方法，await后面跟一个表达式，async方法执行时，遇到await会立即执行表达式，然后把表达式后面的代码放到微任务队列里，让出执行栈让同步代码先执行。