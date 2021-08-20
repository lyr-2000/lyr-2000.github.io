---
title: "java_优化_容器优化"
date: 2021-08-17T13:48:22+08:00
draft: false
author: LYR
---

arraylist换成线程安全的copyOnwriteList就可以解决线程不安全问题?

copyOnwriteList更适合某一时间段统一新增，且新增时避免大量操作容器发生。比较适合在深夜更新黑名单类似的业务。



