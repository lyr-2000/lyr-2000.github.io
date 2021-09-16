---
title: "golang 垃圾回收机制"
date: 2021-08-17T13:48:22+08:00
draft: false
author: LYR
---

## 三色标记法原理

垃圾回收(Garbage Collection，简称GC)是编程语言中提供的自动的内存管理机制，自动释放不需要的对象，让出存储器资源，无需程序员手动执行。

 Golang中的垃圾回收主要应用三色标记法，GC过程和其他用户goroutine可并发运行，但需要一定时间的**STW(stop the world)**，STW的过程中，CPU不执行用户代码，全部用于垃圾回收，这个过程的影响很大，Golang进行了多次的迭代优化来解决这个问题。





三色标记法可以看成是标记清除算法的一种实现





![原理图1](https://static.sitestack.cn/projects/aceld-golang/images/71-%E4%B8%89%E8%89%B2%E6%A0%87%E8%AE%B0%E6%8F%92%E5%85%A5%E5%86%99%E5%B1%8F%E9%9A%9C11.jpeg)

 Golang中的混合写屏障满足`弱三色不变式`，结合了删除写屏障和插入写屏障的优点，只需要在开始时并发扫描各个goroutine的栈，使其变黑并一直保持，这个过程不需要STW，而标记结束后，因为栈在扫描后始终是黑色的，也无需再进行re-scan操作了，减少了STW的时间。



[相关学习文档](https://www.bookstack.cn/read/aceld-golang/8%E3%80%81%E7%B2%BE%E9%80%9AGolang%E9%A1%B9%E7%9B%AE%E4%BE%9D%E8%B5%96Gomodules.md)









