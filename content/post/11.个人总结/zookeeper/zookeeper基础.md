---
title: "zookeeper基础学习0"
date: 2021-08-17T13:48:22+08:00
draft: false
author: LYR


---

# zookeeper 是什么



zookeeper 解决了什么问题?

ZooKeeper是—个开源的分布式协同服务系统。 ZooKeeper的
设计目标是将那些复杂且容易出错的分布式协同服务封装起来
抽象出一个高效可靠的**原语集**，并以一系列简单的接口提供给用
户使用。

zookeeper 是如何被使用的？

- Hadoop： 使用zookeeper的 namenode 的高可用
- HBase: 保证集群中只有一个master，保存集群中的regionServer 列表，保存 hbase:meta 表的位置
- kafka: 集群成员管理，controller



zookeeper的应用场景

- 配置管理（configuration management)
- dns服务
- 组成员管理 (group membership)
- 各种分布式锁

zookeeper适用于存储和协同相关的关键数据，不适合用于大数据存储







## zookeeper服务架构

这是一个 cs 架构， 应用使用 zookeeper客户端库使用 zookeeper 服务，zookeeper 客户端负责和zookeeper集群的交互

![image-20210823220651515](https://cdn.jsdelivr.net/gh/lyr-2000/images_repo_2021_ASUS/2021_08_23_22__06_53image-20210823220651515.png)



ZooKeeper的数据模型是层次模型（ Google
Chubby也是这么做的）.层次模型常见于文件
系统。层次模型和key- value模型是两种主流
的数据模型。 ZooKeeper使用文件系统模型主
要基于以下两点考虑
1.文件系统的树形结构便于表达数据之间的层
次关系。
2.文件系统的树形结构便于为不同的应用分配
独立的命名空间（ namespace）.
ZooKeeper的层次模型称作 data tree.Data
tree的每个节点叫作 znode.不同于文件系统，
每个节点都可以保存数据。每个节点都有一个版
本（ version）.版本从0开始计数。





## zookeeper 主要的4种结构

1. 持久性
2. 顺序性

22 组合可以有4种结构

1. 持久性的 znode, 这样的znode 创建之后即使发生zookeeper宕机，znode也不会消失
2. 临时性 znode, client 在指定的timeout 内没有给 zk 集群发消息，znode 就会消失
3. 持久顺序性
4. 临时顺序性

顺序性是说 每个顺序的 znode 关联一个唯一单调 递增的整数



## zookeeper 使用命令



```shell
#创建一个 app2的节点
create /app2
stat -w /app2


```





### zookeeper 实现分布式锁

分布式锁要求如果锁的持有者宕机了，锁可以被释放。 zookeeper的 ephemeral 节点恰好具备这样的特性。



##### 终端1

```shell
# 下面是线程1 调换分布式锁 的lock方法
zkCli.sh
create -e /lock
#-------- 这边经过耗时的操作
quit
# 这边 quit 之后，立刻就会触发 nodeDeleted 事件
# -------  结束 ----------

# 下面是线程2 调用分布式锁 的 lock 方法 ---------
zkCli.sh
create -e /lock
# 监听 锁节点变化
stat -w /lock
# 重试获取锁
create -e /lock

# ---------------------





```

### zk 实现分布式协同服务

zk可以实现很多的协同服务，分布式锁，分布式队列等

#### 协同服务介绍

设计一个 master-worker 的组成员管理系统，要求系统中只能有一个 master，master 能实时获取 系统中 worker的情况



 ##### 如何成为 master节点呢？

代码实现

```shell
# 成为master节点，就要在 zk 注册一个 master节点，标志自己
create -e /master "m1:8080"
# 创建节点成功了，就成为了 master节点


# --------------下面是线程2 -------------

create -e /master "m2:8081"
# 这边创建失败，因为有提示 Node already exists:/master 

# 于是我注册一个监控，监控 master节点状态变化
stat -w /master
# 节点要是被删除了，我立刻去抢夺注册成为master
create -e /master "m2:8081"
# 于是创建节点成功了。。结果: Created /master

# 监控 worker节点
ls -w /workers
# 结果 []

# ----------------注册为 worker, w1,端口号 8099 ------------
create -e /workers/w1 "w1:8099"






```







## zk 分布式队列设计













