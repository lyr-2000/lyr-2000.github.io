---
title: "java gc 垃圾回收机制"
date: 2021-08-17T13:48:22+08:00
draft: false
author: LYR


---

####  内存布局



### 常见的垃圾回收算法

####  GC 的一些名词

1. Minor GC
   1. 新生代空间，eden,survivor 区域回收的叫做minor GC
2. Major GC
   1. 清理Tenured区， 用于回收老年代，出现 Major GC 通常会出现至少一次Minor GC
   2. 清理 Tenured区域，老年代的回收， 出现Major GC 通常至少一次 Minor GC 【可以理解为FUL GC】
3. FULL GC  【概念上： FULL GC = Major GC + Minor GC + 清理元空间等区域】
   1. 包括整个元空间（metaspace,【永久代】）， 新生代，老年代的全局GC

####  OOM 异常排查

1. top指令



####  常见的垃圾收集算法

1. 





####  必问的垃圾收集器

1. G1垃圾收集器
   - 主要步骤： 初始标记，并发标记，重新标记，复制清除
   - 使用算法： 复制+ 标记整理

2. CMS 垃圾收集器
   - 初始标记 【stop the world】
   - 并发标记
   - 重新标记 【stop the world】
   - 并发清理 【cms concurrent sweep】 阶段
   - 使用算法： 复制+标记清理

CMS 和 G1的对比

1. G1 在压缩空间有优势
2. G1将内存空间分成区域(Region) 的方式避免内存碎片问题
3. Eden ,





####  常见的参数

-Xint , 表示禁用JIT， 所有字节码都被解释运行， 这个模式速度最慢

-Xmixed, 默认模式，让JIT 根据程序运行的情况，有选择的将某些代码编译成本地代码



####  GC 调优

##### 目的

1. GC 的时间够短
2. GC 的次数够少
3. 发生 FULL GC 的周期足够的长，时间合理，最好是不发生



####  内存分配次数

- Xms: 初始堆的大小  `java **-Xmx3550m -Xms3550m -Xmn2g** **-Xss128k**`

- Xmx: 最大堆大小
- Xss： 每个线程 的 stack大小
- XX: SurvivorRatio=n, 年轻代中： $eden/s_1$ 区域的比值, 比如 n = 8, eden=8, 那么 s1 = 1, s2和s1 一样也是1
- XX:MaxPermSize=n: 设置持久代的大小





####  debug 进程的命令

- jps, 现在 process show 当前的 java进程
- jinfo,  运行环境参数
- jstat , 监视运行状态
- jstack 观察到 jvM中当前所有线程的运行情况
- jmap







