---
title: "jvm什么时候进行垃圾回收"
date: 2021-08-17T13:48:22+08:00
draft: false
author: LYR
---



###  什么是 JNI

java native interface，api 底层实现是 c 和 c++



### java GC root  有哪些

1. Class
2. Thread ，活着的线程
3. Stack Local ,java 方法的Local变量参数
4. JNI local
5. Jni Global
6. monitor Used , 用于同步的监控对象
7. Held by JVM , 用于 jvm 特殊目的有 GC 保留的对象。 







### JVM 什么时候进行 垃圾回收





### young GC 什么时候， old GC 什么时候

在新生代中，使用“停止-复制”算法进行清理，将新生代内存分为2部分，1部分 Eden区较大，1部分Survivor比较小，并被划分为两个等量的部分。每次进行清理时，将Eden区和一个Survivor中仍然存活的对象拷贝到 另一个Survivor中，然后清理掉Eden和刚才的Survivor。



由于绝大部分的对象都是短命的，甚至存活不到Survivor中，所以，Eden区与Survivor的比例较大，HotSpot默认是 8:1，即分别占新生代的80%，10%，10%。如果一次回收中，Survivor+Eden中存活下来的内存超过了10%，则需要将一部分对象分配到 老年代。用-XX:SurvivorRatio参数来配置Eden区域Survivor区的容量比值，默认是8，代表Eden：Survivor1：Survivor2=8:1:1.





新生代满了之后就会触发 young GC 进行 垃圾回收

老年代满了之后进行 OLD gc 垃圾回收，分配大对象，如果老年代不够了，也会进行 OLD gc 垃圾回收，如果 gc后还不够，就会 OOM









非堆内存分配：
JVM使用-XX:PermSize设置非堆内存初始值，默认是物理内存的1/64；
由XX:MaxPermSize设置最大非堆内存的大小，默认是物理内存的1/4。
-Xmn2G：设置年轻代大小为2G。
-XX:SurvivorRatio，设置年轻代中Eden区与Survivor区的比值。









###  G1 收集器

G1 将 java 堆内存 分为大小相等的独立区域 (Region ),

1. JVM 最多可以有 2048个 region
2. 一般region大小等于 堆大小/2048
   1. $ regionSize = HeapSize/2048 $
      1. 比如堆内存大小为  4096， 那么每个 region大小为 2M，
      2. 也可以设置参数 `-XX:G1HeapRegionSize` 手动指定 region大小，但是推荐用默认的计算方式
   2. G1 有点复制算法，有点类型标记整理算法这种
   3. G1 也是分代收集的理论 【 逻辑分代收集 】
      1. 卡表的概念：每个eden区域都有一块卡表 
      2. 在 G1 里面 每一个区域都有一个 卡表
      3. 



###  zgc 【垃圾收集器】



[学习视频](https://www.bilibili.com/video/BV1jN411Q7rd?from=search&seid=15326238897104805783&spm_id_from=333.337.0.0)

只有 根对象扫描的时候会 stop the world







###  内存对齐原理

[相关博客](https://zhuanlan.zhihu.com/p/30007037)

虽说如此，但是很多场景下我们对性能十分讲究，用的可能也不是Intel的CPU，比如一些嵌入式设备，又或者说游戏引擎开发，可谓是极尽性能之能事，这时候必须要小心翼翼，避免任何有可能影响存取速度的地方，以“榨干”机器的性能。

又比如，没有考虑内存对齐的时候，有些内存是“空着”的，也无法利用，这时候对于一些内存极小的设备来说，就必须要争取利用每一块可能的内存，避免空间浪费。



个人见解，如有错误欢迎指正~

**所以，内存对齐最最底层的原因是内存的IO是以8个字节64bit为单位进行的。** 对于64位数据宽度的内存，假如cpu也是64位的cpu（现在的计算机基本都是这样的），每次内存IO获取数据都是从同行同列的8个bank中各自读取一个字节拼起来的。从内存的0地址开始，0-7字节的数据可以一次IO读取出来，8-15字节的数据也可以一次读取出来。

换个例子，假如你指定要获取的是0x0001-0x0008，也是8字节，但是不是0开头的，内存需要怎么工作呢？没有好办法，内存只好先工作一次把0x0000-0x0007取出来，然后再把0x0008-0x0015取出来，把两次的结果都返回给你。 CPU和内存IO的硬件限制导致没办法一次跨在两个数据宽度中间进行IO。这样你的应用程序就会变慢，算是计算机因为你不懂内存对齐而给你的一点点惩罚。

> **扩展1：**事实上，编译和链接器会自动替开发者对齐内存的，尽量帮你保证一个变量不跨列寻址。但是他不能做到十分完美。
> **扩展2：**其实在内存硬件层上，还有操作系统层。操作系统还管理了CPU的一级、二级、三级缓存。不知道你有没有印象，我们前面的文章说过高速缓存里的Cache Line也是64字节，它是内存IO的整数倍，不会让内存IO浪费。









###  记忆集和卡表



https://blog.csdn.net/shangshanzixu/article/details/113918994





### 漏标问题怎么解决

https://blog.csdn.net/qq_34707456/article/details/111166356?utm_medium=distribute.pc_relevant.none-task-blog-2~default~baidujs_title~default-1.no_search_link&spm=1001.2101.3001.4242





