---
title: "java并发八股"
date: 2021-08-17T13:48:22+08:00
draft: false
author: LYR


---

## java 并发八股文

[面试题网站](http://r.coderead.cn/r//6%E3%80%81%E5%85%B6%E5%AE%83/35%E9%81%93%E9%9D%A2%E8%AF%95%E7%9C%9F%E9%A2%98.pdf)



###  线程生命周期



当线程被创建并启动以后，它既不是一启动就进入了执行状态，也不是一直处于执行状态。在线程的生命周期中，它要经过**新建**(New)、**就绪**（Runnable）、**运行**（Running）、**阻塞**(Blocked)和**死亡**(Dead)**5种状态**。尤其是当线程启动以后，它不可能一直"霸占"着CPU独自运行，所以CPU需要在多条线程之间切换，于是线程状态也会多次在运行、阻塞之间切换

\1. 新建状态 NEW，当程序使用new关键字创建了一个线程之后，该线程就处于新建状态，此时仅由JVM为其分配内存，并初始化其成员变量的值

\2. 就绪状态 Runnable，当线程对象调用了start()方法之后，该线程处于就绪状态。Java虚拟机会为其创建方法调用栈和程序计数器，等待调度运行

\3. 运行状态 Running ，如果处于就绪状态的线程获得了CPU，开始执行run()方法的线程执行体，则该线程处于运行状态

\4. 阻塞状态 Blocked，当处于运行状态的线程失去所占用资源之后，便进入阻塞状态

\5. 终结状态 DEAD







###  线程的几种阻塞状态

1. 等待阻塞 wait 
2. 同步阻塞 synchronzied
3. 其他阻塞  join ,yield 等









![https://img-blog.csdnimg.cn/20200506223058854.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3Fpbnd1eGlhbjE5ODkxMjEx,size_16,color_FFFFFF,t_70](https://img-blog.csdnimg.cn/20200506223058854.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3Fpbnd1eGlhbjE5ODkxMjEx,size_16,color_FFFFFF,t_70)

###  synchronzied原理

1. 锁池

   - 所有需要竞争同步的线程都会放入锁池， 比如当前对象的锁被其他一个线程得到，则其他线程需要在这个锁池里面进行等待，当前面的线程释放同步锁中的线程去竞争同步锁，当某个 得到后会进入就绪队列进行等待CPU 资源分配

2. 等待池	

   - 当我们调用wait 方法后，线程会进入等待池，等待池线程不会竞争锁 。 只有调用 notify 或者 notifyAll 后 等待池的线程才会去竞争锁， notify() 是随机从等待池选出一个线程放到锁池 ， 而 notifyAll 是等待池的所有线程放到锁池当中

3. sleep 是Thread的静态方法， wait 是 Object定义的方法

4. sleep不会释放锁， wait 释放锁，并且加入到等待队列中

   1. sleep原理： CPU的执行权执行资格释放出去。 时间结束了再获取 CPU资源，参与CPU调度，获得 CPU 资源就继续运行
   2. sleep不会释放锁，其他线程也无法获取这个锁，如果希望 获得锁，可以 通过调用这个线程 的 interrupt方法 让这个 线程 把锁吐出来。 这个线程就会抛出个 interruptexception 的异常返回，和 wait一样
   3. yield 调用后会释放一下 CPU执行权限，线程会处于就绪状态，仍然有 CPU执行资格，下次CPU可能还会选到这个线程 执行 
   4. join 表示线程进入阻塞状态， 线程b调用了A 的join， b就进入阻塞队列，知道 A结束或者A 被中断唤醒

   







###  hashMap 和 hashTable 的区别

1. HashMap 方法没有 synchronzied 修饰，线程不安全， hashTable线程安全
2. HashMap key 和 value 允许为 null， 而 Hashtable 不允许， concurrentHashMap key value 也不能为空







```java
Hashtable table = new Hashtable();
table.put(null,null);
/*
异常结果：
Exception in thread "main" java.lang.NullPointerException
	at java.util.Hashtable.put(Hashtable.java:460)
	at Main.main(Main.java:10)

*/

  Hashtable table = new Hashtable();
         table.put(null,"d");

/*
Exception in thread "main" java.lang.NullPointerException
	at java.util.Hashtable.put(Hashtable.java:465)
	at Main.main(Main.java:10)

*/

//hashtable 源码
 public synchronized V put(K key, V value) {
        // Make sure the value is not null
        if (value == null) {
            //这里 value 也不能为 null
            throw new NullPointerException();
        }

        // Makes sure the key is not already in the hashtable.
        Entry<?,?> tab[] = table;
        //这里 如果 null，就会抛出异常
        int hash = key.hashCode(); //这里直接空指针
    
     
 // concurrentHashMap源码
     Map table = new ConcurrentHashMap<>();
         table.put("d",null);
     /*
     Exception in thread "main" java.lang.NullPointerException
	at java.util.concurrent.ConcurrentHashMap.putVal(ConcurrentHashMap.java:1011)
	at java.util.concurrent.ConcurrentHashMap.put(ConcurrentHashMap.java:1006)
	at Main.main(Main.java:12)

     
     */
      final V putVal(K key, V value, boolean onlyIfAbsent) {
          //直接对 key 和 value 进行空指针检测了
        if (key == null || value == null) throw new NullPointerException();
        int hash = spread(key.hashCode());
        int binCount = 0;
     
```











####  java 线程的几种状态

- 新建状态： 当创建一个线程时， 此线程进入新建状态，但此时还未启动

- 就绪状态，调用 start后，处于就绪状态【可运行状态】 等待被CPU调度

- 运行状态， 获得CPU的使用权

- 阻塞状态，放弃 CPU的使用权

  - 等待阻塞  【wait】
  - 同步阻塞  【synchronized 】
  - 其他阻塞  【join，sleep 】

- 死亡状态，退出了 run方法

  - `new Thread().start()` 默认为 非守护线程【所有线程执行完成才退出】
  - `thread.setDoamen(true)` 设置为守护线程， jvm不关心守护线程

  







## 线程池原理



1. 创建线程池：
   1. 核心线程数 corePoolSize: 提高线程利用率，降低销毁线程的成本
   2. 最大线程数 maxinumPoolSize
   3. keepaliveTime 最大线程的存活时间【超过核心线程数的那部分线程】
   4. 任务队列
   5. 线程工厂 【用来创建线程，自定义线程名字，优先级等】
   6. 拒绝策略 【超过了最大线程，无空闲处理，只能拒绝策略】

2. 核心线程数是线程池里面最小 初始化的线程数，
   1. 流程： 任务先提交到核心线程运行，
   2. 如果核心线程不空闲，就提交到等待队列
   3. 等待队列满的话，就尝试尝试创建线程去处理任务
   4. 如果已经最大线程数了，没有空闲线程，执行拒绝策略

- 线程池的底层工作原理：
  - 队列 + 线程
  - 线程池复用原理：
    - 线程池对 Thread进行了封装，并不是每次执行任务都会调用 `Thread().start()`
    - 而是让每个线程去执行一个循环任务，在循环任务中不断检查是否有新任务需要执行，有就执行



我们可以看到，源码中是 直接调用的 run ，而不是调用 start

```java
    final void runWorker(Worker w) {
        Thread wt = Thread.currentThread();
        // 要执行的任务
        Runnable task = w.firstTask;
        w.firstTask = null;
        // 释放锁，运行中断
        w.unlock(); // allow interrupts
        boolean completedAbruptly = true;
        try {
            while (task != null || (task = getTask()) != null) {
                // worker 获取锁
                w.lock();
                // If pool is stopping, ensure thread is interrupted;
                // if not, ensure thread is not interrupted.  This
                // requires a recheck in second case to deal with
                // shutdownNow race while clearing interrupt

                // 确保只有当线程是stoping时，才会被设置为中断，否则清楚中断标示
                // 如果线程池状态 >= STOP ,且当前线程没有设置中断状态，则wt.interrupt()
                // 如果线程池状态 < STOP，但是线程已经中断了，再次判断线程池是否 >= STOP，如果是 wt.interrupt()
                if ((runStateAtLeast(ctl.get(), STOP) ||
                        (Thread.interrupted() &&
                                runStateAtLeast(ctl.get(), STOP))) &&
                        !wt.isInterrupted())
                    wt.interrupt();
                try {
                    // 自定义方法
                    beforeExecute(wt, task);
                    Throwable thrown = null;
                    try {
                        // 执行任务
                        task.run();
                    } catch (RuntimeException x) {
                        thrown = x;
                        throw x;
                    } catch (Error x) {
                        thrown = x;
                        throw x;
                    } catch (Throwable x) {
                        thrown = x;
                        throw new Error(x);
                    } finally {
                        afterExecute(task, thrown);
                    }
                } finally {
                    // 完成任务数 + 1
                    task = null;
                    w.completedTasks++;
                    w.unlock();
                }
            }
            completedAbruptly = false;
        } finally {
            processWorkerExit(w, completedAbruptly);
        }
    }
```



#####  线程池为什么要用阻塞队列

为什么要先添加到 workerQueue, 而不是先创建最大线程

一般的队列只能保证优先长度的缓冲区，超过缓冲区，就无法保留当前任务了，阻塞

队列 通过阻塞可以保留住当前想要继续入队的任务。



##### 默认的拒绝策略

```java 
  /**
     * The default rejected execution handler
     */
    private static final RejectedExecutionHandler defaultHandler =
            new AbortPolicy();

/**
     * A handler for rejected tasks that throws a
     * {@code RejectedExecutionException}.
     */
    public static class AbortPolicy implements RejectedExecutionHandler {
        /**
         * Creates an {@code AbortPolicy}.
         */
        public AbortPolicy() {
        }

        /**
         * Always throws RejectedExecutionException.
         *
         * @param r the runnable task requested to be executed
         * @param e the executor attempting to execute this task
         * @throws RejectedExecutionException always
         */
        public void rejectedExecution(Runnable r, ThreadPoolExecutor e) {
            throw new RejectedExecutionException("Task " + r.toString() +
                    " rejected from " +
                    e.toString());
        }
    }
```









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
2.  如果 threadLocal 作为弱引用被回收，那么 ThreadLocalMap 里面 的 Entry 那个 key 就会成为null， 剩下那个 value 【 后期调用 set,get ,remove 的话，都会被清理掉】







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



### ThreadLocal八股文

HashMap是使用拉链法解决hash冲突的，ThreadLocalMap是使用线性探测解决hash冲突的（内部只维护Entey数组，没有链表）。所以，源码中在清除泄漏的Entry时，会进行rehash，防止数组的当前位置为null后，有hash冲突的Entry访问不到的问题。

回归本质，ThreadLocalMap是用来存放对象的，在一次线程的执行栈中，存放数据后方便我们在任意的地方取得我们想要的值而不被其他线程干扰。**ThreadLocalMap本身并没有为外界提供取出和存放数据的API，我们所能获得数据的方式只有通过ThreadLocal类提供的API来间接的从ThreadLocalMap取出数据，所以，当我们用不了key（ThreadLocal对象）的API也就无法从ThreadLocalMap里取出指定的数据。**



### ThreadLocal 使用技巧

所以，ThreadLocal的建议使用方法：

1. **设计为static的，被class对象给强引用，线程存活期间就不会被回收，也不用remove，完全不用担心内存泄漏**
   - ThreadLocal就是entry里的key。你这里的ThreadLocal被class对象强引用，不会被回收了
2. **设计为非static的，长对象（比如被spring管理的对象）的内部，也不会被回收**
3. **没必要在方法中创建ThreadLocal对象**









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







##  java 异常体系

java 中所有异常都来自父类的Throwable 

下面2个之类， Error 和 Exception

Error 是程序无法处理的错误，一旦出现这个错误，程序就被迫停止运行

exception不会导致程序停止，又分为 RunTimeException 和 checkedException 检查异常  ，程序编译过程中就会导致程序编译不通过。







##  锁升级体系





###  偏向锁



![https://uploadfiles.nowcoder.com/images/20210915/115285789_1631663595731/81C849792BC1096ED3F02F6A55CF6D0C](https://uploadfiles.nowcoder.com/images/20210915/115285789_1631663595731/81C849792BC1096ED3F02F6A55CF6D0C)

作者：路人zhang
链接：https://www.nowcoder.com/discuss/744436?channel=-1&source_id=profile_follow_post_nctrack
来源：牛客网



引入偏向锁的目的：减少只有一个线程执行同步代码块时的性能消耗，即在没有其他线程竞争的情况下，一个线程获得了锁。

偏向锁的获取流程：

1. 检查对象头中Mark Word是否为可偏向状态，如果不是则直接升级为轻量级锁。 
2. 如果是，判断Mark Work中的线程ID是否指向当前线程，如果是，则执行同步代码块。 
3. 如果不是，则进行CAS操作竞争锁，如果竞争到锁，则将Mark Work中的线程ID设为当前线程ID，执行同步代码块。 
4. 如果竞争失败，升级为轻量级锁。

 

偏向锁的撤销：

只有等到竞争，持有偏向锁的线程才会撤销偏向锁。偏向锁撤销后会恢复到无锁或者轻量级锁的状态。

1. 偏向锁的撤销需要到达全局安全点，全局安全点表示一种状态，该状态下所有线程都处于暂停状态。 
2. 判断锁对象是否处于无锁状态，即获得偏向锁的线程如果已经退出了临界区，表示同步代码已经执行完了。重新竞争锁的线程会进行CAS操作替代原来线程的ThreadID。 
3. 如果获得偏向锁的线程还处于临界区之内，表示同步代码还未执行完，将获得偏向锁的线程升级为轻量级锁。 

一句话简单总结偏向锁原理：使用CAS操作将当前线程的ID记录到对象的Mark Word中

作者：路人zhang
链接：https://www.nowcoder.com/discuss/744436?channel=-1&source_id=profile_follow_post_nctrack
来源：牛客网

###  轻量级锁

入轻量级锁的目的：在多线程交替执行同步代码块时（未发生竞争），避免使用互斥量（重量锁）带来的性能消耗。但多个线程同时进入临界区（发生竞争）则会使得轻量级锁膨胀为重量级锁。

轻量级锁的获取流程：

1. 首先判断当前对象是否处于一个无锁的状态，如果是，Java虚拟机将在当前线程的栈帧建立一个锁记录（Lock Record），用于存储对象目前的Mark Word的拷贝，如图所示。



![https://uploadfiles.nowcoder.com/images/20210915/115285789_1631663618914/AA3859A7110B4404D965F160B823E0A7](https://uploadfiles.nowcoder.com/images/20210915/115285789_1631663618914/AA3859A7110B4404D965F160B823E0A7)

![https://uploadfiles.nowcoder.com/images/20210915/115285789_1631663632877/5DC575272443DA641481CF5A3DA35383](https://uploadfiles.nowcoder.com/images/20210915/115285789_1631663632877/5DC575272443DA641481CF5A3DA35383)



然而，自旋锁的一大好处就是减少线程切换的开销。在这里没有必要直接阻塞当前线程，大可以像轻量级锁一样，自旋一会，失败了再阻塞。





###  偏向锁和轻量级锁区别

轻量级锁一开始是没有自旋功能，所以自旋不是其出现的原因的，而是其后来的优化，其最初的设计目的是在没有线程争用的情况下实现使用CAS操作代替OS的锁以提高性能。

轻量级锁在**多线程不存在竞争和单线程不存在竞争两种场景中表现出一样的行为**，这是不合理的，所以偏向锁通过记录线程ID来优化单线程不存在竞争这种场景。



作者：专业划水运动员
链接：https://www.zhihu.com/question/291789546/answer/959050258
来源：知乎
著作权归作者所有。商业转载请联系作者获得授权，非商业转载请注明出处。



在没有实际竞争的情况下，还能够针对部分场景继续优化。如果不仅仅没有实际竞争，自始至终，使用锁的线程都只有一个，那么，维护轻量级锁都是浪费的。**偏向锁的目标是，减少无竞争且只有一个线程使用锁的情况下，使用轻量级锁产生的性能消耗**。轻量级锁每次申请、释放锁都至少需要一次CAS，但偏向锁只有初始化时需要一次CAS。

“偏向”的意思是，*偏向锁假定将来只有第一个申请锁的线程会使用锁*（不会有任何线程再来申请锁），因此，*只需要在Mark Word中CAS记录owner（本质上也是更新，但初始值为空），如果记录成功，则偏向锁获取成功*，记录锁状态为偏向锁，*以后当前线程等于owner就可以零成本的直接获得锁；否则，说明有其他线程竞争，膨胀为轻量级锁*。

偏向锁无法使用自旋锁优化，因为一旦有其他线程申请锁，就破坏了偏向锁的假定。

### 缺点

同样的，如果明显存在其他线程申请锁，那么偏向锁将很快膨胀为轻量级锁。

> 不过这个副作用已经小的多。
>
> 如果需要，使用参数-XX:-UseBiasedLocking禁止偏向锁优化（默认打开）。

### 小结

> 偏向锁、轻量级锁、重量级锁分配和膨胀的详细过程见后。会涉及一些Mark Word与CAS的知识。



作者：猴子007
链接：https://www.jianshu.com/p/36eedeb3f912
来源：简书
著作权归作者所有。商业转载请联系作者获得授权，非商业转载请注明出处。

 
