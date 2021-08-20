---
title: "concurrentHashMap使用场景"
date: 2021-08-17T13:48:22+08:00
draft: false
author: LYR

 
---

如果对数据有强一致要求，则需使用 Hashtable；在大部分场景通常都是弱一致性的情况下，使用 ConcurrentHashMap 即可；如果数据量在千万级别，且存在大量增删改操作，则可以考虑使用 ConcurrentSkipListMap。

1. 抢购的过程中存在并发操作，所以需要用线程安全的容器，同时，抢购的用户会很多，应当使用链表的数据结构，这种场景往往是写多读少，还需要排队，所以 ConcurrentLinkedQueue应该是最合适的
   -  ConcurrentLinkedQueue是基于CAS乐观锁来实现线程安全。ConcurrentLinkedQueue是无界的，所以使用的时候要特别注意内存溢出问题。

CopyOnWrite在副本写时，是需要加锁的。

![image-20210820135650558](https://cdn.jsdelivr.net/gh/lyr-2000/images_repo_2021_ASUS/2021_08_20_13__56_52image-20210820135650558.png)

