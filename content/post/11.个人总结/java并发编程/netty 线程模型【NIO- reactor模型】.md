---
title: "netty线程模型【nio-reactor】"
date: 2021-08-17T13:48:22+08:00
draft: false
author: LYR
---



## NIO原理

![image-20210829002740868](https://cdn.jsdelivr.net/gh/lyr-2000/images_repo_2021_ASUS/2021_08_29_00__27_43image-20210829002740868.png)

设置一个场景， 从 socket里面读取数据，读到 '\n' 为止，把读到的数据写入到另一个 socket里面，这个就是 c 和 java nio的2种实现









## netty的原理

netty框架并没有完全照搬 reactor模式，但是大体上实现的原理都是一样，统一用了 一个 while死循环

这里我们叫做 eventLoop 事件循环

以在主程序中启动 Reactor 模式，需要以 `while(true){}` 的方式调用 handle_events() 方法。

```cpp
void Reactor::handle_events(){
  // 通过同步事件多路选择器提供的
  //select() 方法监听网络事件
  select(handlers);
  // 处理网络事件
  for(h in handlers){
    h.handle_event();
  }
}
// 在主程序中启动事件循环
while (true) {
  handle_events();
```



Netty 的实现虽然参考了 Reactor 模式，但是并没有完全照搬，**Netty 中最核心的概念是事件循环（EventLoop）**，其实也就是 Reactor 模式中的 Reactor，**负责监听网络事件并调用事件处理器进行处理**。在 4.x 版本的 Netty 中，网络连接和 EventLoop 是稳定的多对 1 关系，而 EventLoop 和 Java 线程是 1 对 1 关系，这里的稳定指的是关系一旦确定就不再发生变化。也就是说一个网络连接只会对应唯一的一个 EventLoop，而一个 EventLoop 也只会对应到一个 Java 线程，所以**一个网络连接只会对应到一个 Java 线程**。



 ![image-20210820003729137](https://cdn.jsdelivr.net/gh/lyr-2000/images_repo_2021_ASUS/2021_08_20_00__37_31image-20210820003729137.png)



Netty 中还有一个核心概念是**EventLoopGroup**，顾名思义，一个 EventLoopGroup 由一组 EventLoop 组成。实际使用中，一般都会创建两个 EventLoopGroup，一个称为 bossGroup，一个称为 workerGroup。为什么会有两个 EventLoopGroup 呢？



















