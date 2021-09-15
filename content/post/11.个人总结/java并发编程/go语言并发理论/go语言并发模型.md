---
title: "go语言并发模型"
date: 2021-08-17T13:48:22+08:00
draft: false
author: LYR


---

[参考的文档教程](https://www.bookstack.cn/read/aceld-golang/2%E3%80%81Golang%E7%9A%84%E5%8D%8F%E7%A8%8B%E8%B0%83%E5%BA%A6%E5%99%A8%E5%8E%9F%E7%90%86%E5%8F%8AGMP%E8%AE%BE%E8%AE%A1%E6%80%9D%E6%83%B3%EF%BC%9F.md#cgh9vc)

### 基础知识和结论

- Java使用的是一对一线程模型，所以它的一个线程对应于一个内核线程，调度完全交给操作系统来处理；
- Go语言使用的是多对多线程模型，这也是其高并发的原因，它的线程模型与Java中的ForkJoinPool非常类似；
- python的gevent使用的是多对一线程模型；
- 操作系统一般只实现到一对一模型；
- 线程分为用户线程和内核线程；









## 协程的原理

多进程、多线程已经提高了系统的并发能力，但是在当今互联网高并发场景下，为每个任务都创建一个线程是不现实的，因为会消耗大量的内存(进程虚拟内存会占用4GB[32位操作系统], 而线程也要大约4MB)。

大量的进程/线程出现了新的问题

- 高内存占用
- 调度的高消耗CPU

####  N:1关系



![go线程并发原理-09](https://static.sitestack.cn/projects/aceld-golang/images/10-N-1%E5%85%B3%E7%B3%BB.png)



N个协程绑定1个线程，优点就是**协程在用户态线程即完成切换，不会陷入到内核态，这种切换非常的轻量快速**。但也有很大的**缺点**，**1个进程的所有协程都绑定在1个线程上**

**缺点**：

- 某个程序用不了硬件的多核加速能力 【本质上还是单线程执行】
- 一旦某协程阻塞，造成线程阻塞，本进程的其他协程都无法执行了，根本就没有并发的能力了。







#### 1:1 关系

1个线程对应一个协程，这种和 java的线程有个毛线区别， 不一样是耗费资源严重吗？ 不说了

- 线程的创建、删除、切换代价都有CPU完成，代价略显昂贵



#### M:N 关系实现原理

M个协程绑定1个线程，是N:1和1:1类型的结合，克服了以上2种模型的缺点，但实现起来最为复杂。

![https://static.sitestack.cn/projects/aceld-golang/images/12-m-n.png](https://static.sitestack.cn/projects/aceld-golang/images/12-m-n.png)





###  go语言协程的应用



Go中，协程被称为goroutine，它非常轻量，一个goroutine只占几KB，并且这几KB就足够goroutine运行完，这就能在有限的内存空间内支持大量goroutine，支持了更多的并发。虽然一个goroutine的栈只占几KB，但实际是可伸缩的，如果需要更多内容，`runtime`会自动为goroutine分配。





###  go语言逃逸分析原理

[go语言逃逸分析原理](https://www.bookstack.cn/read/aceld-golang/3%E3%80%81Golang%E4%B8%AD%E9%80%83%E9%80%B8%E7%8E%B0%E8%B1%A1,%E5%8F%98%E9%87%8F%E2%80%9C%E4%BD%95%E6%97%B6%E6%A0%88%E4%BD%95%E6%97%B6%E5%A0%86%E2%80%9D.md)













