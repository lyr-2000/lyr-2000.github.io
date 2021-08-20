---
 
title: "synchronized锁优化"
date: 2021-08-17T13:48:22+08:00
draft: false
author: LYR

 
---





[学习视频参考](https://www.bilibili.com/video/BV16J411h7Rd?p=80)



### 偏向锁撤销情景

1. 调用 hashCode
2. 调用waitNotify
3. 多线程访问【升级为轻量级锁，要先撤销偏向锁】

### 锁消除和锁粗化



消除的 话，会对代码进行逃逸分析【局部变量加锁】



**每个对象一开始都是无锁的，随着线程间争夺锁，越激烈，锁的级别越高，并且锁只能升级不能降级。**



## 什么是线程安全问题？ Synchronized 底层实现

作者：牛客636793145号
链接：https://www.nowcoder.com/discuss/650653
来源：牛客网



sycnronized的作用

- 原子性：synchronized保证语句块内操作是原子的 
- 可见性：synchronized保证可见性（通过“在执行unlock之前，必须先把此变量同步回主内存”实现） 
- 有序性：synchronized保证有序性（通过“一个变量在同一时刻只允许一条线程对其进行lock操作”）



可以答，monitor enter 和 monitor exit 







## wait/notify原理



![image-20210819140854556](https://cdn.jsdelivr.net/gh/lyr-2000/images_repo_2021_ASUS/2021_08_19_14__08_56image-20210819140854556.png)







```java
public class CyclicBarrierTest {
    static Object lock = new Object();
    public static void main(String[] args) throws InterruptedException {
         lock.wait();

    }
}
 
Exception in thread "main" java.lang.IllegalMonitorStateException
	at java.lang.Object.wait(Native Method)
	at java.lang.Object.wait(Object.java:502)
	at CyclicBarrierTest.main(CyclicBarrierTest.java:11)

Process finished with exit code 1

```

注意； wait 只能 在 syncrhonized代码块里面使用，不然报错



![image-20210819142438487](https://cdn.jsdelivr.net/gh/lyr-2000/images_repo_2021_ASUS/2021_08_19_14__24_38image-20210819142438487.png)







也就是说， 我在占有锁的时候 ，发现不应该由我占有锁，我可以用 wait 让给别人





### sleep和 wait 区别

sleep 是 Thread 的静态方法， wait 是所有对象都有的

wait 它需要获得对象锁







### reentrantLock 的基本使用



reentrantLock 可以被打断的



可以用 lockInterruptly方法实现



```java
static Lock  lock = new ReentrantLock();
    public static void main(String[] args) {
        Thread t =  new Thread(()-> {
            try {
                //如果有竞争，就会进入阻塞队列等待
                lock.lockInterruptibly();
                System.out.println("往下执行后序逻辑");
            } catch (InterruptedException e) {
                // e.printStackTrace();
                System.out.println("被打断了，没有继续往下执行");

            }finally {
                lock.unlock();
            }
        });

        lock.lock();//先获取锁
        t.start();
        //打断
        t.interrupt();
        System.out.println("---");


    }
```







###  wait/notify 固定线程顺序

```java
static Object lock = new Object();
    static boolean t1OK = false;
    static boolean t2OK = false;
    static boolean t3OK = false;

    public static void main(String[] args) throws InterruptedException {

        Thread t1 = new Thread(() -> {
           synchronized (lock) {
               System.out.println("t1");

               t1OK = true;
               lock.notifyAll();
           }
        });
        Thread t2 = new Thread(() -> {
            synchronized (lock) {
                while (t1OK == false) {
                    try {
                        lock.wait();
                    } catch (InterruptedException e) {
                        e.printStackTrace();
                    }
                }
                System.out.println("t2");
                t2OK = true;
                lock.notifyAll();
            }

        });
        Thread t3 = new Thread(() -> {
            synchronized (lock) {
                while (t2OK == false) {
                    try {
                        lock.wait();
                    } catch (InterruptedException e) {
                        e.printStackTrace();
                    }
                }

                System.out.println("t3");
                t3OK = true;
            }
        });
        t3.start();
        t2.start();
        t1.start();
        // synchronized (lock) {
        //     // lock.wait(1000);
        // }

    }
```













