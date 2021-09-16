---
title: "java并发八股"
date: 2021-08-17T13:48:22+08:00
draft: false
author: LYR


---

## java 并发八股文

####  java 线程的几种状态

- 新建状态： 当创建一个线程时， 此线程进入新建状态，但此时还未启动

- 就绪状态，调用 start后，处于就绪状态【可运行状态】 等待被CPU调度

- 运行状态， 获得CPU的使用权

- 阻塞状态，放弃 CPU的使用权

  - 等待阻塞
  - 同步阻塞
  - 其他阻塞

- 死亡状态，退出了 run方法

  - `new Thread().start()` 默认为 非守护线程【所有线程执行完成才退出】
  - `thread.setDoamen(true)` 设置为守护线程， jvm不关心守护线程

  







## 线程池原理



1. 创建线程池：
   1. 核心线程数
   2. 最大线程数
   3. keepaliveTime 最大线程的存活时间
   4. 任务队列
   5. 线程工厂
   6. 拒绝策略

2. 核心线程数是线程池里面最小 初始化的线程数，
   1. 流程： 任务先提交到核心线程运行，
   2. 如果核心线程不空闲，就提交到等待队列
   3. 等待队列满的话，就尝试尝试创建线程去处理任务
   4. 如果已经最大线程数了，没有空闲线程，执行拒绝策略



## hashMap 相关公式

1. 计算哈希值公式：
   - $hash = hashCode \wedge (hashCode>>>16)$
   - 高16位和 低16位异或，加大散列程度

2. 计算槽位公式：
   1. $index = (n-1)\&hash$
   2. 满足条件 ： $n=2^k$,  即 n 是 2的幂

3. 高低位链迁移条件：
   1.  $condition = e.hash \&   oldCap$
   2. 如果得到0 ，放入低位链
   3. 如果得到1， 放入高位链
   4. 公式：
      1. $low\_index = j$
      2. $hi\_index = j+oldCap$

4. 扩容阈值相关公式：

   1. 数组扩容：

      1. $newCap = oldCap<<1$ ， 2倍扩容

   2. 阈值公式：

      1. hashMap初始化的时候

         1. $newThr = default\_load\_factor*default\_initial\_capacity$

      2. 小于容量限制时候：

         1. $newThr = oldThr << 1$ , 直接就是原来的2倍，到达这个阈值，就会触发扩容，并且修改 新阈值

      3. oldCap 已经超过最大容量了，无法扩容，就将阈值设为无穷大

         1. $threshold = INF$

      4. 加载因子公式： $default\_load\_factor = 0.75f$

         



## concurrentHashMap 核心公式

### sizeCtl 字段取值

1. -1 正在创建 table
2. $-N$ 表示 $N-1$ 个线程正在复制 table
3. 在 table 被初始化前，代表根据构造函数传入的值计算出的应被初始化的大小
4. 在 table 被初始化后，则被设置为 table 大小 的 75%，代表 table 的容量（数组容量）。











## ThreadLocal 源码

ThreadLocalMap 的 Entry 的那个 key 是一个弱引用，也就是说 ThreadLocal 对象被回收的话，他是不影响的， 【弱引用不参与root算法】

原理：

1.  ThreadLocal 作为 key 存放在 线程对象的ThreadLocalMap 内



源码：

```java
public
class Thread implements Runnable {
    /* Make sure registerNatives is the first thing <clinit> does. */
    private static native void registerNatives();
    static {
        registerNatives();
    }
    
    ...
    
    /* ThreadLocal values pertaining to this thread. This map is maintained
     * by the ThreadLocal class. */
    ThreadLocal.ThreadLocalMap threadLocals = null;

    /*
     * InheritableThreadLocal values pertaining to this thread. This map is
     * maintained by the InheritableThreadLocal class.
     */
    ThreadLocal.ThreadLocalMap inheritableThreadLocals = null;    
    
```



```java
  /**
     * 类似HashMap，进行元素存取时，要清理遇到的垃圾值，且合并原先紧密相邻的元素（除去垃圾值会造成新空槽）
     */
    static class ThreadLocalMap {

        /**
         * 键值对实体的存储结构
         */
        static class Entry extends WeakReference<ThreadLocal<?>> {
            /**
             * 当前线程关联的 value，这个 value 并没有用弱引用追踪
             */
            Object value;

            /**
             * 构造键值对
             *
             * @param k k 作 key,作为 key 的 ThreadLocal 会被包装为一个弱引用
             * @param v v 作 value
             */
            Entry(ThreadLocal<?> k, Object v) {
                super(k);
                value = v;
            }
        }

```



