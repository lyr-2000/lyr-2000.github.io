---
title: "arp协议原理"
date: 2021-08-17T21:43:55+08:00
draft: false
author: LYR
---







## arp 协议原理



一、什么是ARP协议

　　ARP协议，全称“Address Resolution Protocol”,中文名是地址解析协议，使用ARP协议可实现通过IP地址获得对应主机的物理地址（MAC地址）。

　　在TCP/IP的网络环境下，每个联网的主机都会被分配一个32位的IP地址，这种互联网地址是在网际范围标识主机的一种逻辑地址。为了让报文在物理网路上传输，还必须要知道对方目的主机的物理地址（MAC）才行。这样就存在把IP地址变换成物理地址的地址转换的问题。

　　在以太网环境，为了正确地向目的主机传送报文，必须把目的主机的32位IP地址转换成为目的主机48位以太网的地址（MAC地址）。这就需要在互联层有一个服务或功能将IP地址转换为相应的物理地址（MAC地址），这个服务或者功能就是ARP协议。
　　所谓的“地址解析”，就是主机在发送帧之前将目标IP地址转换成目标MAC地址的过程。ARP协议的基本功能就是通过目标设备的IP地址，查询目标设备的MA地址，以保证主机间相互通信的顺利进行。

　　ARP 协议和DNS有点相

就是在局域网里面发个数据包请求，然后 客户机器收到请求后，发送 mac地址 回复

网络中的 Mac地址是唯一的 【通过 arp协议获取 Mac地址，就能在局域网里面互相通信了 】



[学习视频](https://www.bilibili.com/video/BV16f4y1p7Ky/?spm_id_from=autoNext)







### arp 攻击原理



但凡局域网存在ARP攻击，都说明网络存在"中间人"，我们可以用下图来解释。

![https://s2.51cto.com/wyfs02/M02/A2/CA/wKioL1mjxjXALRekAAHAb60btmw056.png](https://s2.51cto.com/wyfs02/M02/A2/CA/wKioL1mjxjXALRekAAHAb60btmw056.png)



![https://s3.51cto.com/wyfs02/M02/A2/CC/wKioL1mjxuSiFIK8AAIwZFLgJb8705.png](https://s3.51cto.com/wyfs02/M02/A2/CC/wKioL1mjxuSiFIK8AAIwZFLgJb8705.png)

### 攻击手法1

根据之前的信息，我们知道00:08:ca:86:f8:0f其实就是hacker的mac地址，并且对应的真正的IP地址应该是10.1.20.253。而这里很明显是hacker在**欺骗局域网其他主机**，它对外声称：自己就是"所有人"。尤其是上面标红的主机，我们已经知道是小米、思科、苹果等设备，但是**hacker都声明是自己**！这样做的意义在于**覆盖掉其他主机的ARP缓存表信息，并生成错误的ARP映射，最终将通信流量交给hacker。**



### 攻击手法2

还有另外一种ARP欺骗的做法：hacker告诉所有人，自己就是网关。因为其他主机访问互联网必经之路便是网关（出口路由器/无线路由器），通过这种方式，同样可以截取到用户数据流，这里给出另外一个网络的实现过程=>



[学习视频](https://www.bilibili.com/video/BV16f4y1p7Ky?p=4)







arp 一定是要在一个局域网里面做的



arp是以广播的形式去问，单播的方式回答

**攻击者**是不停的去以单播的方式去响应别的机器【这样就会让别的机器不停的认错 mac 地址，导致无法获取真的 Mac 地址】





















