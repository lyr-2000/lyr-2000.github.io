---
title: "bean的生命周期"
date: 2021-08-17T13:48:22+08:00
draft: false
author: LYR
---

## bean是生命周期

主要有四个，实例化Instantiation，属性赋值Populate，初始化Initialization，销毁Destruction。在实例化前后有一个接口InstantiationAwareBeanPostProcessor，分别对应于实例化之前postProcessBeforeInstantiation方法和postProcessAfterInstantiation方法；之后是属性赋值，然后是初始化，初始化前后也有一个接口BeanPostProcessor，前后各有两个方法和之前的两个名字一样。最后销毁。https://www.jianshu.com/p/1dec08d290c1。
Bean生命周期详细版：实例化，填充属性，name，factory，applicationContext，before-init，init，after-init，调用，destory。https://www.zhihu.com/question/38597960。



## factorybean 和 beanFactory



beanFactory是IOC容器的接口，factoryBean是自定义实例化bean的一个工厂接口，给bean加上了一个简单工厂和装饰模式。







## bean的作用域

五种：singleton：全局只有一个。prototype：每次调用bean，都是new。request：请求处理时创建，请求完成后销毁。session：所有http请求共享同一个请求bean。globalSession：全局session，portlet环境才生效，否则相当于session。

## Spring的bean循环依赖怎么解决



https://www.zhihu.com/question/276741767/answer/1192059681 ， 创建时会加入到三级缓存，这个时候还没有赋值，循环依赖的对象直接从三级缓存里面找就可以。构造函数的循环依赖怎么办，用@lazy注解，注入代理对象，当使用这个对象的时候再创建真实的对象。
https://blog.csdn.net/Revivedsun/article/details/84642316

## 为什么是三级缓存不是二级缓存

https://www.cnblogs.com/grey-wolf/p/13034371.html#_label5 ，https://blog.csdn.net/weixin_49592546/article/details/108050566 。二级缓存可以解决aop动态代理的情况，代理对象会被放到二级缓存，解决代理对象的循环依赖。

