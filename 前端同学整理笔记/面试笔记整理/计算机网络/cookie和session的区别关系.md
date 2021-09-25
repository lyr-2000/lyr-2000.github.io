# session
https://www.cnblogs.com/-ROCKS/p/6108556.html
https://blog.csdn.net/qq_28296925/article/details/80921585

https://blog.csdn.net/cnpinpai/article/details/90669587
## session的目的
Http协议是一种无状态协议，即每次服务端接收到客户端的请求时，都是一个全新的请求，服务器并不知道客户端的历史请求记录；

Session的主要目的就是为了弥补Http的无状态特性。简单的说，就是服务器可以利用session存储客户端在同一个会话期间的一些操作记录；

# 区别
1. 数据存放位置不同：  
cookie数据存放在客户的浏览器上或硬盘上，session数据放在服务器上。

2. 安全程度不同：  
cookie不是很安全，别人可以分析存放在本地的COOKIE并进行COOKIE欺骗，考虑到安全应当使用session。  

3. 性能使用程度不同：  
session会在一定时间内保存在服务器上。当访问增多，会比较占用你服务器的性能,考虑到减轻服务器性能方面，应当使用cookie。

4. 数据存储大小不同：  
单个cookie保存的数据不能超过4K，很多浏览器都限制一个站点最多保存20个cookie，而session存储于服务端，浏览器对其没有限制。

5. 使用的含义：  
cookie一般用来存储用户信息，而session的主要作用是通过服务端来记录用户的状态
# 关系
