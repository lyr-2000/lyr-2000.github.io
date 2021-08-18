---
title: "LongAdder源码"
date: 2021-08-17T13:48:22+08:00
draft: false
author: LYR

---







### LongAdder源码学习

[学习视频参考](https://www.bilibili.com/video/BV16J411h7Rd?p=177)



```java
     /** Number of CPUS, to place bound on table size */
    static final int NCPU = Runtime.getRuntime().availableProcessors();

    /**
     * 单元格表。当非空时，大小为 2 的功率。
     */
    transient volatile Cell[] cells;

    /**
     * 基本值，主要用于没有争用时，但也作为
     * 在表初始化比赛期间的回退。通过 CAS 更新。
     */
    transient volatile long base;

    /**
     * 调整大小和/或创建单元格时使用的旋转锁（通过 CAS 锁定）。
     * 1表示加锁，0表示没加锁
     *  创建和扩容的时候，都是置为1
     */
    transient volatile int cellsBusy;

```





### 缓存行伪共享问题

![image-20210818144436503](https://cdn.jsdelivr.net/gh/lyr-2000/images_repo_2021_ASUS/2021_08_18_14__44_36image-20210818144436503.png)

cycle 表示1个时钟周期





![image-20210818144507439](https://cdn.jsdelivr.net/gh/lyr-2000/images_repo_2021_ASUS/2021_08_18_14__45_07image-20210818144507439.png)

CPU3级缓存是将内存中的数据预先读入 缓存，加快访问速度



![image-20210818144711613](https://cdn.jsdelivr.net/gh/lyr-2000/images_repo_2021_ASUS/2021_08_18_14__47_11image-20210818144711613.png)





一个 cell 单位是24 字节（16字节的对象头和8字节的value）

- core-0 修改 cell[0]
- core-1 修改 cell[1]



无论谁修改成功，其他的 cell都会缓存行失效， 解决的方法就是 加 padding， 让一个 cell 占用整个缓存行





```
*表项属于Cell类;
    原子长填充的一种变体
*(通过@sun.misc.Contended)来减少缓存争用。
    填充
*对于大多数原子来说是多余的，因为它们通常是
*不规则地分散在内存中，因此不会产生太多干扰
*彼此之间。
    但是驻留在数组中的原子对象会
*倾向于相邻放置，大多数也是如此
*经常共享缓存线(具有巨大的负面性能)
*冲击)没有这个预防措施。
前后 加了 128字节的空隙， 
```

