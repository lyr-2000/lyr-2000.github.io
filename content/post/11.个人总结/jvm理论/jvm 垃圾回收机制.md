---
title: "jvm什么时候进行垃圾回收"
date: 2021-08-17T13:48:22+08:00
draft: false
author: LYR
---



### JVM 什么时候进行 垃圾回收





### young GC 什么时候， old GC 什么时候

在新生代中，使用“停止-复制”算法进行清理，将新生代内存分为2部分，1部分 Eden区较大，1部分Survivor比较小，并被划分为两个等量的部分。每次进行清理时，将Eden区和一个Survivor中仍然存活的对象拷贝到 另一个Survivor中，然后清理掉Eden和刚才的Survivor。



由于绝大部分的对象都是短命的，甚至存活不到Survivor中，所以，Eden区与Survivor的比例较大，HotSpot默认是 8:1，即分别占新生代的80%，10%，10%。如果一次回收中，Survivor+Eden中存活下来的内存超过了10%，则需要将一部分对象分配到 老年代。用-XX:SurvivorRatio参数来配置Eden区域Survivor区的容量比值，默认是8，代表Eden：Survivor1：Survivor2=8:1:1.





新生代满了之后就会触发 young GC 进行 垃圾回收

老年代满了之后进行 OLD gc 垃圾回收，分配大对象，如果老年代不够了，也会进行 OLD gc 垃圾回收，如果 gc后还不够，就会 OOM

