入代码说是：

	1. $key = ThreadLocal$
	2. ThreadLocalMap 相当于一个大容器

为什么不用HashMap 呢？ 因为 弱引用不影响对象回收【这样就导致可能会内存泄漏，内存无法回收】

表示 ThreadLocalMap 是使用 ThreadLocal 的弱引用作为 Key 的，弱引用的对象在 GC 时会被回收。

![https://img-blog.csdnimg.cn/img_convert/681b63e289c051593e4be3f9ca6e20c6.png](https://img-blog.csdnimg.cn/img_convert/681b63e289c051593e4be3f9ca6e20c6.png)

下面我们分两种情况讨论：

- **key 使用强引用**：引用的ThreadLocal的对象被回收了，但是ThreadLocalMap还持有ThreadLocal的强引用，如果没有手动删除，ThreadLocal不会被回收，导致Entry内存泄漏。
- **key 使用弱引用**：引用的ThreadLocal的对象被回收了，由于ThreadLocalMap持有ThreadLocal的弱引用，即使没有手动删除，ThreadLocal也会被回收。value在下一次ThreadLocalMap调用set,get，remove的时候会被清除。

####  ThreadLocal为什么会内存泄漏
**原理：** **key 会在下一次 gc 的时候置为 null，因为是 weakReference ， 由于 ThreadLocalMap 中的机制，无法再访问那些 key 为 null的 entry， 这些 entry 会引用强引用的 value，就导致 value 无法被回收，而不是 key 无法被回收**

ThreadLocalMap使用ThreadLocal的弱引用作为key，如果一个ThreadLocal没有外部强引用来引用它，那么系统 GC 的时候，这个ThreadLocal势必会被回收，这样一来，ThreadLocalMap中就会出现key为null的Entry，就没有办法访问这些key为null的Entry的value，如果当前线程再迟迟不结束的话，这些key为null的Entry的value就会一直存在一条强引用链：Thread Ref -> Thread -> ThreaLocalMap -> Entry -> value永远无法回收，造成内存泄漏。

其实，ThreadLocalMap的设计中已经考虑到这种情况，也加上了一些防护措施：在ThreadLocal的get(),set(),remove()的时候都会清除线程ThreadLocalMap里所有key为null的value。

但是这些被动的预防措施并不能保证不会内存泄漏：

- 使用static的ThreadLocal，延长了ThreadLocal的生命周期，可能导致的内存泄漏(参考ThreadLocal 内存泄露的实例分析)。
- 分配使用了ThreadLocal又不再调用get(),set(),remove()方法，那么就会导致内存泄漏。

### ThreadLocal 补充：

	1. threadLocal 内部会有清理过期数据的方法，调用 remove 某种程度上解决了这个内存泄漏的问题 

```java
		/**
     * Sets the current thread's copy of this thread-local variable
     * to the specified value.  Most subclasses will have no need to
     * override this method, relying solely on the {@link #initialValue}
     * method to set the values of thread-locals.
     *
     * @param value the value to be stored in the current thread's copy of
     *        this thread-local.
     *
     * 设置当前线程的局部变量的值
     */
    public void set(T value) {
        Thread t = Thread.currentThread();
        //获取当前线程所对应的ThreadLocalMap，
        ThreadLocalMap map = getMap(t);
        //如果不为空，则调用ThreadLocalMap的set()方法，key就是当前ThreadLocal
        //如果不存在，则调用createMap()方法新建一个
        if (map != null)
            map.set(this, value);
        else
            createMap(t, value);
    }


		/**
     * Create the map associated with a ThreadLocal. Overridden in
     * InheritableThreadLocal.
     *
     * @param t the current thread
     * @param firstValue value for the initial entry of the map
     */
    void createMap(Thread t, T firstValue) {
        t.threadLocals = new ThreadLocalMap(this, firstValue);
    }

		/**
     * Removes the current thread's value for this thread-local
     * variable.  If this thread-local variable is subsequently
     * {@linkplain #get read} by the current thread, its value will be
     * reinitialized by invoking its {@link #initialValue} method,
     * unless its value is {@linkplain #set set} by the current thread
     * in the interim.  This may result in multiple invocations of the
     * {@code initialValue} method in the current thread.
     *
     * @since 1.5
     *
     * 将当前线程局部变量的值删除。该方法的目的是减少内存的占用。
     * 当然，我们不需要显示调用该方法，因为一个线程结束后，它所对应的局部变量就会被垃圾回收。
     */
     public void remove() {
         ThreadLocalMap m = getMap(Thread.currentThread());
         if (m != null)
             m.remove(this);
     }


```



## 锁原理



- syncrhonzied 原理
  - 执行 monitorenter 时，对象的计数器+1，执行 monitorexit 时候，对象计数器 - 1 
  - 计数器为0时候，锁就释放了。
- LockSupport原理
- AQS 实现原理
  1. 将每一条请求共享资源的线程封装成 $CLH$ 队列(虚拟双向队列)的 一个节点来实现缩的分配
  2. volatile 修饰 state 变量，保证了 state的可见性，cas 算法 去修改state 变量，保证了 state修改的原子性
  3. 如果被请求共享资源空闲，则 当前线程设置为工作线程，锁定共享资源
  4. 获取不到锁的线程 就加入到队列中等待唤醒



```java
 /**
     * Inserts node into queue, initializing if necessary. See picture above.
     * @param node the node to insert
     * @return node's predecessor
     * enq()的作用很简单。如果CLH队列为空，则新建一个CLH表头；然后将node添加到CLH末尾。
     * 否则，直接将node添加到CLH末尾。
     *
     * 1、这里通过一个死循环方式调用CAS，即使有高并发的场景，无限循环将会最终成功把当前线程追加到队尾
     * 2、第一次循环tail肯定为null，则会初始化一个默认的node，并将head=tail指向该node
     * 3、第二次循环的时候，会将当前node追加到1中创建的node尾部
     */
    private Node enq(final Node node) {
        //无限死循环
        for (;;) {
            Node t = tail;
            if (t == null) { // Must initialize
                //如果尾节点是空， cas 插入 头节点（抢第一)
                if (compareAndSetHead(new Node()))
                    //这个只是一个 dummy 节点，虚拟节点 用来做标记的， 里面的 thread 是 空的
                    tail = head;
            } else {
                node.prev = t;
                //如果尾不为空 ，cas 设置尾节点
                if (compareAndSetTail(t, node)) {
                    //tail.next = node ,and tail = node
                    t.next = node;
                    return t;
                }
            }
        }
    }
```

- countdownlatch 实现原理：
  - 任务分为 N个子线程去执行，state初始化为N，n个线程并行执行
  - 执行完就 countdown 1次，cas操作减去1
  - n个子线程执行完毕后，state= 0， 会unpark 主调用线程， 主线程就会从 await 函数返回，执行后序





##  LongAdder 高性能原理



### longAdder 公式原理：



![https://img-blog.csdn.net/20170305230028229?watermark/2/text/aHR0cDovL2Jsb2cuY3Nkbi5uZXQvdTAxMTM5Mjg5Nw==/font/5a6L5L2T/fontsize/400/fill/I0JBQkFCMA==/dissolve/70/gravity/SouthEast](https://img-blog.csdn.net/20170305230028229?watermark/2/text/aHR0cDovL2Jsb2cuY3Nkbi5uZXQvdTAxMTM5Mjg5Nw==/font/5a6L5L2T/fontsize/400/fill/I0JBQkFCMA==/dissolve/70/gravity/SouthEast)





![https://gitee.com/alan-tang-tt/yuan/raw/master/%25E6%25AD%25BB%25E7%25A3%2595%2520java%25E5%25B9%25B6%25E5%258F%2591%25E5%258C%2585/resource/LongAdder1.png](https://gitee.com/alan-tang-tt/yuan/raw/master/%E6%AD%BB%E7%A3%95%20java%E5%B9%B6%E5%8F%91%E5%8C%85/resource/LongAdder1.png)



使用AtomicLong时，在高并发下大量线程会同时去竞争更新**同一个原子变量**，但是由于同时只有一个线程的CAS会成功，所以其他线程会不断尝试自旋尝试CAS操作，这会浪费不少的CPU资源。

而LongAdder可以概括成这样：内部核心数据value**分离**成一个数组(Cell)，每个线程访问时,通过哈希等算法映射到其中一个数字进行计数，而最终的计数结果，则为这个数组的**求和累加**。

- 简单来说就是将一个值分散成多个值，在并发的时候就可以**分散压力**，性能有所提高。





