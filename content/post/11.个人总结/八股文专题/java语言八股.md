---
title: "java语言八股"
date: 2021-08-17T13:48:22+08:00
draft: false
author: LYR
---



## 重新 equals 一定要重新 hashCode















## concurrentHashMap 扩容机制









### golang，java ， python的垃圾回收机制

[参考文档](https://blog.csdn.net/big_white_py/article/details/107623488)

[golang gc](https://www.cnblogs.com/FG123/p/12828665.html?ivk_sa=1024320u)

Golang 的三色标记法
 golang 的垃圾回收(GC)是基于标记清扫算法，这种算法需要进行 STW（stop the world)，这个过程就会导致程序是卡顿的，频繁的 GC 会严重影响程序性能. golang 在此基础上进行了改进，通过三色标记清扫法与写屏障来减少 STW 的时间.
 三色标记法的流程如下，它将对象通过白、灰、黑进行标记
 1.所有对象最开始都是白色.
 2.从 root 开始找到所有可达对象，标记为灰色，放入待处理队列。
 3.历灰色对象队列，将其引用对象标记为灰色放入待处理队列，自身标记为黑色。
 4.循环步骤3直到灰色队列为空为止，此时所有引用对象都被标记为黑色，所有不可达的对象依然为白色，白色的就是需要进行回收的对象。
 三色标记法相对于普通标记清扫，减少了 STW 时间. 这主要得益于标记过程是 “on-the-fly” 的，在标记过程中是不需要 STW 的，它与程序是并发执行的，这就大大缩短了 STW 的时间.



作者：不能吃的坚果j
链接：https://www.jianshu.com/p/e620cf7c9120
来源：简书
著作权归作者所有。商业转载请联系作者获得授权，非商业转载请注明出处。





## ThreadLocal 原理





每个 Thread 对象都有一个 threadLocalMap





## 如何理解 volatile 关键字



**2.可见性**

　　对于可见性，Java提供了volatile关键字来保证可见性。

　　当一个共享变量被volatile修饰时，它会保证修改的值会立即被更新到主存，当有其他线程需要读取时，它会去内存中读取新值。

　　而普通的共享变量不能保证可见性，因为普通共享变量被修改之后，什么时候被写入主存是不确定的，当其他线程去读取时，此时内存中可能还是原来的旧值，因此无法保证可见性。

　　另外，通过synchronized和Lock也能够保证可见性，synchronized和Lock能保证同一时刻只有一个线程获取锁然后执行同步代码，并且在释放锁之前会将对变量的修改刷新到主存当中。因此可以保证可见性。

**3.有序性**

　　在Java内存模型中，允许编译器和处理器对指令进行重排序，但是重排序过程不会影响到单线程程序的执行，却会影响到多线程并发执行的正确性。

　　在Java里面，可以通过volatile关键字来保证一定的“有序性”（具体原理在下一节讲述）。另外可以通过synchronized和Lock来保证有序性，很显然，synchronized和Lock保证每个时刻是有一个线程执行同步代码，相当于是让线程顺序执行同步代码，自然就保证了有序性。

　　另外，Java内存模型具备一些先天的“有序性”，即不需要通过任何手段就能够得到保证的有序性，这个通常也称为 happens-before 原则。如果两个操作的执行次序无法从happens-before原则推导出来，那么它们就不能保证它们的有序性，虚拟机可以随意地对它们进行重排序。





## 怎么实现 classLoader



[参考文档](https://www.cnblogs.com/vinozly/p/5042628.html)



### 3.1.2 什么时候需要自己实现类加载器

当JDK提供的类加载器实现无法满足我们的需求时，才需要自己实现类加载器。

现有应用场景：OSGi、代码热部署等领域。

另外，根据上述类加载器的作用，可能有以下几个场景需要自己实现类加载器 *当需要在自定义的目录中查找class文件时（或网络获取）* class被类加载器加载前的加解密（代码加密领域）



```java
package com.lordx.sprintbootdemo.classloader;

import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.InputStream;

/**
 * 自定义ClassLoader
 * 功能：可自定义class文件的扫描路径
 * @author zhiminxu 
 */
// 继承ClassLoader，获取基础功能
public class TestClassLoader extends ClassLoader {

    // 自定义的class扫描路径
    private String classPath;

    public TestClassLoader(String classPath) {
        this.classPath = classPath;
    }

    // 覆写ClassLoader的findClass方法
    protected Class<?> findClass(String name) throws ClassNotFoundException {
        // getDate方法会根据自定义的路径扫描class，并返回class的字节
        byte[] classData = getDate(name);
        if (classData == null) {
            throw new ClassNotFoundException();
        } else {
            // 生成class实例
            return defineClass(name, classData, 0, classData.length);
        }
    }


    private byte[] getDate(String name) {
        // 拼接目标class文件路径
        String path = classPath + File.separatorChar + name.replace('.', File.separatorChar) + ".class";
        try {
            InputStream is = new FileInputStream(path);
            ByteArrayOutputStream stream = new ByteArrayOutputStream();
            byte[] buffer = new byte[2048];
            int num = 0;
            while ((num = is.read(buffer)) != -1) {
                stream.write(buffer, 0 ,num);
            }
            return stream.toByteArray();
        } catch (Exception e) {
            e.printStackTrace();
        }
        return null;
    }
}
```





#### 使用方法

```java
package com.lordx.sprintbootdemo.classloader;

public class MyClassLoader {
    public static void main(String[] args) throws ClassNotFoundException {
        // 自定义class类路径
        String classPath = "/Users/zhiminxu/developer/classloader";
        // 自定义的类加载器实现：TestClassLoader
        TestClassLoader testClassLoader = new TestClassLoader(classPath);
        // 通过自定义类加载器加载
        Class<?> object = testClassLoader.loadClass("ClassLoaderTest");
        // 这里的打印应该是我们自定义的类加载器：TestClassLoader
        System.out.println(object.getClassLoader());
    }
}
```

