---
 
title: "AQS源码问题"
date: 2021-08-17T13:48:22+08:00
draft: false
author: LYR

 
---



## AQS 实现原理



```java
static final class Node {
	// waitStatus值
	static final int CANCELLED =  1;	        
	static final int SIGNAL    = -1;	        
	static final int CONDITION = -2;	
	static final int PROPAGATE = -3;
	// 节点的状态
	volatile int waitStatus;
	// 节点的前驱
	volatile Node prev;
	// 节点的后继
	volatile Node next;
	// 节点封装的线程	
	volatile Thread thread;	
}

// 头节点和尾节点
private transient volatile Node head;
private transient volatile Node tail;

```

 ![image-20210818150618687](https://cdn.jsdelivr.net/gh/lyr-2000/images_repo_2021_ASUS/2021_08_18_15__06_18image-20210818150618687.png)



## 独占式获取锁

AQS 内部维护了一个 FIFO 的队列

在AQS中维护着一个FFO的同步队列，当线程获取同步状态失败后，则会加入到这个
cLH同步队列的对尾并一直保持着自旋。在CLH同步队列中的线程在自旋时会判断其前
驱节点是否为首节点，如果为首节点则不断尝试获取同步状态，获取成功则退出CLH同
步队列。当线程执行完逻辑后，会释放同步状态，释放后会喚醒其后继节点。
共享式同步状态过程
共享式与独占式的最主要区别在于同一时刻独占式只能有一个线程获取同步状态，而共
享式在同一时刻可以有多个线程获取同步状态。例如读操作可以有多个线程同时进行，
而写操作同一时刻只能有一个线程进行写操作，其他操作都会被阻塞。



[参考学习视频](https://www.bilibili.com/video/BV1Zz4y197iF?from=search&seid=7913068938121292393)





![image-20210818151355382](https://cdn.jsdelivr.net/gh/lyr-2000/images_repo_2021_ASUS/2021_08_18_15__13_55image-20210818151355382.png)



### 共享模式

独占模式 只能有一个线程去读，共享模式可以有多个线程去读

AQS有**两种资源的共享方式**

- Exclusive（独占，只有一个线程能执行，如ReentrantLock）
- Share（共享，多个线程可同时执行，如Semaphore/CountDownLatch）

不同的自定义同步器争用共享资源的方式也不同。**自定义同步器在实现时只需要实现共享资源state的获取与释放方式即可**，至于具体线程等待队列的维护（如获取资源失败入队/唤醒出队等），AQS已经在顶层实现好了。自定义同步器实现时主要实现以下几种方法：

- isHeldExclusively()：该线程是否正在独占资源。只有用到condition才需要去实现它。
- tryAcquire(int)：独占方式。尝试获取资源，成功则返回true，失败则返回false。
- tryRelease(int)：独占方式。尝试释放资源，成功则返回true，失败则返回false。
- tryAcquireShared(int)：共享方式。尝试获取资源。负数表示失败；0表示成功，但没有剩余可用资源；正数表示成功，且有剩余资源。
- tryReleaseShared(int)：共享方式。尝试释放资源，如果释放后允许唤醒后续等待结点返回true，否则返回false。



